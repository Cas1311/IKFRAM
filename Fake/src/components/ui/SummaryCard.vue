<template>
  <div class="summary-card" :class="[type, { 'clickable': clickable }]" @click="$emit('click')">
    <div class="summary-card__icon">
      <slot name="icon">
        <span class="material-icons">{{ icon }}</span>
      </slot>
    </div>
    <div class="summary-card__content">
      <h3 class="summary-card__title">{{ title }}</h3>
      <p class="summary-card__value" :class="{ 'positive': type === 'income', 'negative': type === 'expense' }">
        {{ formattedValue }}
      </p>
      <p v-if="subtitle" class="summary-card__subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'SummaryCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'income', 'expense', 'success', 'warning', 'info'].includes(value)
    },
    icon: {
      type: String,
      default: 'info'
    },
    subtitle: {
      type: String,
      default: ''
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    const formattedValue = computed(() => {
      if (typeof props.value === 'number') {
        return new Intl.NumberFormat('nl-NL', {
          style: 'currency',
          currency: 'EUR'
        }).format(Math.abs(props.value));
      }
      return props.value;
    });

    return {
      formattedValue
    };
  }
};
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #4a6fa5;
}

.summary-card.clickable {
  cursor: pointer;
}

.summary-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.summary-card__icon {
  margin-right: 1rem;
  color: #4a6fa5;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.summary-card__content {
  flex: 1;
}

.summary-card__title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.summary-card__value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.summary-card__subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: #888;
}

/* Type variations */
.summary-card.income {
  border-left-color: #4caf50;
}

.summary-card.expense {
  border-left-color: #f44336;
}

.summary-card.success {
  border-left-color: #4caf50;
}

.summary-card.warning {
  border-left-color: #ff9800;
}

.summary-card.info {
  border-left-color: #2196f3;
}

.summary-card .positive {
  color: #4caf50;
}

.summary-card .negative {
  color: #f44336;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .summary-card {
    padding: 1rem;
  }
  
  .summary-card__value {
    font-size: 1.25rem;
  }
}
</style>
