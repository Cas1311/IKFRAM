<template>
  <form @submit.prevent="addGoal">
    <div class="form-control">
      <label for="name">Name</label>
      <input type="text" id="name" v-model.trim="name" placeholder="Enter goal name" :class="{ 'was-validated': touched.name }" @blur="touched.name = true" required>
      <span v-if="touched.name && !name" class="error-message">Goal name is required</span>
    </div>
    <div class="form-control">
      <label for="targetAmount">Target Amount</label>
      <input type="number" id="targetAmount" step="1" min="0" v-model.number="targetAmount" placeholder="Enter target amount" :class="{ 'was-validated': touched.targetAmount }" @blur="touched.targetAmount = true" required>
      <span v-if="touched.targetAmount && (!targetAmount || targetAmount <= 0)" class="error-message">Target amount is required and must be greater than 0</span>
    </div>
    <div class="form-control">
      <label for="currentAmount">Current Amount</label>
      <input type="number" id="currentAmount" step="1" min="0" v-model.number="currentAmount" placeholder="Enter current amount" :class="{ 'was-validated': touched.currentAmount }" @blur="touched.currentAmount = true" required>
      <span v-if="touched.currentAmount && (currentAmount === null || currentAmount < 0)" class="error-message">Current amount is required and must be 0 or greater</span>
    </div>
    <div class="form-control">
      <label for="dueDate">Due Date</label>
      <input type="date" id="dueDate" v-model="dueDate" :class="{ 'was-validated': touched.dueDate }" @blur="touched.dueDate = true" required>
      <span v-if="touched.dueDate && !dueDate" class="error-message">Due date is required</span>
    </div>
    <base-button>Add</base-button>
  </form>
</template>

<script>
export default {
  data(){
    return {
      name: '',
      targetAmount: null,
      currentAmount: null,
      dueDate: '',
      isCompleted: false,
      starred: false,
      touched: {
        name: false,
        targetAmount: false,
        currentAmount: false,
        dueDate: false
      }
    };
  },
  methods: {
    addGoal() {
      if (this.name && this.targetAmount && this.currentAmount !== null && this.dueDate) {
        const newGoal = {
          id: Date.now().toString(), // Generate unique ID using timestamp
          name: this.name,
          targetAmount: this.targetAmount,
          currentAmount: this.currentAmount,
          dueDate: this.dueDate,
          isCompleted: this.isCompleted,
          starred: this.starred,
        };

        try {
          this.$store.dispatch('goals/addGoal', newGoal);

          // Reset form fields
          this.name = '';
          this.targetAmount = null;
          this.currentAmount = null;
          this.dueDate = '';
          this.isCompleted = false;
          this.starred = false;

          // Reset touched state
          this.touched = {
            name: false,
            targetAmount: false,
            currentAmount: false,
            dueDate: false
          };

          // Navigate back to goals page
          this.$router.push('/goals');
        } catch (error) {
          alert('Error adding goal. Please try again.');
          console.error('Error adding goal:', error);
        }
      } else {
        alert('Please fill in all fields.');
      }
    },
  }
};
</script>

<style scoped>
.form-control {
  margin-bottom: 1.5rem;
}

.form-control label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-control input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-control input:focus {
  outline: none;
  border-color: #3a0061;
  box-shadow: 0 0 0 2px rgba(58, 0, 97, 0.2);
}

/* Only show red border for invalid fields that have been touched (on blur) */
.form-control input.was-validated:invalid {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
