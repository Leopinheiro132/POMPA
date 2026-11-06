import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { OilInventoryCard } from '../../components/OilInventoryCard';
import { WearHealthGrid } from '../../components/WearHealthGrid';
import { OfficialRevisionsCard } from '../../components/OfficialRevisionsCard';
import { useConfig } from '../../hooks/useConfig';
import { useLogs } from '../../hooks/useLogs';
import { calculateBreakdown } from '../../utils/calculations';
import { COLORS, SPACING } from '../../constants/theme';

export default function OleoDesgasteScreen() {
  const { config, updateConfig } = useConfig();
  const { addLog } = useLogs();

  const breakdown = config ? calculateBreakdown(config) : null;

  const handleQuickLogService = async (serviceName, cost, type, customOdometerKm, customDate) => {
    const km = customOdometerKm !== undefined && customOdometerKm !== null ? parseFloat(customOdometerKm) : config.currentOdometer;
    const date = customDate || new Date().toISOString().split('T')[0];

    const logData = {
      date: date,
      odometerKm: km,
      type: type,
      description: `Troca/Serviço: ${serviceName}`,
      totalCost: parseFloat(cost),
    };
    await addLog(logData);

    // Atualizar lastChangedKmMap com o km específico informado
    const typeToId = {
      oil: 'oil',
      oil_filter: 'oil_filter',
      tire_rear: 'tire_rear',
      tire_front: 'tire_front',
      brakes: 'brakes',
      chain: 'chain',
    };
    const componentId = typeToId[type];
    if (componentId) {
      const updates = {
        lastChangedKmMap: {
          ...config.lastChangedKmMap,
          [componentId]: km,
        },
      };

      // Se o km informado for maior que o odômetro atual, atualizar o odômetro da moto também
      if (km > config.currentOdometer) {
        updates.currentOdometer = km;
      }

      await updateConfig(updates);
    }
  };

  if (!config || !breakdown) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <OilInventoryCard
        config={config}
        breakdown={breakdown}
        onChangeConfig={updateConfig}
      />

      <WearHealthGrid
        config={config}
        breakdown={breakdown}
        onQuickLogService={handleQuickLogService}
      />

      <OfficialRevisionsCard
        currentOdometer={config.currentOdometer}
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
    gap: SPACING.lg,
    paddingBottom: SPACING.xxxl * 2,
  },
});
