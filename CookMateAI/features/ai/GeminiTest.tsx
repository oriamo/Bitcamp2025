// Test script to verify Gemini AI integration for CookMate
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import geminiAIService from './GeminiAIService';

const GeminiTest = () => {
  const [testResult, setTestResult] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult('Testing connection to Gemini AI...\n');

    try {
      // Test 1: Simple prompt
      setTestResult(prev => prev + '\nTest 1: Sending a simple prompt...');
      const response1 = await geminiAIService.sendMessage('Give me a one-sentence greeting as CookMate AI.');
      setTestResult(prev => prev + '\nResponse: ' + response1 + '\n');

      // Test 2: Cooking related prompt
      setTestResult(prev => prev + '\nTest 2: Sending a cooking-related prompt...');
      const response2 = await geminiAIService.sendMessage('What can I make with chicken, rice, and bell peppers?');
      setTestResult(prev => prev + '\nResponse: ' + response2 + '\n');

      setTestResult(prev => prev + '\n✅ Gemini AI connection successful! Your integration is working properly.');
    } catch (error) {
      console.error('Error testing Gemini:', error);
      setTestResult(prev => prev + `\n❌ Error: ${error.message || 'Unknown error'}`);
      
      // Provide debugging information
      setTestResult(prev => prev + '\n\nDebugging Information:');
      
      // Check if API key exists
      try {
        const hasApiKey = !!require('@env').GEMINI_API_KEY;
        setTestResult(prev => prev + `\n- API Key exists: ${hasApiKey ? 'Yes' : 'No'}`);
      } catch (e) {
        setTestResult(prev => prev + '\n- Could not check API key: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Gemini AI Connection Test</Text>
      <Text style={styles.subtitle}>This will test if your Gemini API key is valid and if the integration is working.</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={runTest}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Testing...' : 'Run Test'}</Text>
      </TouchableOpacity>
      
      {testResult ? (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GeminiTest;