import { GoogleGenerativeAI } from '@google/generative-ai';
// Try to import from env, but provide fallback mechanism
let GEMINI_API_KEY: string;
try {
  // Import dynamically to avoid build errors if @env is not properly set up
  GEMINI_API_KEY = require('@env').GEMINI_API_KEY;
} catch (error) {
  console.warn('Could not load API key from environment variables.');
  GEMINI_API_KEY = '';
}

export class GoogleAIService {
  private genAI: GoogleGenerativeAI | null = null;
  
  constructor() {
    // Initialize with the API key from environment variables if available
    if (GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      } catch (error) {
        console.error('Failed to initialize Google Generative AI:', error);
      }
    }
  }

  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!GEMINI_API_KEY && !!this.genAI;
  }

  /**
   * Set API key directly (for testing or if not using env variables)
   */
  setApiKey(apiKey: string): void {
    if (apiKey) {
      GEMINI_API_KEY = apiKey;
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Process a query and get a response from Google Generative AI
   */
  async getResponse(query: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Google AI service not properly configured. Check your environment variables.');
    }

    try {
      // Add context about cooking to help the model understand this is a cooking assistant
      const cookingContext = 'You are CookMate, a helpful cooking assistant. ' +
        'Provide cooking tips, recipe suggestions, ingredient substitutions, ' +
        'and answer any cooking-related questions.';
        
      const model = this.genAI!.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `${cookingContext}\n\nUser question: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Sorry, I had trouble processing your request. Please try again.';
    }
  }
}