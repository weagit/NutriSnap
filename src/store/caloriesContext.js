// src/store/caloriesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, COLORS } from '../constants/constants';

const CaloriesContext = createContext();

export function useCalories() {
  const context = useContext(CaloriesContext);
  if (!context) {
    throw new Error('useCalories must be used within CaloriesProvider');
  }
  return context;
}

export function CaloriesProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(APP_CONFIG.DEFAULT_DAILY_LIMIT);

  // Calculer le total des kcal
  const totalKcal = entries.reduce((sum, entry) => sum + (entry.kcal || 0), 0);

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Charger les entrées du jour
      const entriesData = await AsyncStorage.getItem(`entries_${today}`);
      if (entriesData) {
        setEntries(JSON.parse(entriesData));
      }

      // Charger la limite quotidienne
      const limitData = await AsyncStorage.getItem('dailyLimit');
      if (limitData) {
        setDailyLimit(parseInt(limitData, 10));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveEntries = async (newEntries) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`entries_${today}`, JSON.stringify(newEntries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const saveDailyLimit = async (limit) => {
    try {
      await AsyncStorage.setItem('dailyLimit', String(limit));
    } catch (error) {
      console.error('Error saving daily limit:', error);
    }
  };

  const addEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      name: entry.name,
      kcal: entry.kcal,
      macros: entry.macros || null,
      description: entry.description || null,
      reasoning: entry.reasoning || null,
      additionalDetails: entry.additionalDetails || null,
    };
    const newEntries = [newEntry, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const removeEntry = (id) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const updateDailyLimit = (limit) => {
    setDailyLimit(limit);
    saveDailyLimit(limit);
  };

  // Préparer les données pour la chart
  const getChartData = () => {
    if (entries.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{ data: [0] }]
      };
    }

    // Trier par timestamp (plus ancien au plus récent)
    const sorted = [...entries].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Calculer les kcal cumulées à chaque meal
    let cumulative = 0;
    const cumulativeData = sorted.map(entry => {
      cumulative += entry.kcal;
      return cumulative;
    });

    // Labels = heures des meals
    const labels = sorted.map(entry => {
      const date = new Date(entry.timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    });

    // Ajouter un point de départ à 0 kcal
    labels.unshift('Start');
    cumulativeData.unshift(0);

    return {
      labels,
      datasets: [
        {
          data: cumulativeData,
          color: (opacity = 1) => `rgba(53, 197, 207, ${opacity})`, // Utilise COLORS.primary
          strokeWidth: 3
        }
      ]
    };
  };

  const value = {
    entries,
    dailyLimit,
    totalKcal,
    addEntry,
    removeEntry,
    setDailyLimit: updateDailyLimit,
    getChartData,
  };

  return (
    <CaloriesContext.Provider value={value}>
      {children}
    </CaloriesContext.Provider>
  );
}