import { SearchIcon, CloseIcon } from './icons';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder, autoFocus }) {
  return (
    <div className="search-bar">
      <SearchIcon className="search-bar__icon" width={20} height={20} />
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange('')} aria-label="Clear">
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </div>
  );
}
