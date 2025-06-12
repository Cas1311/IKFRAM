const app = Vue.createApp({
  data() {
    return {
      enteredGoal: '',
      goals: []
    };
  },
  methods: {
    addGoal() {
      this.goals.push(this.enteredGoal);
      this.enteredGoal = ''; // Clear the input field after adding the goal
    },
    removeGoal(index) {
      this.goals.splice(index, 1); // Remove the goal at the specified index
    },
  },
});

app.mount('#user-goals');
