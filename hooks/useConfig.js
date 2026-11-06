import { useState, useEffect, useCallback } from 'react';
import { getConfig, saveConfig, updateConfig, resetConfig } from '../services/database';

/**
 * Hook para gerenciar a configuração do app
 * Lê do SQLite e mantém em memória para performance
 */
export function useConfig() {
  const [config, setConfigState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar config inicial
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConfig();
      setConfigState(data);
    } catch (err) {
      console.error('Erro ao carregar config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setConfig = useCallback(async (newConfigOrUpdater) => {
    try {
      let newConfig;
      if (typeof newConfigOrUpdater === 'function') {
        setConfigState((prev) => {
          newConfig = newConfigOrUpdater(prev);
          return newConfig;
        });
        // Precisamos esperar o state atualizar
        // Salvamos com timeout para garantir
        setTimeout(async () => {
          if (newConfig) await saveConfig(newConfig);
        }, 0);
      } else {
        newConfig = newConfigOrUpdater;
        setConfigState(newConfig);
        await saveConfig(newConfig);
      }
    } catch (err) {
      console.error('Erro ao salvar config:', err);
    }
  }, []);

  const handleUpdateConfig = useCallback(async (partial) => {
    try {
      const updated = await updateConfig(partial);
      setConfigState(updated);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar config:', err);
    }
  }, []);

  const handleUpdateRoutes = useCallback(async (routesPartial) => {
    setConfigState((prev) => {
      const updated = {
        ...prev,
        routes: { ...prev.routes, ...routesPartial },
      };
      saveConfig(updated);
      return updated;
    });
  }, []);

  const handleResetConfig = useCallback(async () => {
    try {
      const defaultConfig = await resetConfig();
      setConfigState(defaultConfig);
      return defaultConfig;
    } catch (err) {
      console.error('Erro ao resetar config:', err);
    }
  }, []);

  return {
    config,
    loading,
    setConfig,
    updateConfig: handleUpdateConfig,
    updateRoutes: handleUpdateRoutes,
    resetConfig: handleResetConfig,
    reloadConfig: loadConfig,
  };
}
