import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { VoiceAIService } from './VoiceAIService';

interface VoiceAIComponentProps {
  onTranscriptionComplete?: (text: string) => void;
}

export const VoiceAIComponent: React.FC<VoiceAIComponentProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [voiceService] = useState(() => new VoiceAIService({
    onTranscriptionResult: (text) => {
      setTranscription(text);
      if (onTranscriptionComplete) {
        onTranscriptionComplete(text);
      }
    },
    onError: (error) => {
      console.error('Voice AI error:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  }));

  const handleRecordPress = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      await voiceService.stopRecording();
      setIsProcessing(false);
    } else {
      setTranscription(null);
      setIsRecording(true);
      await voiceService.startRecording();
    }
  }, [isRecording, voiceService]);

  return (
    <View style={styles.container}>
      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.recordButton, isRecording ? styles.recordingActive : null]}
        onPress={handleRecordPress}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Stop' : 'Start Recording'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  transcriptionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  recordButton: {
    backgroundColor: '#4285F4',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordingActive: {
    backgroundColor: '#EA4335',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});