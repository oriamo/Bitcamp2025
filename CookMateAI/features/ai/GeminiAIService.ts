import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

// Interface for message structure
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private history: Array<{ role: string; parts: Array<{text: string}> }> = [];
  private readonly SYSTEM_PROMPT = "You are CookMate, a helpful cooking assistant AI. Use a friendly, enthusiastic tone. Keep responses concise and focused on cooking, recipes, ingredients, and kitchen techniques. Always start responses with a cooking-related greeting or acknowledgment. End responses with a cooking-related encouragement. Your primary goal is to help users cook delicious meals with the ingredients they have. If users ask about non-cooking topics, gently redirect them to cooking-related discussions.";

  constructor() {
    // Initialize the Google Generative AI with API key
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is missing');
      }
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      // Use the updated model name gemini-1.0-pro instead of gemini-pro
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Initialize history with system prompt
      this.addSystemPrompt();
    } catch (error) {
      console.error('Error initializing GeminiAIService:', error);
    }
  }

  private addSystemPrompt() {
    // Add the system prompt to set the assistant's behavior
    this.history.push({
      role: 'user',
      parts: [{ text: this.SYSTEM_PROMPT }]
    });
    
    this.history.push({
      role: 'model',
      parts: [{ text: "I understand my role as CookMate. I'll provide friendly, cooking-focused assistance with a positive tone." }]
    });
  }

  // Reset the chat history but keep the system prompt
  public resetChat() {
    this.history = [];
    this.addSystemPrompt();
  }

  // Send a message to the AI and get a response
  public async sendMessage(message: string): Promise<string> {
    try {
      // Add user message to history
      this.history.push({
        role: 'user',
        parts: [{ text: message }]
      });

      console.log('Sending request to Gemini with model:', this.model);
      // Generate content using the chat history
      const result = await this.model.generateContent({
        contents: this.history,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      });

      const response = result.response;
      const responseText = response.text();

      // Add AI response to history
      this.history.push({
        role: 'model',
        parts: [{ text: responseText }]
      });

      return responseText;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // If the API call fails, provide a fallback response and more detailed error
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      
      const fallbackResponse = "I'm having trouble connecting to my cooking brain right now. Please check your internet connection or try again in a moment. Remember to keep those ingredients ready!";
      return fallbackResponse;
    }
  }

  // Helper method to convert app message format to Gemini format
  public convertMessagesToHistory(messages: ChatMessage[]) {
    this.resetChat(); // Reset and keep system prompt
    
    // Add all messages except the initial greeting
    messages.forEach(message => {
      if (message.role === 'user') {
        this.history.push({
          role: 'user',
          parts: [{ text: message.content }]
        });
      } else if (message.role === 'assistant' && 
                !message.content.includes("I'm your CookMate AI assistant")) {
        this.history.push({
          role: 'model',
          parts: [{ text: message.content }]
        });
      }
    });
  }
}

// Create singleton instance
const geminiAIService = new GeminiAIService();
export default geminiAIService;