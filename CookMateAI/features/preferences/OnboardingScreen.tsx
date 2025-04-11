import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Platform,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { UserPreferences } from './PreferencesScreen';

// Default preferences
const defaultPreferences: UserPreferences = {
  dietaryRestrictions: {
    vegan: false,
    vegetarian: false,
    pescatarian: false,
    glutenFree: false,
    dairyFree: false,
    keto: false,
    paleo: false,
  },
  allergies: [],
  calorieLimit: '',
  cuisinePreferences: [],
  skillLevel: 'beginner',
  mealTimePreference: {
    quick: false,
    standard: true,
    elaborate: false,
  },
  tastePreferences: {
    spicy: false,
    sweet: false,
    savory: false,
    bitter: false,
    sour: false,
  },
  healthGoals: '',
};

// Define onboarding steps
const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to CookMateAI',
    description: 'Let\'s personalize your cooking experience',
  },
  {
    id: 'dietaryRestrictions',
    title: 'Dietary Restrictions',
    description: 'Do you follow any specific diet?',
  },
  {
    id: 'allergies',
    title: 'Allergies & Intolerances',
    description: 'Tell us about any foods to avoid',
  },
  {
    id: 'cuisinePreferences',
    title: 'Cuisine Preferences',
    description: 'What types of cuisine do you enjoy?',
  },
  {
    id: 'cookingSkill',
    title: 'Cooking Skill Level',
    description: 'How experienced are you in the kitchen?',
  },
  {
    id: 'mealTime',
    title: 'Meal Preparation Time',
    description: 'How much time do you want to spend cooking?',
  },
  {
    id: 'tastePreferences',
    title: 'Taste Preferences',
    description: 'What flavors do you enjoy?',
  },
  {
    id: 'healthGoals',
    title: 'Health Goals',
    description: 'What are your dietary health goals?',
  },
  {
    id: 'finish',
    title: 'All Set!',
    description: 'Your personalized cooking experience awaits',
  }
];

interface OnboardingScreenProps {
  onComplete: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  initialPreferences
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || defaultPreferences
  );
  const [allergyInput, setAllergyInput] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');

  const screenWidth = Dimensions.get('window').width;

  // Toggle boolean preference
  const togglePreference = (category: keyof UserPreferences, option: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [option]: !prev[category as keyof typeof prev][option]
      }
    }));
  };

  // Set skill level
  const setSkillLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setPreferences(prev => ({
      ...prev,
      skillLevel: level
    }));
  };

  // Add allergy
  const addAllergy = () => {
    if (allergyInput.trim() === '') return;
    
    setPreferences(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergyInput.trim()]
    }));
    setAllergyInput('');
  };

  // Remove allergy
  const removeAllergy = (index: number) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  // Add cuisine preference
  const addCuisine = () => {
    if (cuisineInput.trim() === '') return;
    
    setPreferences(prev => ({
      ...prev,
      cuisinePreferences: [...prev.cuisinePreferences, cuisineInput.trim()]
    }));
    setCuisineInput('');
  };

  // Remove cuisine preference
  const removeCuisine = (index: number) => {
    setPreferences(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.filter((_, i) => i !== index)
    }));
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Complete onboarding
  const completeOnboarding = () => {
    // Validate calorie input
    if (preferences.calorieLimit !== '' && isNaN(Number(preferences.calorieLimit))) {
      Alert.alert('Invalid Input', 'Please enter a valid number for calorie limit');
      return;
    }

    onComplete(preferences);
  };

  // Render the progress bar
  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / (STEPS.length - 1)) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {STEPS.length}
        </Text>
      </View>
    );
  };

  // Render welcome screen
  const renderWelcomeScreen = () => {
    return (
      <View style={styles.welcomeContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.welcomeImage}
        />
        <Text style={styles.welcomeTitle}>Welcome to CookMateAI</Text>
        <Text style={styles.welcomeDescription}>
          Let's create your personalized cooking experience! Take a few moments to tell us about your preferences.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={goToNextStep}>
          <Text style={styles.primaryButtonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render finish screen
  const renderFinishScreen = () => {
    return (
      <View style={styles.welcomeContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        <Text style={styles.welcomeTitle}>All Set!</Text>
        <Text style={styles.welcomeDescription}>
          Your preferences have been saved. Now you can discover recipes tailored just for you!
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={completeOnboarding}>
          <Text style={styles.primaryButtonText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render dietary restrictions step
  const renderDietaryRestrictionsStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.optionsContainer}>
          {Object.keys(preferences.dietaryRestrictions).map((option) => (
            <View key={option} style={styles.optionRow}>
              <Text style={styles.optionLabel}>{option.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + option.replace(/([A-Z])/g, ' $1').slice(1)}</Text>
              <Switch
                value={preferences.dietaryRestrictions[option as keyof typeof preferences.dietaryRestrictions]}
                onValueChange={() => togglePreference('dietaryRestrictions', option)}
                trackColor={{ false: '#d3d3d3', true: '#4285F4' }}
              />
            </View>
          ))}
        </View>
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render allergies step
  const renderAllergiesStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={allergyInput}
            onChangeText={setAllergyInput}
            placeholder="Enter an allergy or intolerance"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {preferences.allergies.map((allergy, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.tag}
              onPress={() => removeAllergy(index)}
            >
              <Text style={styles.tagText}>{allergy} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Calorie Limit */}
        <Text style={styles.sectionTitle}>Calorie Limit (per meal)</Text>
        <TextInput
          style={styles.textInput}
          value={preferences.calorieLimit}
          onChangeText={(text) => setPreferences(prev => ({ ...prev, calorieLimit: text }))}
          placeholder="Enter calorie limit (e.g., 500)"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render cuisine preferences step
  const renderCuisinePreferencesStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={cuisineInput}
            onChangeText={setCuisineInput}
            placeholder="Enter a cuisine (e.g., Italian)"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={addCuisine}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {preferences.cuisinePreferences.map((cuisine, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.tag}
              onPress={() => removeCuisine(index)}
            >
              <Text style={styles.tagText}>{cuisine} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render cooking skill step
  const renderCookingSkillStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.pillContainer}>
          <TouchableOpacity 
            style={[
              styles.pill, 
              preferences.skillLevel === 'beginner' && styles.pillActive
            ]}
            onPress={() => setSkillLevel('beginner')}
          >
            <Text style={[
              styles.pillText, 
              preferences.skillLevel === 'beginner' && styles.pillTextActive
            ]}>Beginner</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.pill, 
              preferences.skillLevel === 'intermediate' && styles.pillActive
            ]}
            onPress={() => setSkillLevel('intermediate')}
          >
            <Text style={[
              styles.pillText, 
              preferences.skillLevel === 'intermediate' && styles.pillTextActive
            ]}>Intermediate</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.pill, 
              preferences.skillLevel === 'advanced' && styles.pillActive
            ]}
            onPress={() => setSkillLevel('advanced')}
          >
            <Text style={[
              styles.pillText, 
              preferences.skillLevel === 'advanced' && styles.pillTextActive
            ]}>Advanced</Text>
          </TouchableOpacity>
        </View>
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render meal time preferences step
  const renderMealTimeStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Quick Meals (under 30 min)</Text>
            <Switch
              value={preferences.mealTimePreference.quick}
              onValueChange={() => togglePreference('mealTimePreference', 'quick')}
              trackColor={{ false: '#d3d3d3', true: '#4285F4' }}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Standard (30-60 min)</Text>
            <Switch
              value={preferences.mealTimePreference.standard}
              onValueChange={() => togglePreference('mealTimePreference', 'standard')}
              trackColor={{ false: '#d3d3d3', true: '#4285F4' }}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Elaborate (60+ min)</Text>
            <Switch
              value={preferences.mealTimePreference.elaborate}
              onValueChange={() => togglePreference('mealTimePreference', 'elaborate')}
              trackColor={{ false: '#d3d3d3', true: '#4285F4' }}
            />
          </View>
        </View>
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render taste preferences step
  const renderTastePreferencesStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <View style={styles.optionsContainer}>
          {Object.keys(preferences.tastePreferences).map((option) => (
            <View key={option} style={styles.optionRow}>
              <Text style={styles.optionLabel}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
              <Switch
                value={preferences.tastePreferences[option as keyof typeof preferences.tastePreferences]}
                onValueChange={() => togglePreference('tastePreferences', option)}
                trackColor={{ false: '#d3d3d3', true: '#4285F4' }}
              />
            </View>
          ))}
        </View>
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render health goals step
  const renderHealthGoalsStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{STEPS[currentStep].title}</Text>
        <Text style={styles.stepDescription}>{STEPS[currentStep].description}</Text>
        
        <TextInput
          style={[styles.textInput, styles.textAreaInput]}
          value={preferences.healthGoals}
          onChangeText={(text) => setPreferences(prev => ({ ...prev, healthGoals: text }))}
          placeholder="Enter your health goals (e.g., weight loss, muscle gain, general health)"
          placeholderTextColor="#999"
          multiline
        />
        
        {renderNavigationButtons()}
      </View>
    );
  };

  // Render navigation buttons (back and next)
  const renderNavigationButtons = () => {
    return (
      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={goToPreviousStep}
          >
            <Ionicons name="arrow-back" size={24} color="#555" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={goToNextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < STEPS.length - 1 ? 'Next' : 'Finish'}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'dietaryRestrictions':
        return renderDietaryRestrictionsStep();
      case 'allergies':
        return renderAllergiesStep();
      case 'cuisinePreferences':
        return renderCuisinePreferencesStep();
      case 'cookingSkill':
        return renderCookingSkillStep();
      case 'mealTime':
        return renderMealTimeStep();
      case 'tastePreferences':
        return renderTastePreferencesStep();
      case 'healthGoals':
        return renderHealthGoalsStep();
      case 'finish':
        return renderFinishScreen();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {currentStep > 0 && currentStep < STEPS.length - 1 && renderProgressBar()}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {renderStepContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBarContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#FF6B6B',
  },
  welcomeDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 26,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContainer: {
    padding: 20,
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF6B6B',
  },
  stepDescription: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {
    fontSize: 16,
    color: '#444',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    flex: 1,
    marginVertical: 8,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e1e8ed',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  pill: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingVertical: 16,
    alignItems: 'center',
    margin: 4,
    borderRadius: 20,
  },
  pillActive: {
    backgroundColor: '#4285F4',
  },
  pillText: {
    color: '#333',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OnboardingScreen;