import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ScanScreen({ navigation }) {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', gap:12 }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Scan — take a photo of your meal</Text>
      <Button title="Go to Journal" onPress={() => navigation.navigate('Journal')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
