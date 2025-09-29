// src/screens/ScanScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  useSpeechRecognitionEvent,
  addSpeechRecognitionListener,
  ExpoSpeechRecognitionModule,
} from 'expo-speech-recognition';
import { useCalories } from '../store/caloriesContext';
import { analyzeMealFromImageAsync } from '../services/apiClient';

export default function ScanScreen({ navigation }) {
  const { addEntry, dailyLimit, totalKcal } = useCalories();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceDetails, setVoiceDetails] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognizing, setRecognizing] = useState(false);

  // Gestion du speech recognition
  useSpeechRecognitionEvent('start', () => setRecognizing(true));
  useSpeechRecognitionEvent('end', () => setRecognizing(false));
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setVoiceDetails(transcript);
    }
  });
  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech recognition error:', event.error);
    Alert.alert('Error', 'Could not recognize speech. Please try again.');
    setRecognizing(false);
  });

  // Demander permissions au montage
  useEffect(() => {
    (async () => {
      const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone permission is required for voice details.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to scan meals.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ 
      quality: 0.7, 
      allowsEditing: false,
      base64: false
    });
    if (!res.canceled) {
      setImage(res.assets[0]);
      setVoiceDetails(''); // Reset voice details pour nouvelle photo
    }
  };

  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      await ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: false,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('Error', 'Could not start recording.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const analyzeAndAdd = async () => {
    if (!image) return Alert.alert('No photo', 'Please take a photo first.');
    
    setLoading(true);
    try {
      const result = await analyzeMealFromImageAsync(image.uri, voiceDetails);
      
      addEntry({ 
        name: result.name, 
        kcal: result.kcal,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert('Added ✅', result.description);
      setImage(null);
      setVoiceDetails('');
      navigation.navigate('Journal');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Error', 'Could not analyze this photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>
        Today: {totalKcal}/{dailyLimit} kcal
      </Text>
      
      {image && (
        <>
          <Image 
            source={{ uri: image.uri }} 
            style={{ width:'100%', height:250, borderRadius:12 }} 
            resizeMode="cover"
          />
          
          {/* Bouton micro pour ajouter détails vocaux */}
          <TouchableOpacity
            onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={recognizing}
            style={{
              backgroundColor: isRecording ? '#FF3B30' : '#007AFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isRecording ? '🎤 Stop Recording' : '🎤 Add voice details (optional)'}
            </Text>
          </TouchableOpacity>

          {/* Afficher la transcription */}
          {voiceDetails ? (
            <View style={{ padding: 10, backgroundColor: '#F0F0F0', borderRadius: 8 }}>
              <Text style={{ fontSize: 14, color: '#333' }}>
                📝 Details: {voiceDetails}
              </Text>
            </View>
          ) : null}

          {recognizing && (
            <Text style={{ textAlign: 'center', color: '#007AFF' }}>
              Listening...
            </Text>
          )}
        </>
      )}
      
      {loading ? (
        <View style={{ alignItems: 'center', padding: 20 }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Analyzing your meal...</Text>
        </View>
      ) : (
        <>
          <Button title="📸 Take a photo" onPress={takePhoto} />
          <Button 
            title="🔍 Analyze & add" 
            onPress={analyzeAndAdd} 
            disabled={!image}
            color={image ? "#34C759" : "#999"}
          />
          <Button title="📊 Go to Journal" onPress={() => navigation.navigate('Journal')} />
          <Button title="⚙️ Settings" onPress={() => navigation.navigate('Settings')} />
        </>
      )}
    </View>
  );
}