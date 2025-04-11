import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecipeService, { RecipeDetail, RecipeStep, Ingredient } from './RecipeService';

interface RecipeDetailScreenProps {
  recipeId: string;
  onStartCooking: (recipe: RecipeDetail) => void;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipeId,
  onStartCooking,
  onBack,
}) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'steps'>('overview');

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const recipeDetails = await RecipeService.getRecipeById(recipeId);
        
        if (recipeDetails) {
          setRecipe(recipeDetails);
        } else {
          setError('Recipe not found. Please try another recipe.');
        }
      } catch (error) {
        console.error('Error loading recipe details:', error);
        setError('Failed to load recipe details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetails();
  }, [recipeId]);

  const handleStartCooking = () => {
    if (recipe) {
      onStartCooking(recipe);
    }
  };

  const handleWatchYoutube = () => {
    if (recipe?.youtubeUrl) {
      Linking.openURL(recipe.youtubeUrl);
    }
  };

  const renderIngredients = (ingredients: Ingredient[]) => (
    <View style={styles.ingredientsContainer}>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <View style={styles.ingredientDot} />
          <Text style={styles.ingredientName}>{ingredient.name}</Text>
          <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
        </View>
      ))}
    </View>
  );

  const renderSteps = (steps: RecipeStep[]) => (
    <View style={styles.stepsContainer}>
      {steps.map((step) => (
        <View key={step.number} style={styles.stepItem}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>{step.number}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading recipe details...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backToListButton} onPress={onBack}>
            <Text style={styles.backToListButtonText}>Back to Recipe List</Text>
          </TouchableOpacity>
        </View>
      ) : recipe ? (
        <View style={styles.recipeContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerImageContainer}>
              <Image
                source={{ uri: recipe.thumbnail }}
                style={styles.headerImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recipeHeader}>
              <Text style={styles.recipeName}>{recipe.name}</Text>
              <View style={styles.recipeMetaContainer}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Category:</Text>
                  <Text style={styles.metaValue}>{recipe.category}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Cuisine:</Text>
                  <Text style={styles.metaValue}>{recipe.area}</Text>
                </View>
              </View>
              
              <View style={styles.tagsRow}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
                onPress={() => setActiveTab('overview')}
              >
                <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
                onPress={() => setActiveTab('ingredients')}
              >
                <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                  Ingredients
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'steps' && styles.activeTab]}
                onPress={() => setActiveTab('steps')}
              >
                <Text style={[styles.tabText, activeTab === 'steps' && styles.activeTabText]}>
                  Steps
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contentContainer}>
              {activeTab === 'overview' && (
                <View>
                  <Text style={styles.sectionTitle}>About this Recipe</Text>
                  <Text style={styles.instructions}>{recipe.instructions}</Text>
                  
                  {recipe.youtubeUrl && (
                    <TouchableOpacity 
                      style={styles.youtubeButton}
                      onPress={handleWatchYoutube}
                    >
                      <Text style={styles.youtubeButtonText}>Watch Video Tutorial</Text>
                    </TouchableOpacity>
                  )}
                  
                  {recipe.source && (
                    <Text style={styles.source}>
                      Source: {recipe.source}
                    </Text>
                  )}
                </View>
              )}
              
              {activeTab === 'ingredients' && (
                <View>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  <Text style={styles.sectionSubtitle}>
                    {recipe.ingredients.length} items needed
                  </Text>
                  {renderIngredients(recipe.ingredients)}
                </View>
              )}
              
              {activeTab === 'steps' && (
                <View>
                  <Text style={styles.sectionTitle}>Cooking Instructions</Text>
                  <Text style={styles.sectionSubtitle}>
                    {recipe.steps.length} steps to prepare
                  </Text>
                  {renderSteps(recipe.steps)}
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity 
              style={styles.startCookingButton}
              onPress={handleStartCooking}
            >
              <Text style={styles.startCookingButtonText}>Start Cooking Assistant</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
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
    marginBottom: 20,
  },
  backToListButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToListButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recipeContainer: {
    flex: 1,
  },
  headerImageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  recipeHeader: {
    padding: 16,
    backgroundColor: '#fff',
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    marginRight: 16,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  youtubeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  source: {
    fontSize: 12,
    color: '#888',
    marginTop: 16,
    textAlign: 'right',
  },
  ingredientsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  ingredientMeasure: {
    fontSize: 14,
    color: '#666',
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  stepNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  actionButtonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  startCookingButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startCookingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;