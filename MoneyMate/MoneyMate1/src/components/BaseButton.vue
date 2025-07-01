<template>
  <button
    :class="[
      'base-button',
      mode,
      { 'is-loading': loading }
    ]"
    :disabled="loading"
    v-bind="$attrs"
    @click="emit('click', $event)"
  >
    <slot v-if="!loading"></slot>
    <span v-else class="loading-spinner"></span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'flat', 'text'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

/* Primary button */
.primary {
  background-color: var(--primary-color);
  color: var(--text-primary);
}

.primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Secondary button */
.secondary {
  background-color: var(--secondary-color);
  color: var(--text-primary);
}

.secondary:hover:not(:disabled) {
  background-color: #1976d2;
  transform: translateY(-1px);
}

/* Flat button */
.flat {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.flat:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: var(--text-primary);
}

/* Text button */
.text {
  background: transparent;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
}

.text:hover:not(:disabled) {
  background-color: rgba(76, 175, 80, 0.1);
}

/* Loading state */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode adjustments */
[data-theme='dark'] .base-button {
  color: var(--text-primary);
}

[data-theme='dark'] .primary {
  background-color: var(--primary-color);
}

[data-theme='dark'] .secondary {
  background-color: var(--secondary-color);
}

[data-theme='dark'] .flat {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

[data-theme='dark'] .text {
  color: var(--primary-color);
}
</style>
