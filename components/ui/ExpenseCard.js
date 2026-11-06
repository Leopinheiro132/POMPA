import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Fuel, Droplets, Wrench, Trash2, CircleDot, Link2 } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { EXPENSE_TYPE_LABELS } from '../../constants/types';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const TYPE_ICONS = {
  gas: { icon: Fuel, color: COLORS.secondary },
  oil: { icon: Droplets, color: COLORS.amber },
  oil_filter: { icon: Droplets, color: COLORS.blue },
  tire_rear: { icon: Wrench, color: COLORS.orange },
  tire_front: { icon: Wrench, color: COLORS.cyan },
  brakes: { icon: CircleDot, color: COLORS.red },
  chain: { icon: Link2, color: COLORS.purple },
  eventual: { icon: Wrench, color: COLORS.textMuted },
  other: { icon: Wrench, color: COLORS.textMuted },
};

export function ExpenseCard({ item, onDelete }) {
  const typeInfo = TYPE_ICONS[item.type] || TYPE_ICONS.other;
  const Icon = typeInfo.icon;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: typeInfo.color + '20' }]}>
        <Icon size={18} color={typeInfo.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
          <Text style={styles.cost}>{formatCurrency(item.totalCost)}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaDate}>{item.date} • {formatNumber(item.odometerKm, 0)} km</Text>
          <View style={[styles.badge, { backgroundColor: typeInfo.color + '20' }]}>
            <Text style={[styles.badgeText, { color: typeInfo.color }]}>
              {EXPENSE_TYPE_LABELS[item.type] || item.type}
            </Text>
          </View>
        </View>

        {item.type === 'gas' && (item.calculatedKmPerLiter || item.litersFuel || item.kmSinceLastRefill) && (
          <View style={styles.gasMetricsRow}>
            {item.litersFuel && <Text style={styles.gasSubText}>⛽ {formatNumber(item.litersFuel, 1)} L</Text>}
            {item.kmSinceLastRefill && <Text style={styles.gasSubText}>🛣️ Trip {formatNumber(item.kmSinceLastRefill, 0)} km</Text>}
            {item.calculatedKmPerLiter && (
              <Text style={styles.kmlBadge}>
                🔥 {formatNumber(item.calculatedKmPerLiter, 1)} km/L
              </Text>
            )}
          </View>
        )}
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id, item.description)}>
          <Trash2 size={16} color={COLORS.red} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    flex: 1,
    marginRight: SPACING.sm,
  },
  cost: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  metaDate: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  gasMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 6,
  },
  gasSubText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  kmlBadge: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: COLORS.secondaryBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.sm,
  },
  deleteBtn: {
    padding: SPACING.xs + 2,
    marginLeft: SPACING.xs,
  },
});
