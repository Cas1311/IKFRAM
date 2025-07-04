// Sample data population script for Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

// Firebase configuration (same as in your config.js)
const firebaseConfig = {
  apiKey: "AIzaSyBOKC_3jKyOJaOXt3KEJp1GfuauvCrSLdc",
  authDomain: "moneymate-5a2eb.firebaseapp.com",
  databaseURL: "https://ikfram-33ade-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "moneymate-5a2eb",
  storageBucket: "moneymate-5a2eb.firebasestorage.app",
  messagingSenderId: "139456554433",
  appId: "1:139456554433:web:edc0067fe5c64f02d5b6e2d5b6e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define available categories
const incomeCategories = [
  { value: 'salary', label: 'Salary', avgAmount: 4500, variance: 500 },
  { value: 'freelance', label: 'Freelance', avgAmount: 800, variance: 400 },
  { value: 'investment', label: 'Investment', avgAmount: 300, variance: 200 },
  { value: 'gift', label: 'Gift', avgAmount: 150, variance: 100 },
  { value: 'other-income', label: 'Other Income', avgAmount: 200, variance: 150 }
];

const expenseCategories = [
  { value: 'food', label: 'Food & Dining', avgAmount: 400, variance: 150 },
  { value: 'transportation', label: 'Transportation', avgAmount: 300, variance: 100 },
  { value: 'shopping', label: 'Shopping', avgAmount: 250, variance: 200 },
  { value: 'entertainment', label: 'Entertainment', avgAmount: 150, variance: 100 },
  { value: 'utilities', label: 'Utilities', avgAmount: 200, variance: 50 },
  { value: 'healthcare', label: 'Healthcare', avgAmount: 180, variance: 120 },
  { value: 'education', label: 'Education', avgAmount: 100, variance: 80 },
  { value: 'other-expense', label: 'Other Expense', avgAmount: 120, variance: 100 }
];

// Sample goal contributions
const goalContributions = [
  { name: 'Emergency Fund', avgAmount: 500, variance: 100 },
  { name: 'Vacation Fund', avgAmount: 300, variance: 100 },
  { name: 'New Car', avgAmount: 400, variance: 150 },
  { name: 'House Down Payment', avgAmount: 800, variance: 200 }
];

// Helper functions
function getRandomAmount(avgAmount, variance) {
  const min = avgAmount - variance;
  const max = avgAmount + variance;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return new Date(year, month - 1, day);
}

function shouldIncludeCategory(probability = 0.7) {
  return Math.random() < probability;
}

function generateTransactionsForMonth(year, month) {
  const transactions = [];

  // Generate income transactions
  incomeCategories.forEach((category) => {
    // Salary is monthly, others are more random
    const probability = category.value === 'salary' ? 1.0 : 0.4;

    if (shouldIncludeCategory(probability)) {
      const amount = getRandomAmount(category.avgAmount, category.variance);
      const date = getRandomDate(year, month);

      transactions.push({
        title: `${category.label} - ${getMonthName(month)} ${year}`,
        amount: amount,
        type: 'income',
        category: category.value,
        description: getIncomeDescription(category.value),
        date: date.toISOString().split('T')[0],
        timestamp: date.toISOString()
      });
    }
  });

  // Generate expense transactions
  expenseCategories.forEach((category) => {
    // Utilities are monthly, food is frequent, others vary
    let frequency = 1;
    if (category.value === 'food') frequency = 4; // Weekly
    else if (category.value === 'utilities') frequency = 1; // Monthly
    else if (category.value === 'transportation') frequency = 2; // Bi-weekly
    else frequency = Math.random() < 0.6 ? 1 : 0; // 60% chance

    for (let i = 0; i < frequency; i++) {
      if (shouldIncludeCategory(0.8)) {
        const amount = getRandomAmount(category.avgAmount / frequency, category.variance / frequency);
        const date = getRandomDate(year, month);

        transactions.push({
          title: `${category.label} - ${getExpenseTitle(category.value, i + 1)}`,
          amount: amount,
          type: 'expense',
          category: category.value,
          description: getExpenseDescription(category.value),
          date: date.toISOString().split('T')[0],
          timestamp: date.toISOString()
        });
      }
    }
  });

  // Generate goal contributions (25% chance per goal per month)
  goalContributions.forEach(goal => {
    if (shouldIncludeCategory(0.25)) {
      const amount = getRandomAmount(goal.avgAmount, goal.variance);
      const date = getRandomDate(year, month);

      transactions.push({
        title: `Contribution to ${goal.name}`,
        amount: amount,
        type: 'goal',
        category: 'savings',
        description: `Monthly contribution towards ${goal.name}`,
        date: date.toISOString().split('T')[0],
        timestamp: date.toISOString()
      });
    }
  });

  return transactions;
}

function getMonthName(month) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
}

function getIncomeDescription(category) {
  const descriptions = {
    'salary': 'Monthly salary payment from employer',
    'freelance': 'Freelance project completion payment',
    'investment': 'Investment returns and dividends',
    'gift': 'Gift money received',
    'other-income': 'Miscellaneous income source'
  };
  return descriptions[category] || 'Income transaction';
}

function getExpenseTitle(category, occurrence) {
  const titles = {
    'food': [`Grocery Shopping`, `Restaurant Meal`, `Coffee & Snacks`, `Food Delivery`],
    'transportation': [`Gas Fill-up`, `Public Transport`, `Car Maintenance`, `Parking Fees`],
    'shopping': [`Clothing Purchase`, `Electronics`, `Home Items`, `Personal Care`],
    'entertainment': [`Movie Tickets`, `Streaming Service`, `Concert/Event`, `Gaming`],
    'utilities': [`Electricity Bill`, `Internet Bill`, `Water Bill`, `Phone Bill`],
    'healthcare': [`Doctor Visit`, `Pharmacy`, `Health Insurance`, `Dental Care`],
    'education': [`Online Course`, `Books`, `Workshop`, `Certification`],
    'other-expense': [`Miscellaneous`, `Unexpected Expense`, `Service Fee`, `Other`]
  };

  const categoryTitles = titles[category] || ['Expense'];
  return categoryTitles[(occurrence - 1) % categoryTitles.length];
}

function getExpenseDescription(category) {
  const descriptions = {
    'food': 'Food and dining expenses',
    'transportation': 'Transportation and vehicle costs',
    'shopping': 'Shopping and retail purchases',
    'entertainment': 'Entertainment and leisure activities',
    'utilities': 'Monthly utility bills and services',
    'healthcare': 'Healthcare and medical expenses',
    'education': 'Educational materials and courses',
    'other-expense': 'Other miscellaneous expenses'
  };
  return descriptions[category] || 'Expense transaction';
}

async function populateDatabase() {
  try {
    console.log('Starting to populate database...');

    // Generate transactions for the past 12 months
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let allTransactions = [];

    // Generate data for the past 12 months
    for (let i = 11; i >= 0; i--) {
      let year = currentYear;
      let month = currentMonth - i;

      // Handle year rollover
      if (month <= 0) {
        month += 12;
        year -= 1;
      }

      console.log(`Generating transactions for ${year}-${month.toString().padStart(2, '0')}...`);
      const monthTransactions = generateTransactionsForMonth(year, month);
      allTransactions = allTransactions.concat(monthTransactions);
    }

    console.log(`Generated ${allTransactions.length} total transactions`);

    // Add transactions to Firebase
    const transactionsRef = ref(database, 'transactions');

    for (const transaction of allTransactions) {
      const newTransactionRef = push(transactionsRef);
      await set(newTransactionRef, transaction);
    }

    console.log('All transactions added to database');

    // Calculate and set account balance
    let balance = 2000; // Starting balance
    allTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else if (transaction.type === 'expense' || transaction.type === 'goal') {
        balance -= transaction.amount;
      }
    });

    const balanceRef = ref(database, 'accountBalance');
    await set(balanceRef, balance);
    console.log(`Set account balance to: $${balance}`);

    // Generate and add sample goals
    const sampleGoals = [
      {
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 0, // Will be calculated from contributions
        dueDate: new Date(currentYear + 1, 5, 1).toISOString().split('T')[0], // June next year
        isCompleted: false,
        starred: true
      },
      {
        name: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 0, // Will be calculated from contributions
        dueDate: new Date(currentYear, 8, 15).toISOString().split('T')[0], // September this year
        isCompleted: false,
        starred: false
      },
      {
        name: 'New Car',
        targetAmount: 25000,
        currentAmount: 0, // Will be calculated from contributions
        dueDate: new Date(currentYear + 1, 11, 1).toISOString().split('T')[0], // December next year
        isCompleted: false,
        starred: false
      },
      {
        name: 'House Down Payment',
        targetAmount: 50000,
        currentAmount: 0, // Will be calculated from contributions
        dueDate: new Date(currentYear + 2, 5, 1).toISOString().split('T')[0], // June in 2 years
        isCompleted: false,
        starred: false
      }
    ];

    // Calculate current amounts for each goal based on contributions
    sampleGoals.forEach(goal => {
      const goalContributions = allTransactions
        .filter(t => t.type === 'goal' && t.title.includes(goal.name))
        .reduce((total, t) => total + t.amount, 0);
      goal.currentAmount = goalContributions;

      // Mark as completed if target is reached
      if (goal.currentAmount >= goal.targetAmount) {
        goal.isCompleted = true;
      }
    });

    // Add goals to Firebase
    const goalsRef = ref(database, 'goals');
    for (const goal of sampleGoals) {
      const newGoalRef = push(goalsRef);
      await set(newGoalRef, goal);
      console.log(`Added goal: ${goal.name} (${goal.currentAmount}/${goal.targetAmount})`);
    }

    console.log('Database population completed successfully!');
    console.log(`Added ${allTransactions.length} transactions`);
    console.log(`Added ${sampleGoals.length} goals`);
    console.log(`Final account balance: $${balance}`);

    // Calculate and display summary statistics
    const incomeTotal = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const goalContributionTotal = allTransactions
      .filter(t => t.type === 'goal')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log('\n--- Summary Statistics ---');
    console.log(`Total Income: $${incomeTotal}`);
    console.log(`Total Expenses: $${expenseTotal}`);
    console.log(`Total Goal Contributions: $${goalContributionTotal}`);
    console.log(`Net Amount: $${incomeTotal - expenseTotal - goalContributionTotal}`);

    console.log('\n--- Goal Summary ---');
    sampleGoals.forEach(goal => {
      const progressPercent = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
      console.log(`${goal.name}: $${goal.currentAmount}/$${goal.targetAmount} (${progressPercent}%)`);
    });

    const totalGoalSavings = sampleGoals.reduce((total, goal) => total + goal.currentAmount, 0);
    console.log(`Total Saved in Goals: $${totalGoalSavings}`);

  } catch (error) {
    console.error('Error populating database:', error);
  }
}

// Run the population script
populateDatabase();
