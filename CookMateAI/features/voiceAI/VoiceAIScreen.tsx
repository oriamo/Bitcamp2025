import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { VoiceAIComponent } from './VoiceAIComponent';
import { GoogleAIService } from './GoogleAIService';

type Conversation = {
  type: 'user' | 'assistant';
  text: string;
};

export default function VoiceAIScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const googleAIService = useRef(new GoogleAIService()).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTranscription = async (text: string) => {
    // Add user query to conversation
    setConversations(prev => [...prev, { type: 'user', text }]);
    
    if (!isKeyConfigured) {
      setConversations(prev => [
        ...prev, 
        { 
          type: 'assistant', 
          text: 'Please configure your Google AI API key first using the form at the bottom.' 
        }
      ]);
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // In a real app, you would process this with Google AI
      // For the demo, we'll simulate responses based on cooking topics
      
      let response: string;
      
      if (text.toLowerCase().includes('carbonara') || text.toLowerCase().includes('pasta')) {
        response = "For a classic pasta carbonara, you'll need pasta, eggs, pancetta or bacon, Parmesan cheese, black pepper, and optionally garlic. Cook the pasta, fry the pancetta, mix eggs and cheese in a bowl, then combine everything off heat to create a creamy sauce without scrambling the eggs.";
      } else if (text.toLowerCase().includes('substitute') && text.toLowerCase().includes('egg')) {
        response = "For egg substitutes in baking: 1 banana, 1/4 cup applesauce, 1/4 cup yogurt, or 1 tablespoon ground flaxseed mixed with 3 tablespoons water can replace one egg. The best substitute depends on what you're baking!";
      } else if (text.toLowerCase().includes('chicken') && (text.toLowerCase().includes('cook') || text.toLowerCase().includes('bake'))) {
        response = "For boneless chicken breasts, bake at 375°F (190°C) for 20-25 minutes or until internal temperature reaches 165°F (74°C). Cooking time varies based on thickness - use a meat thermometer for best results!";
      } else {
        // If we can't match a predefined response, try the Google AI service
        try {
          response = await googleAIService.getResponse(text);
        } catch (error) {
          // Fallback response if Google AI fails
          response = "That's a great cooking question! For detailed instructions, I'd recommend checking specialized cooking websites or cookbooks that can provide more comprehensive guidance.";
        }
      }
      
      setConversations(prev => [...prev, { type: 'assistant', text: response }]);
    } catch (error) {
      setConversations(prev => [
        ...prev, 
        { 
          type: 'assistant', 
          text: 'Sorry, there was an error processing your request. Please try again.' 
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfigureApiKey = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    
    try {
      googleAIService.setApiKey(apiKey);
      setIsKeyConfigured(true);
      Alert.alert('Success', 'API key configured successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to configure API key');
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversations]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CookMate Voice Assistant</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.responseContainer}
        contentContainerStyle={conversations.length === 0 ? styles.emptyResponseContainer : undefined}
      >
        {conversations.length > 0 ? (
          conversations.map((conversation, index) => (
            <View 
              key={index} 
              style={[
                styles.messageCard,
                conversation.type === 'user' ? styles.userMessageCard : styles.assistantMessageCard
              ]}
            >
              <Text style={styles.messageText}>{conversation.text}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Tap the button below and ask me anything about cooking!
            </Text>
          </View>
        )}
        
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color="#4285F4" />
            <Text style={styles.processingText}>Thinking about your question...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.voiceControlContainer}>
        <VoiceAIComponent onTranscriptionComplete={handleTranscription} />
      </View>
      
      {!isKeyConfigured && (
        <View style={styles.apiKeyContainer}>
          <TextInput
            style={styles.apiKeyInput}
            placeholder="Enter Google AI API Key (optional for demo)"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
          />
          <Button title="Configure" onPress={handleConfigureApiKey} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#4285F4',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  responseContainer: {
    flex: 1,
    padding: 16,
  },
  emptyResponseContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    maxWidth: '85%',
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
    lineHeight: 24,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    opacity: 0.6,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  voiceControlContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  apiKeyContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  apiKeyInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});