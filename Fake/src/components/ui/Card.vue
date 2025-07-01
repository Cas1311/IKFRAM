<template>
  <div class="card" :class="{ 'card-hover': hover, 'card-clickable': clickable }" @click="handleClick">
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
      <div v-if="!$slots.default && !loading" class="empty-state">
        <slot name="empty">
          <p>Geen gegevens beschikbaar</p>
        </slot>
      </div>
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Laden...</p>
      </div>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>


export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    hover: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event) => {
      if (props.clickable) {
        emit('click', event);
      }
    };

    return {
      handleClick
    };
  }
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-hover:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  position: relative;
}

.card-footer {
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6c757d;
  padding: 2rem 1rem;
}

.empty-state p {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(74, 111, 165, 0.2);
  border-radius: 50%;
  border-top-color: #4a6fa5;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .card-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style>
