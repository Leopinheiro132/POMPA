/**
 * Cálculos financeiros — migrado do app web (100% reutilizável)
 * Ajustado para rotas dia-a-dia (seg a dom individualmente)
 */

export function calculateBreakdown(config) {
  const {
    routes,
    fuelPrice,
    fuelEfficiency,
    oilPricePerLiter,
    oilChangeIntervalKm,
    oilFilterPrice,
    oilFilterIntervalKm,
    pneuTraseiroPrice,
    pneuTraseiroLifespanKm,
    pneuDianteiroPrice,
    pneuDianteiroLifespanKm,
    pastilhasPincasCost,
    pastilhasLifespanKm,
    relacaoCost,
    relacaoLifespanKm,
    emergencyReservePerKm,
  } = config;

  // 1. Cálculo de distâncias — agora dia a dia
  const weeklyKm =
    (routes.monKm || 0) +
    (routes.tueKm || 0) +
    (routes.wedKm || 0) +
    (routes.thuKm || 0) +
    (routes.friKm || 0) +
    (routes.satKm || 0) +
    (routes.sunKm || 0) +
    (routes.extraWeeklyKm || 0);

  const monthlyKm = weeklyKm * (52 / 12);
  const annualKm = weeklyKm * 52;

  // 2. Combustível
  const fuelCostPerKm = fuelPrice / fuelEfficiency;
  const weeklyFuelLiters = weeklyKm / fuelEfficiency;
  const weeklyFuelCost = weeklyFuelLiters * fuelPrice;
  const monthlyFuelCost = (monthlyKm / fuelEfficiency) * fuelPrice;
  const annualFuelCost = (annualKm / fuelEfficiency) * fuelPrice;

  // 3. Óleo e Filtro de Óleo
  // Ciclo de 5.000 km: 2 trocas de óleo (1.2L + 1.4L = 2.6L) + 1 filtro
  // Compra 3L (3 x R$44) + 1 filtro (R$27) = R$159 / 5.000km
  const cycle5000KmOilCost = 3 * oilPricePerLiter;
  const cycle5000KmFilterCost = oilFilterPrice;
  const oilCostPerKm = cycle5000KmOilCost / oilFilterIntervalKm;
  const oilFilterCostPerKm = cycle5000KmFilterCost / oilFilterIntervalKm;
  const monthlyOilCost = (oilCostPerKm + oilFilterCostPerKm) * monthlyKm;

  // 4. Pneus
  const rearTireCostPerKm = pneuTraseiroPrice / pneuTraseiroLifespanKm;
  const frontTireCostPerKm = pneuDianteiroPrice / pneuDianteiroLifespanKm;
  const monthlyTiresCost = (rearTireCostPerKm + frontTireCostPerKm) * monthlyKm;

  // 5. Freios e Relação
  const brakesCostPerKm = pastilhasPincasCost / pastilhasLifespanKm;
  const chainCostPerKm = relacaoCost / relacaoLifespanKm;
  const monthlyBrakesChainCost = (brakesCostPerKm + chainCostPerKm) * monthlyKm;

  // 6. Reserva de Emergência
  const reserveCostPerKm = emergencyReservePerKm;
  const monthlyReserveCost = reserveCostPerKm * monthlyKm;

  // 7. Revisões Periódicas (5.000 km)
  const periodicRevisionAverageCost = config.periodicRevisionAverageCost || 415.32;
  const revisionIntervalKm = config.revisionIntervalKm || 5000;
  const revisionCostPerKm = periodicRevisionAverageCost / revisionIntervalKm;
  const monthlyRevisionCost = revisionCostPerKm * monthlyKm;

  // 8. Totais
  const totalCostPerKm =
    fuelCostPerKm +
    oilCostPerKm +
    oilFilterCostPerKm +
    rearTireCostPerKm +
    frontTireCostPerKm +
    brakesCostPerKm +
    chainCostPerKm +
    reserveCostPerKm +
    revisionCostPerKm;

  const totalMonthlyCost = totalCostPerKm * monthlyKm;
  const totalAnnualCost = totalCostPerKm * annualKm;

  // Inventário de óleo
  const oilPurchasedPerChange = 2;
  const oilLeftoverPerChange = oilPurchasedPerChange - config.oilCapacityNoFilter;

  return {
    weeklyKm,
    monthlyKm,
    annualKm,
    weeklyFuelLiters,
    weeklyFuelCost,
    monthlyFuelCost,
    annualFuelCost,
    fuelCostPerKm,
    oilCostPerKm,
    oilFilterCostPerKm,
    monthlyOilCost,
    rearTireCostPerKm,
    frontTireCostPerKm,
    monthlyTiresCost,
    brakesCostPerKm,
    chainCostPerKm,
    monthlyBrakesChainCost,
    reserveCostPerKm,
    monthlyReserveCost,
    revisionCostPerKm,
    monthlyRevisionCost,
    totalCostPerKm,
    totalMonthlyCost,
    totalAnnualCost,
    oilPurchasedPerChange,
    oilLeftoverPerChange,
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Calcula a porcentagem de vida restante de uma peça
 */
export function getWearPercentage(currentKm, lastChangedKm, lifespanKm) {
  const kmUsed = currentKm - lastChangedKm;
  const remaining = Math.max(0, lifespanKm - kmUsed);
  return Math.min(100, Math.max(0, (remaining / lifespanKm) * 100));
}

/**
 * Retorna km restantes até a próxima troca
 */
export function getKmRemaining(currentKm, lastChangedKm, lifespanKm) {
  return Math.max(0, lifespanKm - (currentKm - lastChangedKm));
}

/**
 * Verifica se uma peça está próxima da troca (< 500km)
 */
export function isMaintenanceUrgent(currentKm, lastChangedKm, lifespanKm) {
  return getKmRemaining(currentKm, lastChangedKm, lifespanKm) < 500;
}

/**
 * Retorna o último dia do mês atual
 */
export function getLastDayOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
