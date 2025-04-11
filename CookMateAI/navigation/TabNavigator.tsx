import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens - using relative paths that match actual file structure
import HomeScreen from '../features/home/HomeScreen';
import FavoritesScreen from '../features/favorites/FavoritesScreen';
import ExploreScreen from '../features/explore/ExploreScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import AIScreen from '../features/ai/AIScreen';
import GeminiTest from '../features/ai/GeminiTest';

// Import recipe navigator
import RecipeNavigator from './RecipeNavigator';

export type TabNavigatorParamList = {
  Home: undefined;
  Favorites: undefined;
  Explore: undefined;
  AI: undefined;
  GeminiTest: undefined;
  Profile: undefined;
  RecipeStack: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#929292',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: insets.bottom > 0 ? 20 : 10,
          paddingTop: 10,
          height: insets.bottom > 0 ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'GeminiTest') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'RecipeStack') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="AI" component={AIScreen} />
      <Tab.Screen 
        name="GeminiTest" 
        component={GeminiTest} 
        options={{
          tabBarLabel: 'Test AI'
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen 
        name="RecipeStack" 
        component={RecipeNavigator} 
        options={{ 
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' }
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;