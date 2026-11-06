import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Fuel, TrendingUp, Calendar, Gauge } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function KPICards({ config, breakdown }) {
  if (!config || !breakdown) return null;

  const kpis = [
    {
      label: 'CUSTO / KM',
      value: formatCurrency(breakdown.totalCostPerKm),
      subtitle: 'Todos os custos inclusos',
      icon: Gauge,
      color: COLORS.amber,
      bgColor: COLORS.amberBg,
    },
    {
      label: 'GASTO MENSAL',
      value: formatCurrency(breakdown.totalMonthlyCost),
      subtitle: `${formatNumber(breakdown.monthlyKm, 0)} km/mês`,
      icon: Calendar,
      color: COLORS.primary,
      bgColor: COLORS.primaryBg,
    },
    {
      label: 'COMBUSTÍVEL',
      value: formatCurrency(breakdown.monthlyFuelCost),
      subtitle: `${formatNumber(breakdown.weeklyFuelLiters, 1)} L/semana`,
      icon: Fuel,
      color: COLORS.secondary,
      bgColor: COLORS.secondaryBg,
    },
    {
      label: 'TANQUE CHEIO (12 L)',
      value: formatCurrency(12 * config.fuelPrice),
      subtitle: `Autonomia: ~${formatNumber(12 * config.fuelEfficiency, 0)} km`,
      icon: Fuel,
      color: COLORS.cyan,
      bgColor: COLORS.cyanBg,
    },
    {
      label: 'GASTO ANUAL',
      value: formatCurrency(breakdown.totalAnnualCost),
      subtitle: `${formatNumber(breakdown.annualKm, 0)} km/ano`,
      icon: TrendingUp,
      color: COLORS.purple,
      bgColor: COLORS.purpleBg,
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <View key={index} style={styles.kpiCard}>
            <View style={[styles.iconContainer, { backgroundColor: kpi.bgColor }]}>
              <Icon size={18} color={kpi.color} />
            </View>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            <Text style={styles.kpiSubtitle}>{kpi.subtitle}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: SPACING.md,
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  kpiCard: {
    width: 164,
    marginRight: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  kpiLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  kpiSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
