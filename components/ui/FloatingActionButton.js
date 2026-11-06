import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '../../constants/theme';

export function FloatingActionButton({ onPress, label, icon = <Plus size={22} color="#ffffff" /> }) {
  return (
    <TouchableOpacity
      style={[styles.fab, label ? styles.fabExtended : styles.fabCircular]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentRow}>
        {icon}
        {label ? <Text style={styles.fabLabel}>{label}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    ...SHADOWS.glow,
  },
  fabCircular: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fabExtended: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  fabLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
