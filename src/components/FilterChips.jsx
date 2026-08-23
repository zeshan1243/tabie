import './FilterChips.css';

export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="filter-chips hide-scrollbar" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          className={`filter-chip ${value === opt.id ? 'is-active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
