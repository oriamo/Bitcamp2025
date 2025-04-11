import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

export type StreamResponseCallback = (text: string, done: boolean) => void;

export class GoogleAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private streamModel: GenerativeModel | null = null;
  
  constructor() {
    // Initialize with the API key from environment variables if available
    if (GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        // Initialize different models for different use cases
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        this.streamModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.streamModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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

  /**
   * Process a query and get a response from Google Generative AI
   */
  async getResponse(query: string, recipeName?: string): Promise<string> {
    if (!this.isConfigured() || !this.model) {
      throw new Error('Google AI service not properly configured. Check your environment variables.');
    }

    try {
      const cookingContext = this.getCookingContext(recipeName);
      const prompt = `${cookingContext}\n\nUser question: ${query}`;
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Sorry, I had trouble processing your request. Please try again.';
    }
  }

  /**
   * Process a query and stream the response in real-time
   */
  async streamResponse(
    query: string, 
    callback: StreamResponseCallback,
    recipeName?: string
  ): Promise<void> {
    if (!this.isConfigured() || !this.streamModel) {
      callback('Sorry, the AI service is not configured properly.', true);
      throw new Error('Google AI service not properly configured. Check your environment variables.');
    }

    try {
      const cookingContext = this.getCookingContext(recipeName);
      const prompt = `${cookingContext}\n\nUser question: ${query}`;
      
      let fullResponse = '';
      
      // Use streaming API
      const streamResult = await this.streamModel.generateContentStream(prompt);
      
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        callback(chunkText, false);
      }
      
      // Signal the end of the stream
      callback('', true);
      return;
    } catch (error) {
      console.error('Error streaming AI response:', error);
      callback('Sorry, I had trouble processing your request. Please try again.', true);
    }
  }

  /**
   * Generate a welcome message for a recipe
   */
  async getWelcomeMessage(recipeName: string): Promise<string> {
    if (!this.isConfigured() || !this.model) {
      return `Welcome! I'll help you cook ${recipeName}. Let's get started!`;
    }

    try {
      const prompt = `Generate a short, enthusiastic welcome message for someone who is about to cook ${recipeName}. 
      Be conversational, friendly, and encouraging. Mention the recipe name and express excitement about helping them cook it. 
      Keep it under 30 words.`;
      
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return response;
    } catch (error) {
      console.error('Error generating welcome message:', error);
      return `You made an awesome choice! Now let me walk you through the steps of cooking ${recipeName}.`;
    }
  }

  /**
   * Stream a welcome message for a recipe
   */
  async streamWelcomeMessage(
    recipeName: string,
    callback: StreamResponseCallback
  ): Promise<void> {
    if (!this.isConfigured() || !this.streamModel) {
      const defaultMessage = `Welcome! I'll help you cook ${recipeName}. Let's get started!`;
      callback(defaultMessage, true);
      return;
    }

    try {
      const prompt = `Generate a short, enthusiastic welcome message for someone who is about to cook ${recipeName}. 
      Be conversational, friendly, and encouraging. Mention the recipe name and express excitement about helping them cook it. 
      Keep it under 40 words.`;
      
      let fullResponse = '';
      
      // Use streaming API
      const streamResult = await this.streamModel.generateContentStream(prompt);
      
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        callback(chunkText, false);
      }
      
      // Signal the end of the stream
      callback('', true);
      return;
    } catch (error) {
      console.error('Error streaming welcome message:', error);
      const fallbackMessage = `You made an awesome choice! Now let me walk you through the steps of cooking ${recipeName}.`;
      callback(fallbackMessage, true);
    }
  }
}