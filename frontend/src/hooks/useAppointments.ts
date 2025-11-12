import { useState, useEffect, useCallback } from 'react';
import type { Appointment } from '../types/appointment';
import { appointmentsAPI } from '../services/api';

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  loadAppointments: () => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsAPI.getAll();
      setAppointments(data);
    } catch (err) {
      const message = 'Erro ao carregar compromissos. Verifique se o backend está rodando.';
      setError(message);
      console.error('Erro ao carregar compromissos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number) => {
    try {
      await appointmentsAPI.delete(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      throw new Error('Erro ao excluir compromisso');
    }
  }, []);

  const refreshAppointments = useCallback(async () => {
    await loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,
    loading,
    error,
    loadAppointments,
    deleteAppointment,
    refreshAppointments,
  };
};

