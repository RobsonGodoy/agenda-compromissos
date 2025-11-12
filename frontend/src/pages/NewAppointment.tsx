import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../services/api';
import type { CreateAppointmentData } from '../types/appointment';
import { AppointmentForm } from '../components/AppointmentForm';

export const NewAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateAppointmentData) => {
    try {
      setIsLoading(true);
      setError(null);
      await appointmentsAPI.create(data);
      navigate('/');
    } catch (err) {
      setError('Erro ao criar compromisso. Verifique os dados e tente novamente.');
      console.error('Erro ao criar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>Novo Compromisso</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <AppointmentForm onSubmit={handleSubmit} isLoading={isLoading} />
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

