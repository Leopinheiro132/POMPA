import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZE } from '../../constants/theme';

export function ProgressBar({ value, maxValue = 100, color = COLORS.amber, label, showPercentage = true, height = 8 }) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  // Cor baseada na porcentagem (verde → amarelo → vermelho)
  const getStatusColor = () => {
    if (color !== 'auto') return color;
    if (percentage > 60) return COLORS.emerald;
    if (percentage > 30) return COLORS.amber;
    return COLORS.red;
  };

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color: getStatusColor() }]}>
              {percentage.toFixed(0)}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: getStatusColor(),
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  percentage: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  track: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BORDER_RADIUS.full,
  },
});
