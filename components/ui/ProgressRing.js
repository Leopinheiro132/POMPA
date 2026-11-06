import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SvgChart, { SVGRenderer } from '@wuba/react-native-echarts/svgChart';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { COLORS, FONT_SIZE } from '../../constants/theme';

echarts.use([SVGRenderer, GaugeChart]);

export function ProgressRing({
  size = 84,
  strokeWidth = 7,
  progress = 75,
  color = COLORS.primary,
  label = 'VIDA',
  valueText,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const displayValue = valueText !== undefined ? valueText : `${Math.round(progress)}%`;

  useEffect(() => {
    if (!chartRef.current) return;

    const option = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 700,
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          radius: '88%',
          center: ['50%', '50%'],
          clockwise: true,
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            width: strokeWidth,
            itemStyle: { color },
          },
          axisLine: {
            lineStyle: {
              width: strokeWidth,
              color: [[1, COLORS.border]],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          title: {
            show: true,
            offsetCenter: [0, '30%'],
            fontSize: 8,
            fontWeight: '800',
            color: COLORS.textMuted,
            letterSpacing: 0.8,
          },
          detail: {
            width: size * 0.6,
            height: 'auto',
            fontSize: FONT_SIZE.sm,
            fontWeight: '800',
            color: COLORS.textPrimary,
            offsetCenter: [0, '-10%'],
            formatter: () => displayValue,
          },
          data: [
            {
              value: progress,
              name: label || '',
            },
          ],
        },
      ],
    };

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark', {
        renderer: 'svg',
        width: size,
        height: size,
      });
    }
    chartInstance.current.setOption(option);

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [size, strokeWidth, progress, color, label, displayValue]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <SvgChart ref={chartRef} useRNGH style={{ width: size, height: size }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
