import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RecipeDetail, RecipeStep } from './RecipeService';
import GeminiService from './GeminiService';

type Conversation = {
  type: 'user' | 'assistant';
  text: string;
};

interface CookingAssistantScreenProps {
  recipe: RecipeDetail;
  onBack: () => void;
}

export const CookingAssistantScreen: React.FC<CookingAssistantScreenProps> = ({
  recipe,
  onBack,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 is prep, 1...n are actual steps
  const [isAIReady, setIsAIReady] = useState(false);

  // Initialize with welcome message and check if AI is configured
  useEffect(() => {
    const init = async () => {
      // Check if Gemini API is configured
      const aiConfigured = GeminiService.isConfigured();
      setIsAIReady(aiConfigured);
      
      if (!aiConfigured) {
        console.warn('Gemini API key not configured properly. The app will operate in basic mode.');
        const welcomeMessage = `Welcome! I'll help you cook ${recipe.name}. We'll go through ${recipe.steps.length} steps together. Tap 'Start Cooking' when you're ready to begin.`;
        setConversations([{ type: 'assistant', text: welcomeMessage }]);
      } else {
        // Generate welcome message with AI
        try {
          setIsProcessing(true);
          const welcomeMessage = await GeminiService.getWelcomeMessage(recipe.name);
          setConversations([{ type: 'assistant', text: welcomeMessage }]);
        } catch (error) {
          console.error('Error generating welcome message:', error);
          const fallbackMessage = `Welcome! I'll help you cook ${recipe.name}. We'll go through ${recipe.steps.length} steps together. Tap 'Start Cooking' when you're ready to begin.`;
          setConversations([{ type: 'assistant', text: fallbackMessage }]);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    init();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversations]);

  const handleUserInput = async () => {
    if (!userInput.trim()) return;
    
    // Add user message to conversations
    const userText = userInput;
    setConversations(prev => [...prev, { type: 'user', text: userText }]);
    setUserInput(''); // Clear input field immediately
    
    // Show processing state
    setIsProcessing(true);
    
    try {
      // Process user input
      const lowerText = userText.toLowerCase();
      let response = '';
      
      // Check for navigation commands first
      if (lowerText.includes('start') || lowerText.includes('begin')) {
        if (currentStep === 0) {
          setCurrentStep(1);
          const firstStep = recipe.steps[0];
          response = `Great! Let's start cooking. Step 1: ${firstStep.description}`;
        } else {
          response = `We're already on step ${currentStep} of ${recipe.steps.length}.`;
        }
      } else if (lowerText.includes('next')) {
        if (currentStep < recipe.steps.length) {
          setCurrentStep(currentStep + 1);
          const nextStep = recipe.steps[currentStep];
          response = `Step ${nextStep.number}: ${nextStep.description}`;
        } else {
          response = "That was the last step! You've completed the recipe.";
        }
      } else if (lowerText.includes('previous') || lowerText.includes('back')) {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
          const prevStep = recipe.steps[currentStep - 2];
          response = `Going back to Step ${prevStep.number}: ${prevStep.description}`;
        } else {
          setCurrentStep(0);
          response = "Let's go back to the beginning. Tap 'Start Cooking' when you're ready.";
        }
      } else if (lowerText.includes('ingredients') || lowerText.includes('what do i need')) {
        const ingredientsList = recipe.ingredients
          .map(ing => `${ing.name}: ${ing.measure}`)
          .join(', ');
        response = `For this recipe, you'll need: ${ingredientsList}`;
      } else if (isAIReady) {
        // Use Gemini API for more complex queries if available
        try {
          // Create context about current recipe and step
          const recipeContext = `Recipe: ${recipe.name}. Current step: ${
            currentStep === 0 ? 'Preparation' : currentStep
          } of ${recipe.steps.length}. ${
            currentStep > 0 
            ? `Current step instructions: ${recipe.steps[currentStep - 1].description}` 
            : `Recipe overview: ${recipe.instructions.substring(0, 200)}...`
          }`;
          
          response = await GeminiService.getResponse(
            `${recipeContext}\n\nUser question: ${userText}`,
            recipe.name
          );
        } catch (error) {
          console.error('Error getting AI response:', error);
          response = "I'm having trouble connecting to my knowledge service right now. Please ask about specific steps or ingredients instead.";
        }
      } else {
        // Generic responses when AI is not available
        response = `I'm a simple cooking assistant. You're ${
          currentStep === 0 ? 'preparing to start' : `on step ${currentStep} of ${recipe.steps.length}`
        }. Try asking about ingredients or using the navigation buttons.`;
      }
      
      // Add assistant response
      setConversations(prev => [...prev, { type: 'assistant', text: response }]);
    } catch (error) {
      console.error('Error in handleUserInput:', error);
      // Show error message
      setConversations(prev => [...prev, { 
        type: 'assistant', 
        text: 'Sorry, there was an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleNavigationButton = (action: 'next' | 'previous' | 'start' | 'repeat') => {
    let response = '';
    
    switch (action) {
      case 'next':
        if (currentStep < recipe.steps.length) {
          setCurrentStep(currentStep + 1);
          const nextStep = recipe.steps[currentStep];
          response = `Step ${nextStep.number}: ${nextStep.description}`;
        } else {
          response = "That was the last step! You've completed the recipe.";
        }
        break;
        
      case 'previous':
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
          const prevStep = recipe.steps[currentStep - 2];
          response = `Going back to Step ${prevStep.number}: ${prevStep.description}`;
        } else {
          setCurrentStep(0);
          response = "Let's go back to the beginning. Tap 'Start Cooking' when you're ready.";
        }
        break;
        
      case 'start':
        if (currentStep === 0) {
          setCurrentStep(1);
          const firstStep = recipe.steps[0];
          response = `Great! Let's start cooking. Step 1: ${firstStep.description}`;
        } else {
          response = `We're already on step ${currentStep} of ${recipe.steps.length}.`;
        }
        break;
        
      case 'repeat':
        if (currentStep === 0) {
          response = `We haven't started yet. Tap 'Start Cooking' when you're ready to begin cooking ${recipe.name}.`;
        } else {
          const step = recipe.steps[currentStep - 1];
          response = `Step ${step.number}: ${step.description}`;
        }
        break;
    }
    
    setConversations(prev => [...prev, { type: 'assistant', text: response }]);
  };

  const getCurrentStepContent = () => {
    if (currentStep === 0) {
      return (
        <View style={styles.prepStep}>
          <Text style={styles.prepTitle}>Preparing to Cook</Text>
          <Image 
            source={{ uri: recipe.thumbnail }} 
            style={styles.recipeImage} 
            resizeMode="cover"
          />
          <Text style={styles.prepText}>
            You'll be making {recipe.name}, a {recipe.area} {recipe.category.toLowerCase()} dish.
          </Text>
          <Text style={styles.prepText}>
            This recipe has {recipe.steps.length} steps. Say "start" or "ready" when you're prepared to begin.
          </Text>
          
          <View style={styles.ingredientsHeader}>
            <Text style={styles.ingredientsTitle}>Ingredients</Text>
            <Text style={styles.ingredientsCount}>{recipe.ingredients.length} items</Text>
          </View>
          
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientDot} />
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
            </View>
          ))}
        </View>
      );
    } else if (currentStep <= recipe.steps.length) {
      const step = recipe.steps[currentStep - 1];
      return (
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            <Text style={styles.stepProgress}>Step {step.number} of {recipe.steps.length}</Text>
          </View>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedTitle}>Recipe Complete!</Text>
          <Image 
            source={{ uri: recipe.thumbnail }} 
            style={styles.recipeImage} 
            resizeMode="cover"
          />
          <Text style={styles.finishedText}>
            You've completed all {recipe.steps.length} steps of {recipe.name}. Enjoy your meal!
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cooking Assistant</Text>
        {isAIReady && (
          <View style={styles.aiIndicator}>
            <Text style={styles.aiIndicatorText}>AI Enabled</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.recipeStepContainer}>
          {getCurrentStepContent()}
          
          <View style={styles.stepNav}>
            <TouchableOpacity 
              style={[styles.navButton, currentStep <= 1 && styles.navButtonDisabled]}
              onPress={() => handleNavigationButton('previous')}
              disabled={currentStep <= 1}
            >
              <Text style={[styles.navButtonText, currentStep <= 1 && styles.navButtonTextDisabled]}>Previous</Text>
            </TouchableOpacity>
            
            {currentStep === 0 ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => handleNavigationButton('start')}
              >
                <Text style={styles.startButtonText}>Start Cooking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.navButton, styles.repeatButton]}
                onPress={() => handleNavigationButton('repeat')}
              >
                <Text style={styles.navButtonText}>Repeat</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.navButton, currentStep >= recipe.steps.length && styles.navButtonDisabled]}
              onPress={() => handleNavigationButton('next')}
              disabled={currentStep >= recipe.steps.length}
            >
              <Text style={[styles.navButtonText, currentStep >= recipe.steps.length && styles.navButtonTextDisabled]}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.conversationContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {conversations.map((conversation, index) => (
              <View 
                key={index} 
                style={[
                  styles.messageCard,
                  conversation.type === 'user' ? styles.userMessageCard : styles.assistantMessageCard
                ]}
              >
                <Text style={styles.messageText}>{conversation.text}</Text>
              </View>
            ))}
            
            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="small" color="#4285F4" />
                <Text style={styles.processingText}>Processing your request...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Ask a question..."
              placeholderTextColor="#999"
              returnKeyType="send"
              onSubmitEditing={handleUserInput}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleUserInput}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  aiIndicator: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  aiIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  recipeStepContainer: {
    flex: 2,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 16,
  },
  conversationContainer: {
    flex: 3,
  },
  prepStep: {
    flex: 1,
  },
  prepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  prepText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    lineHeight: 22,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientsCount: {
    fontSize: 14,
    color: '#666',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  ingredientMeasure: {
    fontSize: 14,
    color: '#666',
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepProgress: {
    fontSize: 14,
    color: '#666',
  },
  stepDescription: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
  },
  finishedContainer: {
    flex: 1,
    alignItems: 'center',
  },
  finishedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  finishedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    lineHeight: 24,
    marginTop: 12,
  },
  stepNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  startButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  repeatButton: {
    backgroundColor: '#4CAF50',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 8,
  },
  messageCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessageCard: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantMessageCard: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    alignItems: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CookingAssistantScreen;