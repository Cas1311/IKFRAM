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

  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 40rem;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
