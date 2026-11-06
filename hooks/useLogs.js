import { useState, useEffect, useCallback } from 'react';
import { getAllLogs, addLog, deleteLog } from '../services/database';

/**
 * Hook para gerenciar os lançamentos de despesas
 */
export function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllLogs();
      setLogs(data);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddLog = useCallback(async (logData) => {
    try {
      const id = await addLog(logData);
      const newLog = { ...logData, id };
      setLogs((prev) => [newLog, ...prev]);
      return id;
    } catch (err) {
      console.error('Erro ao adicionar log:', err);
      throw err;
    }
  }, []);

  const handleDeleteLog = useCallback(async (id) => {
    try {
      await deleteLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Erro ao deletar log:', err);
      throw err;
    }
  }, []);

  return {
    logs,
    loading,
    addLog: handleAddLog,
    deleteLog: handleDeleteLog,
    reloadLogs: loadLogs,
  };
}
