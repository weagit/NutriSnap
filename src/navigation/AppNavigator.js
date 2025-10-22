import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanScreen from '../screens/ScanScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Scan" component={ScanScreen}  />
        <Stack.Screen name="Journal" component={JournalScreen}  />
        <Stack.Screen name="Settings" component={SettingsScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
