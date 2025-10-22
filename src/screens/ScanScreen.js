// src/screens/ScanScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Image, 
  ActivityIndicator, 
  Alert, 
  TextInput, 
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCalories } from '../store/caloriesContext';
import { analyzeMealFromImageAsync } from '../services/apiClient';
import { COLORS, MESSAGES, APP_CONFIG } from '../constants/constants';


export default function ScanScreen({ navigation }) {
  const { addEntry, dailyLimit, totalKcal } = useCalories();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [showDetailsInput, setShowDetailsInput] = useState(false);

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
      setAdditionalDetails('');
      setShowDetailsInput(false);
    }
  };

  const handleDone = () => {
    Keyboard.dismiss();
    setShowDetailsInput(false);
  };

  const analyzeAndAdd = async () => {
    if (!image) return Alert.alert('No photo', 'Please take a photo first.');
    
    setLoading(true);
    try {
      const result = await analyzeMealFromImageAsync(image.uri, additionalDetails);
      
      addEntry({ 
        name: result.name, 
        kcal: result.kcal,
        macros: result.macros,
        description: result.description,
        reasoning: result.reasoning,
        additionalDetails: result.additionalDetails,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert(
        'Meal Added', 
        `${result.name}\n${result.kcal} kcal\n\n${result.reasoning}`,
        [{ text: 'OK' }]
      );
      
      setImage(null);
      setAdditionalDetails('');
      setShowDetailsInput(false);
      navigation.navigate('Journal');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Error', 'Could not analyze this photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Logo NutriSnap */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>NutriSnap</Text>
          <View style={styles.logoBadge}>
            <View style={styles.aiDot} />
            <Text style={styles.badgeText}>AI Powered</Text>
          </View>
        </View>

        {/* Header avec progression */}
        <View style={styles.header}>
          <View style={styles.progressHeader}>
            <Text style={styles.headerTitle}>Daily Progress</Text>
            <Text style={styles.headerKcal}>{totalKcal} / {dailyLimit}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: `${Math.min((totalKcal / dailyLimit) * 100, 100)}%`,
                backgroundColor: totalKcal > dailyLimit ? '#FF3B30' : '#35C5CF'
              }
            ]} />
          </View>
        </View>
        
        {image && (
          <View style={styles.imageSection}>
            <Image 
              source={{ uri: image.uri }} 
              style={styles.image} 
              resizeMode="cover"
            />
            
            {!showDetailsInput ? (
              <TouchableOpacity
                onPress={() => setShowDetailsInput(true)}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsButtonText}>
                  Add details (optional)
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.detailsInputSection}>
                <Text style={styles.detailsLabel}>
                  Describe your meal for better accuracy:
                </Text>
                <TextInput
                  value={additionalDetails}
                  onChangeText={setAdditionalDetails}
                  placeholder="e.g., without meat, double cheese, 0% fat..."
                  placeholderTextColor="#999"
                  multiline
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={handleDone}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={handleDone}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {additionalDetails && !showDetailsInput ? (
              <View style={styles.detailsDisplay}>
                <Text style={styles.detailsDisplayText}>
                  Details: {additionalDetails}
                </Text>
              </View>
            ) : null}
          </View>
        )}
        
        {loading ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#35C5CF" />
            <Text style={styles.loadingText}>Analyzing your meal...</Text>
          </View>
        ) : (
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, !image && styles.buttonDisabled]} 
              onPress={analyzeAndAdd} 
              disabled={!image}
            >
              <Text style={styles.analyzeButtonText}>Analyze & Add</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => navigation.navigate('Journal')}
            >
              <Text style={styles.secondaryButtonText}>View Journal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#35C5CF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9EFF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#35C5CF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#35C5CF',
    letterSpacing: 0.3,
  },
  header: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerKcal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#35C5CF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EDEEF1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  imageSection: {
    gap: 12,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  detailsButton: {
    backgroundColor: '#81C9F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  detailsInputSection: {
    gap: 10,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#81C9F3',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
    maxHeight: 120,
    backgroundColor: 'white',
  },
  doneButton: {
    backgroundColor: '#35C5CF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  detailsDisplay: {
    padding: 12,
    backgroundColor: '#D9EFF5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#35C5CF',
  },
  detailsDisplayText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  loadingSection: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 15,
  },
  actionsSection: {
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#35C5CF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  analyzeButton: {
    backgroundColor: '#81C9F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#EDEEF1',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#1A1A1A',
    fontWeight: '600',
    fontSize: 15,
  },
});