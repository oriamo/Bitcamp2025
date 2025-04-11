import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PreferencesService, UserPreferences } from './features/preferences';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  console.log('App is running');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingPreferences, setHasExistingPreferences] = useState<boolean>(false);

  // Check if user has saved preferences when app starts
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const savedPreferences = await PreferencesService.getPreferences();
        if (savedPreferences) {
          setUserPreferences(savedPreferences);
          setHasExistingPreferences(true);
          console.log('Loaded saved preferences');
        } else {
          setHasExistingPreferences(false);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        setError('Failed to load preferences. Please restart the app.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);

  // If there's an error loading or saving preferences
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // While loading preferences from AsyncStorage
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator 
            userPreferences={userPreferences} 
            hasExistingPreferences={hasExistingPreferences}
            onSavePreferences={async (preferences: UserPreferences) => {
              try {
                await PreferencesService.savePreferences(preferences);
                setUserPreferences(preferences);
                setHasExistingPreferences(true);
                console.log('Preferences saved successfully');
                return true;
              } catch (error) {
                console.error('Error saving preferences:', error);
                return false;
              }
            }}
          />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
