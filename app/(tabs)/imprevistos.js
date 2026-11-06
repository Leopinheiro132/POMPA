import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { EventualExpensesPlanner } from '../../components/EventualExpensesPlanner';
import { useConfig } from '../../hooks/useConfig';
import { calculateBreakdown } from '../../utils/calculations';
import { COLORS, SPACING } from '../../constants/theme';

export default function ImprevistoScreen() {
  const { config, updateConfig } = useConfig();
  const breakdown = config ? calculateBreakdown(config) : null;

  if (!config || !breakdown) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <EventualExpensesPlanner
        config={config}
        breakdown={breakdown}
        onChangeConfig={updateConfig}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl * 2,
  },
});
