import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { Gauge, Navigation, Zap } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useConfig } from '../hooks/useConfig';
import { saveOdometerReading, getOdometerReadings } from '../services/database';
import { formatNumber } from '../utils/calculations';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { TRACKING_MODES } from '../constants/types';

export default function OdometroScreen() {
  const { config, updateConfig } = useConfig();
  const [manualKm, setManualKm] = useState('');
  const [readings, setReadings] = useState([]);
  const [trackingActive, setTrackingActive] = useState(false);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      const data = await getOdometerReadings(30);
      setReadings(data);
    } catch (err) {
      console.error('Erro ao carregar leituras:', err);
    }
  };

  const handleManualInput = async () => {
    const km = parseFloat(manualKm);
    if (isNaN(km) || km <= 0) {
      Alert.alert('Erro', 'Insira um valor válido de km.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    await saveOdometerReading(today, 0, km, 'manual');
    await updateConfig({ currentOdometer: km });
    await loadReadings();

    Alert.alert('✅ Odômetro Atualizado', `Km registrado: ${formatNumber(km, 0)} km`);
    setManualKm('');
  };

  const trackingMode = config?.trackingMode || 'off';

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'accelerometer': return '📱 Acelerômetro (Econômico)';
      case 'gps': return '📍 GPS (Preciso)';
      default: return '⏸️ Desligado';
    }
  };

  const getModeDescription = (mode) => {
    switch (mode) {
      case 'accelerometer':
        return 'Usa o acelerômetro do celular para estimar distância. Menor consumo de bateria, mas menor precisão. Threshold: ~12 km/h.';
      case 'gps':
        return 'Usa GPS para rastrear distância com alta precisão. Consome mais bateria.';
      default:
        return 'Rastreamento automático desativado. Use a entrada manual para registrar km.';
    }
  };

  if (!config) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Odômetro principal */}
      <Card style={styles.mainCard}>
        <View style={styles.odometerDisplay}>
          <Gauge size={32} color={COLORS.amber} />
          <Text style={styles.odometerValue}>
            {formatNumber(config.currentOdometer, 0)}
          </Text>
          <Text style={styles.odometerUnit}>km</Text>
        </View>
        <Text style={styles.odometerLabel}>Odômetro Atual</Text>
      </Card>

      {/* Entrada Manual */}
      <Card>
        <Text style={styles.sectionTitle}>📝 Entrada Manual</Text>
        <Text style={styles.sectionSubtitle}>
          Insira o km real lido no painel da moto
        </Text>

        <View style={styles.manualRow}>
          <View style={{ flex: 1 }}>
            <Input
              value={manualKm}
              onChangeText={setManualKm}
              keyboardType="numeric"
              placeholder="Ex: 13200"
              suffix="km"
            />
          </View>
          <Button
            title="Salvar"
            variant="primary"
            size="md"
            onPress={handleManualInput}
            style={{ marginLeft: SPACING.md, marginBottom: SPACING.md }}
          />
        </View>
      </Card>

      {/* Modo de Rastreamento */}
      <Card>
        <Text style={styles.sectionTitle}>🎯 Modo de Rastreamento</Text>
        <Text style={styles.sectionSubtitle}>
          {getModeDescription(trackingMode)}
        </Text>

        <View style={styles.modeOptions}>
          {[
            { mode: 'off', label: 'Desligado', icon: '⏸️' },
            { mode: 'accelerometer', label: 'Acelerômetro', icon: '📱' },
            { mode: 'gps', label: 'GPS', icon: '📍' },
          ].map((option) => (
            <TouchableOpacityMode
              key={option.mode}
              option={option}
              isActive={trackingMode === option.mode}
              onPress={async () => {
                await updateConfig({ trackingMode: option.mode });
              }}
            />
          ))}
        </View>

        {trackingMode === 'accelerometer' && (
          <View style={styles.thresholdConfig}>
            <Input
              label="Threshold de velocidade (km/h)"
              value={String(config.accelerometerThresholdKmh || 12)}
              onChangeText={(v) => {
                const num = parseFloat(v) || 12;
                updateConfig({ accelerometerThresholdKmh: num });
              }}
              keyboardType="numeric"
              suffix="km/h"
            />
            <Text style={styles.thresholdHint}>
              Só começa a contar km quando a velocidade estimada ultrapassar esse valor
            </Text>
          </View>
        )}
      </Card>

      {/* Histórico de Leituras */}
      <Card>
        <Text style={styles.sectionTitle}>📊 Últimas Leituras</Text>

        {readings.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma leitura registrada.</Text>
        ) : (
          readings.slice(0, 10).map((reading, index) => (
            <View key={index} style={styles.readingItem}>
              <Text style={styles.readingDate}>{reading.date}</Text>
              <Text style={styles.readingSource}>
                {reading.source === 'manual' ? '📝' : reading.source === 'gps' ? '📍' : '📱'}
              </Text>
              <Text style={styles.readingKm}>
                {formatNumber(reading.km_manual || reading.km_estimated, 0)} km
              </Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

function TouchableOpacityMode({ option, isActive, onPress }) {
  const { TouchableOpacity } = require('react-native');

  return (
    <TouchableOpacity
      style={[styles.modeOption, isActive && styles.modeOptionActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.modeIcon}>{option.icon}</Text>
      <Text style={[styles.modeLabel, isActive && styles.modeLabelActive]}>
        {option.label}
      </Text>
    </TouchableOpacity>
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
  mainCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  odometerDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  odometerValue: {
    color: COLORS.amber,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  odometerUnit: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
  },
  odometerLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeOptionActive: {
    borderColor: COLORS.amber,
    backgroundColor: COLORS.amberBg,
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  modeLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  modeLabelActive: {
    color: COLORS.amber,
  },
  thresholdConfig: {
    marginTop: SPACING.sm,
  },
  thresholdHint: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: -SPACING.sm,
    lineHeight: 16,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  readingDate: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  readingSource: {
    fontSize: 14,
    marginHorizontal: SPACING.sm,
  },
  readingKm: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
