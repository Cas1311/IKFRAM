<template>
  <div v-if="!link" class="card">
    <slot></slot>
  </div>
  <router-link v-else :to="to" class="card card-link">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
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
};
</script>

<style scoped>
.card {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 40rem;
  border: 1px solid var(--border-light);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
