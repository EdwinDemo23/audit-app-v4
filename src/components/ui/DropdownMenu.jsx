import { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

/**
 * Enterprise Dropdown Menu / Select
 * Implements Hirael / shadcn clean popover trigger and item list
 */
export default function DropdownMenu({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  label,
  icon,
  className = '',
  size = 'md',
  align = 'left',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options into { value, label }
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`ent-dropdown ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`ent-dropdown__trigger ent-dropdown__trigger--${size} ${isOpen ? 'ent-dropdown__trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && <span className="ent-dropdown__icon">{icon}</span>}
        <span className="ent-dropdown__label">
          {label && <span className="ent-dropdown__prefix">{label}: </span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`ent-dropdown__chevron ${isOpen ? 'ent-dropdown__chevron--rotated' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={`ent-dropdown__popover ent-dropdown__popover--${align}`} role="listbox">
          <div className="ent-dropdown__list">
            {normalizedOptions.map(opt => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`ent-dropdown__item ${isSelected ? 'ent-dropdown__item--selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="ent-dropdown__item-label">{opt.label}</span>
                  {isSelected && (
                    <svg
                      className="ent-dropdown__item-check"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
