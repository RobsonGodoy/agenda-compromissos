import { useState, useRef, useEffect } from 'react';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const DateTimePicker = ({
  value,
  onChange,
  id,
  name,
  required,
  disabled,
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Formatar data para exibição
  const formatDisplayDate = (date: Date | null) => {
    if (!date || !value) return 'Selecione data e hora';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean; isSelected: boolean; isToday: boolean }[] = [];

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
      });
    }

    // Dias do mês atual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        isCurrentMonth: true,
        isSelected,
        isToday,
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const newDate = new Date(date);
    // Manter hora e minuto atuais se já existirem
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    }
    setSelectedDate(newDate);
  };

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const hours = String(selectedDate.getHours()).padStart(2, '0');
    const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
    
    const formattedValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const calendarDays = generateCalendarDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="datetime-picker" ref={containerRef}>
      <input
        type="text"
        id={id}
        name={name}
        value={formatDisplayDate(value ? new Date(value) : null)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        required={required}
        disabled={disabled}
        className="datetime-picker-input"
        placeholder="Selecione data e hora"
      />

      {isOpen && (
        <div className="datetime-picker-dropdown">
          <div className="datetime-picker-header">
            <button type="button" onClick={handlePrevMonth} className="datetime-picker-nav-btn">
              ←
            </button>
            <span className="datetime-picker-month">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" onClick={handleNextMonth} className="datetime-picker-nav-btn">
              →
            </button>
          </div>

          <button 
            type="button" 
            onClick={handleToday} 
            className="datetime-picker-today-btn"
          >
            📅 Hoje
          </button>

          <div className="datetime-picker-calendar">
            {daysOfWeek.map((day) => (
              <div key={day} className="datetime-picker-day-header">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => day.isCurrentMonth && handleDateSelect(day.date)}
                className={`datetime-picker-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isSelected ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
                disabled={!day.isCurrentMonth}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          <div className="datetime-picker-time">
            <div className="datetime-picker-time-group">
              <label>Hora:</label>
              <select
                value={selectedDate.getHours()}
                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                className="datetime-picker-select"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {String(hour).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <span className="datetime-picker-time-separator">:</span>

            <div className="datetime-picker-time-group">
              <label>Minuto:</label>
              <select
                value={Math.floor(selectedDate.getMinutes() / 5) * 5}
                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                className="datetime-picker-select"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {String(minute).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="datetime-picker-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary btn-small"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-primary btn-small"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

