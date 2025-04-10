import React from 'react';
import { StyleSheet } from 'react-native';
import { VoiceAIScreen } from './features/voiceAI';

export default function App() {
  return <VoiceAIScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
