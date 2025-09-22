import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useCalories } from '../store/caloriesContext';

export default function JournalScreen({ navigation }) {
  const { entries, removeEntry, totalKcal, dailyLimit } = useCalories();

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:20, fontWeight:'700' }}>{totalKcal}/{dailyLimit} kcal today</Text>

      <FlatList
        data={entries}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={{ marginTop:12 }}>No meals yet.</Text>}
        renderItem={({ item }) => (
          <View style={{ padding:12, marginVertical:6, borderWidth:1, borderRadius:12 }}>
            <Text style={{ fontWeight:'600' }}>{item.name || 'Meal'}</Text>
            <Text>{item.kcal} kcal</Text>
            <Button title="Delete" onPress={() => removeEntry(item.id)} />
          </View>
        )}
      />

      <Button title="Scan a new meal" onPress={() => navigation.navigate('Scan')} />
    </View>
  );
}
