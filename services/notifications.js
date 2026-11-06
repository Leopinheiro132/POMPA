import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { isMaintenanceUrgent, getKmRemaining, getLastDayOfMonth } from '../utils/calculations';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Configurar comportamento das notificações
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  console.warn('Não foi possível configurar handler de notificações:', e);
}

/**
 * Solicita permissão para notificações
 */
export async function requestNotificationPermission() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (err) {
    console.warn('Erro ao solicitar permissões de notificação:', err);
    return false;
  }
}

/**
 * Agenda todas as notificações do app
 */
export async function scheduleAllNotifications(config) {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn('Permissão de notificação negada');
      return;
    }

    // Cancelar todas as notificações agendadas anteriormente
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 1. Notificação diária de manutenção (08:00)
    await scheduleDailyMaintenanceCheck(config);

    // 2. Fim do mês — atualizar gastos (19:00 do último dia)
    await scheduleEndOfMonthReminder();

    // 3. Dia 1 — registrar odômetro (10:00)
    await scheduleOdometerReminder();
  } catch (err) {
    console.warn('Agendamento de notificações falhou (esperado no Expo Go):', err?.message || err);
  }
}

/**
 * Notificação diária de verificação de manutenção
 */
async function scheduleDailyMaintenanceCheck(config) {
  // Verificar se alguma peça está próxima da troca
  const wearItems = [
    { id: 'oil', name: 'Óleo Motor', lifespan: config.oilChangeIntervalKm },
    { id: 'oil_filter', name: 'Filtro de Óleo', lifespan: config.oilFilterIntervalKm },
    { id: 'tire_rear', name: 'Pneu Traseiro', lifespan: config.pneuTraseiroLifespanKm },
    { id: 'tire_front', name: 'Pneu Dianteiro', lifespan: config.pneuDianteiroLifespanKm },
    { id: 'brakes', name: 'Pastilhas de Freio', lifespan: config.pastilhasLifespanKm },
    { id: 'chain', name: 'Kit Relação', lifespan: config.relacaoLifespanKm },
  ];

  const urgentItems = wearItems.filter((item) => {
    const lastChanged = config.lastChangedKmMap?.[item.id] || 0;
    return isMaintenanceUrgent(config.currentOdometer, lastChanged, item.lifespan);
  });

  if (urgentItems.length > 0) {
    const names = urgentItems.map((i) => i.name).join(', ');
    const firstItem = urgentItems[0];
    const kmLeft = getKmRemaining(
      config.currentOdometer,
      config.lastChangedKmMap?.[firstItem.id] || 0,
      firstItem.lifespan
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔧 Manutenção Próxima!',
        body: `${firstItem.name} está a ${Math.round(kmLeft)} km da troca! Itens pendentes: ${names}`,
        data: { screen: 'oleo-desgaste' },
      },
      trigger: {
        type: 'daily',
        hour: 8,
        minute: 0,
      },
    });
  }
}

/**
 * Notificação de fim do mês para atualizar gastos
 */
async function scheduleEndOfMonthReminder() {
  const lastDay = getLastDayOfMonth();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Fim do mês!',
      body: 'Hora de atualizar seus gastos do mês. Abra o app e registre os lançamentos pendentes.',
      data: { screen: 'lancamentos' },
    },
    trigger: {
      type: 'monthly',
      day: lastDay,
      hour: 19,
      minute: 0,
    },
  });
}

/**
 * Notificação do dia 1 para registrar odômetro
 */
async function scheduleOdometerReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🏍️ Registre o Odômetro!',
      body: 'Início de mês! Olhe o km no painel da moto e registre no app para manter os cálculos precisos.',
      data: { screen: 'odometro' },
    },
    trigger: {
      type: 'monthly',
      day: 1,
      hour: 10,
      minute: 0,
    },
  });
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Retorna as notificações agendadas (para debug)
 */
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
