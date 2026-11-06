import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, Gauge, Wrench } from 'lucide-react-native';
import { ExecutiveHeaderWidget } from '../../components/ExecutiveHeaderWidget';
import { KPICards } from '../../components/KPICards';
import { RouteCalculator } from '../../components/RouteCalculator';
import { FinancialCharts } from '../../components/FinancialCharts';
import { TripCalculatorCard } from '../../components/TripCalculatorCard';
import { RidingStyleSimulatorCard } from '../../components/RidingStyleSimulatorCard';
import { RevisionScheduleCard } from '../../components/RevisionScheduleCard';
import { WearHealthGrid } from '../../components/WearHealthGrid';
import { useConfig } from '../../hooks/useConfig';
import { useLogs } from '../../hooks/useLogs';
import { calculateBreakdown } from '../../utils/calculations';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

export default function DashboardScreen() {
  const { config, loading: configLoading, updateConfig, updateRoutes, reloadConfig } = useConfig();
  const { logs, addLog, reloadLogs } = useLogs();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const breakdown = config ? calculateBreakdown(config) : null;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reloadConfig();
    await reloadLogs();
    setRefreshing(false);
  }, []);

  const handleQuickLogService = async (serviceName, cost, type, customKm) => {
    const serviceKm = customKm || config.currentOdometer;
    const logData = {
      date: new Date().toISOString().split('T')[0],
      odometerKm: serviceKm,
      type: type,
      description: `Troca/Serviço: ${serviceName}`,
      totalCost: cost,
    };
    await addLog(logData);

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
      await updateConfig({
        lastChangedKmMap: {
          ...config.lastChangedKmMap,
          [componentId]: serviceKm,
        },
      });
    }
  };

  if (configLoading || !config || !breakdown) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.amber}
          colors={[COLORS.amber]}
        />
      }
    >
      {/* Executive Rider Header & Hero Card TCO */}
      <ExecutiveHeaderWidget
        config={config}
        breakdown={breakdown}
        onOpenOdometer={() => router.push('/odometro')}
        onOpenSettings={() => router.push('/configuracoes')}
      />

      {/* KPI Cards */}
      <KPICards config={config} breakdown={breakdown} />

      {/* Route Calculator */}
      <RouteCalculator
        config={config}
        breakdown={breakdown}
        onChangeRoutes={updateRoutes}
      />

      {/* Trip Calculator */}
      <TripCalculatorCard config={config} />

      {/* Riding Style Simulator */}
      <RidingStyleSimulatorCard config={config} breakdown={breakdown} />

      {/* Financial Charts & Cost Distribution */}
      <FinancialCharts
        config={config}
        breakdown={breakdown}
      />

      {/* Revision Schedule */}
      <View style={styles.section}>
        <RevisionScheduleCard
          config={config}
          breakdown={breakdown}
          onQuickLogService={handleQuickLogService}
        />
      </View>

      {/* Wear Health */}
      <View style={styles.section}>
        <WearHealthGrid
          config={config}
          breakdown={breakdown}
          onQuickLogService={handleQuickLogService}
        />
      </View>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.lg,
  },
});
