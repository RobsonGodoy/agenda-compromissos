import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateAppointmentData, Appointment } from '../types/appointment';
import { DateTimePicker } from './DateTimePicker';

interface AppointmentFormProps {
  onSubmit: (data: CreateAppointmentData) => void;
  initialData?: Appointment;
  isLoading?: boolean;
}

export const AppointmentForm = ({
  onSubmit,
  initialData,
  isLoading = false,
}: AppointmentFormProps) => {
  // Função para formatar data para datetime-local mantendo timezone local
  const formatDatetimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState<CreateAppointmentData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    datetime: initialData ? formatDatetimeLocal(initialData.datetime) : '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      datetime: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={200}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="datetime">Data e Hora *</label>
        <DateTimePicker
          id="datetime"
          name="datetime"
          value={formData.datetime}
          onChange={handleDateTimeChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

