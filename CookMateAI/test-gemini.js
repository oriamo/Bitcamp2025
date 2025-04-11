// Test script to verify Gemini API access
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

// Function to test API connection
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API access...');
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('No API key found in environment variables');
      return;
    }

    // Initialize the API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try the original model name
    console.log('Trying gemini-pro model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Generate a simple response
    const prompt = 'Write a one-sentence greeting.';
    console.log('Sending test prompt to API:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('API Response received:');
    console.log(response);
    console.log('Gemini API test successful!');
  } catch (error) {
    console.error('Error testing Gemini API:');
    console.error(error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testGeminiAPI();