import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber, getKmRemaining } from '../utils/calculations';

export function RevisionScheduleCard({ config, breakdown, onQuickLogService }) {
  if (!config) return null;

  const lastRevisionKm = Math.max(
    ...(Object.values(config.lastChangedKmMap || {}).filter(v => typeof v === 'number'))
  );

  // Calcular próximas revisões baseado no intervalo de 5.000km
  const revisionIntervalKm = config.revisionIntervalKm || 5000;
  const currentKm = config.currentOdometer;

  // Encontrar a próxima revisão
  const nextRevisionKm = Math.ceil(currentKm / revisionIntervalKm) * revisionIntervalKm;
  const kmToNextRevision = nextRevisionKm - currentKm;

  // Estimativa de data baseada nos km mensais
  const monthsToRevision = breakdown.monthlyKm > 0
    ? kmToNextRevision / breakdown.monthlyKm
    : 0;

  const nextRevisionDate = new Date();
  nextRevisionDate.setMonth(nextRevisionDate.getMonth() + Math.ceil(monthsToRevision));

  // Timeline de revisões
  const revisions = [];
  for (let i = 0; i < 5; i++) {
    const revKm = nextRevisionKm + (i * revisionIntervalKm);
    const kmAway = revKm - currentKm;
    const monthsAway = breakdown.monthlyKm > 0 ? kmAway / breakdown.monthlyKm : 0;
    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + Math.ceil(monthsAway));

    revisions.push({
      km: revKm,
      kmAway,
      cost: config.periodicRevisionAverageCost,
      estimatedDate: estimatedDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      isCurrent: i === 0,
    });
  }

  return (
    <Card>
      <Text style={styles.title}>🔧 Agenda de Revisões (5.000 km)</Text>
      <Text style={styles.subtitle}>
        Custo médio: {formatCurrency(config.periodicRevisionAverageCost)} • Intervalo: {formatNumber(revisionIntervalKm, 0)} km
      </Text>

      {/* Próxima revisão destaque */}
      <View style={styles.nextRevision}>
        <Text style={styles.nextLabel}>Próxima Revisão</Text>
        <Text style={styles.nextKm}>{formatNumber(nextRevisionKm, 0)} km</Text>
        <Text style={styles.nextMeta}>
          Faltam {formatNumber(kmToNextRevision, 0)} km • ~{nextRevisionDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {revisions.map((rev, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={[
              styles.timelineDot,
              rev.isCurrent && styles.timelineDotActive,
            ]} />
            {index < revisions.length - 1 && <View style={styles.timelineLine} />}
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineKm, rev.isCurrent && { color: COLORS.amber }]}>
                {formatNumber(rev.km, 0)} km
              </Text>
              <Text style={styles.timelineMeta}>
                {formatCurrency(rev.cost)} • {rev.estimatedDate}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Custo mensal de revisão */}
      <View style={styles.monthlyCost}>
        <Text style={styles.monthlyCostLabel}>Custo mensal (provisionado)</Text>
        <Text style={styles.monthlyCostValue}>
          {formatCurrency(breakdown.monthlyRevisionCost)}
        </Text>
      </View>
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
  nextRevision: {
    backgroundColor: COLORS.amberBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
  },
  nextLabel: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextKm: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    marginVertical: SPACING.xs,
  },
  nextMeta: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  timeline: {
    marginLeft: SPACING.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
    marginTop: 4,
    marginRight: SPACING.md,
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: COLORS.amber,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    position: 'absolute',
    left: 4.5,
    top: 14,
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineKm: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  timelineMeta: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  monthlyCost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  monthlyCostLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  monthlyCostValue: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
});
