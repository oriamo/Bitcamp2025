# Voice AI Feature for CookMate

This feature adds voice command capabilities to the CookMate application, allowing users to ask cooking-related questions using voice input and receive intelligent responses powered by Google's Gemini AI.

## Features

- Voice recording and processing via Expo Audio
- Speech-to-text transcription (simulated in demo mode)
- Integration with Google Generative AI for intelligent responses
- LiveKit integration for potential voice chat functionality
- Conversation history display with user and assistant messages
- Demo mode with predefined cooking responses

## Setup

1. Install the required dependencies:
   ```
   npm install expo-av @google/generative-ai @livekit/react-native @livekit/react-native-webrtc livekit-client react-native-dotenv
   ```

2. Create a `.env` file in the root of the CookMateAI directory with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   LIVEKIT_URL=your_livekit_url
   ```

3. Create a `babel.config.js` file to enable the environment variables:
   ```js
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         ["module:react-native-dotenv", {
           "moduleName": "@env",
           "path": ".env",
           "blacklist": null,
           "whitelist": null,
           "safe": false,
           "allowUndefined": true
         }]
       ]
     };
   };
   ```

4. The feature can be used in demo mode even without proper API keys (using predefined responses).

## Usage

The Voice AI feature consists of these main components:

- `VoiceAIService`: Handles voice recording and audio processing
- `GoogleAIService`: Communicates with the Google Generative AI API
- `LiveKitService`: Provides live voice communication capability
- `VoiceAIComponent`: UI component for the recording button and transcription display
- `VoiceAIScreen`: Main screen that orchestrates all components and displays conversations

### Integration

To integrate into your app:

```tsx
import { VoiceAIScreen } from './features/voiceAI';

export default function App() {
  return <VoiceAIScreen />;
}
```

## Mode Detection

The feature automatically detects whether API keys are available:

1. If the Gemini API key is present, it will use the real AI service for responses
2. If no API key is found, it will display "Demo Mode" and use predefined cooking responses

## Voice Processing

In the current implementation:
1. Voice input is recorded using Expo Audio
2. For demo purposes, transcription is simulated with predefined cooking questions
3. In a real implementation, this would be connected to a speech-to-text service

## Future Enhancements

- Implement actual speech-to-text using Google Speech API or Whisper API
- Add voice output for AI responses using text-to-speech
- Integrate LiveKit for real-time voice conversations with a remote cooking assistant
- Improve error handling and offline capabilities
- Implement user preferences for voice interaction