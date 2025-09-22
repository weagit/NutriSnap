import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useCalories } from '../store/caloriesContext';

export default function SettingsScreen() {
  const { dailyLimit, setDailyLimit } = useCalories();
  const [value, setValue] = useState(String(dailyLimit));

  const save = () => {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < 500) return alert('Enter a valid value (>500)');
    setDailyLimit(n);
    alert('Daily limit updated ✅');
  };

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Daily kcal limit</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={{ borderWidth:1, borderRadius:8, padding:10 }}
      />
      <Button title="Save" onPress={save} />
    </View>
  );
}
