import React from 'react';
import { View, Text, FlatList, Button, ScrollView } from 'react-native';
import { useCalories } from '../store/caloriesContext';

export default function JournalScreen({ navigation }) {
  const { entries, removeEntry, totalKcal, dailyLimit } = useCalories();

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:20, fontWeight:'700', marginBottom: 4 }}>
        {totalKcal}/{dailyLimit} kcal today
      </Text>
      
      {/* Barre de progression */}
      <View style={{ 
        height: 8, 
        backgroundColor: '#E0E0E0', 
        borderRadius: 4, 
        marginBottom: 16,
        overflow: 'hidden'
      }}>
        <View style={{ 
          height: '100%', 
          width: `${Math.min((totalKcal / dailyLimit) * 100, 100)}%`,
          backgroundColor: totalKcal > dailyLimit ? '#FF3B30' : '#34C759',
          borderRadius: 4
        }} />
      </View>

      <FlatList
        data={entries}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={
          <View style={{ 
            padding: 20, 
            alignItems: 'center', 
            backgroundColor: '#F8F9FA', 
            borderRadius: 12,
            marginTop: 12
          }}>
            <Text style={{ fontSize: 16, color: '#999' }}>🍽️ No meals yet.</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              Start scanning your first meal!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          // Extraire les macros si elles existent
          const macros = item.macros || null;
          const hasDetails = item.description || macros;
          
          return (
            <View style={{ 
              padding: 14, 
              marginVertical: 8, 
              borderWidth: 1, 
              borderColor: '#E0E0E0',
              borderRadius: 12,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1
            }}>
              {/* En-tête du meal */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 16, color: '#1A1A1A' }}>
                    {item.name || 'Meal'}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#34C759', marginTop: 2 }}>
                    {item.kcal} kcal
                  </Text>
                </View>
                
                {/* Heure */}
                {item.timestamp && (
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    {new Date(item.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                )}
              </View>

              {/* Macronutriments */}
              {macros && (
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-around', 
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#F0F0F0'
                }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#FF6B6B' }}>
                      {macros.protein}g
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                      🥩 Protein
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#4ECDC4' }}>
                      {macros.carbs}g
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                      🍞 Carbs
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFD93D' }}>
                      {macros.fat}g
                    </Text>
                    <Text style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                      🥑 Fat
                    </Text>
                  </View>
                </View>
              )}

              {/* Description détaillée */}
              {item.description && (
                <View style={{ 
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: '#F8F9FA',
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: '#007AFF'
                }}>
                  <Text style={{ fontSize: 12, color: '#555', lineHeight: 18 }}>
                    {item.description}
                  </Text>
                </View>
              )}

              {/* Bouton supprimer */}
              <View style={{ marginTop: 12 }}>
                <Button 
                  title="🗑️ Delete" 
                  onPress={() => removeEntry(item.id)} 
                  color="#FF3B30"
                />
              </View>
            </View>
          );
        }}
      />

      <View style={{ marginTop: 16 }}>
        <Button 
          title="📸 Scan a new meal" 
          onPress={() => navigation.navigate('Scan')}
          color="#007AFF" 
        />
      </View>
    </View>
  );
}