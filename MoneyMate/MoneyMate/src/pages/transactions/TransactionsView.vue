<template>
  <!-- <section>
    <base-card>
      <h1>Transactions</h1>
      <p>Here you can see all your transactions. These can either be a form of income, or an expense</p>
    </base-card>
  </section> -->

  <section>
    <base-card>
      <div class="controls">
        <h2>All Transactions</h2>
        <div class="control-actions">
          <base-button mode="outline" @click="toggleFilters">
            {{ showFilters ? 'Hide' : 'Show' }} Filters
          </base-button>
          <base-button link to="/transactions/add">Add a Transaction</base-button>
        </div>
      </div>

      <!-- Filters -->
      <transaction-filter v-if="showFilters" :filters="filters" :available-categories="availableCategories"
        @filtersChanged="onFiltersChanged" />

      <!-- Transaction Stats -->
      <div v-if="hasTransactions" class="transaction-stats">
        <div class="stat-item">
          <span class="stat-label">Showing:</span>
          <span class="stat-value">{{ filteredTransactions.length }} of {{ totalTransactions }} transactions</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Amount:</span>
          <span class="stat-value" :class="{
            'positive': totalFilteredAmount > 0,
            'negative': totalFilteredAmount < 0
          }">
            {{ totalFilteredAmount >= 0 ? '+' : '' }}${{ Math.abs(totalFilteredAmount).toFixed(2) }}
          </span>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <p>Loading transactions...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>Error loading transactions: {{ error }}</p>
        <base-button @click="refreshTransactions">Retry</base-button>
      </div>
      <div v-else-if="hasFilteredTransactions" class="transactions-list">
        <transaction-item v-for="transaction in paginatedTransactions" :key="transaction.id" :id="transaction.id"
          :title="transaction.title" :amount="transaction.amount" :type="transaction.type" :date="transaction.date"
          :description="transaction.description" :category="transaction.category" />

        <!-- Pagination -->
        <base-pagination :current-page="currentPage" :total-items="filteredTransactions.length" :page-size="pageSize"
          @page-changed="onPageChanged" @page-size-changed="onPageSizeChanged" />
      </div>
      <div v-else-if="hasTransactions" class="no-filtered-transactions">
        <h3>No transactions match your filters</h3>
        <p>Try adjusting your search criteria or clear filters to see all transactions.</p>
        <base-button mode="outline" @click="clearFilters">Clear Filters</base-button>
      </div>
      <div v-else class="no-transactions">
        <h3>No transactions yet</h3>
        <p>Start by adding your first transaction!</p>
        <base-button link to="/transactions/add">Add Transaction</base-button>
      </div>
    </base-card>
  </section>
</template>

<script>
import TransactionItem from '@/components/transactions/TransactionItem.vue';
import TransactionFilter from '@/components/transactions/TransactionFilter.vue';
import BasePagination from '@/components/ui/Pagination.vue';

export default {
  name: 'TransactionsView',
  components: {
    TransactionItem,
    TransactionFilter,
    BasePagination,
  },
  data() {
    return {
      showFilters: false,
      currentPage: 1,
      pageSize: 10,
      filters: {
        search: '',
        type: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        amountMin: null,
        amountMax: null,
        sortBy: 'date',
        sortOrder: 'desc'
      }
    };
  },
  computed: {
    transactions() {
      return this.$store.getters['transactions/transactions'];
    },
    loading() {
      return this.$store.getters['transactions/loading'];
    },
    error() {
      return this.$store.getters['transactions/error'];
    },
    hasTransactions() {
      return this.transactions && this.transactions.length > 0;
    },
    totalTransactions() {
      return this.transactions ? this.transactions.length : 0;
    },
    availableCategories() {
      if (!this.transactions) return [];

      const categories = new Set();
      this.transactions.forEach(transaction => {
        if (transaction.category && transaction.category.trim()) {
          categories.add(transaction.category);
        }
      });

      return Array.from(categories).sort();
    },
    filteredTransactions() {
      if (!this.hasTransactions) return [];

      let filtered = [...this.transactions];

      // Apply search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        filtered = filtered.filter(transaction =>
          transaction.title.toLowerCase().includes(searchTerm) ||
          transaction.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply type filter
      if (this.filters.type) {
        filtered = filtered.filter(transaction => transaction.type === this.filters.type);
      }

      // Apply category filter
      if (this.filters.category) {
        filtered = filtered.filter(transaction => transaction.category === this.filters.category);
      }

      // Apply date range filter
      if (this.filters.dateFrom) {
        filtered = filtered.filter(transaction =>
          new Date(transaction.date) >= new Date(this.filters.dateFrom)
        );
      }

      if (this.filters.dateTo) {
        filtered = filtered.filter(transaction =>
          new Date(transaction.date) <= new Date(this.filters.dateTo)
        );
      }

      // Apply amount range filter
      if (this.filters.amountMin !== null && this.filters.amountMin !== '') {
        filtered = filtered.filter(transaction => transaction.amount >= this.filters.amountMin);
      }

      if (this.filters.amountMax !== null && this.filters.amountMax !== '') {
        filtered = filtered.filter(transaction => transaction.amount <= this.filters.amountMax);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (this.filters.sortBy) {
          case 'amount':
            aValue = a.amount;
            bValue = b.amount;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'category':
            aValue = a.category || '';
            bValue = b.category || '';
            break;
          case 'date':
          default:
            aValue = new Date(a.date || a.timestamp);
            bValue = new Date(b.date || b.timestamp);
            break;
        }

        if (aValue < bValue) return this.filters.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    },
    paginatedTransactions() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredTransactions.slice(startIndex, endIndex);
    },
    hasFilteredTransactions() {
      return this.filteredTransactions && this.filteredTransactions.length > 0;
    },
    totalFilteredAmount() {
      if (!this.hasFilteredTransactions) return 0;

      return this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
          return total + transaction.amount;
        } else if (transaction.type === 'expense' || transaction.type === 'goal') {
          return total - transaction.amount;
        }
        return total;
      }, 0);
    }
  },
  methods: {
    refreshTransactions() {
      this.$store.dispatch('transactions/fetchTransactions');
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    onFiltersChanged(newFilters) {
      this.filters = { ...newFilters };
    },
    clearFilters() {
      this.filters = {
        search: '',
        type: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        amountMin: null,
        amountMax: null,
        sortBy: 'date',
        sortOrder: 'desc'
      };
      this.currentPage = 1; // Reset to first page when clearing filters
    },
    onPageChanged(page) {
      this.currentPage = page;
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onPageSizeChanged(newPageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // Reset to first page when changing page size
    }
  },
  watch: {
    // Reset to first page when filters change
    filters: {
      handler() {
        this.currentPage = 1;
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.controls h2 {
  margin: 0;
}

.control-actions {
  display: flex;
  gap: 0.5rem;
}

.transaction-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.stat-value.positive {
  color: #28a745;
}

.stat-value.negative {
  color: #dc3545;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-transactions,
.no-filtered-transactions {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.no-transactions h3,
.no-filtered-transactions h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.no-transactions p,
.no-filtered-transactions p {
  margin: 0 0 1.5rem 0;
}

.loading {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.loading p {
  font-size: 1.1rem;
  margin: 0;
}

.error {
  text-align: center;
  padding: 3rem 1rem;
  color: #dc3545;
}

.error p {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .control-actions {
    justify-content: space-between;
  }

  .transaction-stats {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stat-item {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .control-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
