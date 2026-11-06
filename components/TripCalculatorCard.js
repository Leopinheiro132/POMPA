import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Compass, Fuel, DollarSign, MapPin, Sparkles, Navigation } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function TripCalculatorCard({ config }) {
  const [tripDistanceKm, setTripDistanceKm] = useState('350');
  const [tollsCost, setTollsCost] = useState('45');

  if (!config) return null;

  const distance = parseFloat(tripDistanceKm) || 0;
  const tolls = parseFloat(tollsCost) || 0;
  const kml = config.fuelEfficiency || 30;
  const fuelPrice = config.fuelPrice || 6.85;

  // Cálculos de viagem
  const litersNeeded = distance / kml;
  const fuelCost = litersNeeded * fuelPrice;
  const tankCapacity = 12;
  const tankRange = tankCapacity * kml; // ~360 km
  const stopsNeeded = Math.floor(distance / (tankRange * 0.8)); // Paradas aos 80% do tanque (~280km)

  // Custo por km total com peças
  const costPerKm = (config.fuelPrice / kml) + 0.15; // Estimativa de peças acumuladas por km
  const totalTripCost = (distance * costPerKm) + tolls;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Compass size={20} color={COLORS.amber} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>🗺️ Calculadora de Viagem & Rodovia</Text>
          <Text style={styles.subtitle}>Planeje rolês e viagens com custo real por KM</Text>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.halfWidth}>
          <Input
            label="Distância da Viagem (km)"
            value={tripDistanceKm}
            onChangeText={setTripDistanceKm}
            keyboardType="numeric"
            placeholder="Ex: 350"
            suffix="km"
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="Pedágios Estimados (R$)"
            value={tollsCost}
            onChangeText={setTollsCost}
            keyboardType="numeric"
            placeholder="Ex: 45"
            prefix="R$"
          />
        </View>
      </View>

      {/* Resultados da Viagem */}
      <View style={styles.resultsGrid}>
        <View style={styles.resultBox}>
          <Fuel size={16} color={COLORS.emerald} />
          <Text style={styles.resultLabel}>Combustível</Text>
          <Text style={[styles.resultValue, { color: COLORS.emerald }]}>
            {formatNumber(litersNeeded, 1)} L
          </Text>
          <Text style={styles.resultSub}>{formatCurrency(fuelCost)}</Text>
        </View>

        <View style={styles.resultBox}>
          <Navigation size={16} color={COLORS.cyan} />
          <Text style={styles.resultLabel}>Paradas de Posto</Text>
          <Text style={[styles.resultValue, { color: COLORS.cyan }]}>
            {stopsNeeded > 0 ? `${stopsNeeded} ${stopsNeeded === 1 ? 'parada' : 'paradas'}` : 'Nenhuma'}
          </Text>
          <Text style={styles.resultSub}>Cada ~280 km</Text>
        </View>

        <View style={styles.resultBox}>
          <DollarSign size={16} color={COLORS.amber} />
          <Text style={styles.resultLabel}>Custo Total</Text>
          <Text style={[styles.resultValue, { color: COLORS.amber }]}>
            {formatCurrency(totalTripCost)}
          </Text>
          <Text style={styles.resultSub}>Gasolina + Pedágio + Peças</Text>
        </View>
      </View>

      <View style={styles.tipBanner}>
        <Sparkles size={14} color={COLORS.amber} />
        <Text style={styles.tipText}>
          Dica para viagens longas: Abasteça a cada <Text style={{ fontWeight: '800', color: COLORS.amber }}>250 - 280 km</Text> para evitar entrar na reserva do tanque da NS 200.
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.amberBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  resultsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.md,
  },
  resultBox: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  resultLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  resultValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginTop: 2,
  },
  resultSub: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.amberBg,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  tipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
  },
});
