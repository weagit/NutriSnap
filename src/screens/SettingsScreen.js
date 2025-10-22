// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useCalories } from '../store/caloriesContext';
import { COLORS, MESSAGES, APP_CONFIG } from '../constants/constants';


export default function SettingsScreen() {
  const { dailyLimit, setDailyLimit, getChartData, totalKcal } = useCalories();
  const [value, setValue] = useState(String(dailyLimit));

  const save = () => {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < APP_CONFIG.MIN_DAILY_LIMIT) {
      return alert(MESSAGES.ERROR.INVALID_LIMIT);
    }
    setDailyLimit(n);
    alert(MESSAGES.SUCCESS.LIMIT_UPDATED);
  };

  const chartData = getChartData();
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Section Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <Text style={styles.subtitle}>
          {totalKcal} / {dailyLimit} kcal consumed
        </Text>
        
        {/* Message motivationnel si limite atteinte */}
        {totalKcal >= dailyLimit && (
          <View style={styles.congratsBox}>
            <Text style={styles.congratsTitle}>
              Congratulations! You've reached your goal!
            </Text>
            <Text style={styles.congratsQuote}>
              "Success is the sum of small efforts repeated day in and day out."
            </Text>
          </View>
        )}

        {chartData.datasets[0].data.length > 1 ? (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                // Ligne verte : votre consommation
                chartData.datasets[0],
                // Ligne rouge : limite daily (ajoutée à tous les points)
                {
                  data: chartData.labels.map(() => dailyLimit),
                  color: () => '#FF3B30',
                  strokeWidth: 2,
                  withDots: false,
                  strokeDashArray: [8, 4]
                }
              ]
            }}
            width={screenWidth - 40}
            height={240}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#FAFAFA',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(53, 197, 207, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,
              style: {
                borderRadius: 12,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#35C5CF',
                fill: '#35C5CF'
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#EDEEF1',
                strokeWidth: 1
              }
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            fromZero={true}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartTitle}>No meals tracked yet</Text>
            <Text style={styles.emptyChartSubtitle}>
              Start adding meals to see your progress
            </Text>
          </View>
        )}

        {/* Légende */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#35C5CF' }]} />
            <Text style={styles.legendText}>Your intake</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDashed, { borderColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Daily limit</Text>
          </View>
        </View>
      </View>

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Section Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Text style={styles.inputLabel}>Daily calorie limit</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          placeholder="2000"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
  },
  congratsBox: {
    backgroundColor: '#35C5CF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  congratsTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  congratsQuote: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  chart: {
    marginVertical: 12,
    borderRadius: 12,
  },
  emptyChart: {
    height: 240,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEEF1',
    marginVertical: 12,
  },
  emptyChartTitle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptyChartSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  legendDashed: {
    width: 24,
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEEF1',
    marginVertical: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#81C9F3',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#35C5CF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});