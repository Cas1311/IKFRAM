<template>
    <div class="pagination" v-if="totalPages > 1">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="$emit('page-changed', currentPage - 1)">
            ‹ Previous
        </button>

        <div class="pagination-pages">
            <!-- First page -->
            <button v-if="showFirstPage" class="pagination-btn page-number" :class="{ active: currentPage === 1 }"
                @click="$emit('page-changed', 1)">
                1
            </button>

            <!-- First ellipsis -->
            <span v-if="showFirstEllipsis" class="pagination-ellipsis">...</span>

            <!-- Visible page numbers -->
            <button v-for="page in visiblePages" :key="page" class="pagination-btn page-number"
                :class="{ active: currentPage === page }" @click="$emit('page-changed', page)">
                {{ page }}
            </button>

            <!-- Last ellipsis -->
            <span v-if="showLastEllipsis" class="pagination-ellipsis">...</span>

            <!-- Last page -->
            <button v-if="showLastPage" class="pagination-btn page-number"
                :class="{ active: currentPage === totalPages }" @click="$emit('page-changed', totalPages)">
                {{ totalPages }}
            </button>
        </div>

        <button class="pagination-btn" :disabled="currentPage === totalPages"
            @click="$emit('page-changed', currentPage + 1)">
            Next ›
        </button>

        <!-- Page size selector -->
        <div class="page-size-selector">
            <label for="pageSize">Items per page:</label>
            <select id="pageSize" :value="pageSize" @change="$emit('page-size-changed', parseInt($event.target.value))"
                class="page-size-select">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>

    <!-- Pagination info -->
    <div class="pagination-info" v-if="totalItems > 0">
        <span>
            Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} items
        </span>
    </div>
</template>

<script>
export default {
    name: 'BasePagination',
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalItems: {
            type: Number,
            required: true
        },
        pageSize: {
            type: Number,
            default: 10
        },
        maxVisiblePages: {
            type: Number,
            default: 5
        }
    },
    emits: ['page-changed', 'page-size-changed'],
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.pageSize);
        },
        startItem() {
            return (this.currentPage - 1) * this.pageSize + 1;
        },
        endItem() {
            return Math.min(this.currentPage * this.pageSize, this.totalItems);
        },
        visiblePages() {
            const pages = [];
            const half = Math.floor(this.maxVisiblePages / 2);

            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

            // Adjust start if we're near the end
            if (end - start + 1 < this.maxVisiblePages) {
                start = Math.max(1, end - this.maxVisiblePages + 1);
            }

            // Don't show first/last page in visible pages if they're already shown separately
            const showFirst = this.showFirstPage;
            const showLast = this.showLastPage;

            if (showFirst && start === 1) start = 2;
            if (showLast && end === this.totalPages) end = this.totalPages - 1;

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },
        showFirstPage() {
            return this.totalPages > this.maxVisiblePages && this.currentPage > Math.ceil(this.maxVisiblePages / 2) + 1;
        },
        showLastPage() {
            return this.totalPages > this.maxVisiblePages && this.currentPage < this.totalPages - Math.ceil(this.maxVisiblePages / 2);
        },
        showFirstEllipsis() {
            return this.showFirstPage && this.visiblePages.length > 0 && this.visiblePages[0] > 2;
        },
        showLastEllipsis() {
            return this.showLastPage && this.visiblePages.length > 0 && this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
        }
    }
};
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
}

.pagination-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.pagination-btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e0e0e0;
    background: white;
    color: #64748b;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 2.5rem;
    text-align: center;
}

.pagination-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #3498db;
    color: #3498db;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-btn.page-number {
    padding: 0.5rem;
    min-width: 2.5rem;
}

.pagination-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.pagination-ellipsis {
    padding: 0.5rem 0.25rem;
    color: #64748b;
    font-weight: 500;
}

.page-size-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid #e0e0e0;
}

.page-size-selector label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
}

.page-size-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: white;
    color: #333;
    font-size: 0.875rem;
    cursor: pointer;
}

.page-size-select:focus {
    outline: none;
    border-color: #3498db;
}

.pagination-info {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.5rem 0;
}

/* Responsive design */
@media (max-width: 768px) {
    .pagination {
        flex-direction: column;
        gap: 1rem;
    }

    .page-size-selector {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
        border-top: 1px solid #e0e0e0;
        padding-top: 1rem;
    }

    .pagination-pages {
        order: -1;
    }
}

@media (max-width: 480px) {
    .pagination-btn {
        padding: 0.375rem 0.5rem;
        font-size: 0.8rem;
        min-width: 2rem;
    }

    .pagination-btn.page-number {
        padding: 0.375rem;
        min-width: 2rem;
    }

    .page-size-selector {
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
    }
}
</style>
