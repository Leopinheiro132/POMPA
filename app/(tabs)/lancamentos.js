import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaintenanceSpreadsheet } from '../../components/MaintenanceSpreadsheet';
import { useConfig } from '../../hooks/useConfig';
import { useLogs } from '../../hooks/useLogs';
import { COLORS, SPACING } from '../../constants/theme';

export default function LancamentosScreen() {
  const { config, updateConfig } = useConfig();
  const { logs, addLog, deleteLog } = useLogs();

  const handleAddLog = async (logData) => {
    await addLog(logData);

    // Atualizar odômetro se o novo log tem km maior
    if (config && logData.odometerKm > config.currentOdometer) {
      await updateConfig({ currentOdometer: logData.odometerKm });
    }

    // Se for troca de óleo, atualizar estoque
    if (logData.type === 'oil' && config) {
      const bought = logData.litersOilBought || 2;
      const used = logData.litersOilUsed || 1.2;
      const leftover = Math.max(0, bought - used);
      await updateConfig({
        garageOilStockLiters: config.garageOilStockLiters + leftover,
        lastChangedKmMap: {
          ...config.lastChangedKmMap,
          oil: logData.odometerKm,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaintenanceSpreadsheet
          logs={logs}
          onAddLog={handleAddLog}
          onDeleteLog={deleteLog}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
});
