import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, Flame, ShieldAlert, Award } from 'lucide-react-native';
import { Card } from './ui/Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function RidingStyleSimulatorCard({ config, breakdown }) {
  if (!config || !breakdown) return null;

  const fuelPrice = config.fuelPrice || 6.85;
  const monthlyKm = breakdown.monthlyKm || 1183;
  const annualKm = breakdown.annualKm || 14196;

  // Modos de pilotagem
  const ecoKml = 32;
  const sportKml = 24;

  const ecoMonthlyCost = (monthlyKm / ecoKml) * fuelPrice;
  const sportMonthlyCost = (monthlyKm / sportKml) * fuelPrice;

  const ecoAnnualCost = (annualKm / ecoKml) * fuelPrice;
  const sportAnnualCost = (annualKm / sportKml) * fuelPrice;

  const annualSavings = sportAnnualCost - ecoAnnualCost;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Zap size={20} color={COLORS.emerald} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>⚡ Simulador de Estilo de Pilotagem</Text>
          <Text style={styles.subtitle}>Comparativo de consumo na Pulsar NS 200</Text>
        </View>
      </View>

      {/* Comparação lado a lado */}
      <View style={styles.comparisonRow}>
        {/* Pilotagem Econômica */}
        <View style={[styles.styleCard, styles.ecoStyle]}>
          <View style={styles.styleBadgeRow}>
            <Award size={14} color={COLORS.emerald} />
            <Text style={[styles.styleTitle, { color: COLORS.emerald }]}>Econômica</Text>
          </View>
          <Text style={styles.kmlValue}>32 km/L</Text>
          <Text style={styles.styleDesc}>Trocas suaves de marcha a ~6.000 RPM</Text>

          <View style={styles.divider} />

          <Text style={styles.costLabel}>Custo Mensal</Text>
          <Text style={[styles.costValue, { color: COLORS.emerald }]}>{formatCurrency(ecoMonthlyCost)}</Text>
        </View>

        {/* Pilotagem Esportiva */}
        <View style={[styles.styleCard, styles.sportStyle]}>
          <View style={styles.styleBadgeRow}>
            <Flame size={14} color={COLORS.red} />
            <Text style={[styles.styleTitle, { color: COLORS.red }]}>Esportiva</Text>
          </View>
          <Text style={styles.kmlValue}>24 km/L</Text>
          <Text style={styles.styleDesc}>Esticando marchas até ~9.500 RPM</Text>

          <View style={styles.divider} />

          <Text style={styles.costLabel}>Custo Mensal</Text>
          <Text style={[styles.costValue, { color: COLORS.red }]}>{formatCurrency(sportMonthlyCost)}</Text>
        </View>
      </View>

      {/* Banner de Economia */}
      <View style={styles.savingsBox}>
        <Text style={styles.savingsTitle}>💰 Economia Potencial com Pilotagem Suave:</Text>
        <Text style={styles.savingsAmount}>{formatCurrency(annualSavings)} / ano</Text>
        <Text style={styles.savingsSub}>
          Equivale a <Text style={{ color: COLORS.amber, fontWeight: '800' }}>{Math.round(annualSavings / 265)} revisões completas</Text> ou <Text style={{ color: COLORS.emerald, fontWeight: '800' }}>{Math.round(annualSavings / 460)} pneu traseiro novo</Text> de graça!
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.emeraldBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  styleCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    backgroundColor: COLORS.bg,
  },
  ecoStyle: {
    borderColor: COLORS.emerald + '40',
  },
  sportStyle: {
    borderColor: COLORS.red + '40',
  },
  styleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  styleTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  kmlValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  styleDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  costLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  costValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginTop: 2,
  },
  savingsBox: {
    backgroundColor: COLORS.cardBgLight || '#1c2842',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
    alignItems: 'center',
  },
  savingsTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  savingsAmount: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginVertical: 2,
  },
  savingsSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
});
