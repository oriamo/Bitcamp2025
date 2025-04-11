// Basic test following Google's documentation
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable
const apiKey = process.env.GEMINI_API_KEY;

console.log('API Key available:', !!apiKey);
console.log('API Key length:', apiKey ? apiKey.length : 0);

async function runTest() {
  try {
    // For text-only input, use the gemini-pro model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Write a short poem about a cat.";
    console.log('Sending prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error details:', error);
  }
}

runTest();