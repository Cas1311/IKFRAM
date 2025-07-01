import { storage } from '@/utils/storage';

const SETTINGS_KEY = 'settings';

export const defaultSettings = {
  // General
  currency: 'EUR',
  locale: 'nl-NL',
  firstDayOfWeek: 1, // Monday
  dateFormat: 'dd-MM-yyyy',
  
  // Appearance
  theme: 'system', // 'light', 'dark', or 'system'
  compactMode: false,
  
  // Notifications
  enableNotifications: true,
  transactionAlerts: true,
  billReminders: true,
  
  // Data & Backup
  autoBackup: true,
  backupFrequency: 'weekly', // 'daily', 'weekly', 'monthly'
  lastBackup: null,
  
  // Security
  enableBiometrics: false,
  autoLock: 5, // minutes of inactivity
  
  // Budgets & Goals
  enableBudgetWarnings: true,
  budgetWarningThreshold: 80, // percentage
  
  // Categories
  showCategoryIcons: true,
  
  // Developer
  debugMode: false,
  analytics: true
};

/**
 * Get all settings
 * @returns {Object} Current settings
 */
export const getSettings = () => {
  return {
    ...defaultSettings,
    ...(storage.getItem(SETTINGS_KEY) || {})
  };
};

/**
 * Update one or more settings
 * @param {Object} updates - Settings to update
 * @returns {Object} Updated settings
 */
export const updateSettings = (updates) => {
  const currentSettings = getSettings();
  const newSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  storage.setItem(SETTINGS_KEY, newSettings);
  
  // Apply theme changes immediately
  if (updates.theme) {
    applyTheme(updates.theme);
  }
  
  return newSettings;
};

/**
 * Reset all settings to default
 * @returns {Object} Default settings
 */
export const resetSettings = () => {
  storage.setItem(SETTINGS_KEY, defaultSettings);
  applyTheme(defaultSettings.theme);
  return { ...defaultSettings };
};

/**
 * Apply theme to the document
 * @param {string} theme - Theme to apply ('light', 'dark', or 'system')
 */
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('theme-light', 'theme-dark');
  
  if (theme === 'system') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  } else {
    root.classList.add(`theme-${theme}`);
  }
  
  // Update meta theme-color
  const themeColor = theme === 'dark' ? '#1a1a2e' : '#4a6fa5';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
};

/**
 * Format currency according to user settings
 * @param {number} amount - Amount to format
 * @param {Object} options - Additional options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const settings = getSettings();
  const {
    currency = settings.currency,
    locale = settings.locale,
    ...formatOptions
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...formatOptions
  }).format(amount);
};

/**
 * Format date according to user settings
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Additional options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const settings = getSettings();
  const {
    locale = settings.locale,
    ...formatOptions
  } = options;
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...formatOptions
  }).format(dateObj);
};

// Initialize settings
const initialize = () => {
  const settings = getSettings();
  applyTheme(settings.theme);
};

// Initialize when this module is loaded
initialize();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const settings = getSettings();
  if (settings.theme === 'system') {
    applyTheme('system');
  }
});

const settingsService = {
  getSettings,
  updateSettings,
  resetSettings,
  formatCurrency,
  formatDate
};

export default settingsService;
