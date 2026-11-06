import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, ScrollView } from 'react-native';
import { Plus, Fuel, Droplets, Wrench, X, Sparkles, Filter } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ExpenseCard } from './ui/ExpenseCard';
import { FloatingActionButton } from './ui/FloatingActionButton';
import { EmptyState } from './ui/EmptyState';
import { FilterChips } from './ui/FilterChips';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { EXPENSE_TYPE_LABELS } from '../constants/types';
import { formatCurrency, formatNumber } from '../utils/calculations';

export function MaintenanceSpreadsheet({ logs, onAddLog, onDeleteLog }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    odometerKm: '',
    type: 'gas',
    description: '',
    totalCost: '',
    litersFuel: '',
    litersOilBought: '',
    litersOilUsed: '',
    kmSinceLastRefill: '',
  });

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      odometerKm: '',
      type: 'gas',
      description: '',
      totalCost: '',
      litersFuel: '',
      litersOilBought: '',
      litersOilUsed: '',
      kmSinceLastRefill: '',
    });
  };

  const handleOpenNewModal = (type = 'gas') => {
    resetForm();
    setForm((prev) => ({
      ...prev,
      type: type,
      description: type === 'gas' ? 'Abastecimento Completo' : '',
    }));
    setModalVisible(true);
  };

  // Cálculo de médias em tempo real no formulário
  const litersNum = parseFloat(form.litersFuel) || 0;
  const tripNum = parseFloat(form.kmSinceLastRefill) || 0;
  const costNum = parseFloat(form.totalCost) || 0;

  const liveKmPerLiter = litersNum > 0 && tripNum > 0 ? (tripNum / litersNum) : null;
  const livePricePerLiter = litersNum > 0 && costNum > 0 ? (costNum / litersNum) : null;
  const liveCostPerKm = tripNum > 0 && costNum > 0 ? (costNum / tripNum) : null;

  const handleSubmit = () => {
    if (!form.odometerKm || !form.totalCost) {
      Alert.alert('Erro', 'Preencha odômetro e custo total.');
      return;
    }

    const liters = form.litersFuel ? parseFloat(form.litersFuel) : null;
    const trip = form.kmSinceLastRefill ? parseFloat(form.kmSinceLastRefill) : null;
    const kml = liters && trip ? trip / liters : null;

    let desc = form.description;
    if (!desc && form.type === 'gas') {
      desc = `Abastecimento: ${liters ? liters + 'L' : ''} • ${trip ? trip + 'km' : ''} ${kml ? '(' + kml.toFixed(1) + ' km/L)' : ''}`;
    }

    const logData = {
      date: form.date,
      odometerKm: parseFloat(form.odometerKm),
      type: form.type,
      description: desc || 'Lançamento',
      totalCost: parseFloat(form.totalCost),
      litersFuel: liters,
      litersOilBought: form.litersOilBought ? parseFloat(form.litersOilBought) : null,
      litersOilUsed: form.litersOilUsed ? parseFloat(form.litersOilUsed) : null,
      kmSinceLastRefill: trip,
      calculatedKmPerLiter: kml,
    };

    onAddLog(logData);
    resetForm();
    setModalVisible(false);
  };

  const handleDelete = (id, description) => {
    Alert.alert(
      'Excluir Lançamento',
      `Deseja excluir "${description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDeleteLog(id) },
      ]
    );
  };

  const filterOptions = [
    { label: 'Todos os Lançamentos', value: 'all' },
    { label: '⛽ Gasolina', value: 'gas' },
    { label: '🛢️ Óleo / Filtro', value: 'oil' },
    { label: '⚙️ Peças & Pneus', value: 'brakes' },
    { label: '🛡️ Imprevistos', value: 'eventual' },
  ];

  const filteredLogs = logs.filter((l) => {
    if (filterType === 'all') return true;
    if (filterType === 'gas') return l.type === 'gas';
    if (filterType === 'oil') return l.type === 'oil' || l.type === 'oil_filter';
    if (filterType === 'brakes') return l.type === 'brakes' || l.type === 'tire_rear' || l.type === 'tire_front' || l.type === 'chain';
    return l.type === 'eventual' || l.type === 'other';
  });

  const typeOptions = Object.entries(EXPENSE_TYPE_LABELS);

  return (
    <View style={styles.container}>
      {/* Botão Grande Prominente ABASTECER no Topo */}
      <TouchableOpacity
        style={styles.heroRefuelBtn}
        onPress={() => handleOpenNewModal('gas')}
        activeOpacity={0.85}
      >
        <View style={styles.heroRefuelIconBox}>
          <Fuel size={24} color="#ffffff" />
        </View>
        <View style={styles.heroRefuelTextBox}>
          <Text style={styles.heroRefuelTitle}>⛽ Novo Abastecimento</Text>
          <Text style={styles.heroRefuelSub}>Registre bomba, trip do painel e valor pago</Text>
        </View>
        <Plus size={20} color="#ffffff" />
      </TouchableOpacity>

      {/* Filtros por Categoria */}
      <FilterChips
        options={filterOptions}
        selected={filterType}
        onSelect={setFilterType}
      />

      <FlatList
        data={filteredLogs}
        renderItem={({ item }) => <ExpenseCard item={item} onDelete={handleDelete} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum lançamento encontrado"
            description="Toque no botão Abastecer ou no botão + para adicionar."
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      <FloatingActionButton
        onPress={() => handleOpenNewModal('gas')}
        label="Novo"
      />

      {/* Modal Bottom Sheet de Lançamento */}
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
                  {form.type === 'gas' ? '⛽ Registrar Abastecimento' : 'Novo Lançamento'}
                </Text>
                <Text style={styles.modalSub}>
                  {form.type === 'gas' ? 'Informe bomba, trip do painel e odômetro' : 'Registre despesas e manutenções'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Seletor de Tipo */}
              <Text style={styles.fieldLabel}>Tipo de Registro</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
                {typeOptions.map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.typeOption,
                      form.type === key && styles.typeOptionActive,
                    ]}
                    onPress={() => setForm({ ...form, type: key })}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      form.type === key && styles.typeOptionTextActive,
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Formulário de Abastecimento */}
              {form.type === 'gas' ? (
                <View style={styles.gasFormBox}>
                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <Input
                        label="Litros na Bomba (L)"
                        value={form.litersFuel}
                        onChangeText={(v) => setForm({ ...form, litersFuel: v })}
                        keyboardType="numeric"
                        placeholder="Ex: 9.0"
                        suffix="L"
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <Input
                        label="Trip / KM Parcial (km)"
                        value={form.kmSinceLastRefill}
                        onChangeText={(v) => setForm({ ...form, kmSinceLastRefill: v })}
                        keyboardType="numeric"
                        placeholder="Ex: 270"
                        suffix="km"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <Input
                        label="Valor Pago (R$)"
                        value={form.totalCost}
                        onChangeText={(v) => setForm({ ...form, totalCost: v })}
                        keyboardType="numeric"
                        placeholder="Ex: 61.65"
                        prefix="R$"
                      />
                    </View>
                    <View style={styles.halfWidth}>
                      <Input
                        label="Odômetro Moto (km)"
                        value={form.odometerKm}
                        onChangeText={(v) => setForm({ ...form, odometerKm: v })}
                        keyboardType="numeric"
                        placeholder="Ex: 12500"
                        suffix="km"
                      />
                    </View>
                  </View>

                  {/* Painel de Cálculo em Tempo Real */}
                  {(liveKmPerLiter || livePricePerLiter || liveCostPerKm) && (
                    <View style={styles.liveCalculationBox}>
                      <View style={styles.liveHeader}>
                        <Sparkles size={14} color={COLORS.secondary} />
                        <Text style={styles.liveTitle}>Cálculos em Tempo Real do Tanque</Text>
                      </View>
                      <View style={styles.liveRow}>
                        {liveKmPerLiter && (
                          <View style={styles.liveItem}>
                            <Text style={styles.liveLabel}>Consumo</Text>
                            <Text style={[styles.liveValue, { color: COLORS.secondary }]}>
                              {formatNumber(liveKmPerLiter, 1)} km/L
                            </Text>
                          </View>
                        )}
                        {livePricePerLiter && (
                          <View style={styles.liveItem}>
                            <Text style={styles.liveLabel}>Preço/Litro</Text>
                            <Text style={[styles.liveValue, { color: COLORS.amber }]}>
                              {formatCurrency(livePricePerLiter)}/L
                            </Text>
                          </View>
                        )}
                        {liveCostPerKm && (
                          <View style={styles.liveItem}>
                            <Text style={styles.liveLabel}>Custo/KM</Text>
                            <Text style={[styles.liveValue, { color: COLORS.primary }]}>
                              {formatCurrency(liveCostPerKm)}/km
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  <Input
                    label="Descrição (Opcional)"
                    value={form.description}
                    onChangeText={(v) => setForm({ ...form, description: v })}
                    placeholder="Ex: Abastecimento Aditivada Shell"
                  />
                </View>
              ) : (
                <>
                  <Input
                    label="Data"
                    value={form.date}
                    onChangeText={(v) => setForm({ ...form, date: v })}
                    placeholder="YYYY-MM-DD"
                  />

                  <Input
                    label="Odômetro (km)"
                    value={form.odometerKm}
                    onChangeText={(v) => setForm({ ...form, odometerKm: v })}
                    keyboardType="numeric"
                    placeholder="Ex: 12500"
                  />

                  <Input
                    label="Descrição"
                    value={form.description}
                    onChangeText={(v) => setForm({ ...form, description: v })}
                    placeholder="Descrição da manutenção"
                  />

                  <Input
                    label="Custo Total (R$)"
                    value={form.totalCost}
                    onChangeText={(v) => setForm({ ...form, totalCost: v })}
                    keyboardType="numeric"
                    placeholder="Ex: 120.00"
                    prefix="R$"
                  />
                </>
              )}

              <View style={styles.modalActions}>
                <Button
                  title="Cancelar"
                  variant="ghost"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1, marginRight: SPACING.sm }}
                />
                <Button
                  title="Salvar Lançamento"
                  variant="primary"
                  onPress={handleSubmit}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroRefuelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  heroRefuelIconBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  heroRefuelTextBox: {
    flex: 1,
  },
  heroRefuelTitle: {
    color: '#ffffff',
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  heroRefuelSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  list: {
    flex: 1,
  },

  // Bottom Sheet Modal
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
    maxHeight: '90%',
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
  modalSub: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  typeSelector: {
    marginBottom: SPACING.md,
  },
  typeOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.bgInput,
  },
  typeOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  typeOptionTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  gasFormBox: {
    gap: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  liveCalculationBox: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  liveTitle: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  liveRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  liveItem: {
    alignItems: 'center',
  },
  liveLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  liveValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
});
