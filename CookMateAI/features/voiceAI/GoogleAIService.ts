import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

export class GoogleAIService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    // Initialize with the API key from environment variables
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!GEMINI_API_KEY;
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