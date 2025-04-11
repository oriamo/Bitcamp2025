import axios from 'axios';
import { GEMINI_API_KEY } from '@env';

// Interface for Gemini API responses
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
  }[];
}

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string | null = null;
  
  private constructor() {
    this.apiKey = GEMINI_API_KEY || null;
  }
  
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }
  
  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
  
  /**
   * Set API key directly (if needed)
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
  
  /**
   * Process a query and get a response from Gemini API
   */
  async getResponse(query: string, recipeName?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API service not properly configured. Check your API key.');
    }
    
    try {
      // Add context about cooking to help the model
      const cookingContext = this.getCookingContext(recipeName);
      
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`;
      
      const data = {
        contents: [
          {
            parts: [
              { text: `${cookingContext}\n\nUser question: ${query}` }
            ]
          }
        ]
      };
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const responseData = response.data as GeminiResponse;
        if (responseData.candidates && 
            responseData.candidates[0]?.content?.parts && 
            responseData.candidates[0].content.parts[0]?.text) {
          return responseData.candidates[0].content.parts[0].text;
        }
      }
      
      throw new Error('Invalid response from Gemini API');
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Sorry, I had trouble processing your request. Please try again.';
    }
  }
  
  /**
   * Generate a welcome message for a recipe
   */
  async getWelcomeMessage(recipeName: string): Promise<string> {
    if (!this.isConfigured()) {
      return `Welcome! I'll help you cook ${recipeName}. Let's get started!`;
    }
    
    try {
      const prompt = `Generate a short, enthusiastic welcome message for someone who is about to cook ${recipeName}. 
      Be conversational, friendly, and encouraging. Mention the recipe name and express excitement about helping them cook it. 
      Keep it under 40 words.`;
      
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`;
      
      const data = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      };
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const responseData = response.data as GeminiResponse;
        if (responseData.candidates && 
            responseData.candidates[0]?.content?.parts && 
            responseData.candidates[0].content.parts[0]?.text) {
          return responseData.candidates[0].content.parts[0].text;
        }
      }
      
      return `You made an awesome choice! Now let me walk you through the steps of cooking ${recipeName}.`;
    } catch (error) {
      console.error('Error generating welcome message:', error);
      return `Welcome! I'll help you cook ${recipeName}. Let's get started!`;
    }
  }
  
  /**
   * Get cooking context for consistent persona
   */
  private getCookingContext(recipeName?: string): string {
    let context = 'You are CookMate, a friendly and encouraging cooking assistant. ' +
      'Provide cooking tips, recipe suggestions, ingredient substitutions, ' +
      'and answer any cooking-related questions. Use a conversational, supportive tone.';
    
    if (recipeName) {
      context += ` You are currently helping the user cook ${recipeName}.`;
    }
    
    return context;
  }
}

export default GeminiService.getInstance();