import { useState, useMemo } from 'react';
import type { Appointment } from '../types/appointment';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateClick?: (date: Date) => void;
}

export const AppointmentCalendar = ({
  appointments,
  onDateClick,
}: AppointmentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
      hasAppointment: boolean;
      appointments: Appointment[];
    }[] = [];

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        hasAppointment: false,
        appointments: [],
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.datetime);
        return (
          aptDate.getDate() === day &&
          aptDate.getMonth() === month &&
          aptDate.getFullYear() === year
        );
      });

      days.push({
        date,
        isCurrentMonth: true,
        hasAppointment: dayAppointments.length > 0,
        appointments: dayAppointments,
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        hasAppointment: false,
        appointments: [],
      });
    }

    return days;
  }, [currentDate, appointments]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-header-top">
          <h2>Calendário de Compromissos</h2>
          <button onClick={handleToday} className="btn btn-secondary btn-small">
            📅 Hoje
          </button>
        </div>
        
        <div className="calendar-selectors">
          <div className="calendar-select-group">
            <label htmlFor="month-select">Mês:</label>
            <select
              id="month-select"
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="calendar-select"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="calendar-select-group">
            <label htmlFor="year-select">Ano:</label>
            <select
              id="year-select"
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="calendar-select"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="calendar-nav">
            <button 
              onClick={handlePrevMonth} 
              className="btn btn-icon"
              title="Mês anterior"
            >
              ←
            </button>
            <button 
              onClick={handleNextMonth} 
              className="btn btn-icon"
              title="Próximo mês"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.hasAppointment ? 'has-appointment' : ''}`}
            onClick={() => {
              if (day.isCurrentMonth && onDateClick) {
                onDateClick(day.date);
              }
            }}
            title={
              day.hasAppointment
                ? `${day.appointments.length} compromisso(s) - Clique para ver`
                : ''
            }
          >
            <div className="calendar-day-number">{day.date.getDate()}</div>
            {day.hasAppointment && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary-color)',
                  marginTop: '2px',
                }}
              >
                {day.appointments.length} 
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

