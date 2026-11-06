import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Shield, Disc, Wrench, FileText, Sparkles, HelpCircle } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function EventualExpensesPlanner({ config, breakdown, onChangeConfig }) {
  // Calculadora de pinças de freio & manutenções eventuais
  const [frontCaliperRepair, setFrontCaliperRepair] = useState('180');
  const [rearCaliperRepair, setRearCaliperRepair] = useState('140');
  const [brakeFluidDot4, setBrakeFluidDot4] = useState('35');
  const [sparkPlugs3x, setSparkPlugs3x] = useState('110');
  const [clutchCable, setClutchCable] = useState('45');
  const [ipvaLicensing, setIpvaLicensing] = useState('380');

  if (!config || !breakdown) return null;

  const reservePerKm = config.emergencyReservePerKm || 0.05;
  const monthlyReserve = breakdown.monthlyReserveCost;
  const annualReserve = reservePerKm * (breakdown.annualKm || 14196);

  // Cálculos das manutenções eventuais
  const frontCaliperVal = parseFloat(frontCaliperRepair) || 0;
  const rearCaliperVal = parseFloat(rearCaliperRepair) || 0;
  const brakeFluidVal = parseFloat(brakeFluidDot4) || 0;
  const calipersTotal = frontCaliperVal + rearCaliperVal + brakeFluidVal;
  const calipersCostPerKm = calipersTotal / 20000;

  const sparkPlugsVal = parseFloat(sparkPlugs3x) || 0;
  const clutchCableVal = parseFloat(clutchCable) || 0;
  const ipvaVal = parseFloat(ipvaLicensing) || 0;
  const annualKm = breakdown.annualKm || 14196;
  const ipvaCostPerKm = ipvaVal / annualKm;
  const extraCostPerKm = (sparkPlugsVal / 15000) + (clutchCableVal / 12000) + ipvaCostPerKm + calipersCostPerKm;

  // Projeção de acumulação da reserva em 12 meses
  const months = [];
  let accumulated = 0;
  for (let i = 1; i <= 12; i++) {
    accumulated += monthlyReserve;
    months.push({ month: i, accumulated });
  }

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Shield size={20} color={COLORS.purple} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Pinças de Freio, Imprevistos & IPVA</Text>
          <Text style={styles.subtitle}>Calculadora de manutenção eventual e fundo de reserva</Text>
        </View>
      </View>

      {/* Banner de Reserva Sugerida */}
      <View style={styles.reserveBadge}>
        <Sparkles size={16} color={COLORS.amber} />
        <Text style={styles.reserveBadgeText}>
          Reserva Mensal Guardada: <Text style={{ color: COLORS.amber, fontWeight: '800' }}>{formatCurrency(monthlyReserve)}/mês</Text> ({formatCurrency(reservePerKm)}/km)
        </Text>
      </View>

      {/* Seção 1: Revisão de Pinças de Freio & Fluido DOT 4 */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionBoxHeader}>
          <Wrench size={16} color={COLORS.red} />
          <Text style={styles.sectionBoxTitle}>Revisão de Pinças de Freio (A cada 20.000 km)</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Pinça Dianteira (R$)"
              value={frontCaliperRepair}
              onChangeText={setFrontCaliperRepair}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Pinça Traseira (R$)"
              value={rearCaliperRepair}
              onChangeText={setRearCaliperRepair}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Input
          label="Fluido DOT 4 (Sangria/Troca R$)"
          value={brakeFluidDot4}
          onChangeText={setBrakeFluidDot4}
          keyboardType="numeric"
        />

        <View style={styles.summaryBar}>
          <Text style={styles.summaryBarLabel}>Total Pinças + Fluido:</Text>
          <Text style={styles.summaryBarValue}>
            {formatCurrency(calipersTotal)} <Text style={{ fontSize: 10, color: COLORS.textMuted }}>({formatCurrency(calipersCostPerKm)}/km)</Text>
          </Text>
        </View>
      </View>

      {/* Seção 2: Peças de Desgaste Ocasional & Documentação */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionBoxHeader}>
          <FileText size={16} color={COLORS.purple} />
          <Text style={styles.sectionBoxTitle}>Outros Imprevistos & Anuais</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="3x Velas DTS-i (R$)"
              value={sparkPlugs3x}
              onChangeText={setSparkPlugs3x}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Cabo Embreagem (R$)"
              value={clutchCable}
              onChangeText={setClutchCable}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Input
          label="IPVA / Licenciamento / DPVAT Anual (R$)"
          value={ipvaLicensing}
          onChangeText={setIpvaLicensing}
          keyboardType="numeric"
        />

        <View style={styles.summaryBar}>
          <Text style={styles.summaryBarLabel}>Impacto nos Eventuais por KM:</Text>
          <Text style={[styles.summaryBarValue, { color: COLORS.purple }]}>
            {formatCurrency(extraCostPerKm)} / km
          </Text>
        </View>
      </View>

      {/* Seção 3: Ajuste do Fundo de Reserva por KM */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionBoxTitle}>Ajustar Fundo de Reserva de Imprevistos</Text>
        <Input
          label="Reserva Guardada por KM (R$/km)"
          value={String(reservePerKm)}
          onChangeText={(v) => {
            const num = parseFloat(v) || 0;
            onChangeConfig({ emergencyReservePerKm: num });
          }}
          keyboardType="numeric"
          suffix="R$/km"
        />

        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiBoxLabel}>Reserva Mensal</Text>
            <Text style={[styles.kpiBoxValue, { color: COLORS.amber }]}>{formatCurrency(monthlyReserve)}</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiBoxLabel}>Reserva Anual</Text>
            <Text style={[styles.kpiBoxValue, { color: COLORS.emerald }]}>{formatCurrency(annualReserve)}</Text>
          </View>
        </View>
      </View>

      {/* Seção 4: Projeção de Acumulação */}
      <View style={styles.projectionBox}>
        <Text style={styles.projectionTitle}>Projeção de Acumulação da Reserva (12 meses)</Text>
        {months.map((m) => (
          <View key={m.month} style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Mês {m.month}</Text>
            <View style={styles.projectionBar}>
              <View
                style={[
                  styles.projectionFill,
                  { width: `${Math.min(100, (m.accumulated / (annualReserve || 1)) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.projectionValue}>{formatCurrency(m.accumulated)}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.purpleBg,
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
  reserveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.amberBg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
  },
  reserveBadgeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
  },
  sectionBox: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  sectionBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  sectionBoxTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgLight || '#1e293b',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
  },
  summaryBarLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  summaryBarValue: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.cardBgLight || '#1e293b',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  kpiBoxLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  kpiBoxValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginTop: 2,
  },
  projectionBox: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  projectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  projectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  projectionLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    width: 48,
  },
  projectionBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  projectionFill: {
    height: 6,
    backgroundColor: COLORS.emerald,
    borderRadius: 3,
  },
  projectionValue: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    width: 75,
    textAlign: 'right',
  },
});
