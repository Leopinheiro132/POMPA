import * as Location from 'expo-location';
import { saveOdometerReading } from './database';

/**
 * Serviço de rastreamento GPS para odômetro preciso
 */
class LocationTracker {
  constructor() {
    this.subscription = null;
    this.isTracking = false;
    this.lastPosition = null;
    this.totalDistance = 0; // metros

    this.onDistanceUpdate = null;
  }

  /**
   * Solicita permissão de localização
   */
  async requestPermission() {
    const { status: foreground } = await Location.requestForegroundPermissionsAsync();
    if (foreground !== 'granted') {
      return false;
    }

    // Permissão de background é opcional
    try {
      const { status: background } = await Location.requestBackgroundPermissionsAsync();
    } catch (e) {
      console.warn('Permissão de background não disponível:', e);
    }

    return true;
  }

  /**
   * Inicia rastreamento GPS
   */
  async start(onDistanceUpdate) {
    if (this.isTracking) return;

    const granted = await this.requestPermission();
    if (!granted) {
      throw new Error('Permissão de localização negada');
    }

    this.onDistanceUpdate = onDistanceUpdate;
    this.isTracking = true;
    this.lastPosition = null;

    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // A cada 10 segundos
        distanceInterval: 20, // Ou a cada 20 metros
      },
      (location) => {
        this.processLocation(location);
      }
    );
  }

  /**
   * Para rastreamento GPS
   */
  stop() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isTracking = false;
  }

  /**
   * Processa nova posição GPS
   */
  processLocation(location) {
    const { latitude, longitude, speed } = location.coords;

    if (this.lastPosition) {
      const distance = haversineDistance(
        this.lastPosition.latitude,
        this.lastPosition.longitude,
        latitude,
        longitude
      );

      // Filtrar erros de GPS (distâncias absurdas = drift)
      if (distance < 1000 && distance > 5) {
        this.totalDistance += distance;

        if (this.onDistanceUpdate) {
          this.onDistanceUpdate(this.totalDistance / 1000); // km
        }
      }
    }

    this.lastPosition = { latitude, longitude };
  }

  /**
   * Salva leitura diária
   */
  async saveDailyReading() {
    const today = new Date().toISOString().split('T')[0];
    const kmEstimated = this.totalDistance / 1000;

    if (kmEstimated > 0) {
      await saveOdometerReading(today, kmEstimated, null, 'gps');
    }

    this.totalDistance = 0;
    this.lastPosition = null;
  }

  getCurrentDistanceKm() {
    return this.totalDistance / 1000;
  }
}

/**
 * Calcula distância entre dois pontos geográficos usando fórmula de Haversine
 * @returns {number} Distância em metros
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Raio da Terra em metros
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Singleton
let locationTracker = null;

export function getLocationTracker() {
  if (!locationTracker) {
    locationTracker = new LocationTracker();
  }
  return locationTracker;
}

export async function isLocationAvailable() {
  return await Location.hasServicesEnabledAsync();
}
