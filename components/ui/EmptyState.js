import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export function EmptyState({ icon = <Inbox size={36} color={COLORS.textMuted} />, title = 'Nenhum dado encontrado', description = 'Nenhum registro cadastrado no momento.' }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  iconBox: {
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
  },
});
