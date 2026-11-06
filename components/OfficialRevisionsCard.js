import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Wrench, Calendar, CheckCircle2, ChevronRight, Info, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Card } from './ui/Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { BAJAJ_OFFICIAL_REVISIONS, BAJAJ_PARTS_SCHEDULE } from '../data/defaultConfig';

export function OfficialRevisionsCard({ currentOdometer = 0 }) {
  const [activeTab, setActiveTab] = useState('revisions'); // 'revisions' | 'parts'

  // Encontrar próxima revisão oficial
  const nextRevision = BAJAJ_OFFICIAL_REVISIONS.find((r) => r.km > currentOdometer) || BAJAJ_OFFICIAL_REVISIONS[BAJAJ_OFFICIAL_REVISIONS.length - 1];
  const kmToNextRevision = Math.max(0, nextRevision.km - currentOdometer);

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconContainer}>
          <ShieldCheck size={20} color={COLORS.amber} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Plano Oficial Bajaj — NS 200</Text>
          <Text style={styles.subtitle}>Revisões Periódicas e Quilometragem de Peças</Text>
        </View>
      </View>

      {/* Destaque Próxima Revisão */}
      <View style={styles.nextRevisionBadge}>
        <View style={styles.nextRevisionHeader}>
          <Sparkles size={16} color={COLORS.amber} />
          <Text style={styles.nextRevisionTitle}>Próxima Revisão Concessionária</Text>
        </View>
        <View style={styles.nextRevisionContent}>
          <View>
            <Text style={styles.nextRevisionKm}>{formatNumber(nextRevision.km, 0)} km ({nextRevision.months} meses)</Text>
            <Text style={styles.nextRevisionDesc}>{nextRevision.description}</Text>
          </View>
          <View style={styles.nextRevisionCostContainer}>
            <Text style={styles.nextRevisionCostLabel}>Total Previsto</Text>
            <Text style={styles.nextRevisionCostValue}>{formatCurrency(nextRevision.totalCost)}</Text>
          </View>
        </View>
        <View style={styles.nextRevisionFooter}>
          <Text style={styles.nextRevisionRemaining}>
            Faltam <Text style={{ color: COLORS.amber, fontWeight: '800' }}>{formatNumber(kmToNextRevision, 0)} km</Text> (Odômetro: {formatNumber(currentOdometer, 0)} km)
          </Text>
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'revisions' && styles.tabButtonActive]}
          onPress={() => setActiveTab('revisions')}
        >
          <Wrench size={14} color={activeTab === 'revisions' ? COLORS.amber : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'revisions' && styles.tabTextActive]}>Revisões Bajaj</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'parts' && styles.tabButtonActive]}
          onPress={() => setActiveTab('parts')}
        >
          <Calendar size={14} color={activeTab === 'parts' ? COLORS.amber : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'parts' && styles.tabTextActive]}>Tabela de Peças</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Aba 1: Revisões Concessionária */}
      {activeTab === 'revisions' && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionHeader}>Plano de Manutenção Periódica (Até 30.000 km)</Text>
          {BAJAJ_OFFICIAL_REVISIONS.map((item) => {
            const isCompleted = currentOdometer >= item.km;
            const isNext = nextRevision.km === item.km;

            return (
              <View
                key={item.km}
                style={[
                  styles.revisionCard,
                  isNext && styles.revisionCardNext,
                  isCompleted && styles.revisionCardCompleted,
                ]}
              >
                <View style={styles.revisionCardHeader}>
                  <View style={styles.kmBadge}>
                    <Text style={styles.kmBadgeText}>{formatNumber(item.km, 0)} KM</Text>
                    <Text style={styles.monthBadgeText}>{item.months} {item.months === 1 ? 'mês' : 'meses'}</Text>
                  </View>

                  <View style={styles.revisionPriceInfo}>
                    <Text style={styles.revisionTotalPrice}>{formatCurrency(item.totalCost)}</Text>
                    <Text style={styles.laborInfo}>
                      M.O: {item.laborStatus === 'Gratuita' ? 'GRÁTIS' : formatCurrency(item.laborCost)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.revisionDesc}>{item.description}</Text>

                <View style={styles.revisionDetailsRow}>
                  <View style={styles.detailTag}>
                    <CheckCircle2 size={12} color={COLORS.emerald} />
                    <Text style={styles.detailTagText}>{item.itemsCount} itens verificados</Text>
                  </View>
                  <View style={styles.detailTag}>
                    <Info size={12} color={COLORS.cyan} />
                    <Text style={styles.detailTagText}>Peças: {formatCurrency(item.partsCost)}</Text>
                  </View>
                  {isNext && (
                    <View style={[styles.detailTag, { backgroundColor: COLORS.amberBg }]}>
                      <Sparkles size={12} color={COLORS.amber} />
                      <Text style={[styles.detailTagText, { color: COLORS.amber, fontWeight: '700' }]}>Próxima</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Conteúdo Aba 2: Recomendação de Peças do Manual */}
      {activeTab === 'parts' && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionHeader}>Quilometragem Limite de Peças (Manual Dominar NS 200)</Text>
          {BAJAJ_PARTS_SCHEDULE.map((part) => (
            <View key={part.id} style={styles.partCard}>
              <View style={styles.partHeader}>
                <Text style={styles.partName}>{part.name}</Text>
                <View style={styles.partKmBadge}>
                  <Text style={styles.partKmText}>A cada {formatNumber(part.intervalKm, 0)} km</Text>
                </View>
              </View>
              <Text style={styles.partSpec}>{part.spec}</Text>
              <Text style={styles.partMonths}>Validade máxima recomendada: {part.maxMonths} meses</Text>
            </View>
          ))}
        </View>
      )}
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
  headerIconContainer: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.amberBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  headerTextContainer: {
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
  nextRevisionBadge: {
    backgroundColor: COLORS.cardBgLight || '#1e293b',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
    marginBottom: SPACING.lg,
  },
  nextRevisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  nextRevisionTitle: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  nextRevisionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  nextRevisionKm: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  nextRevisionDesc: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    maxWidth: 200,
  },
  nextRevisionCostContainer: {
    alignItems: 'flex-end',
  },
  nextRevisionCostLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  nextRevisionCostValue: {
    color: COLORS.emerald,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  nextRevisionFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
    marginTop: SPACING.xs,
  },
  nextRevisionRemaining: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.full,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  tabButtonActive: {
    backgroundColor: COLORS.cardBgLight || '#1e293b',
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.amber,
    fontWeight: '700',
  },
  listContainer: {
    gap: SPACING.sm,
  },
  sectionHeader: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  revisionCard: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  revisionCardNext: {
    borderColor: COLORS.amber,
    backgroundColor: COLORS.amberBg + '10',
  },
  revisionCardCompleted: {
    opacity: 0.8,
  },
  revisionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  kmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  kmBadgeText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  monthBadgeText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  revisionPriceInfo: {
    alignItems: 'flex-end',
  },
  revisionTotalPrice: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
  },
  laborInfo: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
  },
  revisionDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.sm,
  },
  revisionDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  detailTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardBgLight || '#1e293b',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  detailTagText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  partCard: {
    backgroundColor: COLORS.bg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  partKmBadge: {
    backgroundColor: COLORS.amberBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  partKmText: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  partSpec: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 2,
  },
  partMonths: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
