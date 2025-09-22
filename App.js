import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CaloriesProvider } from './src/store/caloriesContext';

export default function App() {
  return (
    <CaloriesProvider>
      <AppNavigator />
    </CaloriesProvider>
  );
}
