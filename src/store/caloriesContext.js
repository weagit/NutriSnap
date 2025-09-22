import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const CaloriesContext = createContext(null);

export function CaloriesProvider({ children }) {
  const [dailyLimit, setDailyLimit] = useState(2000);
  const [entries, setEntries] = useState([]); // { id, name, kcal, timestamp }

  // Clé de stockage liée à la date (ex: nutrisnap:2025-09-22)
  const todayKey = useMemo(() => `nutrisnap:${format(new Date(), 'yyyy-MM-dd')}`, []);

  // 1) Au montage, on charge ce qui a été sauvegardé pour AUJOURD’HUI
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(todayKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.limit) setDailyLimit(parsed.limit);
          if (parsed.entries) setEntries(parsed.entries);
        }
      } catch (e) {
        console.warn('Failed to load local data', e);
      }
    })();
  }, [todayKey]);

  // 2) À chaque changement (limite ou entrées), on sauvegarde
  useEffect(() => {
    AsyncStorage.setItem(todayKey, JSON.stringify({ limit: dailyLimit, entries }))
      .catch((e) => console.warn('Failed to save local data', e));
  }, [todayKey, dailyLimit, entries]);

  // Fonctions utilitaires : ajouter/supprimer une entrée, calculer le total
  const addEntry = (item) =>
    setEntries((prev) => [{ id: Date.now().toString(), timestamp: Date.now(), ...item }, ...prev]);

  const removeEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const totalKcal = entries.reduce((s, e) => s + (e.kcal || 0), 0);

  const value = { dailyLimit, setDailyLimit, entries, addEntry, removeEntry, totalKcal };
  return <CaloriesContext.Provider value={value}>{children}</CaloriesContext.Provider>;
}

export const useCalories = () => useContext(CaloriesContext);
