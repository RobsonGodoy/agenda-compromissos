import type { Appointment } from '../types/appointment';
import { AppointmentCard } from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: number) => void;
}

export const AppointmentList = ({
  appointments,
  onDelete,
}: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum compromisso cadastrado.</p>
        <p>Clique em "Novo Compromisso" para adicionar um.</p>
      </div>
    );
  }

  return (
    <div className="appointments-list">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

