// Test Gemini API directly using axios
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key available:', !!apiKey);
console.log('API Key length:', apiKey ? apiKey.length : 0);

async function testGeminiAPI() {
  try {
    // Try with API version 1 and gemini-1.5-pro model
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    
    const data = {
      contents: [
        {
          parts: [
            { text: "Write a short greeting." }
          ]
        }
      ]
    };
    
    console.log('Making direct API request...');
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('API access successful!');
      
      // Extract the text from the response
      if (response.data.candidates && response.data.candidates[0].content.parts) {
        const text = response.data.candidates[0].content.parts[0].text;
        console.log('Generated text:', text);
      }
    } else {
      console.log('API access failed.');
    }
  } catch (error) {
    console.error('Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testGeminiAPI();