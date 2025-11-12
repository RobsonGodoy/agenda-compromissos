interface ViewToggleProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="view-toggle">
      <button
        className={view === 'list' ? 'active' : ''}
        onClick={() => onViewChange('list')}
      >
        Lista de compromissos
      </button>
      <button
        className={view === 'calendar' ? 'active' : ''}
        onClick={() => onViewChange('calendar')}
      >
        Calendário de compromissos
      </button>
    </div>
  );
};

