import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../types/appointment';
import { Modal } from './Modal';

interface DayAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  appointments: Appointment[];
  onDelete: (id: number) => void;
}

export const DayAppointmentsModal = ({
  isOpen,
  onClose,
  date,
  appointments,
  onDelete,
}: DayAppointmentsModalProps) => {
  const navigate = useNavigate();

  if (!date) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
    onClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      onDelete(id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="day-modal-header">
        <h2 className="day-modal-title">
          📅 {formatDate(date).charAt(0).toUpperCase() + formatDate(date).slice(1)}
        </h2>
        <p className="day-modal-count">
          {appointments.length} {appointments.length === 1 ? 'compromisso' : 'compromissos'}
        </p>
      </div>

      <div className="day-modal-appointments">
        {appointments.length === 0 ? (
          <div className="day-modal-empty">
            <p>Nenhum compromisso para este dia.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="day-modal-appointment">
              <div className="day-modal-appointment-time">
                🕐 {formatTime(appointment.datetime)}
              </div>
              <div className="day-modal-appointment-content">
                <h3 className="day-modal-appointment-title">{appointment.title}</h3>
                {appointment.description && (
                  <p className="day-modal-appointment-description">
                    {appointment.description}
                  </p>
                )}
              </div>
              <div className="day-modal-appointment-actions">
                <button
                  onClick={() => handleEdit(appointment.id)}
                  className="btn btn-primary btn-small"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="btn btn-danger btn-small"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
