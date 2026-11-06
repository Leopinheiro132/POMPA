import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart as PieIcon, BarChart3, Info } from 'lucide-react-native';
import { Card } from './ui/Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { formatCurrency, formatNumber } from '../utils/calculations';
import SvgChart, { SVGRenderer } from '@wuba/react-native-echarts/svgChart';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([SVGRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Chart 1: Distribuição do Custo por KM (Horizontal Bar) ───────────────
function CostDistributionChart({ costItems, totalKmCost }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const sorted = [...costItems]
    .filter((i) => i.value > 0)
    .sort((a, b) => a.value - b.value);

  useEffect(() => {
    if (!chartRef.current) return;

    const option = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 900,
      grid: { top: 8, right: 80, bottom: 8, left: 100, containLabel: false },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: COLORS.border, type: 'dashed' } },
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((i) => i.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.textSecondary,
          fontSize: 10,
          fontWeight: '600',
        },
      },
      series: [
        {
          type: 'bar',
          data: sorted.map((i) => ({
            value: Math.round((i.value / totalKmCost) * 100),
            itemStyle: { color: i.color, borderRadius: [0, 4, 4, 0] },
          })),
          barWidth: 10,
          label: {
            show: true,
            position: 'right',
            formatter: (p) => `${p.value}%`,
            color: COLORS.textMuted,
            fontSize: 10,
            fontWeight: '700',
          },
        },
      ],
    };

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'svg',
        width: SCREEN_WIDTH - 64,
        height: sorted.length * 28 + 16,
      });
    }
    chartInstance.current.setOption(option);

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [sorted, totalKmCost]);

  const chartHeight = sorted.length * 28 + 16;

  return (
    <SvgChart ref={chartRef} useRNGH style={{ height: chartHeight, width: '100%' }} />
  );
}

// ─── Chart 2: Projeção Orçamentária 12 Meses (Stacked Bar) ────────────────
function MonthlyProjectionChart({ monthlyFuel, monthlyMaintenance, monthlyReserve }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  useEffect(() => {
    if (!chartRef.current) return;

    const fuelVal = Math.round(monthlyFuel);
    const maintVal = Math.round(monthlyMaintenance);
    const reserveVal = Math.round(monthlyReserve);

    const option = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      grid: { top: 8, right: 8, bottom: 24, left: 50, containLabel: false },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0f172a',
        borderColor: COLORS.border,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: COLORS.textPrimary, fontSize: 11 },
        formatter: (params) => {
          const total = params.reduce((s, p) => s + p.value, 0);
          const rows = params
            .map(
              (p) =>
                `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:4px;"></span>` +
                `<span style="color:${COLORS.textSecondary}">${p.seriesName}</span> ` +
                `<span style="font-weight:700;color:#fff">R$ ${p.value}</span>`
            )
            .join('<br/>');
          return `<div style="font-size:11px;font-weight:700;color:${COLORS.primary};margin-bottom:4px;">${params[0].name} · R$ ${total}</div>${rows}`;
        },
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: COLORS.textMuted, fontSize: 9, fontWeight: '600', margin: 6 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: COLORS.border, type: 'dashed' } },
        axisLabel: {
          color: COLORS.textMuted,
          fontSize: 9,
          formatter: (v) => `R$${v}`,
        },
      },
      series: [
        {
          name: 'Gasolina',
          type: 'bar',
          stack: 'total',
          barWidth: 14,
          data: months.map(() => fuelVal),
          itemStyle: { color: COLORS.secondary },
        },
        {
          name: 'Manutenção',
          type: 'bar',
          stack: 'total',
          barWidth: 14,
          data: months.map(() => maintVal),
          itemStyle: { color: COLORS.amber },
        },
        {
          name: 'Reserva',
          type: 'bar',
          stack: 'total',
          barWidth: 14,
          data: months.map(() => reserveVal),
          itemStyle: { color: COLORS.purple, borderRadius: [4, 4, 0, 0] },
        },
      ],
    };

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'svg',
        width: SCREEN_WIDTH - 64,
        height: 160,
      });
    }
    chartInstance.current.setOption(option);

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [monthlyFuel, monthlyMaintenance, monthlyReserve]);

  return (
    <SvgChart ref={chartRef} useRNGH style={{ height: 160, width: '100%' }} />
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────
export function FinancialCharts({ config, breakdown }) {
  if (!config || !breakdown) return null;

  const costItems = [
    { name: 'Gasolina', value: breakdown.fuelCostPerKm, color: COLORS.secondary },
    { name: 'Óleo + Filtro', value: breakdown.oilCostPerKm + breakdown.oilFilterCostPerKm, color: COLORS.amber },
    { name: 'Revisão 5k', value: breakdown.revisionCostPerKm, color: COLORS.orange },
    { name: 'Pneu Traseiro', value: breakdown.rearTireCostPerKm, color: COLORS.primary },
    { name: 'Pneu Dianteiro', value: breakdown.frontTireCostPerKm, color: COLORS.cyan },
    { name: 'Pastilhas/Pinças', value: breakdown.brakesCostPerKm, color: COLORS.red },
    { name: 'Kit Relação', value: breakdown.chainCostPerKm, color: COLORS.purple },
    { name: 'Reserva Imprevistos', value: breakdown.reserveCostPerKm, color: COLORS.textMuted },
  ];

  const totalKmCost = breakdown.totalCostPerKm || 1;
  const monthlyFuel = breakdown.monthlyFuelCost;
  const monthlyOil = breakdown.monthlyOilCost;
  const monthlyTires = breakdown.monthlyTiresCost;
  const monthlyBrakesChain = breakdown.monthlyBrakesChainCost;
  const monthlyReserve = breakdown.monthlyReserveCost;
  const monthlyMaintenance = monthlyOil + monthlyTires + monthlyBrakesChain;

  return (
    <View style={styles.container}>

      {/* 1. Distribuição do Custo por KM — ECharts Horizontal Bar */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.secondaryBg }]}>
              <PieIcon size={18} color={COLORS.secondary} />
            </View>
            <View>
              <Text style={styles.title}>Distribuição do Custo por KM</Text>
              <Text style={styles.subtitle}>Divisão proporcional de cada gasto da NS 200</Text>
            </View>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{formatCurrency(breakdown.totalCostPerKm)}/km</Text>
          </View>
        </View>

        <CostDistributionChart costItems={costItems} totalKmCost={totalKmCost} />
      </Card>

      {/* 2. Projeção Orçamentária 12 Meses — ECharts Stacked Bar */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.primaryBg }]}>
              <BarChart3 size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.title}>Projeção Orçamentária (12 Meses)</Text>
              <Text style={styles.subtitle}>Baseado na rodagem de {formatNumber(breakdown.monthlyKm, 0)} km/mês</Text>
            </View>
          </View>
        </View>

        {/* Legenda */}
        <View style={styles.legendRow}>
          {[
            { label: 'Gasolina', color: COLORS.secondary, value: monthlyFuel },
            { label: 'Manutenção', color: COLORS.amber, value: monthlyMaintenance },
            { label: 'Reserva', color: COLORS.purple, value: monthlyReserve },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}: {formatCurrency(item.value)}</Text>
            </View>
          ))}
        </View>

        <MonthlyProjectionChart
          monthlyFuel={monthlyFuel}
          monthlyMaintenance={monthlyMaintenance}
          monthlyReserve={monthlyReserve}
        />

        <View style={styles.infoNote}>
          <Info size={14} color={COLORS.cyan} />
          <Text style={styles.infoNoteText}>
            Com a reserva de{' '}
            <Text style={{ color: COLORS.amber, fontWeight: '700' }}>
              {formatCurrency(monthlyReserve)}/mês
            </Text>
            , você tem cobertura para todas as manutenções da moto sem surpresas no orçamento.
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
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
  totalBadge: {
    backgroundColor: COLORS.amberBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.amber + '40',
  },
  totalBadgeText: {
    color: COLORS.amber,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bg,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.cyanBg || 'rgba(6,182,212,0.1)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  infoNoteText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
  },
});

