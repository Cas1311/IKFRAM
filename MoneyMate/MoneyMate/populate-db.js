// Sample data population script for Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

// Firebase configuration (same as in your config.js)
const firebaseConfig = {
  apiKey: "AIzaSyBOKC_3jKyOJaOXt3KEJp1GfuauvCrSLdc",
  authDomain: "moneymate-5a2eb.firebaseapp.com",
  databaseURL: "https://moneymate-5a2eb-default-rtdb.firebaseio.com",
  projectId: "moneymate-5a2eb",
  storageBucket: "moneymate-5a2eb.firebasestorage.app",
  messagingSenderId: "139456554433",
  appId: "1:139456554433:web:edc0067fe5c64f02d5b6e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample transaction data
const sampleTransactions = [
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
];

async function populateDatabase() {
  try {
    console.log('Starting to populate database...');

    // Add transactions
    const transactionsRef = ref(database, 'transactions');

    for (const transaction of sampleTransactions) {
      const newTransactionRef = push(transactionsRef);
      await set(newTransactionRef, transaction);
      console.log(`Added transaction: ${transaction.title}`);
    }

    // Calculate and set account balance
    let balance = 1000; // Starting balance
    sampleTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else if (transaction.type === 'expense') {
        balance -= transaction.amount;
      }
    });

    const balanceRef = ref(database, 'accountBalance');
    await set(balanceRef, balance);
    console.log(`Set account balance to: $${balance}`);

    console.log('Database population completed successfully!');
    console.log(`Added ${sampleTransactions.length} transactions`);
    console.log(`Final account balance: $${balance}`);

  } catch (error) {
    console.error('Error populating database:', error);
  }
}

// Run the population script
populateDatabase();
