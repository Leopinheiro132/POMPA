import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Edit2, Droplets, Plus, Minus, Check, X, Info, Sparkles } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function OilInventoryCard({ config, breakdown, onChangeConfig }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [stockInput, setStockInput] = useState('');

  if (!config || !breakdown) return null;

  const lastOilChangeKm = config.lastChangedKmMap?.oil || 0;
  const lastOilFilterKm = config.lastChangedKmMap?.oil_filter || 0;
  const currentKm = config.currentOdometer;

  // Próxima troca de óleo
  const nextOilChangeKm = lastOilChangeKm + config.oilChangeIntervalKm;
  const kmToOilChange = Math.max(0, nextOilChangeKm - currentKm);

  // Próxima troca de filtro
  const nextFilterChangeKm = lastOilFilterKm + config.oilFilterIntervalKm;

  // A próxima troca de óleo inclui filtro?
  const nextOilChangeWithFilter = nextOilChangeKm >= nextFilterChangeKm;

  // Litros necessários na próxima troca
  const litersNeeded = nextOilChangeWithFilter
    ? config.oilCapacityWithFilter
    : config.oilCapacityNoFilter;

  // Precisa comprar?
  const litersToFill = Math.max(0, litersNeeded - config.garageOilStockLiters);
  const bottlesToBuy = Math.ceil(litersToFill); // Vende de 1 em 1L
  const leftoverAfterChange = config.garageOilStockLiters + bottlesToBuy - litersNeeded;

  const handleOpenEditModal = () => {
    setStockInput(String(config.garageOilStockLiters));
    setModalVisible(true);
  };

  const handleSaveStock = (newStockValue) => {
    const val = parseFloat(newStockValue);
    if (isNaN(val) || val < 0) {
      Alert.alert('Erro', 'Digite uma quantidade de litros válida.');
      return;
    }

    if (onChangeConfig) {
      onChangeConfig({ garageOilStockLiters: val });
    }
    setModalVisible(false);
  };

  const handleQuickAdd = (delta) => {
    const current = parseFloat(stockInput) || 0;
    const updated = Math.max(0, parseFloat((current + delta).toFixed(2)));
    setStockInput(String(updated));
  };

  return (
    <Card>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>🛢️ Gestão de Óleo na Garagem</Text>
          <Text style={styles.subtitle}>Motul 20W50 Semi-Sintético • {formatCurrency(config.oilPricePerLiter)}/L</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={handleOpenEditModal}>
          <Edit2 size={14} color={COLORS.amber} />
          <Text style={styles.editBtnText}>Editar Sobra</Text>
        </TouchableOpacity>
      </View>

      {/* Estoque atual */}
      <View style={styles.stockRow}>
        <View style={styles.stockItem}>
          <Text style={styles.stockLabel}>Sobra na Garagem</Text>
          <Text style={[styles.stockValue, { color: COLORS.emerald }]}>
            {formatNumber(config.garageOilStockLiters, 1)} L
          </Text>
        </View>
        <View style={styles.stockItem}>
          <Text style={styles.stockLabel}>Próx. Troca em</Text>
          <Text style={[styles.stockValue, { color: kmToOilChange < 500 ? COLORS.red : COLORS.amber }]}>
            {formatNumber(kmToOilChange, 0)} km
          </Text>
        </View>
        <View style={styles.stockItem}>
          <Text style={styles.stockLabel}>Com Filtro?</Text>
          <Text style={[styles.stockValue, { color: nextOilChangeWithFilter ? COLORS.blue : COLORS.textMuted }]}>
            {nextOilChangeWithFilter ? 'Sim' : 'Não'}
          </Text>
        </View>
      </View>

      {/* Destaque de Economia com a Sobra */}
      {config.garageOilStockLiters > 0 && (
        <View style={styles.savingsBanner}>
          <Sparkles size={16} color={COLORS.emerald} />
          <Text style={styles.savingsText}>
            Você tem <Text style={{ fontWeight: '800', color: COLORS.emerald }}>{formatNumber(config.garageOilStockLiters, 1)} L</Text> guardados.
            {bottlesToBuy === 1 ? ' Comprará apenas 1 frasco na próxima troca!' : bottlesToBuy === 0 ? ' Não precisará comprar nenhum frasco na próxima troca!' : ''}
          </Text>
        </View>
      )}

      {/* Detalhes da próxima troca */}
      <View style={styles.nextChange}>
        <Text style={styles.nextTitle}>Próxima Troca ({formatNumber(nextOilChangeKm, 0)} km)</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Capacidade da moto</Text>
          <Text style={styles.detailValue}>{formatNumber(litersNeeded, 1)} L ({nextOilChangeWithFilter ? 'com filtro' : 'sem filtro'})</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sobra disponível na garagem</Text>
          <Text style={[styles.detailValue, { color: COLORS.emerald }]}>{formatNumber(config.garageOilStockLiters, 1)} L</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frascos de 1L a comprar</Text>
          <Text style={[styles.detailValue, { color: bottlesToBuy > 0 ? COLORS.amber : COLORS.emerald }]}>
            {bottlesToBuy > 0 ? `${bottlesToBuy} L (${formatCurrency(bottlesToBuy * config.oilPricePerLiter)})` : '0 L (Economia total!)'}
          </Text>
        </View>

        {nextOilChangeWithFilter && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>+ Filtro de Óleo</Text>
            <Text style={[styles.detailValue, { color: COLORS.blue }]}>
              {formatCurrency(config.oilFilterPrice)}
            </Text>
          </View>
        )}

        <View style={[styles.detailRow, styles.detailTotal]}>
          <Text style={styles.detailTotalLabel}>Nova sobra após essa troca</Text>
          <Text style={[styles.detailTotalValue, { color: COLORS.emeraldLight }]}>
            {formatNumber(leftoverAfterChange, 1)} L
          </Text>
        </View>
      </View>

      {/* Modal de Ajuste de Estoque de Sobra de Óleo */}
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
                <Text style={styles.modalTitle}>Sobra de Óleo na Garagem</Text>
                <Text style={{ color: COLORS.textMuted, fontSize: FONT_SIZE.xs }}>
                  Ajuste a quantidade guardada de trocas anteriores
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Input
                label="Quantidade em Estoque (Litros)"
                value={stockInput}
                onChangeText={setStockInput}
                keyboardType="numeric"
                placeholder="Ex: 0.8"
                suffix="L"
              />

              <Text style={styles.quickLabel}>Ajuste Rápido:</Text>
              <View style={styles.quickButtonsRow}>
                <TouchableOpacity style={styles.quickBtn} onPress={() => handleQuickAdd(0.2)}>
                  <Text style={styles.quickBtnText}>+ 0.2 L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => handleQuickAdd(0.4)}>
                  <Text style={styles.quickBtnText}>+ 0.4 L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickBtn} onPress={() => handleQuickAdd(0.8)}>
                  <Text style={styles.quickBtnText}>+ 0.8 L</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quickBtn, { borderColor: COLORS.red }]} onPress={() => setStockInput('0')}>
                  <Text style={[styles.quickBtnText, { color: COLORS.red }]}>Zerar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Cancelar"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: SPACING.sm }}
                />
                <Button
                  title="Salvar Estoque"
                  variant="primary"
                  onPress={() => handleSaveStock(stockInput)}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.amberBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
  },
  editBtnText: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.bg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stockItem: {
    alignItems: 'center',
  },
  stockLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  stockValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.emeraldBg || 'rgba(16,185,129,0.1)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.emerald + '40',
  },
  savingsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
  },
  nextChange: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  detailTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
  },
  detailTotalLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  detailTotalValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.bgModal || 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgCard || '#0f172a',
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
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  modalBody: {
    gap: SPACING.sm,
  },
  quickLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: SPACING.xs + 2,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  quickBtnText: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
