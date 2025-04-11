import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import geminiAIService, { ChatMessage } from './GeminiAIService';

// Initial conversation data with CookMate's greeting
const initialConversation = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your CookMate AI assistant. How can I help with your cooking today?',
  }
];

const AIScreen = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>(initialConversation);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Scroll to bottom when conversation updates
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversation]);
  
  // Function to handle sending a new message
  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Update the Gemini service with the current conversation history
      geminiAIService.convertMessagesToHistory(conversation);
      
      // Send the message to Gemini AI and get the response
      const aiResponseText = await geminiAIService.sendMessage(message);
      
      // Create the AI response object
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
      };
      
      // Update the conversation with the AI response
      setConversation(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to CookMate AI. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to render each message bubble
  const renderMessage = (item: ChatMessage) => {
    const isUser = item.role === 'user';
    
    return (
      <View 
        key={item.id} 
        style={[
          styles.messageBubble, 
          isUser ? styles.userBubble : styles.aiBubble
        ]}
      >
        {!isUser && (
          <View style={styles.aiIconContainer}>
            <LinearGradient
              colors={['#FF8C94', '#FF6B6B']}
              style={styles.aiIconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="restaurant" size={16} color="#fff" />
            </LinearGradient>
          </View>
        )}
        <View style={[
          styles.messageContent,
          isUser ? styles.userMessageContent : styles.aiMessageContent
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>{item.content}</Text>
        </View>
      </View>
    );
  };
  
  // Function to suggest prompts for the user
  const renderSuggestions = () => {
    const suggestions = [
      "What can I make with chicken and pasta?",
      "How do I make crispy roast potatoes?",
      "Give me a quick 15-minute dinner idea",
      "Suggest a healthy dessert recipe",
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => {
              setMessage(suggestion);
            }}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Reset chat function
  const resetChat = () => {
    geminiAIService.resetChat();
    setConversation(initialConversation);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CookMate AI</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={resetChat}
        >
          <Ionicons name="refresh" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.conversationContainer}
        contentContainerStyle={styles.conversationContent}
      >
        {conversation.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#FF6B6B" />
              <Text style={styles.loadingText}>Cooking up a response...</Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      {conversation.length === 1 && renderSuggestions()}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about recipes, cooking tips..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            message.trim() === '' ? styles.sendButtonDisabled : null
          ]}
          onPress={sendMessage}
          disabled={message.trim() === '' || isLoading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() === '' || isLoading ? "#CCC" : "#FFF"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.features}>
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="mic" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="camera" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="image" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContainer: {
    flex: 1,
  },
  conversationContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  aiIconContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  aiIconBackground: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userMessageContent: {
    backgroundColor: '#FF6B6B',
  },
  aiMessageContent: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  aiMessageText: {
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#777',
  },
  suggestionsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  suggestionButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  suggestionText: {
    fontSize: 14,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  featureButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIScreen;