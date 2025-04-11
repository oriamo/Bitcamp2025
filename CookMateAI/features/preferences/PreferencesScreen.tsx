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
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define preference types
export interface UserPreferences {
  dietaryRestrictions: {
    vegan: boolean;
    vegetarian: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    keto: boolean;
    paleo: boolean;
  };
  allergies: string[];
  calorieLimit: string;
  cuisinePreferences: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  mealTimePreference: {
    quick: boolean;
    standard: boolean;
    elaborate: boolean;
  };
  tastePreferences: {
    spicy: boolean;
    sweet: boolean;
    savory: boolean;
    bitter: boolean;
    sour: boolean;
  };
  healthGoals: string;
}

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

interface PreferencesScreenProps {
  onComplete: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ 
  onComplete, 
  initialPreferences 
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || defaultPreferences
  );
  const [allergyInput, setAllergyInput] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');

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

  // Save preferences and navigate to next screen
  const savePreferences = () => {
    // Validate calorie input
    if (preferences.calorieLimit !== '' && isNaN(Number(preferences.calorieLimit))) {
      Alert.alert('Invalid Input', 'Please enter a valid number for calorie limit');
      return;
    }

    // Here we would normally save preferences to AsyncStorage
    // For now, just pass them to the parent component
    onComplete(preferences);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Food Preferences</Text>
      <Text style={styles.subtitle}>Tell us about your preferences to get personalized recipes</Text>

      <ScrollView style={styles.scrollContainer}>
        {/* Dietary Restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
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
        </View>

        {/* Allergies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies & Intolerances</Text>
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
        </View>

        {/* Calorie Limit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calorie Limit (per meal)</Text>
          <TextInput
            style={styles.textInput}
            value={preferences.calorieLimit}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, calorieLimit: text }))}
            placeholder="Enter calorie limit (e.g., 500)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Cuisine Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
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
        </View>

        {/* Cooking Skill Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cooking Skill Level</Text>
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
        </View>

        {/* Meal Time Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Preparation Time</Text>
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
        </View>

        {/* Taste Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taste Preferences</Text>
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
        </View>

        {/* Health Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            value={preferences.healthGoals}
            onChangeText={(text) => setPreferences(prev => ({ ...prev, healthGoals: text }))}
            placeholder="Enter your health goals (e.g., weight loss, muscle gain, general health)"
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  },
  pill: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
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
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PreferencesScreen;