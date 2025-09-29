// src/screens/ScanScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCalories } from '../store/caloriesContext';
import { analyzeMealFromImageAsync } from '../services/apiClient';

export default function ScanScreen({ navigation }) {
  const { addEntry, dailyLimit, totalKcal } = useCalories();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to scan meals.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ 
      quality: 0.7, 
      allowsEditing: false,
      base64: false // Pas besoin de base64 ici, on le fait dans apiClient
    });
    if (!res.canceled) setImage(res.assets[0]);
  };

  const analyzeAndAdd = async () => {
    if (!image) return Alert.alert('No photo', 'Please take a photo first.');
    
    setLoading(true);
    try {
      const result = await analyzeMealFromImageAsync(image.uri);
      // result => { name, kcal, macros, description, confidence }
      
      addEntry({ 
        name: result.name, 
        kcal: result.kcal,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert('Added ✅', result.description);
      setImage(null);
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
        <Image 
          source={{ uri: image.uri }} 
          style={{ width:'100%', height:250, borderRadius:12 }} 
          resizeMode="cover"
        />
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
            color={image ? "#007AFF" : "#999"}
          />
          <Button title="📊 Go to Journal" onPress={() => navigation.navigate('Journal')} />
          <Button title="⚙️ Settings" onPress={() => navigation.navigate('Settings')} />
        </>
      )}
    </View>
  );
}