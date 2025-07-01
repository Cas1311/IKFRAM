<template>
  <li>
    <h3>
      {{ name }}
    </h3>
    <h4>{{ current }} / {{ target }}</h4>
    <p>{{ date }}</p>
    <div class="actions">
      <base-button mode="outline" link :to="goalEditLink">Edit</base-button>
      <base-button link :to="goalDeleteLink">Delete</base-button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'GoalItem',
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    complete: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    goalEditLink() {
      return `/goals/${this.id}/edit`;
    },
    goalDeleteLink() {
      return `/goals/${this.id}/delete`;
    }
  }
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
