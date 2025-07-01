import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import DashboardView from '@/views/DashboardView.vue';

// Mock the components
vi.mock('@/components/charts/MonthlyTrendsChart.vue', () => ({
  name: 'MonthlyTrendsChart',
  template: '<div class="mocked-monthly-trends-chart"></div>',
  props: ['transactions', 'year', 'type']
}));

vi.mock('@/components/charts/CategorySpendingChart.vue', () => ({
  name: 'CategorySpendingChart',
  template: '<div class="mocked-category-spending-chart"></div>',
  props: ['categories']
}));

// Mock the store
export const createMockStore = (state = {}, getters = {}, actions = {}) => {
  return createStore({
    state: {
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      ...state
    },
    mutations: {
      setCurrentMonth: vi.fn(),
      setCurrentYear: vi.fn()
    },
    modules: {
      transactions: {
        namespaced: true,
        state: {
          transactions: [],
          categories: [
            { id: 'income', name: 'Inkomen', type: 'income' },
            { id: 'food', name: 'Eten & Drinken', type: 'expense' },
            { id: 'transport', name: 'Vervoer', type: 'expense' }
          ],
          ...state.transactions
        },
        getters: {
          transactions: (state) => state.transactions,
          categories: (state) => state.categories,
          incomeCategories: (state) => state.categories.filter(cat => cat.type === 'income'),
          expenseCategories: (state) => state.categories.filter(cat => cat.type === 'expense'),
          totalBalance: () => 5000,
          monthlySummary: () => (year, month) => ({
            income: 3000,
            expenses: 2000,
            byCategory: [
              { id: 'food', name: 'Eten & Drinken', amount: 1000 },
              { id: 'transport', name: 'Vervoer', amount: 1000 }
            ]
          }),
          ...getters.transactions
        },
        actions: {
          loadTransactions: vi.fn(),
          ...actions.transactions
        }
      },
      goals: {
        namespaced: true,
        state: {
          goals: [
            { id: '1', name: 'Nieuwe fiets', targetAmount: 1000, currentAmount: 500, completed: false },
            { id: '2', name: 'Vakantie', targetAmount: 2000, currentAmount: 2000, completed: true }
          ],
          ...state.goals
        },
        getters: {
          activeGoals: (state) => state.goals.filter(goal => !goal.completed),
          completedGoals: (state) => state.goals.filter(goal => goal.completed),
          ...getters.goals
        },
        actions: {
          loadGoals: vi.fn(),
          ...actions.goals
        }
      }
    }
  });
};

describe('DashboardView', () => {
  let wrapper;
  let store;
  
  const createComponent = () => {
    store = createMockStore();
    
    wrapper = mount(DashboardView, {
      global: {
        plugins: [store],
        stubs: {
          'font-awesome-icon': true,
          'router-link': true
        },
        mocks: {
          $route: {
            query: {}
          },
          $router: {
            push: vi.fn()
          }
        }
      }
    });
  };
  
  beforeEach(() => {
    createComponent();
  });
  
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });
  
  it('renders the dashboard with all sections', () => {
    expect(wrapper.find('.dashboard-header').exists()).toBe(true);
    expect(wrapper.find('.summary-cards').exists()).toBe(true);
    expect(wrapper.find('.dashboard-grid').exists()).toBe(true);
  });
  
  it('displays the current month and year in the header', () => {
    const currentDate = new Date();
    const monthNames = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
    ];
    const expectedMonth = monthNames[currentDate.getMonth()];
    const expectedYear = currentDate.getFullYear();
    
    expect(wrapper.find('.date-navigation h3').text()).toContain(expectedMonth);
    expect(wrapper.find('.date-navigation h3').text()).toContain(expectedYear);
  });
  
  it('displays summary cards with correct values', () => {
    const cards = wrapper.findAll('.summary-card');
    expect(cards.length).toBe(4);
    
    // Check balance card
    expect(cards[0].text()).toContain('Saldo');
    expect(cards[0].text()).toContain('€5,000.00');
    
    // Check income card
    expect(cards[1].text()).toContain('Inkomsten');
    expect(cards[1].text()).toContain('€3,000.00');
    
    // Check expenses card
    expect(cards[2].text()).toContain('Uitgaven');
    expect(cards[2].text()).toContain('€2,000.00');
    
    // Check savings card
    expect(cards[3].text()).toContain('Bespaard');
    expect(cards[3].text()).toContain('€1,000.00');
  });
  
  it('displays recent transactions section', () => {
    expect(wrapper.find('.recent-transactions').exists()).toBe(true);
    expect(wrapper.find('.recent-transactions h3').text()).toBe('Recente transacties');
  });
  
  it('displays spending by category section', () => {
    expect(wrapper.find('.spending-by-category').exists()).toBe(true);
    expect(wrapper.find('.spending-by-category h3').text()).toBe('Uitgaven per categorie');
  });
  
  it('displays active goals section', () => {
    expect(wrapper.find('.goals-preview').exists()).toBe(true);
    expect(wrapper.find('.goals-preview h3').text()).toBe('Actieve spaardoelen');
    
    // Should show active goals (not completed)
    const goals = wrapper.findAll('.goal-item');
    expect(goals.length).toBe(1); // Only 1 active goal in mock data
    expect(goals[0].text()).toContain('Nieuwe fiets');
    expect(goals[0].text()).toContain('€500');
    expect(goals[0].text()).toContain('€1,000');
  });
  
  it('navigates between months', async () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    // Click previous month button
    const prevBtn = wrapper.find('.nav-btn:first-child');
    await prevBtn.trigger('click');
    
    // Check if the store's setCurrentMonth mutation was called
    expect(store.commit).toHaveBeenCalledWith('setCurrentMonth', currentMonth === 1 ? 12 : currentMonth - 1);
    if (currentMonth === 1) {
      expect(store.commit).toHaveBeenCalledWith('setCurrentYear', currentYear - 1);
    }
    
    // Reset mocks
    store.commit.mockClear();
    
    // Click next month button (should do nothing if current month is the latest)
    const nextBtn = wrapper.find('.nav-btn:last-child');
    await nextBtn.trigger('click');
    
    // If current month is not the latest, it should navigate to next month
    if (currentMonth < 12) {
      expect(store.commit).toHaveBeenCalledWith('setCurrentMonth', currentMonth + 1);
    } else {
      // If current month is December, next month should be January of next year
      expect(store.commit).toHaveBeenCalledWith('setCurrentMonth', 1);
      expect(store.commit).toHaveBeenCalledWith('setCurrentYear', currentYear + 1);
    }
  });
  
  it('displays loading state when data is being fetched', () => {
    // Create a store with loading state
    store = createMockStore({
      transactions: {
        loading: true
      }
    });
    
    wrapper = mount(DashboardView, {
      global: {
        plugins: [store],
        stubs: {
          'font-awesome-icon': true,
          'router-link': true
        },
        mocks: {
          $route: {
            query: {}
          },
          $router: {
            push: vi.fn()
          }
        }
      }
    });
    
    // Check if loading state is shown
    expect(wrapper.find('.loading-state').exists()).toBe(true);
  });
  
  it('displays empty state when there are no transactions', () => {
    // Create a store with no transactions
    store = createMockStore({
      transactions: {
        transactions: [],
        monthlySummary: () => ({
          income: 0,
          expenses: 0,
          byCategory: []
        })
      }
    });
    
    wrapper = mount(DashboardView, {
      global: {
        plugins: [store],
        stubs: {
          'font-awesome-icon': true,
          'router-link': true
        },
        mocks: {
          $route: {
            query: {}
          },
          $router: {
            push: vi.fn()
          }
        }
      }
    });
    
    // Check if empty state is shown
    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('.empty-state').text()).toContain('Nog geen transacties deze maand');
  });
});
