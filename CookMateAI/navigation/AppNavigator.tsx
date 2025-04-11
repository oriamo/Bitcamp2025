import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UserPreferences } from '../features/preferences';

// Import screens and navigators
import OnboardingScreen from '../features/preferences/OnboardingScreen';
import PreferencesScreen from '../features/preferences/PreferencesScreen';
import TabNavigator from './TabNavigator';

export type AppStackParamList = {
  Onboarding: undefined;
  Preferences: { initialPreferences?: UserPreferences };
  Main: undefined;
};

export type AppNavigatorProps = {
  userPreferences: UserPreferences | null;
  hasExistingPreferences: boolean;
  onSavePreferences: (preferences: UserPreferences) => Promise<boolean>;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator: React.FC<AppNavigatorProps> = ({ 
  userPreferences, 
  hasExistingPreferences,
  onSavePreferences
}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={hasExistingPreferences ? 'Main' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding">
        {(props) => (
          <OnboardingScreen 
            {...props} 
            onComplete={async (preferences) => {
              const success = await onSavePreferences(preferences);
              if (success) {
                props.navigation.navigate('Main');
              }
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Preferences">
        {(props) => (
          <PreferencesScreen 
            {...props}
            initialPreferences={userPreferences || undefined}
            onComplete={async (preferences) => {
              const success = await onSavePreferences(preferences);
              if (success) {
                props.navigation.navigate('Main');
              }
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;