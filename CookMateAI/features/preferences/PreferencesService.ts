import { UserPreferences } from './PreferencesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'COOKMATE_USER_PREFERENCES';

class PreferencesService {
  private static instance: PreferencesService;

  private constructor() {}

  public static getInstance(): PreferencesService {
    if (!PreferencesService.instance) {
      PreferencesService.instance = new PreferencesService();
    }
    return PreferencesService.instance;
  }

  // Save preferences to AsyncStorage
  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  // Get preferences from AsyncStorage
  async getPreferences(): Promise<UserPreferences | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue === null) {
        console.log('No preferences found');
        return null;
      }
      return JSON.parse(jsonValue) as UserPreferences;
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      return null;
    }
  }

  // Update a specific section of the preferences
  async updatePreferences(partialPreferences: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.getPreferences();
      if (!currentPreferences) {
        await this.savePreferences(partialPreferences as UserPreferences);
        return;
      }
      
      const updatedPreferences = {
        ...currentPreferences,
        ...partialPreferences
      };
      
      await this.savePreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Clear preferences from AsyncStorage
  async clearPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Preferences cleared successfully');
    } catch (error) {
      console.error('Error clearing preferences:', error);
      throw error;
    }
  }
}

export default PreferencesService.getInstance();