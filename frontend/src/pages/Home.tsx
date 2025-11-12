import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Appointment } from '../types/appointment';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentList } from '../components/AppointmentList';
import { AppointmentCalendar } from '../components/AppointmentCalendar';
import { ViewToggle } from '../components/ViewToggle';
import { DayAppointmentsModal } from '../components/DayAppointmentsModal';

export const Home = () => {
  const { appointments, loading, error, deleteAppointment } = useAppointments();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      // Atualizar modal se estiver aberto
      if (modalOpen && selectedDate) {
        const dayAppointments = appointments.filter((apt) => {
          if (apt.id === id) return false;
          const aptDate = new Date(apt.datetime);
          return (
            aptDate.getDate() === selectedDate.getDate() &&
            aptDate.getMonth() === selectedDate.getMonth() &&
            aptDate.getFullYear() === selectedDate.getFullYear()
          );
        });
        setSelectedDayAppointments(dayAppointments);
      }
    } catch (err) {
      alert('Erro ao excluir compromisso');
      console.error('Erro ao excluir:', err);
    }
  };

  const handleDayClick = (date: Date) => {
    // Filtrar compromissos do dia clicado
    const dayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.datetime);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });

    // Ordenar por hora
    dayAppointments.sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    setSelectedDate(date);
    setSelectedDayAppointments(dayAppointments);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedDayAppointments([]);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando compromissos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <Link to="/new" className="btn btn-primary">
          Novo Compromisso
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Meus Compromissos</h2>
        <Link to="/new" className="btn btn-primary">
          + Novo Compromisso
        </Link>
      </div>

      <ViewToggle view={view} onViewChange={setView} />

      {view === 'list' ? (
        <AppointmentList appointments={appointments} onDelete={handleDelete} />
      ) : (
        <AppointmentCalendar 
          appointments={appointments} 
          onDateClick={handleDayClick}
        />
      )}

      <DayAppointmentsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        appointments={selectedDayAppointments}
        onDelete={handleDelete}
      />
    </div>
  );
};

