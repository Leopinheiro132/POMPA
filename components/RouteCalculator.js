import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

const DAYS = [
  { key: 'monKm', label: 'Segunda' },
  { key: 'tueKm', label: 'Terça' },
  { key: 'wedKm', label: 'Quarta' },
  { key: 'thuKm', label: 'Quinta' },
  { key: 'friKm', label: 'Sexta' },
  { key: 'satKm', label: 'Sábado' },
  { key: 'sunKm', label: 'Domingo' },
];

export function RouteCalculator({ config, breakdown, onChangeRoutes }) {
  if (!config || !breakdown) return null;

  return (
    <Card>
      <Text style={styles.title}>🛣️ Rotas Diárias</Text>
      <Text style={styles.subtitle}>Configure os km de cada dia da semana</Text>

      <View style={styles.daysGrid}>
        {DAYS.map((day) => (
          <View key={day.key} style={styles.dayItem}>
            <Input
              label={day.label}
              value={String(config.routes[day.key] || 0)}
              onChangeText={(v) => {
                const num = parseFloat(v) || 0;
                onChangeRoutes({ [day.key]: num });
              }}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
        ))}
        <View style={styles.dayItem}>
          <Input
            label="Km Extra/Semana"
            value={String(config.routes.extraWeeklyKm || 0)}
            onChangeText={(v) => {
              const num = parseFloat(v) || 0;
              onChangeRoutes({ extraWeeklyKm: num });
            }}
            keyboardType="numeric"
            suffix="km"
          />
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Semanal</Text>
          <Text style={styles.summaryValue}>{formatNumber(breakdown.weeklyKm, 0)} km</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Mensal</Text>
          <Text style={styles.summaryValue}>{formatNumber(breakdown.monthlyKm, 0)} km</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Anual</Text>
          <Text style={styles.summaryValue}>{formatNumber(breakdown.annualKm, 0)} km</Text>
        </View>
      </View>

      <View style={styles.fuelSummary}>
        <Text style={styles.fuelText}>
          ⛽ {formatNumber(breakdown.weeklyFuelLiters, 1)} L/semana • {formatCurrency(breakdown.weeklyFuelCost)}/semana
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  dayItem: {
    width: '47%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  summaryValue: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  fuelSummary: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  fuelText: {
    color: COLORS.emeraldLight,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
