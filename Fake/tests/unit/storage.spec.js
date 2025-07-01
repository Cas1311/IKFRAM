import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '@/utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

// Mock the global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Storage Utility', () => {
  beforeEach(() => {
    // Clear all mocks and reset store before each test
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('getItem', () => {
    it('should return null for non-existent key', () => {
      const result = storage.getItem('non-existent');
      expect(result).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('moneymate_non-existent');
    });

    it('should return parsed JSON for existing key', () => {
      const testData = { name: 'test', value: 123 };
      localStorageMock.setItem('moneymate_test-key', JSON.stringify(testData));
      
      const result = storage.getItem('test-key');
      expect(result).toEqual(testData);
    });

    it('should return default value for invalid JSON', () => {
      localStorageMock.setItem('moneymate_invalid-json', '{invalid-json');
      
      const defaultValue = { default: 'value' };
      const result = storage.getItem('invalid-json', defaultValue);
      expect(result).toBe(defaultValue);
    });
  });

  describe('setItem', () => {
    it('should store stringified JSON in localStorage', () => {
      const testData = { name: 'test', value: 123 };
      storage.setItem('test-key', testData);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'moneymate_test-key',
        JSON.stringify(testData)
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      storage.removeItem('test-key');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('moneymate_test-key');
    });
  });

  describe('clearAll', () => {
    it('should remove all MoneyMate items from localStorage', () => {
      // Set up test data
      localStorageMock.setItem('moneymate_key1', 'value1');
      localStorageMock.setItem('moneymate_key2', 'value2');
      localStorageMock.setItem('other_key', 'value3');
      
      storage.clearAll();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('moneymate_key1');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('moneymate_key2');
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('other_key');
    });
  });

  describe('initializeStorage', () => {
    it('should set default categories if they do not exist', () => {
      storage.initializeStorage();
      
      const categories = storage.getItem('categories');
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('type');
    });

    it('should not overwrite existing categories', () => {
      const existingCategories = [{ id: 'custom', name: 'Custom', type: 'expense' }];
      storage.setItem('categories', existingCategories);
      
      storage.initializeStorage();
      
      const categories = storage.getItem('categories');
      expect(categories).toEqual(existingCategories);
    });
  });
});

describe('Settings Service', () => {
  let originalSettings;
  
  beforeEach(() => {
    // Store original settings
    originalSettings = { ...storage.getItem('settings') };
    // Clear settings before each test
    storage.removeItem('settings');
  });
  
  afterEach(() => {
    // Restore original settings after each test
    if (originalSettings) {
      storage.setItem('settings', originalSettings);
    }
  });
  
  it('should return default settings when no settings exist', () => {
    const settings = getSettings();
    expect(settings.currency).toBe('EUR');
    expect(settings.locale).toBe('nl-NL');
    expect(settings.theme).toBe('system');
  });
  
  it('should update settings correctly', () => {
    const updates = {
      theme: 'dark',
      currency: 'USD'
    };
    
    const updatedSettings = updateSettings(updates);
    
    expect(updatedSettings.theme).toBe('dark');
    expect(updatedSettings.currency).toBe('USD');
    expect(updatedSettings).toHaveProperty('updatedAt');
    
    // Verify the settings were saved to storage
    const savedSettings = storage.getItem('settings');
    expect(savedSettings.theme).toBe('dark');
    expect(savedSettings.currency).toBe('USD');
  });
  
  it('should reset settings to defaults', () => {
    // First, update with some custom settings
    updateSettings({ theme: 'dark', currency: 'USD' });
    
    // Then reset
    const defaultSettings = resetSettings();
    
    // Check that we got the default settings back
    expect(defaultSettings.theme).toBe('system');
    expect(defaultSettings.currency).toBe('EUR');
    
    // Verify the settings were reset in storage
    const savedSettings = storage.getItem('settings');
    expect(savedSettings.theme).toBe('system');
    expect(savedSettings.currency).toBe('EUR');
  });
  
  it('should format currency according to settings', () => {
    // Test with default settings (EUR, nl-NL)
    let formatted = formatCurrency(1234.56);
    expect(formatted).toContain('1.234,56');
    expect(formatted).toContain('€');
    
    // Test with custom settings
    updateSettings({ currency: 'USD', locale: 'en-US' });
    formatted = formatCurrency(1234.56);
    expect(formatted).toContain('1,234.56');
    expect(formatted).toContain('$');
  });
  
  it('should format dates according to settings', () => {
    const testDate = new Date(2023, 0, 15); // Jan 15, 2023
    
    // Test with default settings (nl-NL)
    let formatted = formatDate(testDate);
    expect(formatted).toMatch(/15-01-2023/);
    
    // Test with custom settings
    updateSettings({ locale: 'en-US' });
    formatted = formatDate(testDate);
    expect(formatted).toMatch(/01[/-]15[/-]2023/);
  });
});
