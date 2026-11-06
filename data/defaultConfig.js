/**
 * Configuração padrão da Bajaj Pulsar NS 200
 * Ajustada com os valores reais do usuário
 */
export const INITIAL_CONFIG = {
  motoName: 'Bajaj Pulsar NS 200',
  fuelPrice: 6.85,
  fuelEfficiency: 30,
  fuelEfficiencyMargin: 2,

  // Óleo — Motul 20W50 Semi-Sintético
  oilPricePerLiter: 44.00,
  oilCapacityNoFilter: 1.2,
  oilCapacityWithFilter: 1.4,
  oilChangeIntervalKm: 2500,
  oilFilterPrice: 27.00,
  oilFilterIntervalKm: 5000,

  // Pneus — Pirelli Sport Demon
  pneuTraseiroPrice: 460.00,
  pneuTraseiroLifespanKm: 12000,
  pneuDianteiroPrice: 380.00,
  pneuDianteiroLifespanKm: 18000,

  // Freios e Transmissão
  pastilhasPincasCost: 130.00,
  pastilhasLifespanKm: 10000,
  relacaoCost: 280.00,
  relacaoLifespanKm: 15000,

  // Odômetro
  currentOdometer: 12500,

  // Estoque de óleo na garagem
  garageOilStockLiters: 0.8,

  // Reserva de emergência
  emergencyReservePerKm: 0.05,

  // Revisões periódicas
  periodicRevisionAverageCost: 415.32,
  revisionIntervalKm: 5000,

  // Último km de troca de cada componente
  lastChangedKmMap: {
    oil: 12200,
    oil_filter: 10000,
    spark_plugs: 10000,
    coolant: 10000,
    brake_fluid: 10000,
    air_filter: 10000,
    fuel_filter: 10000,
    tire_rear: 3000,
    tire_front: 1000,
    brakes: 12480,
    chain: 2000,
    battery: 0,
  },

  // Rotas diárias — Segunda a Domingo individualmente
  routes: {
    monKm: 26,
    tueKm: 26,
    wedKm: 26,
    thuKm: 26,
    friKm: 65,
    satKm: 65,
    sunKm: 39,
    extraWeeklyKm: 0,
  },

  // Configurações do odômetro
  trackingMode: 'off', // 'off', 'accelerometer', 'gps'
  accelerometerThresholdKmh: 12, // Threshold: ~12 km/h para começar a contar

  // Configurações de pesquisa de preços
  autoSearchPricesOnWifi: true, // Toggle para desativar busca automática no Wi-Fi
  pricesCacheTTLDays: 7,
};

/**
 * Logs iniciais de exemplo
 */
export const INITIAL_LOGS = [
  {
    id: 'log-rev-1k',
    date: '2025-08-15',
    odometerKm: 1000,
    type: 'eventual',
    description: 'Revisão Concessionária Bajaj 1.000 KM (Peças R$ 105,32 + M.O. Grátis)',
    totalCost: 105.32,
  },
  {
    id: 'log-rev-5k',
    date: '2025-12-10',
    odometerKm: 5000,
    type: 'eventual',
    description: 'Revisão Concessionária Bajaj 5.000 KM (Peças R$ 110,32 + M.O. R$ 155,00)',
    totalCost: 265.32,
  },
  {
    id: 'log-rev-10k',
    date: '2026-04-20',
    odometerKm: 10000,
    type: 'eventual',
    description: 'Revisão Concessionária Bajaj 10.000 KM (Peças R$ 105,32 + M.O. R$ 310,00)',
    totalCost: 415.32,
  },
  {
    id: 'log-1',
    date: '2026-07-25',
    odometerKm: 12200,
    type: 'oil',
    description: 'Troca de Óleo Intermediária (1.2L - Sobrou 0.8L do frasco de 2L comprados)',
    totalCost: 88.00,
    litersOilBought: 2,
    litersOilUsed: 1.2,
  },
  {
    id: 'log-2',
    date: '2026-07-28',
    odometerKm: 12350,
    type: 'gas',
    description: 'Abastecimento Completo (Gasolina Aditivada)',
    totalCost: 61.65,
    litersFuel: 9.0,
    kmSinceLastRefill: 270,
    calculatedKmPerLiter: 30.0,
  },
  {
    id: 'log-3',
    date: '2026-07-30',
    odometerKm: 12480,
    type: 'brakes',
    description: 'Revisão de Pinças de Freio + Troca de Pastilhas Dianteiras e Fluido DOT4',
    totalCost: 130.00,
  },
];

/**
 * Plano Oficial de Manutenção Periódica Bajaj — Dominar NS 200
 * Extraído diretamente da tabela oficial de concessionária e manual do proprietário
 */
export const BAJAJ_OFFICIAL_REVISIONS = [
  {
    km: 1000,
    months: 1,
    partsCost: 105.32,
    laborCost: 0.00,
    totalCost: 105.32,
    itemsCount: 21,
    washIncluded: false,
    laborStatus: 'Gratuita',
    description: '1ª Revisão — Troca de Óleo, Filtro de Óleo, Anel O-ring e inspeção de 21 itens',
  },
  {
    km: 5000,
    months: 6,
    partsCost: 110.32,
    laborCost: 155.00,
    totalCost: 265.32,
    itemsCount: 24,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '2ª Revisão — Troca de Óleo, Filtro de Óleo, Lubrificação geral e 24 itens',
  },
  {
    km: 10000,
    months: 12,
    partsCost: 105.32,
    laborCost: 310.00,
    totalCost: 415.32,
    itemsCount: 34,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '3ª Revisão — Troca de Óleo, Filtro de Óleo, Velas, Fluido Freio e 34 itens',
  },
  {
    km: 15000,
    months: 18,
    partsCost: 293.85,
    laborCost: 310.00,
    totalCost: 603.85,
    itemsCount: 30,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '4ª Revisão — Troca de Óleo, Filtro Óleo, Filtro Ar, Velas DTS-i e 30 itens',
  },
  {
    km: 20000,
    months: 24,
    partsCost: 105.32,
    laborCost: 310.00,
    totalCost: 415.32,
    itemsCount: 36,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '5ª Revisão — Troca de Óleo, Filtro, Fluido Arrefecimento e 36 itens',
  },
  {
    km: 25000,
    months: 30,
    partsCost: 105.32,
    laborCost: 310.00,
    totalCost: 415.32,
    itemsCount: 28,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '6ª Revisão — Troca de Óleo, Filtro de Óleo, Limpeza geral e 28 itens',
  },
  {
    km: 30000,
    months: 36,
    partsCost: 442.58,
    laborCost: 310.00,
    totalCost: 752.58,
    itemsCount: 29,
    washIncluded: false,
    laborStatus: 'Paga',
    description: '7ª Revisão — Revisão Geral Completa (Óleo, Filtros, Velas, Fluidos e 29 itens)',
  },
];

/**
 * Tabela de Recomendação de Quilometragem de Peças (Manual Dominar NS 200)
 */
export const BAJAJ_PARTS_SCHEDULE = [
  { id: 'oil', name: 'Óleo de Motor (Motul 20W50)', intervalKm: 5000, maxMonths: 6, spec: '1.2L sem filtro / 1.4L com filtro (SAE 20W50 API SL JASO MA2)' },
  { id: 'oil_filter', name: 'Filtro de Óleo', intervalKm: 5000, maxMonths: 6, spec: 'Substituição em toda troca de óleo' },
  { id: 'spark_plugs', name: 'Velas de Ignição (Tripla Faísca)', intervalKm: 10000, maxMonths: 12, spec: '3 Velas de Ignição DTS-i (Substituição a cada 10.000 km)' },
  { id: 'air_filter', name: 'Filtro de Ar', intervalKm: 10000, maxMonths: 12, spec: 'Inspeção aos 5k km, troca obrigatória aos 10k km' },
  { id: 'brake_fluid', name: 'Fluido de Freio (DOT 4)', intervalKm: 10000, maxMonths: 12, spec: 'Substituição completa do fluido dianteiro e traseiro' },
  { id: 'coolant', name: 'Fluido de Arrefecimento', intervalKm: 20000, maxMonths: 24, spec: 'Troca completa de líquido de arrefecimento' },
  { id: 'tire_rear', name: 'Pneu Traseiro (140/70-17)', intervalKm: 12000, maxMonths: 24, spec: 'Pirelli Sport Demon 140/70-17' },
  { id: 'tire_front', name: 'Pneu Dianteiro (110/70-17)', intervalKm: 18000, maxMonths: 36, spec: 'Pirelli Sport Demon 110/70-17' },
  { id: 'brakes', name: 'Pastilhas de Freio', intervalKm: 10000, maxMonths: 12, spec: 'Inspeção a cada 2.500 km, troca quando abaixo do limite' },
  { id: 'chain', name: 'Kit Relação (Coroa, Pinhão, Corrente)', intervalKm: 15000, maxMonths: 24, spec: 'Lubrificação a cada 500 km, regulagem a cada 1.000 km' },
];

/**
 * Itens padrão para pesquisa de preços no Mercado Livre
 */
export const DEFAULT_PRICE_WATCH_ITEMS = [
  { query: 'óleo motul 20w50 semi sintético moto 1 litro', category: 'oil' },
  { query: 'pneu traseiro 140/70-17 pirelli sport demon', category: 'tire' },
  { query: 'pneu dianteiro 110/70-17 pirelli sport demon', category: 'tire' },
  { query: 'pastilha freio Bajaj NS 200', category: 'brake' },
  { query: 'kit relação Bajaj NS 200', category: 'transmission' },
  { query: 'filtro óleo Bajaj NS 200', category: 'filter' },
];

