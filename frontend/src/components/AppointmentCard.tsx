import type { Appointment } from '../types/appointment';
import { useNavigate } from 'react-router-dom';

interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: (id: number) => void;
}

export const AppointmentCard = ({
  appointment,
  onDelete,
}: AppointmentCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  };

  const handleEdit = () => {
    navigate(`/edit/${appointment.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      onDelete(appointment.id);
    }
  };

  return (
    <div className="appointment-card">
      <div className="appointment-card-header">
        <h3 className="appointment-card-title">{appointment.title}</h3>
      </div>
      <div className="appointment-card-datetime">
        🕐 {formatDate(appointment.datetime)}
      </div>
      {appointment.description && (
        <p className="appointment-card-description">{appointment.description}</p>
      )}
      <div className="appointment-card-actions">
        <button onClick={handleEdit} className="btn btn-primary btn-small">
          Editar
        </button>
        <button onClick={handleDelete} className="btn btn-danger btn-small">
          Excluir
        </button>
      </div>
    </div>
  );
};

