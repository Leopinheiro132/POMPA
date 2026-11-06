import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Droplets, Disc, CircleDot, Link2, Wind, X, Wrench, Clock, Calendar } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ProgressBar } from './ui/ProgressBar';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber, getWearPercentage, getKmRemaining } from '../utils/calculations';

const WEAR_ITEMS = [
  {
    id: 'oil',
    name: 'Óleo Motor',
    subtitle: 'Motul 20W50 Semi-Sintético',
    icon: Droplets,
    color: COLORS.amber,
    getLifespan: (c) => c.oilChangeIntervalKm,
    getCost: (c) => c.oilPricePerLiter * 2,
    logType: 'oil',
  },
  {
    id: 'oil_filter',
    name: 'Filtro de Óleo',
    subtitle: 'A cada 5.000 km',
    icon: Wind,
    color: COLORS.blue,
    getLifespan: (c) => c.oilFilterIntervalKm,
    getCost: (c) => c.oilFilterPrice,
    logType: 'oil_filter',
  },
  {
    id: 'tire_rear',
    name: 'Pneu Traseiro',
    subtitle: 'Pirelli 140/70-17',
    icon: Disc,
    color: COLORS.orange,
    getLifespan: (c) => c.pneuTraseiroLifespanKm,
    getCost: (c) => c.pneuTraseiroPrice,
    logType: 'tire_rear',
  },
  {
    id: 'tire_front',
    name: 'Pneu Dianteiro',
    subtitle: 'Pirelli 110/70-17',
    icon: Disc,
    color: COLORS.cyan,
    getLifespan: (c) => c.pneuDianteiroLifespanKm,
    getCost: (c) => c.pneuDianteiroPrice,
    logType: 'tire_front',
  },
  {
    id: 'brakes',
    name: 'Pastilhas de Freio',
    subtitle: 'Dianteira + Traseira + Fluido',
    icon: CircleDot,
    color: COLORS.red,
    getLifespan: (c) => c.pastilhasLifespanKm,
    getCost: (c) => c.pastilhasPincasCost,
    logType: 'brakes',
  },
  {
    id: 'chain',
    name: 'Kit Relação',
    subtitle: 'Coroa + Pinhão + Corrente',
    icon: Link2,
    color: COLORS.purple,
    getLifespan: (c) => c.relacaoLifespanKm,
    getCost: (c) => c.relacaoCost,
    logType: 'chain',
  },
];

export function WearHealthGrid({ config, breakdown, onQuickLogService }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    odometerKm: '',
    totalCost: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!config) return null;

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    const estimatedCost = item.getCost(config);
    setForm({
      odometerKm: String(config.currentOdometer),
      totalCost: String(estimatedCost.toFixed(2)),
      date: new Date().toISOString().split('T')[0],
    });
    setModalVisible(true);
  };

  const handleConfirmLog = () => {
    if (!form.odometerKm || isNaN(parseFloat(form.odometerKm))) {
      Alert.alert('Erro', 'Digite um valor válido para a quilometragem.');
      return;
    }

    const customKm = parseFloat(form.odometerKm);
    const customCost = parseFloat(form.totalCost) || selectedItem.getCost(config);

    if (onQuickLogService) {
      onQuickLogService(selectedItem.name, customCost, selectedItem.logType, customKm);
    }
    setModalVisible(false);
  };

  return (
    <Card>
      <Text style={styles.title}>🛠️ Saúde das Peças & Desgaste</Text>
      <Text style={styles.subtitle}>
        Acompanhe a vida útil estimada e registre trocas com qualquer quilometragem
      </Text>

      <View style={styles.grid}>
        {WEAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const lifespanKm = item.getLifespan(config);
          const lastChangedKm = config.lastChangedKmMap?.[item.id] || 0;
          const wearPct = getWearPercentage(config.currentOdometer, lastChangedKm, lifespanKm);
          const kmRemaining = getKmRemaining(config.currentOdometer, lastChangedKm, lifespanKm);
          const isCritical = wearPct >= 80;

          return (
            <View key={item.id} style={styles.wearItemBox}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                  <Icon size={18} color={item.color} />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              <ProgressBar
                progress={wearPct}
                color={isCritical ? COLORS.red : item.color}
                style={styles.progress}
              />

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {wearPct.toFixed(0)}% desgastado
                </Text>
                <Text style={[styles.metaText, isCritical && styles.criticalText]}>
                  {kmRemaining <= 0 ? 'SUBSTITUIR!' : `${formatNumber(kmRemaining, 0)} km restantes`}
                </Text>
              </View>

              <Button
                title="Registrar Troca / Retroativo"
                variant="outline"
                size="sm"
                onPress={() => handleOpenModal(item)}
                style={styles.actionBtn}
              />
            </View>
          );
        })}
      </View>

      {/* Modal de Registro de Troca Retroativa */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {selectedItem ? `Registrar Troca: ${selectedItem.name}` : 'Registrar Troca'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Troca realizada hoje ou lançamento retroativo com KM específico
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Quilometragem da Troca (KM)"
              value={form.odometerKm}
              onChangeText={(v) => setForm({ ...form, odometerKm: v })}
              keyboardType="numeric"
              placeholder="Ex: 12500"
              suffix="km"
            />

            <Input
              label="Valor Pago / Custo (R$)"
              value={form.totalCost}
              onChangeText={(v) => setForm({ ...form, totalCost: v })}
              keyboardType="numeric"
              placeholder="Ex: 88.00"
              prefix="R$"
            />

            <Input
              label="Data da Manutenção"
              value={form.date}
              onChangeText={(v) => setForm({ ...form, date: v })}
              placeholder="YYYY-MM-DD"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                variant="ghost"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="Salvar Serviço"
                variant="primary"
                onPress={handleConfirmLog}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  grid: {
    gap: SPACING.md,
  },
  wearItemBox: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  itemName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  progress: {
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  criticalText: {
    color: COLORS.red,
    fontWeight: '700',
  },
  actionBtn: {
    marginTop: SPACING.xs,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.bgModal,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
});
