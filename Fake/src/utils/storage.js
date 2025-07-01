/**
 * Storage utility for handling LocalStorage operations
 * Provides a simple API for getting, setting, and removing data
 * with JSON serialization/deserialization
 */

const STORAGE_PREFIX = 'moneymate_';

/**
 * Get an item from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if item doesn't exist
 * @returns {any} The stored value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage
 * @param {string} key - The key to set
 * @param {any} value - The value to store (will be JSON stringified)
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    // Handle storage full error or other issues
    if (error.name === 'QuotaExceededError') {
      // Clear old data or notify user
      clearOldData();
      // Try again
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to save after clearing old data:', e);
      }
    }
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Clear all MoneyMate data from localStorage
 */
export const clearAll = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing MoneyMate data from localStorage:', error);
  }
};

/**
 * Clear old data when storage is full
 * Keeps only the most recent 6 months of data
 */
const clearOldData = () => {
  try {
    // Get all transaction keys
    const transactionKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${STORAGE_PREFIX}transactions_`));
    
    if (transactionKeys.length > 6) {
      // Sort by date (newest first)
      const sortedKeys = transactionKeys.sort((a, b) => {
        return new Date(b.split('_')[1]) - new Date(a.split('_')[1]);
      });
      
      // Keep only the 6 most recent months
      const keysToRemove = sortedKeys.slice(6);
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
};

/**
 * Migrate data from old storage format if needed
 */
export const migrateData = () => {
  try {
    // Example migration: Check for old format and convert to new format
    const oldTransactions = localStorage.getItem('transactions');
    if (oldTransactions) {
      const transactions = JSON.parse(oldTransactions);
      setItem('transactions', transactions);
      localStorage.removeItem('transactions');
    }
    
    // Add more migration logic here as needed
  } catch (error) {
    console.error('Error during data migration:', error);
  }
};

// Initialize storage with default values if they don't exist
export const initializeStorage = () => {
  // Set default categories if they don't exist
  if (!getItem('categories')) {
    const defaultCategories = [
      { id: 'income', name: 'Inkomen', type: 'income' },
      { id: 'housing', name: 'Huisvesting', type: 'expense' },
      { id: 'utilities', name: 'Nutsvoorzieningen', type: 'expense' },
      { id: 'food', name: 'Eten & Drinken', type: 'expense' },
      { id: 'transportation', name: 'Vervoer', type: 'expense' },
      { id: 'shopping', name: 'Winkelen', type: 'expense' },
      { id: 'entertainment', name: 'Vrije Tijd', type: 'expense' },
      { id: 'health', name: 'Gezondheid', type: 'expense' },
      { id: 'education', name: 'Opleiding', type: 'expense' },
      { id: 'other', name: 'Overig', type: 'expense' }
    ];
    setItem('categories', defaultCategories);
  }
  
  // Set default settings if they don't exist
  if (!getItem('settings')) {
    const defaultSettings = {
      currency: 'EUR',
      locale: 'nl-NL',
      firstDayOfWeek: 1, // Monday
      theme: 'system',
      backupEnabled: true,
      lastBackup: null
    };
    setItem('settings', defaultSettings);
  }
};

// Export a storage instance with all methods
export const storage = {
  getItem,
  setItem,
  removeItem,
  clearAll,
  migrateData,
  initializeStorage
};

export default storage;
