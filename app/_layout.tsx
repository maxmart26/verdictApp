import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases'; 
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// ⚠️ AJOUTE TES CLÉS REVENUECAT ICI (Celles qui commencent par 'appl_' ou 'goog_')
const API_KEYS = {
  apple: "appl_KAlRKmctcTiBeyjeOYMbvZHWbdG", 
  google: "goog_PAS_ENCORE_DISPO"
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // --- INITIALISATION DES PAIEMENTS ---
  useEffect(() => {
    const initPurchases = async () => {
      try {
        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: API_KEYS.apple });
        } else if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: API_KEYS.google });
        }
      } catch (e) {
        console.log("Erreur init paiements", e);
      }
    };

    initPurchases();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* On cache le header natif pour avoir un design immersif */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="rules" options={{ headerShown: false }} />
        <Stack.Screen name="legal" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}