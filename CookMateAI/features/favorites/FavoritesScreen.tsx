import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Mock data for favorite recipes
const mockFavorites = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    cookTime: '25 min',
    difficulty: 'Medium',
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Avocado Toast',
    cookTime: '10 min',
    difficulty: 'Easy',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Chicken Tikka Masala',
    cookTime: '45 min',
    difficulty: 'Medium',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Greek Salad',
    cookTime: '15 min',
    difficulty: 'Easy',
    rating: 4.6,
  },
];

const { width } = Dimensions.get('window');

const FavoritesScreen = () => {
  // Function to render each recipe item
  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      activeOpacity={0.8}
    >
      <View style={[styles.recipeImageContainer, { backgroundColor: index % 3 === 0 ? '#FFB7B2' : index % 3 === 1 ? '#A8E6CF' : '#FFD3B6' }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
          style={styles.recipeImageOverlay}
        />
        <Ionicons 
          name="heart" 
          size={24} 
          color="#FF6B6B" 
          style={styles.favoriteIcon} 
        />
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <View style={styles.recipeDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#777" />
            <Text style={styles.detailText}>{item.cookTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="stats-chart-outline" size={16} color="#777" />
            <Text style={styles.detailText}>{item.difficulty}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      
      {mockFavorites.length > 0 ? (
        <FlatList
          data={mockFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>
            Save your favorite recipes for quick access
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Extra padding for bottom tab navigation
  },
  recipeCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  recipeImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  recipeInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#777',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FavoritesScreen;