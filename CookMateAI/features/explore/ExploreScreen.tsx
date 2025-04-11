import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Define types for our data
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Recipe {
  id: string;
  name: string;
  category: string;
  rating: number;
  time: string;
}

// Mock data for categories
const categories: Category[] = [
  { id: '1', name: 'Italian', icon: '🍝' },
  { id: '2', name: 'Mexican', icon: '🌮' },
  { id: '3', name: 'Asian', icon: '🍜' },
  { id: '4', name: 'Indian', icon: '🍛' },
  { id: '5', name: 'American', icon: '🍔' },
  { id: '6', name: 'French', icon: '🥐' },
  { id: '7', name: 'Mediterranean', icon: '🥙' },
  { id: '8', name: 'Vegetarian', icon: '🥗' },
];

// Mock data for popular recipes
const popularRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Thai Green Curry',
    category: 'Asian',
    rating: 4.8,
    time: '35 min',
  },
  {
    id: '2',
    name: 'Homemade Margherita Pizza',
    category: 'Italian',
    rating: 4.9,
    time: '45 min',
  },
  {
    id: '3',
    name: 'Beef Tacos',
    category: 'Mexican',
    rating: 4.7,
    time: '30 min',
  },
  {
    id: '4',
    name: 'Chickpea Salad',
    category: 'Vegetarian',
    rating: 4.5,
    time: '15 min',
  },
];

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Function to render category item
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? '' : item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryName,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Function to render popular recipe item
  const renderPopularRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.popularRecipeCard}
      activeOpacity={0.8}
    >
      <View style={styles.popularRecipeImageContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.recipeImageOverlay}
        />
        <View style={styles.recipeMetaContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.recipeInfoContainer}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <View style={styles.recipeDetailRow}>
          <View style={styles.recipeDetail}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.recipeDetailText}>{item.rating}</Text>
          </View>
          <View style={styles.recipeDetail}>
            <Ionicons name="time-outline" size={16} color="#777" />
            <Text style={styles.recipeDetailText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Recipes</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularRecipes}
            renderItem={renderPopularRecipeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularRecipesContainer}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick & Easy</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularRecipes.slice(0, 2)}
            renderItem={renderPopularRecipeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularRecipesContainer}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom tab navigation
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAllButton: {
    paddingVertical: 5,
  },
  viewAllText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  selectedCategoryItem: {
    backgroundColor: '#FF6B6B',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  popularRecipesContainer: {
    paddingHorizontal: 15,
  },
  popularRecipeCard: {
    width: width * 0.65,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  popularRecipeImageContainer: {
    height: 140,
    backgroundColor: '#ddd',
    position: 'relative',
  },
  recipeImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  recipeMetaContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfoContainer: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeDetailText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
});

export default ExploreScreen;