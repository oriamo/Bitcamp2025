import * as Speech from 'expo-speech';

interface SpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  voice?: string;
}

export class SpeechService {
  private static instance: SpeechService;
  private isSpeaking: boolean = false;
  private queue: {text: string, options?: SpeechOptions}[] = [];
  private defaultOptions: SpeechOptions = {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.95,
  };
  
  private constructor() {}
  
  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }
  
  /**
   * Initialize the speech service and get available voices
   */
  async initialize(): Promise<void> {
    try {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', availableVoices.length);
      
      // Try to find a good voice for our cooking assistant
      const preferredVoices = availableVoices.filter(
        voice => voice.quality === Speech.VoiceQuality.Enhanced && 
        voice.language.includes('en') &&
        (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Karen'))
      );
      
      if (preferredVoices.length > 0) {
        this.defaultOptions.voice = preferredVoices[0].identifier;
        console.log('Using preferred voice:', preferredVoices[0].name);
      }
    } catch (error) {
      console.error('Error initializing speech service:', error);
    }
  }
  
  /**
   * Speak text out loud
   */
  async speak(text: string, options?: SpeechOptions): Promise<void> {
    // Add to queue
    this.queue.push({text, options});
    
    // If not already speaking, start the queue
    if (!this.isSpeaking) {
      this.processQueue();
    }
  }
  
  /**
   * Process the speech queue
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isSpeaking = false;
      return;
    }
    
    this.isSpeaking = true;
    const item = this.queue.shift();
    
    if (!item) {
      this.isSpeaking = false;
      return;
    }
    
    try {
      // Merge default options with provided options
      const mergedOptions = {...this.defaultOptions, ...item.options};
      
      await Speech.speak(item.text, {
        ...mergedOptions,
        onDone: () => {
          this.processQueue();
        },
        onError: (error) => {
          console.error('Speech error:', error);
          this.processQueue();
        },
      });
    } catch (error) {
      console.error('Error speaking:', error);
      this.processQueue();
    }
  }
  
  /**
   * Stream speech in chunks for real-time speaking
   */
  async streamSpeak(text: string, options?: SpeechOptions): Promise<void> {
    // For streaming, we want to speak immediately
    // Split text into reasonable chunks (sentences or phrase boundaries)
    const chunks = this.splitIntoChunks(text);
    
    for (const chunk of chunks) {
      this.speak(chunk, options);
    }
  }
  
  /**
   * Split text into reasonable chunks for speaking
   */
  private splitIntoChunks(text: string): string[] {
    // First try to split on sentences
    const sentenceRegex = /(?<=[.!?])\s+/g;
    let chunks = text.split(sentenceRegex);
    
    // If any chunk is too long, split further on commas or other breaks
    const maxChunkLength = 100;
    let result: string[] = [];
    
    for (const chunk of chunks) {
      if (chunk.length <= maxChunkLength) {
        result.push(chunk);
      } else {
        // Split on commas, colons, semicolons
        const phraseRegex = /(?<=[,;:])\s+/g;
        const phrases = chunk.split(phraseRegex);
        
        let currentPhrase = '';
        for (const phrase of phrases) {
          if ((currentPhrase + phrase).length <= maxChunkLength) {
            currentPhrase += (currentPhrase ? ' ' : '') + phrase;
          } else {
            if (currentPhrase) {
              result.push(currentPhrase);
            }
            currentPhrase = phrase;
          }
        }
        
        if (currentPhrase) {
          result.push(currentPhrase);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Stop all speech
   */
  stop(): void {
    Speech.stop();
    this.queue = [];
    this.isSpeaking = false;
  }
}

export default SpeechService.getInstance();