import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { VoiceAIScreen } from './features/voiceAI';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <VoiceAIScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
});
