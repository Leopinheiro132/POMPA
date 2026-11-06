import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Switch } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Download, Upload, RotateCcw, Bell } from 'lucide-react-native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useConfig } from '../hooks/useConfig';
import { exportAllData, importData } from '../services/database';
import { scheduleAllNotifications, cancelAllNotifications } from '../services/notifications';
import { formatCurrency } from '../utils/calculations';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

export default function ConfiguracoesScreen() {
  const { config, updateConfig, resetConfig } = useConfig();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!config) return null;

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `controle_gastos_moto_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Backup',
        });
      }

      Alert.alert('✅ Exportado', 'Backup salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao exportar:', err);
      Alert.alert('❌ Erro', 'Não foi possível exportar os dados.');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const jsonString = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(jsonString);

      Alert.alert(
        'Importar Backup',
        'Isso irá substituir TODOS os dados atuais. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Importar',
            style: 'destructive',
            onPress: async () => {
              await importData(data);
              Alert.alert('✅ Importado', 'Dados restaurados com sucesso! Reinicie o app.');
            },
          },
        ]
      );
    } catch (err) {
      console.error('Erro ao importar:', err);
      Alert.alert('❌ Erro', 'Arquivo inválido ou corrompido.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Restaurar Padrões',
      'Deseja restaurar TODAS as configurações para os valores padrão da NS 200?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await resetConfig();
            Alert.alert('✅ Restaurado', 'Configurações restauradas para o padrão.');
          },
        },
      ]
    );
  };

  const handleToggleNotifications = async (enabled) => {
    setNotificationsEnabled(enabled);
    if (enabled) {
      await scheduleAllNotifications(config);
      Alert.alert('🔔 Notificações', 'Notificações ativadas!');
    } else {
      await cancelAllNotifications();
      Alert.alert('🔕 Notificações', 'Notificações desativadas.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Dados da Moto */}
      <Card>
        <Text style={styles.sectionTitle}>🏍️ Dados da Moto</Text>

        <Input
          label="Nome da Moto"
          value={config.motoName}
          onChangeText={(v) => updateConfig({ motoName: v })}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Preço Gasolina (R$/L)"
              value={String(config.fuelPrice)}
              onChangeText={(v) => updateConfig({ fuelPrice: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Consumo (km/L)"
              value={String(config.fuelEfficiency)}
              onChangeText={(v) => updateConfig({ fuelEfficiency: parseFloat(v) || 1 })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </Card>

      {/* Preços de Peças */}
      <Card>
        <Text style={styles.sectionTitle}>💰 Preços de Peças</Text>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Óleo (R$/L)"
              value={String(config.oilPricePerLiter)}
              onChangeText={(v) => updateConfig({ oilPricePerLiter: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Filtro de Óleo (R$)"
              value={String(config.oilFilterPrice)}
              onChangeText={(v) => updateConfig({ oilFilterPrice: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Pneu Traseiro (R$)"
              value={String(config.pneuTraseiroPrice)}
              onChangeText={(v) => updateConfig({ pneuTraseiroPrice: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Pneu Dianteiro (R$)"
              value={String(config.pneuDianteiroPrice)}
              onChangeText={(v) => updateConfig({ pneuDianteiroPrice: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Pastilhas/Pinças (R$)"
              value={String(config.pastilhasPincasCost)}
              onChangeText={(v) => updateConfig({ pastilhasPincasCost: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Kit Relação (R$)"
              value={String(config.relacaoCost)}
              onChangeText={(v) => updateConfig({ relacaoCost: parseFloat(v) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Input
          label="Revisão 5.000km (R$)"
          value={String(config.periodicRevisionAverageCost)}
          onChangeText={(v) => updateConfig({ periodicRevisionAverageCost: parseFloat(v) || 0 })}
          keyboardType="numeric"
        />
      </Card>

      {/* Intervalos de Troca */}
      <Card>
        <Text style={styles.sectionTitle}>🔄 Intervalos de Troca (km)</Text>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Óleo"
              value={String(config.oilChangeIntervalKm)}
              onChangeText={(v) => updateConfig({ oilChangeIntervalKm: parseFloat(v) || 2500 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Filtro de Óleo"
              value={String(config.oilFilterIntervalKm)}
              onChangeText={(v) => updateConfig({ oilFilterIntervalKm: parseFloat(v) || 5000 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Pneu Traseiro"
              value={String(config.pneuTraseiroLifespanKm)}
              onChangeText={(v) => updateConfig({ pneuTraseiroLifespanKm: parseFloat(v) || 12000 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Pneu Dianteiro"
              value={String(config.pneuDianteiroLifespanKm)}
              onChangeText={(v) => updateConfig({ pneuDianteiroLifespanKm: parseFloat(v) || 18000 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Pastilhas"
              value={String(config.pastilhasLifespanKm)}
              onChangeText={(v) => updateConfig({ pastilhasLifespanKm: parseFloat(v) || 10000 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Kit Relação"
              value={String(config.relacaoLifespanKm)}
              onChangeText={(v) => updateConfig({ relacaoLifespanKm: parseFloat(v) || 15000 })}
              keyboardType="numeric"
              suffix="km"
            />
          </View>
        </View>
      </Card>

      {/* Toggles */}
      <Card>
        <Text style={styles.sectionTitle}>⚙️ Preferências</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Notificações</Text>
            <Text style={styles.toggleDesc}>Avisos de troca, fim de mês, odômetro</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.amber }}
            thumbColor={notificationsEnabled ? COLORS.amberLight : COLORS.textMuted}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Busca Automática de Preços</Text>
            <Text style={styles.toggleDesc}>Buscar preços no Wi-Fi quando cache expirado</Text>
          </View>
          <Switch
            value={config.autoSearchPricesOnWifi}
            onValueChange={(v) => updateConfig({ autoSearchPricesOnWifi: v })}
            trackColor={{ false: COLORS.border, true: COLORS.amber }}
            thumbColor={config.autoSearchPricesOnWifi ? COLORS.amberLight : COLORS.textMuted}
          />
        </View>
      </Card>

      {/* Backup */}
      <Card>
        <Text style={styles.sectionTitle}>💾 Backup de Dados</Text>

        <Button
          title="Exportar Backup (JSON)"
          variant="primary"
          size="lg"
          icon={<Download size={16} color={COLORS.textDark} />}
          onPress={handleExport}
          style={styles.actionButton}
        />

        <Button
          title="Importar Backup"
          variant="outline"
          size="lg"
          icon={<Upload size={16} color={COLORS.amber} />}
          onPress={handleImport}
          style={styles.actionButton}
        />

        <Button
          title="Restaurar Padrões"
          variant="danger"
          size="lg"
          icon={<RotateCcw size={16} color="#fff" />}
          onPress={handleReset}
          style={styles.actionButton}
        />
      </Card>
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
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  toggleDesc: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
});
