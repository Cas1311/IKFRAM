<template>
  <form @submit.prevent="addTransaction">
    <div class="form-control">
      <label for="title">Transaction Title</label>
      <input
        type="text"
        id="title"
        v-model.trim="title"
        placeholder="Enter transaction title"
        :class="{ 'was-validated': touched.title }"
        @blur="touched.title = true"
        required
      >
      <span v-if="touched.title && !title" class="error-message">Transaction title is required</span>
    </div>

    <div class="form-control">
      <label for="amount">Amount</label>
      <input
        type="number"
        id="amount"
        step="0.01"
        min="0"
        v-model.number="amount"
        placeholder="Enter amount"
        :class="{ 'was-validated': touched.amount }"
        @blur="touched.amount = true"
        required
      >
      <span v-if="touched.amount && (!amount || amount <= 0)" class="error-message">Amount must be greater than 0</span>
    </div>

    <div class="form-control">
      <label for="type">Transaction Type</label>
      <select
        id="type"
        v-model="type"
        :class="{ 'was-validated': touched.type }"
        @blur="touched.type = true"
        required
      >
        <option value="">Select transaction type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <span v-if="touched.type && !type" class="error-message">Transaction type is required</span>
    </div>

    <div class="form-control">
      <label for="category">Category</label>
      <select
        id="category"
        v-model="category"
        :class="{ 'was-validated': touched.category }"
        @blur="touched.category = true"
        required
      >
        <option value="">Select category</option>
        <!-- Income categories -->
        <optgroup v-if="type === 'income'" label="Income Categories">
          <option value="salary">Salary</option>
          <option value="freelance">Freelance</option>
          <option value="investment">Investment</option>
          <option value="gift">Gift</option>
          <option value="other-income">Other Income</option>
        </optgroup>
        <!-- Expense categories -->
        <optgroup v-if="type === 'expense'" label="Expense Categories">
          <option value="food">Food & Dining</option>
          <option value="transportation">Transportation</option>
          <option value="shopping">Shopping</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="other-expense">Other Expense</option>
        </optgroup>
      </select>
      <span v-if="touched.category && !category" class="error-message">Category is required</span>
    </div>

    <div class="form-control">
      <label for="description">Description (Optional)</label>
      <textarea
        id="description"
        v-model.trim="description"
        placeholder="Enter transaction description"
        rows="3"
      ></textarea>
    </div>

    <div class="form-control">
      <label for="date">Date</label>
      <input
        type="date"
        id="date"
        v-model="date"
        :class="{ 'was-validated': touched.date }"
        @blur="touched.date = true"
        required
      >
      <span v-if="touched.date && !date" class="error-message">Date is required</span>
    </div>

    <div class="form-actions">
      <base-button type="submit">Add Transaction</base-button>
      <base-button mode="outline" link to="/transactions">Cancel</base-button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'TransactionForm',
  data() {
    return {
      title: '',
      amount: null,
      type: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0], // Today's date
      touched: {
        title: false,
        amount: false,
        type: false,
        category: false,
        date: false
      }
    };
  },
  watch: {
    type() {
      // Reset category when type changes
      this.category = '';
      this.touched.category = false;
    }
  },
  methods: {
    addTransaction() {
      if (this.title && this.amount && this.type && this.category && this.date) {
        const newTransaction = {
          id: Date.now().toString(),
          title: this.title,
          amount: this.amount,
          type: this.type,
          category: this.category,
          description: this.description,
          date: this.date,
          timestamp: new Date().toISOString()
        };

        try {
          // Add transaction to store
          this.$store.dispatch('transactions/addTransaction', newTransaction);
          console.log('Transaction added successfully:', newTransaction);

          // Reset form
          this.resetForm();

          // Navigate back to transactions
          this.$router.push('/transactions');
        } catch (error) {
          alert('Error adding transaction. Please try again.');
          console.error('Error adding transaction:', error);
        }
      } else {
        alert('Please fill in all required fields.');
      }
    },
    resetForm() {
      this.title = '';
      this.amount = null;
      this.type = '';
      this.category = '';
      this.description = '';
      this.date = new Date().toISOString().split('T')[0];
      this.touched = {
        title: false,
        amount: false,
        type: false,
        category: false,
        date: false
      };
    }
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

.form-control input,
.form-control select,
.form-control textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-control input:focus,
.form-control select:focus,
.form-control textarea:focus {
  outline: none;
  border-color: #3a0061;
  box-shadow: 0 0 0 2px rgba(58, 0, 97, 0.2);
}

.form-control input.was-validated:invalid,
.form-control select.was-validated:invalid,
.form-control textarea.was-validated:invalid {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-control textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>
