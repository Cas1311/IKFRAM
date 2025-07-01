import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import TransactionForm from '@/components/transactions/TransactionForm.vue';

// Mock the store
export const createMockStore = (state = {}, getters = {}, actions = {}) => {
  return createStore({
    modules: {
      transactions: {
        namespaced: true,
        state: {
          categories: [
            { id: 'income', name: 'Inkomen', type: 'income' },
            { id: 'food', name: 'Eten & Drinken', type: 'expense' },
            { id: 'transport', name: 'Vervoer', type: 'expense' },
            { id: 'housing', name: 'Huisvesting', type: 'expense' },
            { id: 'other', name: 'Overig', type: 'expense' }
          ],
          ...state
        },
        getters: {
          filteredCategories: (state) => (type) => {
            return state.categories.filter(cat => cat.type === type);
          },
          ...getters
        },
        actions: {
          addTransaction: vi.fn(),
          ...actions
        }
      }
    }
  });
};

describe('TransactionForm', () => {
  let wrapper;
  let store;
  let actions;
  
  const createComponent = (props = {}) => {
    store = createMockStore({}, {}, actions);
    
    wrapper = mount(TransactionForm, {
      global: {
        plugins: [store],
        stubs: {
          'font-awesome-icon': true
        }
      },
      props: {
        initialData: {
          type: 'expense',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        },
        ...props
      }
    });
  };
  
  beforeEach(() => {
    actions = {
      addTransaction: vi.fn()
    };
  });
  
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });
  
  it('renders the form with default values', () => {
    createComponent();
    
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="number"]').element.value).toBe('');
    expect(wrapper.find('input[type="date"]').element.value).toBe(new Date().toISOString().split('T')[0]);
    expect(wrapper.find('select').element.value).toBe('');
  });
  
  it('switches between income and expense types', async () => {
    createComponent();
    
    // Default is expense
    expect(wrapper.vm.formData.type).toBe('expense');
    
    // Click income button
    const incomeBtn = wrapper.findAll('button').find(btn => btn.text() === 'Inkomsten');
    await incomeBtn.trigger('click');
    
    expect(wrapper.vm.formData.type).toBe('income');
    
    // Check if categories are updated
    const categoryOptions = wrapper.findAll('option');
    expect(categoryOptions.length).toBe(2); // Default empty option + 1 income category
    expect(categoryOptions[1].text()).toBe('Inkomen');
  });
  
  it('validates required fields on submit', async () => {
    createComponent();
    
    // Try to submit empty form
    await wrapper.find('form').trigger('submit');
    
    // Should show validation errors
    expect(wrapper.find('input[type="number"]:invalid').exists()).toBe(true);
    expect(wrapper.find('select:invalid').exists()).toBe(true);
    
    // Should not call the submit handler
    expect(actions.addTransaction).not.toHaveBeenCalled();
  });
  
  it('submits the form with valid data', async () => {
    createComponent();
    
    // Fill in the form
    await wrapper.find('input[type="number"]').setValue('100');
    await wrapper.find('select').setValue('food');
    await wrapper.find('input[type="text"]').setValue('Boodschappen');
    
    // Submit the form
    await wrapper.find('form').trigger('submit');
    
    // Check if the action was called with the right data
    expect(actions.addTransaction).toHaveBeenCalled();
    
    const submittedData = actions.addTransaction.mock.calls[0][1];
    expect(submittedData.amount).toBe(100);
    expect(submittedData.category).toBe('food');
    expect(submittedData.description).toBe('Boodschappen');
    expect(submittedData.type).toBe('expense');
  });
  
  it('emits cancel event when cancel button is clicked', async () => {
    createComponent({ showCancel: true });
    
    // Click cancel button
    const cancelBtn = wrapper.find('.btn-secondary');
    await cancelBtn.trigger('click');
    
    // Check if cancel event was emitted
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
  
  it('loads initial data when provided', () => {
    const initialData = {
      type: 'income',
      amount: '500',
      category: 'income',
      description: 'Salaris',
      date: '2023-06-15'
    };
    
    createComponent({ initialData });
    
    // Check if form is populated with initial data
    expect(wrapper.vm.formData).toEqual(initialData);
    
    // Check if the correct type is selected
    const incomeBtn = wrapper.findAll('button').find(btn => btn.text() === 'Inkomsten');
    expect(incomeBtn.classes()).toContain('active');
  });
  
  it('formats amount to 2 decimal places', async () => {
    createComponent();
    
    // Enter an amount with more than 2 decimal places
    const amountInput = wrapper.find('input[type="number"]');
    await amountInput.setValue('123.456');
    
    // Trigger blur to format the value
    await amountInput.trigger('blur');
    
    // Check if the value is formatted to 2 decimal places
    expect(wrapper.vm.formData.amount).toBe('123.46');
  });
});
