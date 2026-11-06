import { Accelerometer } from 'expo-sensors';
import { saveOdometerReading } from './database';

// Constantes de calibração
const GRAVITY = 9.81; // m/s²
const SAMPLE_INTERVAL_MS = 1000; // 1 segundo entre amostras
const IDLE_THRESHOLD_MS = 30000; // 30s parado = para de contar
const MIN_ACCELERATION_THRESHOLD = 0.15; // Aceleração mínima para considerar movimento (em g)

/**
 * Converte aceleração de g para m/s²
 */
function gToMs2(g) {
  return g * GRAVITY;
}

/**
 * Estima velocidade a partir do acelerômetro
 * NOTA: Integração simples com filtro. Precisão limitada.
 */
class AccelerometerTracker {
  constructor(thresholdKmh = 12) {
    this.subscription = null;
    this.isTracking = false;
    this.thresholdMs = (thresholdKmh / 3.6); // Converter km/h para m/s

    // Estado do rastreamento
    this.velocity = 0; // m/s
    this.distance = 0; // metros acumulados
    this.lastTimestamp = null;
    this.idleStartTime = null;

    // Filtro passa-alta para remover gravidade
    this.prevAccel = { x: 0, y: 0, z: 0 };
    this.alpha = 0.8; // Fator do filtro

    // Callback para atualização
    this.onDistanceUpdate = null;
  }

  /**
   * Inicia rastreamento via acelerômetro
   */
  start(onDistanceUpdate) {
    if (this.isTracking) return;

    this.onDistanceUpdate = onDistanceUpdate;
    this.isTracking = true;
    this.lastTimestamp = Date.now();
    this.idleStartTime = null;

    Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);

    this.subscription = Accelerometer.addListener((data) => {
      this.processAccelerometerData(data);
    });
  }

  /**
   * Para rastreamento
   */
  stop() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isTracking = false;
  }

  /**
   * Processa dados do acelerômetro
   */
  processAccelerometerData(rawData) {
    const now = Date.now();
    const dt = (now - this.lastTimestamp) / 1000; // delta em segundos
    this.lastTimestamp = now;

    if (dt <= 0 || dt > 5) return; // Proteção contra timestamps inválidos

    // Filtro passa-alta para remover componente gravitacional
    const filteredX = this.alpha * (this.prevAccel.x + rawData.x - this.prevAccel.x);
    const filteredY = this.alpha * (this.prevAccel.y + rawData.y - this.prevAccel.y);
    const filteredZ = this.alpha * (this.prevAccel.z + rawData.z - this.prevAccel.z);

    this.prevAccel = { x: rawData.x, y: rawData.y, z: rawData.z };

    // Magnitude da aceleração linear (sem gravidade)
    const linearAccelG = Math.sqrt(
      filteredX * filteredX +
      filteredY * filteredY +
      filteredZ * filteredZ
    );

    // Se aceleração é significativa (não é ruído)
    if (linearAccelG > MIN_ACCELERATION_THRESHOLD) {
      const accelMs2 = gToMs2(linearAccelG);

      // Integração simples: velocidade = velocidade + aceleração * dt
      this.velocity += accelMs2 * dt;

      // Limitar velocidade máxima razoável (200 km/h = 55.5 m/s)
      this.velocity = Math.min(this.velocity, 55.5);

      // Se velocidade acima do threshold, acumular distância
      if (this.velocity > this.thresholdMs) {
        const distanceIncrement = this.velocity * dt; // metros
        this.distance += distanceIncrement;
        this.idleStartTime = null;

        if (this.onDistanceUpdate) {
          this.onDistanceUpdate(this.distance / 1000); // Retorna em km
        }
      }
    } else {
      // Sem movimento significativo
      // Desacelerar gradualmente (fricção simulada)
      this.velocity *= 0.95;

      if (this.velocity < 0.5) {
        this.velocity = 0;

        // Contar tempo parado
        if (!this.idleStartTime) {
          this.idleStartTime = now;
        } else if (now - this.idleStartTime > IDLE_THRESHOLD_MS) {
          // Parado por mais de 30s — pode parar sensor para economia
          // (O componente que chamou deve lidar com isso)
        }
      }
    }
  }

  /**
   * Salva leitura diária no SQLite
   */
  async saveDailyReading() {
    const today = new Date().toISOString().split('T')[0];
    const kmEstimated = this.distance / 1000;

    if (kmEstimated > 0) {
      await saveOdometerReading(today, kmEstimated, null, 'accelerometer');
    }

    // Resetar contadores para o próximo dia
    this.distance = 0;
    this.velocity = 0;
  }

  /**
   * Retorna distância atual em km
   */
  getCurrentDistanceKm() {
    return this.distance / 1000;
  }

  /**
   * Retorna velocidade atual em km/h
   */
  getCurrentSpeedKmh() {
    return this.velocity * 3.6;
  }

  /**
   * Verifica se está parado
   */
  isIdle() {
    return this.velocity < 0.5;
  }
}

// Instância singleton
let tracker = null;

export function getAccelerometerTracker(thresholdKmh) {
  if (!tracker) {
    tracker = new AccelerometerTracker(thresholdKmh);
  }
  return tracker;
}

/**
 * Verifica se o acelerômetro está disponível no dispositivo
 */
export async function isAccelerometerAvailable() {
  return await Accelerometer.isAvailableAsync();
}
