<template>
    <div class="transaction-filter">
        <div class="filter-row">
            <!-- Search -->
            <div class="filter-group">
                <label for="search">Search</label>
                <input id="search" type="text" v-model="localFilters.search" placeholder="Search by transaction name..."
                    class="filter-input" />
            </div>

            <!-- Type Filter -->
            <div class="filter-group">
                <label for="type">Type</label>
                <select id="type" v-model="localFilters.type" class="filter-select">
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="goal">Goal Contribution</option>
                </select>
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
                <label for="category">Category</label>
                <select id="category" v-model="localFilters.category" class="filter-select">
                    <option value="">All Categories</option>
                    <option v-for="category in availableCategories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>
            </div>
        </div>

        <div class="filter-row">
            <!-- Date Range -->
            <div class="filter-group">
                <label for="dateFrom">From Date</label>
                <input id="dateFrom" type="date" v-model="localFilters.dateFrom" class="filter-input" />
            </div>

            <div class="filter-group">
                <label for="dateTo">To Date</label>
                <input id="dateTo" type="date" v-model="localFilters.dateTo" class="filter-input" />
            </div>

            <!-- Amount Range -->
            <div class="filter-group">
                <label for="amountMin">Min Amount</label>
                <input id="amountMin" type="number" v-model.number="localFilters.amountMin" placeholder="0" min="0"
                    step="0.01" class="filter-input" />
            </div>

            <div class="filter-group">
                <label for="amountMax">Max Amount</label>
                <input id="amountMax" type="number" v-model.number="localFilters.amountMax" placeholder="No limit"
                    min="0" step="0.01" class="filter-input" />
            </div>
        </div>

        <div class="filter-row">
            <!-- Sort Options -->
            <div class="filter-group">
                <label for="sortBy">Sort By</label>
                <select id="sortBy" v-model="localFilters.sortBy" class="filter-select">
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="title">Title</option>
                    <option value="type">Type</option>
                    <option value="category">Category</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="sortOrder">Order</label>
                <select id="sortOrder" v-model="localFilters.sortOrder" class="filter-select">
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <!-- Actions -->
            <div class="filter-group filter-actions">
                <base-button mode="outline" @click="clearFilters">Clear All</base-button>
                <base-button @click="applyFilters">Apply Filters</base-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TransactionFilter',
    props: {
        filters: {
            type: Object,
            default: () => ({
                search: '',
                type: '',
                category: '',
                dateFrom: '',
                dateTo: '',
                amountMin: null,
                amountMax: null,
                sortBy: 'date',
                sortOrder: 'desc'
            })
        },
        availableCategories: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            localFilters: { ...this.filters }
        };
    },
    watch: {
        filters: {
            handler(newFilters) {
                this.localFilters = { ...newFilters };
            },
            deep: true
        }
    },
    methods: {
        applyFilters() {
            this.$emit('filtersChanged', { ...this.localFilters });
        },
        clearFilters() {
            this.localFilters = {
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
            this.applyFilters();
        }
    }
};
</script>

<style scoped>
.transaction-filter {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.filter-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: end;
}

.filter-row:last-child {
    margin-bottom: 0;
}

.filter-group {
    flex: 1;
    min-width: 0;
}

.filter-actions {
    display: flex;
    gap: 0.5rem;
    min-width: auto;
    flex: none;
}

.filter-group label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: #333;
    font-size: 0.875rem;
}

.filter-input,
.filter-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.filter-input:focus,
.filter-select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.filter-select {
    background-color: white;
    cursor: pointer;
}

@media (max-width: 768px) {
    .filter-row {
        flex-direction: column;
        gap: 1rem;
    }

    .filter-actions {
        flex-direction: row;
        justify-content: space-between;
    }
}

@media (max-width: 480px) {
    .filter-actions {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
