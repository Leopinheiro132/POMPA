import * as SQLite from 'expo-sqlite';
import { INITIAL_CONFIG, INITIAL_LOGS, DEFAULT_PRICE_WATCH_ITEMS } from '../data/defaultConfig';

let db = null;

/**
 * Abre e inicializa o banco de dados SQLite
 */
export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('controle_gastos_moto.db');

  // Criar tabelas
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expense_logs (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      odometer_km REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      total_cost REAL NOT NULL,
      liters_fuel REAL,
      liters_oil_bought REAL,
      liters_oil_used REAL,
      km_since_last_refill REAL,
      calculated_km_per_liter REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS odometer_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      km_estimated REAL DEFAULT 0,
      km_manual REAL,
      source TEXT DEFAULT 'accelerometer',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS prices_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      search_query TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      url TEXT,
      fetched_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_watch_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1
    );
  `);

  // Inserir config padrão se não existir
  const existingConfig = await db.getFirstAsync('SELECT id FROM config WHERE id = 1');
  if (!existingConfig) {
    await db.runAsync(
      'INSERT INTO config (id, data) VALUES (1, ?)',
      JSON.stringify(INITIAL_CONFIG)
    );
  }

  // Inserir logs iniciais se tabela vazia
  const logCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM expense_logs');
  if (logCount.count === 0) {
    for (const log of INITIAL_LOGS) {
      await db.runAsync(
        `INSERT INTO expense_logs (id, date, odometer_km, type, description, total_cost, liters_fuel, liters_oil_bought, liters_oil_used, km_since_last_refill, calculated_km_per_liter)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        log.id,
        log.date,
        log.odometerKm,
        log.type,
        log.description,
        log.totalCost,
        log.litersFuel || null,
        log.litersOilBought || null,
        log.litersOilUsed || null,
        log.kmSinceLastRefill || null,
        log.calculatedKmPerLiter || null
      );
    }
  }

  // Inserir itens de pesquisa padrão se tabela vazia
  const watchCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM price_watch_items');
  if (watchCount.count === 0) {
    for (const item of DEFAULT_PRICE_WATCH_ITEMS) {
      await db.runAsync(
        'INSERT INTO price_watch_items (query, category) VALUES (?, ?)',
        item.query,
        item.category
      );
    }
  }

  // Preencher cache inicial de preços se tabela vazia
  const priceCacheCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM prices_cache');
  if (priceCacheCount.count === 0) {
    const initialSeed = [
      { query: 'óleo motul 20w50 semi sintético moto 1 litro', name: 'Óleo Motul 20W50 Semi-Sintético 4T 1L', price: 44.00, url: 'https://lista.mercadolivre.com.br/oleo-motul-20w50-semi-sintetico-1l' },
      { query: 'pneu traseiro 140/70-17 pirelli sport demon', name: 'Pneu Traseiro Pirelli Sport Demon 140/70-17', price: 460.00, url: 'https://lista.mercadolivre.com.br/pneu-traseiro-140-70-17-pirelli-sport-demon' },
      { query: 'pneu dianteiro 110/70-17 pirelli sport demon', name: 'Pneu Dianteiro Pirelli Sport Demon 110/70-17', price: 380.00, url: 'https://lista.mercadolivre.com.br/pneu-dianteiro-110-70-17-pirelli-sport-demon' },
      { query: 'pastilha freio Bajaj NS 200', name: 'Jogo Pastilha de Freio Dianteira/Traseira Bajaj Dominar NS 200', price: 130.00, url: 'https://lista.mercadolivre.com.br/pastilha-freio-bajaj-ns-200' },
      { query: 'kit relação Bajaj NS 200', name: 'Kit Relação Transmissão Completo Bajaj Dominar NS 200 (Coroa + Pinhão + Corrente)', price: 280.00, url: 'https://lista.mercadolivre.com.br/kit-relacao-bajaj-ns-200' },
      { query: 'filtro óleo Bajaj NS 200', name: 'Filtro de Óleo Original Bajaj Dominar NS 200', price: 27.00, url: 'https://lista.mercadolivre.com.br/filtro-oleo-bajaj-ns-200' },
    ];
    for (const item of initialSeed) {
      await db.runAsync(
        `INSERT INTO prices_cache (search_query, product_name, price, url, expires_at)
         VALUES (?, ?, ?, ?, datetime('now', '+7 days'))`,
        item.query,
        item.name,
        item.price,
        item.url
      );
    }
  }

  return db;
}

/**
 * Retorna a instância do banco
 */
export function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ============================================================
// CONFIG
// ============================================================

export async function getConfig() {
  const row = await getDB().getFirstAsync('SELECT data FROM config WHERE id = 1');
  return row ? JSON.parse(row.data) : INITIAL_CONFIG;
}

export async function saveConfig(config) {
  await getDB().runAsync(
    'UPDATE config SET data = ?, updated_at = datetime("now") WHERE id = 1',
    JSON.stringify(config)
  );
}

export async function updateConfig(partialConfig) {
  const current = await getConfig();
  const updated = { ...current, ...partialConfig };
  await saveConfig(updated);
  return updated;
}

export async function resetConfig() {
  await saveConfig(INITIAL_CONFIG);
  return INITIAL_CONFIG;
}

// ============================================================
// EXPENSE LOGS
// ============================================================

export async function getAllLogs() {
  const rows = await getDB().getAllAsync(
    'SELECT * FROM expense_logs ORDER BY date DESC, created_at DESC'
  );
  return rows.map(rowToLog);
}

export async function addLog(logData) {
  const id = logData.id || 'log-' + Date.now();
  await getDB().runAsync(
    `INSERT INTO expense_logs (id, date, odometer_km, type, description, total_cost, liters_fuel, liters_oil_bought, liters_oil_used, km_since_last_refill, calculated_km_per_liter)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    logData.date,
    logData.odometerKm,
    logData.type,
    logData.description,
    logData.totalCost,
    logData.litersFuel || null,
    logData.litersOilBought || null,
    logData.litersOilUsed || null,
    logData.kmSinceLastRefill || null,
    logData.calculatedKmPerLiter || null
  );
  return id;
}

export async function deleteLog(id) {
  await getDB().runAsync('DELETE FROM expense_logs WHERE id = ?', id);
}

function rowToLog(row) {
  return {
    id: row.id,
    date: row.date,
    odometerKm: row.odometer_km,
    type: row.type,
    description: row.description,
    totalCost: row.total_cost,
    litersFuel: row.liters_fuel,
    litersOilBought: row.liters_oil_bought,
    litersOilUsed: row.liters_oil_used,
    kmSinceLastRefill: row.km_since_last_refill,
    calculatedKmPerLiter: row.calculated_km_per_liter,
  };
}

// ============================================================
// ODOMETER READINGS
// ============================================================

export async function getOdometerReadings(limit = 30) {
  return await getDB().getAllAsync(
    'SELECT * FROM odometer_readings ORDER BY date DESC LIMIT ?',
    limit
  );
}

export async function saveOdometerReading(date, kmEstimated, kmManual, source) {
  await getDB().runAsync(
    `INSERT OR REPLACE INTO odometer_readings (date, km_estimated, km_manual, source)
     VALUES (?, ?, ?, ?)`,
    date,
    kmEstimated,
    kmManual || null,
    source
  );
}

export async function getTotalEstimatedKm() {
  const row = await getDB().getFirstAsync(
    'SELECT SUM(COALESCE(km_manual, km_estimated)) as total FROM odometer_readings'
  );
  return row ? row.total || 0 : 0;
}

// ============================================================
// PRICES CACHE
// ============================================================

export async function getCachedPrices(query) {
  return await getDB().getAllAsync(
    `SELECT * FROM prices_cache 
     WHERE search_query = ? AND expires_at > datetime('now')
     ORDER BY price ASC`,
    query
  );
}

export async function getCachedPricesAll() {
  return await getDB().getAllAsync(
    `SELECT pc.*, pwi.category 
     FROM prices_cache pc
     LEFT JOIN price_watch_items pwi ON pc.search_query = pwi.query
     ORDER BY pc.search_query, pc.price ASC`
  );
}

export async function savePrices(query, results) {
  // Limpar cache antigo dessa query
  await getDB().runAsync('DELETE FROM prices_cache WHERE search_query = ?', query);

  // Inserir novos resultados com TTL de 7 dias
  for (const result of results) {
    await getDB().runAsync(
      `INSERT INTO prices_cache (search_query, product_name, price, url, expires_at)
       VALUES (?, ?, ?, ?, datetime('now', '+7 days'))`,
      query,
      result.productName,
      result.price,
      result.url || ''
    );
  }
}

export async function clearExpiredPrices() {
  await getDB().runAsync(
    "DELETE FROM prices_cache WHERE expires_at < datetime('now', '-30 days')"
  );
}

// ============================================================
// PRICE WATCH ITEMS
// ============================================================

export async function getPriceWatchItems() {
  return await getDB().getAllAsync(
    'SELECT * FROM price_watch_items WHERE is_active = 1 ORDER BY category'
  );
}

export async function addPriceWatchItem(query, category) {
  await getDB().runAsync(
    'INSERT INTO price_watch_items (query, category) VALUES (?, ?)',
    query,
    category || 'general'
  );
}

export async function removePriceWatchItem(id) {
  await getDB().runAsync(
    'UPDATE price_watch_items SET is_active = 0 WHERE id = ?',
    id
  );
}

// ============================================================
// EXPORT / IMPORT
// ============================================================

export async function exportAllData() {
  const config = await getConfig();
  const logs = await getAllLogs();
  const odometerReadings = await getOdometerReadings(9999);
  const priceWatchItems = await getPriceWatchItems();

  return {
    config,
    logs,
    odometerReadings,
    priceWatchItems,
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
  };
}

export async function importData(data) {
  if (data.config) {
    await saveConfig(data.config);
  }

  if (data.logs && Array.isArray(data.logs)) {
    // Limpar logs existentes e inserir importados
    await getDB().runAsync('DELETE FROM expense_logs');
    for (const log of data.logs) {
      await addLog(log);
    }
  }

  if (data.odometerReadings && Array.isArray(data.odometerReadings)) {
    await getDB().runAsync('DELETE FROM odometer_readings');
    for (const reading of data.odometerReadings) {
      await saveOdometerReading(
        reading.date,
        reading.km_estimated || reading.kmEstimated || 0,
        reading.km_manual || reading.kmManual || null,
        reading.source || 'manual'
      );
    }
  }
}
