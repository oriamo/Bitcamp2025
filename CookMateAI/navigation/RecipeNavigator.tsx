import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UserPreferences } from '../preferences';
import { RecipeDetail } from '../recipes';

// Import recipe screens
import RecipeListScreen from '../features/recipes/RecipeListScreen';
import RecipeDetailScreen from '../features/recipes/RecipeDetailScreen';
import CookingAssistantScreen from '../features/recipes/CookingAssistantScreen';
import { useNavigation } from '@react-navigation/native';

export type RecipeStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
  CookingAssistant: { recipe: RecipeDetail };
};

const Stack = createStackNavigator<RecipeStackParamList>();

const RecipeNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="RecipeList">
        {(props) => (
          <RecipeListScreen 
            {...props}
            userPreferences={null} // You may need to pass this from a context or store
            onSelectRecipe={(recipeId) => {
              props.navigation.navigate('RecipeDetail', { recipeId });
            }}
            onBack={() => {
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="RecipeDetail">
        {(props) => (
          <RecipeDetailScreen 
            {...props}
            recipeId={props.route.params.recipeId}
            onStartCooking={(recipe) => {
              props.navigation.navigate('CookingAssistant', { recipe });
            }}
            onBack={() => {
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="CookingAssistant">
        {(props) => (
          <CookingAssistantScreen 
            {...props}
            recipe={props.route.params.recipe}
            onBack={() => {
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default RecipeNavigator;