import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Linking } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { PriceCard } from '../../components/ui/PriceCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useConfig } from '../../hooks/useConfig';
import { getPriceWatchItems, getCachedPricesAll, savePrices, clearExpiredPrices } from '../../services/database';
import { searchMercadoLivre } from '../../services/priceScraper';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

export default function PrecosScreen() {
  const { config } = useConfig();
  const [watchItems, setWatchItems] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWifi, setIsWifi] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    loadData();
    checkNetwork();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifi(state.type === 'wifi');
    });
    return () => unsubscribe();
  }, []);

  const checkNetwork = async () => {
    const state = await NetInfo.fetch();
    setIsWifi(state.type === 'wifi');
  };

  const loadData = async () => {
    try {
      const items = await getPriceWatchItems();
      setWatchItems(items);

      const cached = await getCachedPricesAll();
      setPrices(cached);

      await clearExpiredPrices();

      if (cached.length > 0) {
        setLastFetch(cached[0].fetched_at);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de preços:', err);
    }
  };

  const handleSearchAll = async () => {
    if (!isWifi) {
      Alert.alert(
        '📱 Dados Móveis',
        'Você está usando dados móveis. A busca de preços vai consumir ~50KB. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => doSearch() },
        ]
      );
    } else {
      await doSearch();
    }
  };

  const doSearch = async () => {
    setLoading(true);
    try {
      let updatedCount = 0;
      for (const item of watchItems) {
        const results = await searchMercadoLivre(item.query);
        if (results && results.length > 0) {
          await savePrices(item.query, results);
          updatedCount++;
        }
      }
      await loadData();
      if (updatedCount > 0) {
        Alert.alert('✅ Sucesso', 'Preços do Mercado Livre atualizados com sucesso!');
      } else {
        Alert.alert('ℹ️ Informação', 'Cotações carregadas.');
      }
    } catch (err) {
      console.error('Erro na busca de preços:', err);
      Alert.alert('❌ Erro', 'Ocorreu um erro ao buscar os preços.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Network Status Badge */}
      <View style={[styles.networkBadge, { backgroundColor: isWifi ? COLORS.secondaryBg : COLORS.redBg }]}>
        {isWifi ? (
          <Wifi size={14} color={COLORS.secondary} />
        ) : (
          <WifiOff size={14} color={COLORS.red} />
        )}
        <Text style={[styles.networkText, { color: isWifi ? COLORS.secondary : COLORS.red }]}>
          {isWifi ? 'Wi-Fi Conectado — Cotações automáticas' : 'Dados Móveis — Busca sob demanda'}
        </Text>
      </View>

      {/* Botão de Atualizar Preços */}
      <Button
        title={loading ? 'Buscando Cotações...' : 'Atualizar Cotações no ML'}
        variant="primary"
        size="lg"
        loading={loading}
        icon={<RefreshCw size={16} color="#ffffff" />}
        onPress={handleSearchAll}
        style={styles.searchButton}
      />

      {lastFetch && (
        <Text style={styles.lastFetchText}>
          Última sincronização: {new Date(lastFetch).toLocaleDateString('pt-BR')}
        </Text>
      )}

      {/* Lista de Cotações */}
      <Text style={styles.sectionTitle}>🛍️ Mercado Livre — Bajaj NS 200 ({prices.length} Cotações)</Text>

      {prices.map((item, index) => (
        <PriceCard key={item.id || index} item={item} onRefresh={doSearch} />
      ))}

      {prices.length === 0 && !loading && (
        <EmptyState
          title="Nenhuma cotação carregada"
          description='Toque em "Atualizar Cotações no ML" para carregar ofertas.'
        />
      )}
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
    paddingBottom: SPACING.xxxl * 2,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  networkText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  searchButton: {
    marginBottom: SPACING.xs,
  },
  lastFetchText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
});
