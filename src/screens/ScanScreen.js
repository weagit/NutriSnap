import React from 'react';
import { View, Text, Button } from 'react-native';
import { useCalories } from '../store/caloriesContext';

export default function ScanScreen({ navigation }) {
  const { addEntry, dailyLimit, totalKcal } = useCalories();

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', gap:12, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Scan — take a photo of your meal</Text>
      <Text>Today: {totalKcal}/{dailyLimit} kcal</Text>

      {/* Bouton temporaire pour simuler un ajout de repas */}
      <Button title="Add dummy meal (450 kcal)" onPress={() => addEntry({ name: 'Meal', kcal: 450 })} />
      <Button title="Go to Journal" onPress={() => navigation.navigate('Journal')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
