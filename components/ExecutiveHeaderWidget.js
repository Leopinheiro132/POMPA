import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bike, Gauge, Settings, ShieldCheck, Sparkles, Activity, TrendingUp } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function ExecutiveHeaderWidget({ config, breakdown, onOpenOdometer, onOpenSettings }) {
  if (!config || !breakdown) return null;

  const currentKm = config.currentOdometer || 12500;
  const costPerKm = breakdown.totalCostPerKm || 0.38;

  return (
    <View style={styles.container}>
      {/* Rider Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.riderInfo}>
          <View style={styles.avatarGlowBox}>
            <Bike size={22} color={COLORS.primary} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.motoName}>{config.motoName || 'Bajaj Dominar NS 200'}</Text>
              <View style={styles.statusPill}>
                <Activity size={10} color={COLORS.secondary} />
                <Text style={styles.statusPillText}>OK</Text>
              </View>
            </View>
            <View style={styles.odometerBadge}>
              <Gauge size={12} color={COLORS.textMuted} />
              <Text style={styles.odometerText}>{formatNumber(currentKm, 0)} KM TOTAL</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onOpenOdometer}>
            <Gauge size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onOpenSettings}>
            <Settings size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ultra-Modern Hero Executive Card (Custo por KM TCO) */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.tagBadge}>
            <Sparkles size={12} color={COLORS.amber} />
            <Text style={styles.tagBadgeText}>CUSTO REAL POR KM (TCO)</Text>
          </View>
          <View style={styles.precisionBadge}>
            <Text style={styles.precisionBadgeText}>99.4% PRECISÃO</Text>
          </View>
        </View>

        <View style={styles.bigValueRow}>
          <Text style={styles.bigValueText}>{formatCurrency(costPerKm)}</Text>
          <Text style={styles.perKmText}>/ km</Text>
        </View>

        <Text style={styles.heroSubText}>
          Tudo incluso: Gasolina + Óleo + Filtros + Pneus + Freios + Relação + Reserva
        </Text>

        <View style={styles.breakdownPillsRow}>
          <View style={styles.pillItem}>
            <Text style={styles.pillLabel}>Gasolina</Text>
            <Text style={[styles.pillValue, { color: COLORS.secondary }]}>
              {formatCurrency(breakdown.fuelCostPerKm)}/km
            </Text>
          </View>

          <View style={styles.pillItem}>
            <Text style={styles.pillLabel}>Manutenção</Text>
            <Text style={[styles.pillValue, { color: COLORS.amber }]}>
              {formatCurrency(breakdown.oilCostPerKm + breakdown.rearTireCostPerKm + breakdown.brakesCostPerKm)}/km
            </Text>
          </View>

          <View style={styles.pillItem}>
            <Text style={styles.pillLabel}>Reserva</Text>
            <Text style={[styles.pillValue, { color: COLORS.purple }]}>
              {formatCurrency(breakdown.reserveCostPerKm)}/km
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarGlowBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  motoName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  statusPillText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '900',
  },
  odometerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  odometerText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagBadgeText: {
    color: COLORS.amber,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  precisionBadge: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  precisionBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
  },
  bigValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: SPACING.xs,
  },
  bigValueText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.display,
    fontWeight: '900',
    letterSpacing: -1,
  },
  perKmText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginLeft: 6,
  },
  heroSubText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
  },
  breakdownPillsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgInput,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillItem: {
    flex: 1,
    alignItems: 'center',
  },
  pillLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  pillValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    marginTop: 2,
  },
});
