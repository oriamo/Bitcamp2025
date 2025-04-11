import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withTiming,
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeScreenProps {
  onNavigateToPreferences?: () => void;
}

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ onNavigateToPreferences }: HomeScreenProps) => {
  // Animation values
  const logoOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const cardScale = useSharedValue(0.8);
  const feature1Opacity = useSharedValue(0);
  const feature2Opacity = useSharedValue(0);
  const feature3Opacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const buttonOpacity = useSharedValue(0);

  // Start animations on component mount
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000 });
    headerTranslateY.value = withSpring(0, { damping: 20 });
    cardScale.value = withDelay(400, withSpring(1, { damping: 14 }));
    feature1Opacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    feature2Opacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    feature3Opacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    buttonScale.value = withDelay(1200, withSpring(1, { damping: 12 }));
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
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

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }]
  }));

  const handleButtonPress = () => {
    // Trigger button animation and navigate
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 300 })
    );
    
    // Call the navigation function with a slight delay for animation
    if (onNavigateToPreferences) {
      setTimeout(onNavigateToPreferences, 200);
    }
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
          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <Text style={styles.cardTitle}>Welcome to CookMateAI!</Text>
            <Text style={styles.cardText}>
              Find recipes based on your preferences and available ingredients.
              Get step-by-step cooking instructions with voice assistance.
            </Text>
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
              <Text style={styles.featureTitle}>Personalized Recipes</Text>
              <Text style={styles.featureDescription}>
                Tailored to your preferences and dietary needs
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
              <Text style={styles.featureTitle}>Step-by-Step</Text>
              <Text style={styles.featureDescription}>
                Interactive cooking instructions with voice guidance
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
              <Text style={styles.featureTitle}>Ingredient Scan</Text>
              <Text style={styles.featureDescription}>
                Identify ingredients and get recipe suggestions
              </Text>
            </Animated.View>
          </View>
          
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity 
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleButtonPress}
            >
              <LinearGradient
                colors={['#FF8C94', '#FF6B6B']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    height: height * 0.25,
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
    marginTop: -30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconText: {
    fontSize: 30,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: width * 0.8,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});