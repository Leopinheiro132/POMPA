/**
 * Tipos de despesa possíveis
 */
export const EXPENSE_TYPES = {
  GAS: 'gas',
  OIL: 'oil',
  OIL_FILTER: 'oil_filter',
  TIRE_REAR: 'tire_rear',
  TIRE_FRONT: 'tire_front',
  BRAKES: 'brakes',
  CHAIN: 'chain',
  EVENTUAL: 'eventual',
  OTHER: 'other',
};

/**
 * Labels em português para os tipos de despesa
 */
export const EXPENSE_TYPE_LABELS = {
  [EXPENSE_TYPES.GAS]: 'Gasolina',
  [EXPENSE_TYPES.OIL]: 'Óleo',
  [EXPENSE_TYPES.OIL_FILTER]: 'Filtro de Óleo',
  [EXPENSE_TYPES.TIRE_REAR]: 'Pneu Traseiro',
  [EXPENSE_TYPES.TIRE_FRONT]: 'Pneu Dianteiro',
  [EXPENSE_TYPES.BRAKES]: 'Freios/Pastilhas',
  [EXPENSE_TYPES.CHAIN]: 'Kit Relação',
  [EXPENSE_TYPES.EVENTUAL]: 'Eventual',
  [EXPENSE_TYPES.OTHER]: 'Outros',
};

/**
 * Categorias de manutenção
 */
export const MAINTENANCE_CATEGORIES = {
  OIL: 'oil',
  TIRE: 'tire',
  BRAKE: 'brake',
  TRANSMISSION: 'transmission',
  FILTER: 'filter',
  GENERAL: 'general',
};

/**
 * Modos de rastreamento do odômetro
 */
export const TRACKING_MODES = {
  OFF: 'off',
  ACCELEROMETER: 'accelerometer',
  GPS: 'gps',
};

/**
 * Fontes de leitura do odômetro
 */
export const ODOMETER_SOURCES = {
  ACCELEROMETER: 'accelerometer',
  GPS: 'gps',
  MANUAL: 'manual',
};
