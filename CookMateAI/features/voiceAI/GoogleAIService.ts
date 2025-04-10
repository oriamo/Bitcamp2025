import { GoogleGenerativeAI } from '@google/generative-ai';

// In a real app, this would come from environment variables
// For demo purposes, we'll need an API key at runtime
let API_KEY = '';

export class GoogleAIService {
  private genAI: GoogleGenerativeAI | null = null;
  
  constructor() {
    // Initialization is deferred until setApiKey is called
  }

  /**
   * Set API key and initialize the service
   */
  setApiKey(apiKey: string): void {
    API_KEY = apiKey;
    this.genAI = new GoogleGenerativeAI(API_KEY);
  }

  /**
   * Check if the API key is set
   */
  isConfigured(): boolean {
    return !!API_KEY && !!this.genAI;
  }

  /**
   * Process a query and get a response from Google Generative AI
   */
  async getResponse(query: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Google AI service not initialized. Call setApiKey first.');
    }

    try {
      // Add context about cooking to help the model understand this is a cooking assistant
      const cookingContext = 'You are CookMate, a helpful cooking assistant. ' +
        'Provide cooking tips, recipe suggestions, ingredient substitutions, ' +
        'and answer any cooking-related questions.';
        
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
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