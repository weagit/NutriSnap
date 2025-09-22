import React from 'react';
import { View, Text } from 'react-native';

export default function JournalScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:18, fontWeight:'600' }}>Daily Journal</Text>
      <Text>(Here we will list meals and total kcal)</Text>
    </View>
  );
}
