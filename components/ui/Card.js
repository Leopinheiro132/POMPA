import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export function Card({ children, style, variant = 'default' }) {
  return (
    <View style={[
      styles.card,
      variant === 'accent' && styles.cardAccent,
      variant === 'danger' && styles.cardDanger,
      variant === 'success' && styles.cardSuccess,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardAccent: {
    borderColor: COLORS.amber,
    borderWidth: 1,
  },
  cardDanger: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
  cardSuccess: {
    borderColor: COLORS.emerald,
    borderWidth: 1,
  },
});
