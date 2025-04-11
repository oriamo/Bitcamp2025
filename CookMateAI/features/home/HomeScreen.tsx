import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigatorParamList } from '../../navigation/TabNavigator';

type HomeScreenNavigationProp = StackNavigationProp<TabNavigatorParamList>;

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // Animation values
  const logoOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const cardScale = useSharedValue(0.8);
  const feature1Opacity = useSharedValue(0);
  const feature2Opacity = useSharedValue(0);
  const feature3Opacity = useSharedValue(0);
  const recipeCardScale = useSharedValue(0.9);

  // Start animations on component mount
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000 });
    headerTranslateY.value = withSpring(0, { damping: 20 });
    cardScale.value = withDelay(400, withSpring(1, { damping: 14 }));
    feature1Opacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    feature2Opacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    feature3Opacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    recipeCardScale.value = withDelay(600, withSpring(1, { damping: 14 }));
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: interpolate(cardScale.value, [0.8, 1], [0, 1], Extrapolate.CLAMP)
  }));

  const feature1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature1Opacity.value,
    transform: [{ 
      translateY: interpolate(
        feature1Opacity.value, 
        [0, 1], 
        [20, 0], 
        Extrapolate.CLAMP
      ) 
    }]
  }));

  const feature2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature2Opacity.value,
    transform: [{ 
      translateY: interpolate(
        feature2Opacity.value, 
        [0, 1], 
        [20, 0], 
        Extrapolate.CLAMP
      ) 
    }]
  }));

  const feature3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: feature3Opacity.value,
    transform: [{ 
      translateY: interpolate(
        feature3Opacity.value, 
        [0, 1], 
        [20, 0], 
        Extrapolate.CLAMP
      ) 
    }]
  }));

  const recipeCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recipeCardScale.value }],
    opacity: interpolate(recipeCardScale.value, [0.9, 1], [0, 1], Extrapolate.CLAMP)
  }));

  const navigateToRecipeList = () => {
    navigation.navigate('RecipeStack', { screen: 'RecipeList' });
  };

  const navigateToRecipeDetail = (recipeId: string) => {
    navigation.navigate('RecipeStack', { 
      screen: 'RecipeDetail',
      params: { recipeId }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF8C94', '#FF6B6B']}
          style={styles.headerBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
            <Text style={styles.title}>CookMateAI</Text>
            <Text style={styles.subtitle}>Your AI Cooking Assistant</Text>
          </Animated.View>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipeCardsContainer}
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigateToRecipeDetail('recipe-pasta-primavera')}
            >
              <Animated.View style={[styles.recipeCard, recipeCardAnimatedStyle]}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                  style={styles.recipeCardOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.recipeCardTitle}>Pasta Primavera</Text>
                  <View style={styles.recipeCardInfo}>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="time-outline" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>30 min</Text>
                    </View>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="star" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>4.8</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigateToRecipeDetail('recipe-avocado-toast')}
            >
              <Animated.View style={[styles.recipeCard, recipeCardAnimatedStyle, {backgroundColor: '#A8E6CF'}]}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                  style={styles.recipeCardOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.recipeCardTitle}>Avocado Toast</Text>
                  <View style={styles.recipeCardInfo}>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="time-outline" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>15 min</Text>
                    </View>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="star" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>4.5</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigateToRecipeDetail('recipe-chicken-curry')}
            >
              <Animated.View style={[styles.recipeCard, recipeCardAnimatedStyle, {backgroundColor: '#FFD3B6'}]}>
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                  style={styles.recipeCardOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.recipeCardTitle}>Chicken Curry</Text>
                  <View style={styles.recipeCardInfo}>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="time-outline" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>45 min</Text>
                    </View>
                    <View style={styles.recipeCardDetail}>
                      <Ionicons name="star" size={14} color="#fff" />
                      <Text style={styles.recipeCardDetailText}>4.9</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Features</Text>
          
          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <Text style={styles.cardTitle}>Welcome to CookMateAI!</Text>
            <Text style={styles.cardText}>
              Find recipes based on your preferences and available ingredients.
              Get step-by-step cooking instructions with voice assistance.
            </Text>
            
            <TouchableOpacity style={styles.viewAllButton} onPress={navigateToRecipeList}>
              <Text style={styles.viewAllButtonText}>View All Recipes</Text>
              <Ionicons name="arrow-forward" size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.featuresContainer}>
            <Animated.View style={[styles.featureItem, feature1AnimatedStyle]}>
              <LinearGradient
                colors={['#FFC3A0', '#FFAFBD']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>🍽️</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Personalized</Text>
              <Text style={styles.featureDescription}>
                Recipes tailored to you
              </Text>
            </Animated.View>
            
            <Animated.View style={[styles.featureItem, feature2AnimatedStyle]}>
              <LinearGradient
                colors={['#A1C4FD', '#C2E9FB']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>👨‍🍳</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Interactive</Text>
              <Text style={styles.featureDescription}>
                Voice-guided cooking
              </Text>
            </Animated.View>
            
            <Animated.View style={[styles.featureItem, feature3AnimatedStyle]}>
              <LinearGradient
                colors={['#D4FC79', '#96E6A1']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>📸</Text>
              </LinearGradient>
              <Text style={styles.featureTitle}>Ingredient</Text>
              <Text style={styles.featureDescription}>
                Scan and get ideas
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    width: '100%',
    height: height * 0.22,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding for bottom tab navigation
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
  },
  recipeCardsContainer: {
    paddingRight: 15,
    paddingBottom: 5,
  },
  recipeCard: {
    width: width * 0.7,
    height: 180,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFB7B2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recipeCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  recipeCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  recipeCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  recipeCardDetailText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 15,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 5,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginRight: 5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 25,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

export default HomeScreen;