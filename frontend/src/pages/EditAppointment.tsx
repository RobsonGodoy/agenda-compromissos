import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import type { Appointment, CreateAppointmentData } from '../types/appointment';
import { AppointmentForm } from '../components/AppointmentForm';

export const EditAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoadingData(true);
        const data = await appointmentsAPI.getById(parseInt(id));
        setAppointment(data);
      } catch (err) {
        setError('Compromisso não encontrado');
        console.error('Erro ao carregar:', err);
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    loadAppointment();
  }, [id, navigate]);

  const handleSubmit = async (data: CreateAppointmentData) => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await appointmentsAPI.update(parseInt(id), data);
      navigate('/');
    } catch (err) {
      setError('Erro ao atualizar compromisso. Tente novamente.');
      console.error('Erro ao atualizar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container">
        <div className="loading">Carregando compromisso...</div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>Editar Compromisso</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <AppointmentForm
          onSubmit={handleSubmit}
          initialData={appointment}
          isLoading={isLoading}
        />
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          style={{ marginTop: 'var(--spacing-sm)' }}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

