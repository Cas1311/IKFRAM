<template>
  <div class="filters">
    <div class="filter-group">
      <label for="filter-type">Type:</label>
      <select 
        id="filter-type" 
        v-model="filters.type" 
        class="form-control"
        @change="updateFilters"
      >
        <option value="all">Alle transacties</option>
        <option value="income">Inkomsten</option>
        <option value="expense">Uitgaven</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-month">Maand:</label>
      <select 
        id="filter-month" 
        v-model="filters.month" 
        class="form-control"
        @change="updateFilters"
      >
        <option v-for="(month, index) in months" :key="index" :value="index + 1">
          {{ month }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-year">Jaar:</label>
      <select 
        id="filter-year" 
        v-model="filters.year" 
        class="form-control"
        @change="updateFilters"
      >
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-category">Categorie:</label>
      <select 
        id="filter-category" 
        v-model="filters.category" 
        class="form-control"
        @change="updateFilters"
      >
        <option value="">Alle categorieën</option>
        <optgroup v-if="incomeCategories.length > 0" label="Inkomsten">
          <option 
            v-for="category in incomeCategories" 
            :key="'inc-' + category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </optgroup>
        <optgroup v-if="expenseCategories.length > 0" label="Uitgaven">
          <option 
            v-for="category in expenseCategories" 
            :key="'exp-' + category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </optgroup>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-by">Sorteren op:</label>
      <select 
        id="sort-by" 
        v-model="sortOptions.by" 
        class="form-control"
        @change="updateSorting"
      >
        <option value="date">Datum</option>
        <option value="amount">Bedrag</option>
        <option value="category">Categorie</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-order">Volgorde:</label>
      <select 
        id="sort-order" 
        v-model="sortOptions.order" 
        class="form-control"
        @change="updateSorting"
      >
        <option value="desc">Aflopend</option>
        <option value="asc">Oplopend</option>
      </select>
    </div>

    <button 
      class="btn btn-secondary" 
      @click="resetFilters"
      :disabled="!hasActiveFilters"
    >
      Reset filters
    </button>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TransactionFilters',
  emits: ['update:filters', 'update:sort'],
  setup(props, { emit }) {
    const store = useStore();
    
    // Months in Dutch
    const months = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
      'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
    ];
    
    // Generate years (current year - 5 to current year + 1)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);
    
    // Get categories from store
    const incomeCategories = computed(() => store.getters['transactions/incomeCategories']);
    const expenseCategories = computed(() => store.getters['transactions/expenseCategories']);
    
    // Default filters
    const defaultFilters = {
      type: 'all',
      month: new Date().getMonth() + 1, // Current month
      year: currentYear,
      category: ''
    };
    
    const filters = ref({ ...defaultFilters });
    
    // Default sort options
    const defaultSortOptions = {
      by: 'date',
      order: 'desc'
    };
    
    const sortOptions = ref({ ...defaultSortOptions });
    
    // Check if any filter is active
    const hasActiveFilters = computed(() => {
      return Object.entries(defaultFilters).some(
        ([key, value]) => filters.value[key] !== value
      );
    });
    
    // Emit filter changes
    const updateFilters = () => {
      emit('update:filters', { ...filters.value });
    };
    
    // Emit sort changes
    const updateSorting = () => {
      emit('update:sort', { ...sortOptions.value });
    };
    
    // Reset all filters to default
    const resetFilters = () => {
      filters.value = { ...defaultFilters };
      sortOptions.value = { ...defaultSortOptions };
      updateFilters();
      updateSorting();
    };
    
    // Watch for route query changes to update filters
    watch(
      () => store.state.route.query,
      (query) => {
        if (query.month) filters.value.month = parseInt(query.month);
        if (query.year) filters.value.year = parseInt(query.year);
        if (query.type) filters.value.type = query.type;
        if (query.category) filters.value.category = query.category;
      },
      { immediate: true }
    );
    
    return {
      months,
      years,
      filters,
      sortOptions,
      incomeCategories,
      expenseCategories,
      hasActiveFilters,
      updateFilters,
      updateSorting,
      resetFilters
    };
  }
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .filter-group {
    min-width: calc(50% - 0.5rem);
  }
}

@media (max-width: 576px) {
  .filter-group {
    min-width: 100%;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
