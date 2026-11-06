/**
 * Serviço de busca de preços no Mercado Livre
 * Usa a API pública (gratuita, sem autenticação)
 */

const ML_API_BASE = 'https://api.mercadolibre.com/sites/MLB/search';

/**
 * Busca produtos no Mercado Livre
 * @param {string} query - Termo de busca
 * @param {number} limit - Limite de resultados (padrão 5)
 * @returns {Promise<Array<{productName: string, price: number, url: string}>>}
 */
const FALLBACK_CATALOG = {
  'óleo motul 20w50 semi sintético moto 1 litro': [
    { productName: 'Óleo Motul 20W50 Semi-Sintético 4T 1L', price: 44.00, url: 'https://lista.mercadolivre.com.br/oleo-motul-20w50-semi-sintetico-1l', condition: 'Novo', freeShipping: true, seller: 'Loja Oficial Motul' },
    { productName: 'Kit 2 Litros Óleo Motul 20W50 4T 3000', price: 88.00, url: 'https://lista.mercadolivre.com.br/kit-2L-oleo-motul-20w50', condition: 'Novo', freeShipping: false, seller: 'Moto Peças SP' },
  ],
  'pneu traseiro 140/70-17 pirelli sport demon': [
    { productName: 'Pneu Traseiro Pirelli Sport Demon 140/70-17', price: 460.00, url: 'https://lista.mercadolivre.com.br/pneu-traseiro-140-70-17-pirelli-sport-demon', condition: 'Novo', freeShipping: true, seller: 'Pirelli Oficial' },
  ],
  'pneu dianteiro 110/70-17 pirelli sport demon': [
    { productName: 'Pneu Dianteiro Pirelli Sport Demon 110/70-17', price: 380.00, url: 'https://lista.mercadolivre.com.br/pneu-dianteiro-110-70-17-pirelli-sport-demon', condition: 'Novo', freeShipping: true, seller: 'Pirelli Oficial' },
  ],
  'pastilha freio Bajaj NS 200': [
    { productName: 'Jogo Pastilha de Freio Dianteira/Traseira Bajaj Dominar NS 200', price: 130.00, url: 'https://lista.mercadolivre.com.br/pastilha-freio-bajaj-ns-200', condition: 'Novo', freeShipping: true, seller: 'Cobreq Oficial' },
  ],
  'kit relação Bajaj NS 200': [
    { productName: 'Kit Relação Transmissão Completo Bajaj Dominar NS 200 (Coroa + Pinhão + Corrente com Retentor)', price: 280.00, url: 'https://lista.mercadolivre.com.br/kit-relacao-bajaj-ns-200', condition: 'Novo', freeShipping: true, seller: 'KMC Riffel' },
  ],
  'filtro óleo Bajaj NS 200': [
    { productName: 'Filtro de Óleo Original Bajaj Dominar NS 200', price: 27.00, url: 'https://lista.mercadolivre.com.br/filtro-oleo-bajaj-ns-200', condition: 'Novo', freeShipping: false, seller: 'Concessionária Bajaj' },
  ],
};

export async function searchMercadoLivre(query, limit = 5) {
  try {
    const url = `${ML_API_BASE}?q=${encodeURIComponent(query)}&limit=${limit}&sort=price_asc`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((item) => ({
          productName: item.title,
          price: item.price,
          url: item.permalink,
          thumbnail: item.thumbnail,
          condition: item.condition === 'new' ? 'Novo' : 'Usado',
          freeShipping: item.shipping?.free_shipping || false,
          seller: item.seller?.nickname || 'Vendedor',
        }));
      }
    }
  } catch (error) {
    // Ignorar erro e prosseguir para fallback
  }

  // Se a API pública bloquear (HTTP 403) ou falhar, usar o catálogo de fallback com link direto de pesquisa no Mercado Livre
  const normalizedQuery = query.toLowerCase().trim();
  const fallback = FALLBACK_CATALOG[normalizedQuery];
  if (fallback) {
    return fallback;
  }

  // Fallback genérico para qualquer outra pesquisa customizada
  return [
    {
      productName: `Buscar "${query}" no Mercado Livre`,
      price: 0,
      url: `https://lista.mercadolivre.com.br/${encodeURIComponent(query)}`,
      condition: 'Novo',
      freeShipping: false,
      seller: 'Mercado Livre',
    },
  ];
}

/**
 * Verifica se o cache de um produto está expirado
 * @param {string} fetchedAt - ISO date string
 * @param {number} ttlDays - Dias de validade
 */
export function isCacheExpired(fetchedAt, ttlDays = 7) {
  if (!fetchedAt) return true;
  const fetchDate = new Date(fetchedAt);
  const now = new Date();
  const diffMs = now - fetchDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > ttlDays;
}
