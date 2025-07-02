<template>
  <div class="populate-db">
    <base-card>
      <h2>Database Population Tool</h2>
      <p>This will add sample transaction and goal data to your Firebase database.</p>

      <div v-if="loading" class="loading">
        <p>Adding sample data... {{ progress }}</p>
      </div>

      <div v-else-if="completed" class="success">
        <p>✅ Successfully added sample data!</p>
        <p>{{ totalTransactions }} transactions and {{ totalGoals }} goals added</p>
        <p>Final account balance: ${{ finalBalance.toLocaleString() }}</p>
        <base-button @click="reset">Add More Data</base-button>
      </div>

      <div v-else class="controls">
        <base-button @click="populateData">Add Sample Data</base-button>
        <base-button mode="outline" @click="clearData">Clear All Data</base-button>
      </div>

      <div v-if="error" class="error">
        <p>❌ Error: {{ error }}</p>
      </div>
    </base-card>
  </div>
</template>

<script>
export default {
  name: 'PopulateDatabase',
  data() {
    return {
      loading: false,
      completed: false,
      progress: '',
      addedCount: 0,
      finalBalance: 0,
      error: null,
      sampleTransactions: [
        // Income transactions
        {
          title: "Monthly Salary",
          amount: 5500,
          type: "income",
          category: "Salary",
          description: "Monthly salary payment from employer",
          date: "2024-12-01",
          timestamp: new Date("2024-12-01").toISOString()
        },
        {
          title: "Freelance Project",
          amount: 1200,
          type: "income",
          category: "Freelance",
          description: "Website development project completion",
          date: "2024-12-15",
          timestamp: new Date("2024-12-15").toISOString()
        },
        {
          title: "Investment Dividends",
          amount: 450,
          type: "income",
          category: "Investment",
          description: "Quarterly dividend payments",
          date: "2024-12-20",
          timestamp: new Date("2024-12-20").toISOString()
        },
        {
          title: "Side Hustle Earnings",
          amount: 300,
          type: "income",
          category: "Business",
          description: "Online tutoring sessions",
          date: "2024-12-25",
          timestamp: new Date("2024-12-25").toISOString()
        },
        {
          title: "Bonus Payment",
          amount: 800,
          type: "income",
          category: "Bonus",
          description: "Year-end performance bonus",
          date: "2024-12-30",
          timestamp: new Date("2024-12-30").toISOString()
        },
        // Expense transactions
        {
          title: "Grocery Shopping",
          amount: 120,
          type: "expense",
          category: "Food",
          description: "Weekly grocery shopping at supermarket",
          date: "2024-12-02",
          timestamp: new Date("2024-12-02").toISOString()
        },
        {
          title: "Monthly Rent",
          amount: 1800,
          type: "expense",
          category: "Housing",
          description: "Monthly apartment rent payment",
          date: "2024-12-01",
          timestamp: new Date("2024-12-01").toISOString()
        },
        {
          title: "Gas Bill",
          amount: 85,
          type: "expense",
          category: "Utilities",
          description: "Monthly gas and heating bill",
          date: "2024-12-03",
          timestamp: new Date("2024-12-03").toISOString()
        },
        {
          title: "Car Payment",
          amount: 450,
          type: "expense",
          category: "Transportation",
          description: "Monthly car loan payment",
          date: "2024-12-05",
          timestamp: new Date("2024-12-05").toISOString()
        },
        {
          title: "Health Insurance",
          amount: 320,
          type: "expense",
          category: "Healthcare",
          description: "Monthly health insurance premium",
          date: "2024-12-01",
          timestamp: new Date("2024-12-01").toISOString()
        },
        {
          title: "Netflix Subscription",
          amount: 15,
          type: "expense",
          category: "Entertainment",
          description: "Monthly streaming service subscription",
          date: "2024-12-10",
          timestamp: new Date("2024-12-10").toISOString()
        },
        {
          title: "Coffee Shop",
          amount: 25,
          type: "expense",
          category: "Food",
          description: "Weekly coffee and pastries",
          date: "2024-12-08",
          timestamp: new Date("2024-12-08").toISOString()
        },
        {
          title: "Gym Membership",
          amount: 50,
          type: "expense",
          category: "Health",
          description: "Monthly gym membership fee",
          date: "2024-12-01",
          timestamp: new Date("2024-12-01").toISOString()
        },
        {
          title: "Online Course",
          amount: 99,
          type: "expense",
          category: "Education",
          description: "Programming course on Udemy",
          date: "2024-12-12",
          timestamp: new Date("2024-12-12").toISOString()
        },
        {
          title: "Birthday Gift",
          amount: 75,
          type: "expense",
          category: "Personal",
          description: "Gift for friend's birthday",
          date: "2024-12-18",
          timestamp: new Date("2024-12-18").toISOString()
        },
        {
          title: "Electricity Bill",
          amount: 110,
          type: "expense",
          category: "Utilities",
          description: "Monthly electricity bill",
          date: "2024-12-15",
          timestamp: new Date("2024-12-15").toISOString()
        },
        {
          title: "Restaurant Dinner",
          amount: 65,
          type: "expense",
          category: "Food",
          description: "Dinner at Italian restaurant",
          date: "2024-12-22",
          timestamp: new Date("2024-12-22").toISOString()
        },
        {
          title: "Gasoline",
          amount: 40,
          type: "expense",
          category: "Transportation",
          description: "Gas station fill-up",
          date: "2024-12-14",
          timestamp: new Date("2024-12-14").toISOString()
        },
        {
          title: "Phone Bill",
          amount: 80,
          type: "expense",
          category: "Utilities",
          description: "Monthly mobile phone service",
          date: "2024-12-05",
          timestamp: new Date("2024-12-05").toISOString()
        },
        {
          title: "Movie Tickets",
          amount: 30,
          type: "expense",
          category: "Entertainment",
          description: "Cinema tickets for weekend movie",
          date: "2024-12-16",
          timestamp: new Date("2024-12-16").toISOString()
        },
        {
          title: "Haircut",
          amount: 35,
          type: "expense",
          category: "Personal",
          description: "Monthly haircut and styling",
          date: "2024-12-20",
          timestamp: new Date("2024-12-20").toISOString()
        },
        {
          title: "Book Purchase",
          amount: 25,
          type: "expense",
          category: "Education",
          description: "Technical programming book",
          date: "2024-12-11",
          timestamp: new Date("2024-12-11").toISOString()
        },
        {
          title: "Doctor Visit",
          amount: 150,
          type: "expense",
          category: "Healthcare",
          description: "Regular check-up appointment",
          date: "2024-12-28",
          timestamp: new Date("2024-12-28").toISOString()
        },
        {
          title: "Internet Bill",
          amount: 60,
          type: "expense",
          category: "Utilities",
          description: "Monthly internet service",
          date: "2024-12-07",
          timestamp: new Date("2024-12-07").toISOString()
        },
        {
          title: "Clothing Purchase",
          amount: 120,
          type: "expense",
          category: "Personal",
          description: "Winter jacket and accessories",
          date: "2024-12-26",
          timestamp: new Date("2024-12-26").toISOString()
        }
      ],
      sampleGoals: [
        {
          name: "Emergency Fund",
          targetAmount: 10000,
          currentAmount: 3500,
          dueDate: "2025-12-31",
          isCompleted: false,
          starred: true,
          description: "Save 6 months of expenses for unexpected situations",
          priority: "high",
          category: "Security"
        },
        {
          name: "Vacation to Europe",
          targetAmount: 5000,
          currentAmount: 1200,
          dueDate: "2025-08-15",
          isCompleted: false,
          starred: false,
          description: "Two-week trip to Europe including flights, hotels, and activities",
          priority: "medium",
          category: "Travel"
        },
        {
          name: "New Car Down Payment",
          targetAmount: 8000,
          currentAmount: 2500,
          dueDate: "2025-10-01",
          isCompleted: false,
          starred: false,
          description: "Down payment for a reliable used car",
          priority: "high",
          category: "Transportation"
        },
        {
          name: "Home Improvement",
          targetAmount: 15000,
          currentAmount: 600,
          dueDate: "2026-06-30",
          isCompleted: false,
          starred: false,
          description: "Kitchen renovation and bathroom upgrade",
          priority: "medium",
          category: "Home"
        },
        {
          name: "Wedding Fund",
          targetAmount: 25000,
          currentAmount: 8500,
          dueDate: "2026-09-15",
          isCompleted: false,
          starred: false,
          description: "Save for wedding ceremony and reception",
          priority: "high",
          category: "Life Events"
        },
        {
          name: "Investment Portfolio",
          targetAmount: 20000,
          currentAmount: 4200,
          dueDate: "2025-12-31",
          isCompleted: false,
          starred: false,
          description: "Build diversified investment portfolio for long-term growth",
          priority: "medium",
          category: "Investment"
        },
        {
          name: "Professional Development",
          targetAmount: 3000,
          currentAmount: 3000,
          dueDate: "2024-12-31",
          isCompleted: true,
          starred: false,
          description: "Courses, certifications, and conference attendance",
          priority: "medium",
          category: "Education"
        },
        {
          name: "Gaming Setup",
          targetAmount: 2500,
          currentAmount: 750,
          dueDate: "2025-07-01",
          isCompleted: false,
          starred: false,
          description: "New gaming PC and accessories",
          priority: "low",
          category: "Entertainment"
        },
        {
          name: "Health & Fitness",
          targetAmount: 1500,
          currentAmount: 980,
          dueDate: "2025-06-30",
          isCompleted: false,
          starred: false,
          description: "Personal trainer, nutrition plan, and gym equipment",
          priority: "medium",
          category: "Health"
        },
        {
          name: "Business Startup Fund",
          targetAmount: 12000,
          currentAmount: 1800,
          dueDate: "2026-03-01",
          isCompleted: false,
          starred: false,
          description: "Initial capital for starting freelance consulting business",
          priority: "high",
          category: "Business"
        }
      ]
    };
  },
  computed: {
    totalTransactions() {
      return this.sampleTransactions.length;
    },
    totalGoals() {
      return this.sampleGoals.length;
    }
  },
  methods: {
    async populateData() {
      this.loading = true;
      this.error = null;
      this.addedCount = 0;

      try {
        // Add transactions
        for (let i = 0; i < this.sampleTransactions.length; i++) {
          const transaction = this.sampleTransactions[i];
          this.progress = `Adding transaction ${i + 1} of ${this.sampleTransactions.length}: ${transaction.title}`;

          await this.$store.dispatch('transactions/addTransaction', transaction);
          this.addedCount++;

          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Add goals
        for (let i = 0; i < this.sampleGoals.length; i++) {
          const goal = this.sampleGoals[i];
          this.progress = `Adding goal ${i + 1} of ${this.sampleGoals.length}: ${goal.name}`;

          await this.$store.dispatch('goals/addGoal', goal);
          this.addedCount++;

          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.finalBalance = this.$store.getters['transactions/accountBalance'];
        this.completed = true;

      } catch (error) {
        this.error = error.message;
        console.error('Error populating data:', error);
      } finally {
        this.loading = false;
      }
    },

    async clearData() {
      if (confirm('This will clear ALL transaction data. Are you sure?')) {
        try {
          this.loading = true;
          this.progress = 'Clearing all data...';

          // Note: You would need to implement a clearAllTransactions action
          // For now, we'll just reset the local state
          await this.$store.dispatch('transactions/fetchTransactions');

          this.reset();
        } catch (error) {
          this.error = error.message;
        } finally {
          this.loading = false;
        }
      }
    },

    reset() {
      this.completed = false;
      this.addedCount = 0;
      this.finalBalance = 0;
      this.progress = '';
      this.error = null;
    }
  }
};
</script>

<style scoped>
.populate-db {
  max-width: 600px;
  margin: 2rem auto;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.success {
  text-align: center;
  padding: 2rem;
  color: #4caf50;
}

.success p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.error {
  text-align: center;
  padding: 1rem;
  color: #f44336;
  background: #ffebee;
  border-radius: 8px;
  margin-top: 1rem;
}

.error p {
  margin: 0;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
}
</style>
