import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { initDatabase } from '../services/database';
import { COLORS, FONT_SIZE } from '../constants/theme';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (err) {
        console.error('Erro ao inicializar banco:', err);
        setError(err.message);
      }
    }
    setup();
  }, []);

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>❌ Erro ao inicializar: {error}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.amber} />
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.bg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="odometro"
          options={{
            headerShown: true,
            headerTitle: 'Odômetro',
            headerStyle: { backgroundColor: COLORS.bgCard },
            headerTintColor: COLORS.textPrimary,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="configuracoes"
          options={{
            headerShown: true,
            headerTitle: 'Configurações',
            headerStyle: { backgroundColor: COLORS.bgCard },
            headerTintColor: COLORS.textPrimary,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 16,
  },
  errorText: {
    color: COLORS.red,
    fontSize: FONT_SIZE.md,
    padding: 20,
    textAlign: 'center',
  },
});
