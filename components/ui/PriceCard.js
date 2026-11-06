import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Tag, ShieldCheck, RefreshCw, ShoppingCart } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { formatCurrency } from '../../utils/calculations';

export function PriceCard({ item, onRefresh }) {
  const isLowest = item.price <= 50; // Destaque visual
  const url = item.url || `https://lista.mercadolivre.com.br/${encodeURIComponent(item.search_query || 'bajaj ns 200')}`;

  const handleOpenUrl = () => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.tagRow}>
          <View style={styles.badgeFreeShipping}>
            <Text style={styles.badgeFreeShippingText}>Frete Grátis</Text>
          </View>
          <View style={styles.badgeNew}>
            <Text style={styles.badgeNewText}>Novo</Text>
          </View>
          {isLowest && (
            <View style={styles.badgeLowest}>
              <Text style={styles.badgeLowestText}>Menor Preço</Text>
            </View>
          )}
        </View>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>

      <Text style={styles.productName} numberOfLines={2}>{item.product_name}</Text>
      <Text style={styles.queryLabel}>Termo: "{item.search_query}"</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={14} color={COLORS.textSecondary} />
          <Text style={styles.refreshBtnText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleOpenUrl}>
          <ShoppingCart size={14} color="#ffffff" />
          <Text style={styles.buyBtnText}>Abrir no ML</Text>
          <ExternalLink size={12} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badgeFreeShipping: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeFreeShippingText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  badgeNew: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeNewText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  badgeLowest: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeLowestText: {
    color: COLORS.amber,
    fontSize: 9,
    fontWeight: '800',
  },
  price: {
    color: COLORS.secondary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  productName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginVertical: 4,
  },
  queryLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  buyBtnText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
  },
});
