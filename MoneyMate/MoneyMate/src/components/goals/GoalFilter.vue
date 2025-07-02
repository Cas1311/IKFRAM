<template>
  <base-card>
    <h2>Filter your Goals</h2>

    <div class="filter-section">
      <!-- Search by name -->
      <div class="filter-group">
        <label for="search">Search by name:</label>
        <input
          id="search"
          type="text"
          v-model="filters.searchText"
          placeholder="Search goals by name"
        />
      </div>

      <!-- Filter by goal amount -->
      <div class="filter-group">
        <label>Goal Amount Range:</label>
        <div class="range-inputs">
          <input
            type="number"
            v-model.number="filters.minAmount"
            placeholder="Min amount"
          />
          <span>to</span>
          <input
            type="number"
            v-model.number="filters.maxAmount"
            placeholder="Max amount"
          />
        </div>
      </div>

      <!-- Filter by percentage complete -->
      <div class="filter-group">
        <label>Completion Percentage:</label>
        <div class="range-inputs">
          <input
            type="number"
            v-model.number="filters.minPercentage"
            placeholder="Min %"
            min="0"
            max="100"
          />
          <span>to</span>
          <input
            type="number"
            v-model.number="filters.maxPercentage"
            placeholder="Max %"
            min="0"
            max="100"
          />
        </div>
      </div>

      <!-- Filter by due date -->
      <div class="filter-group">
        <label>Due Date Range:</label>
        <div class="range-inputs">
          <input
            type="date"
            v-model="filters.startDate"
          />
          <span>to</span>
          <input
            type="date"
            v-model="filters.endDate"
          />
        </div>
      </div>

      <!-- Status filter -->
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filters.status">
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <!-- Sorting options -->
      <div class="filter-group">
        <label>Sort by:</label>
        <select v-model="filters.sortBy">
          <option value="">No sorting</option>
          <option value="name">Goal Name</option>
          <option value="dueDate">Due Date</option>
          <option value="percentage">Completion %</option>
          <option value="targetAmount">Goal Amount</option>
          <option value="currentAmount">Current Amount</option>
        </select>

        <select v-model="filters.sortOrder" v-if="filters.sortBy">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <div class="filter-actions">
      <base-button @click="applyFilters">Apply Filters</base-button>
      <base-button mode="outline" @click="clearFilters">Clear All Filters</base-button>
      <span class="results-count" v-if="resultCount !== null">
        {{ resultCount }} goal{{ resultCount !== 1 ? 's' : '' }} found
      </span>
    </div>
  </base-card>
</template>

<script>
export default {
  name: 'GoalFilter',
  props: {
    resultCount: {
      type: Number,
      default: null
    }
  },
  emits: ['filter-changed'],
  data() {
    return {
      filters: {
        searchText: '',
        minAmount: null,
        maxAmount: null,
        minPercentage: null,
        maxPercentage: null,
        startDate: '',
        endDate: '',
        status: '',
        sortBy: '',
        sortOrder: 'asc'
      }
    };
  },
  methods: {
    applyFilters() {
      this.$emit('filter-changed', { ...this.filters });
    },
    emitFilters() {
      this.$emit('filter-changed', { ...this.filters });
    },
    clearFilters() {
      this.filters = {
        searchText: '',
        minAmount: null,
        maxAmount: null,
        minPercentage: null,
        maxPercentage: null,
        startDate: '',
        endDate: '',
        status: '',
        sortBy: '',
        sortOrder: 'asc'
      };
      this.applyFilters();
    }
  }
};
</script>

<style scoped>
.filter-section {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #3a0061;
  box-shadow: 0 0 0 2px rgba(58, 0, 97, 0.2);
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.range-inputs input {
  flex: 1;
  min-width: 0;
}

.range-inputs span {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
  margin-left: auto;
}

/* Responsive design */
@media (min-width: 768px) {
  .filter-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-group:last-child {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .filter-section {
    grid-template-columns: repeat(3, 1fr);
  }

  .filter-group:last-child {
    grid-column: span 1;
  }
}

@media (max-width: 767px) {
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .range-inputs span {
    text-align: center;
    padding: 0.25rem 0;
  }

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .results-count {
    margin-left: 0;
    text-align: center;
    order: -1;
  }
}

/* Ensure content doesn't overflow container */
* {
  box-sizing: border-box;
}

h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.25rem;
  }

  .filter-group input,
  .filter-group select {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
}
</style>

