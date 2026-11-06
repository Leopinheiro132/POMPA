import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, FileSpreadsheet, Droplets, Shield, ShoppingBag } from 'lucide-react-native';
import { COLORS, FONT_SIZE } from '../../constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgCard,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: FONT_SIZE.lg,
        },
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 52 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: '🏍️ MotoExpert',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lancamentos"
        options={{
          title: 'Lançamentos',
          headerTitle: '📋 Lançamentos Financeiros',
          tabBarIcon: ({ color, size }) => (
            <FileSpreadsheet size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="oleo-desgaste"
        options={{
          title: 'Óleo',
          headerTitle: '🛢️ Óleo & Saúde da Moto',
          tabBarIcon: ({ color, size }) => (
            <Droplets size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="imprevistos"
        options={{
          title: 'Planejamento',
          headerTitle: '🛡️ Planejamento & Fundo',
          tabBarIcon: ({ color, size }) => (
            <Shield size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="precos"
        options={{
          title: 'Mercado',
          headerTitle: '🛍️ Mercado de Peças',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size - 4} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
