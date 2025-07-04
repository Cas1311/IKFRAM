<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    }
  }
}
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: var(--button-primary-bg);
  border: 1px solid var(--button-primary-border);
  color: var(--button-primary-text);
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
  transition: all 0.3s ease;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: var(--button-primary-hover-bg);
  border-color: var(--button-primary-hover-border);
}

.flat {
  background-color: transparent;
  color: var(--interactive-primary);
  border: none;
}

.outline {
  background-color: var(--button-secondary-bg);
  border-color: var(--button-secondary-border);
  color: var(--button-secondary-text);
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: var(--button-secondary-hover-bg);
}
</style>
