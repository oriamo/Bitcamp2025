import { Audio } from 'expo-av';

/**
 * Service for handling voice AI functionalities
 */
export interface VoiceAIOptions {
  onTranscriptionResult?: (text: string) => void;
  onError?: (error: Error) => void;
}

export class VoiceAIService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;
  
  constructor(private options: VoiceAIOptions = {}) {}

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await this.recording.startAsync();
      this.isRecording = true;
    } catch (error) {
      if (this.options.onError && error instanceof Error) {
        this.options.onError(error);
      }
    }
  }

  /**
   * Stop recording and process the audio
   */
  async stopRecording(): Promise<string | null> {
    if (!this.recording || !this.isRecording) {
      return null;
    }
    
    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;
      this.recording = null;
      
      if (uri) {
        // Process the audio file and get transcription
        const transcription = await this.processAudio(uri);
        if (this.options.onTranscriptionResult) {
          this.options.onTranscriptionResult(transcription);
        }
        return transcription;
      }
    } catch (error) {
      if (this.options.onError && error instanceof Error) {
        this.options.onError(error);
      }
    }
    
    return null;
  }

  /**
   * Process the recorded audio and return transcription
   * For this demo, we'll simulate transcription since speech-to-text
   * implementation can vary widely (Google Speech-to-Text, Whisper API, etc.)
   */
  private async processAudio(audioUri: string): Promise<string> {
    console.log('Processing audio from:', audioUri);
    
    // In a real implementation, we would:
    // 1. Convert the audio to the required format
    // 2. Upload to a speech-to-text service
    // 3. Get the transcription back
    
    // For demo purposes, simulate common cooking queries
    const simulatedQueries = [
      "How do I make pasta carbonara?",
      "What's a substitute for eggs in baking?",
      "How long should I cook chicken breast?",
      "What spices go well with fish?",
      "How do I know when bread is done baking?",
      "What's the best way to sharpen kitchen knives?",
      "Can I freeze homemade soup?",
      "How do I make fluffy rice?",
      "What's the difference between baking soda and baking powder?",
      "How do I prevent cookies from spreading too much?"
    ];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a random cooking query
    return simulatedQueries[Math.floor(Math.random() * simulatedQueries.length)];
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}