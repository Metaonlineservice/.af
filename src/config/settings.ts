// Dynamic Settings Configuration
// Allows admin to change API URL without redeployment

const SETTINGS_KEY = 'meta_settings';
const DEFAULT_API = 'https://sheetdb.io/api/v1/j92iddttd3260';

export interface AppSettings {
  sheetdbApi: string;
  googleSheetId: string;
  sheetNames: {
    applications: string;
    appointments: string;
    emergency: string;
    users: string;
    chatbot: string;
    contacts: string;
    newsletter: string;
    reviews: string;
    services: string;
    successful_cases: string;
    inprocess_cases: string;
    customers: string;
  };
  lastUpdated: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  sheetdbApi: DEFAULT_API,
  googleSheetId: '12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no',
  sheetNames: {
    applications: 'applications',
    appointments: 'appointments',
    emergency: 'emergency',
    users: 'users',
    chatbot: 'chatbot',
    contacts: 'contacts',
    newsletter: 'newsletter',
    reviews: 'reviews',
    services: 'services',
    successful_cases: 'successful_cases',
    inprocess_cases: 'inprocess_cases',
    customers: 'customers',
  },
  lastUpdated: new Date().toISOString(),
};

// Get settings from localStorage or return defaults
export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate any old SheetDB API URL to the new one
      if (parsed.sheetdbApi && parsed.sheetdbApi !== DEFAULT_API) {
        parsed.sheetdbApi = DEFAULT_API;
        parsed.googleSheetId = DEFAULT_SETTINGS.googleSheetId;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
          ...parsed,
          lastUpdated: new Date().toISOString(),
        }));
      }
      // Merge with defaults to ensure all keys exist
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        sheetNames: {
          ...DEFAULT_SETTINGS.sheetNames,
          ...(parsed.sheetNames || {}),
        },
      };
    }
  } catch (e) {
    console.error('Failed to parse settings:', e);
  }
  return DEFAULT_SETTINGS;
}

// Save settings to localStorage
export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated: AppSettings = {
    ...current,
    ...settings,
    sheetNames: {
      ...current.sheetNames,
      ...(settings.sheetNames || {}),
    },
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

  // Dispatch event to notify components
  window.dispatchEvent(new CustomEvent('settingsChanged', { detail: updated }));

  return updated;
}

// Reset to default settings
export function resetSettings(): AppSettings {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  window.dispatchEvent(new CustomEvent('settingsChanged', { detail: DEFAULT_SETTINGS }));
  return DEFAULT_SETTINGS;
}

// Test API connection
export async function testApiConnection(apiUrl: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await fetch(`${apiUrl}?sheet=applications&limit=1`);
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Connection failed: ${response.status} ${response.statusText}`,
      };
    }
    const data = await response.json();
    return {
      success: true,
      message: 'Connection successful!',
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Get the SheetDB API URL (runtime configurable)
export function getSheetDbApi(): string {
  return getSettings().sheetdbApi;
}

// Get sheet name (runtime configurable)
export function getSheetName(key: keyof AppSettings['sheetNames']): string {
  return getSettings().sheetNames[key];
}
