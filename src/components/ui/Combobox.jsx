import { useState, useRef, useEffect } from 'react';
import './Combobox.css';

/**
 * Enterprise Combobox Component (Hirael / shadcn pattern)
 * Used for Vessel Search, Auto-complete, Filter Comboboxes
 *
 * Props:
 * - items: Array of { id, label, sublabel, tag, value, raw }
 * - value: currently selected item or id
 * - onSelect: callback (item) => void
 * - placeholder: input placeholder
 * - label: optional label above combobox
 * - showChips: boolean (whether to show selected chips)
 * - autoFocus: boolean
 * - className: custom class
 */
export default function Combobox({
  items = [],
  value,
  onSelect,
  placeholder = 'Search vessel name, IMO number...',
  label,
  className = '',
  disabled = false,
  emptyMessage = 'No matching vessels found.',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Find currently selected item
  const selectedItem = items.find(
    item => (item.id && item.id === value?.id) || item.value === value || item.id === value
  );

  // Filtered items
  const filteredItems = items.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchLabel = item.label?.toLowerCase().includes(q);
    const matchSub = item.sublabel?.toLowerCase().includes(q);
    const matchTag = item.tag?.toLowerCase().includes(q);
    return matchLabel || matchSub || matchTag;
  });

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
    setSearch('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearch('');
    if (onSelect) onSelect(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`hirael-combobox ${className}`} ref={containerRef}>
      {label && <label className="hirael-combobox__label">{label}</label>}

      {/* Input Group */}
      <div
        className={`hirael-combobox__input-group ${isOpen ? 'hirael-combobox__input-group--open' : ''} ${disabled ? 'hirael-combobox__input-group--disabled' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            if (inputRef.current) inputRef.current.focus();
          }
        }}
      >
        {/* Search icon */}
        <span className="hirael-combobox__search-icon" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          className="hirael-combobox__input"
          value={isOpen ? search : selectedItem ? selectedItem.label : ''}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedItem ? selectedItem.label : placeholder}
          disabled={disabled}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {/* Selected badge preview when closed */}
        {!isOpen && selectedItem?.tag && (
          <span className="hirael-combobox__selected-tag">
            {selectedItem.tag}
          </span>
        )}

        {/* Clear Button */}
        {(search || selectedItem) && (
          <button
            type="button"
            className="hirael-combobox__clear-btn"
            onClick={handleClear}
            title="Clear selection"
            aria-label="Clear selection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Trigger Button (Chevron) */}
        <button
          type="button"
          className={`hirael-combobox__trigger-btn ${isOpen ? 'hirael-combobox__trigger-btn--rotated' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen && inputRef.current) inputRef.current.focus();
            }
          }}
          aria-label="Toggle options"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Popover Content */}
      {isOpen && (
        <div className="hirael-combobox__popover" role="listbox">
          <div className="hirael-combobox__list" ref={listRef}>
            {filteredItems.length === 0 ? (
              <div className="hirael-combobox__empty">{emptyMessage}</div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = selectedItem && (selectedItem.id === item.id || selectedItem.value === item.value);
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={item.id || item.value || index}
                    className={`hirael-combobox__item ${isSelected ? 'hirael-combobox__item--selected' : ''} ${isHighlighted ? 'hirael-combobox__item--highlighted' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="hirael-combobox__item-body">
                      <div className="hirael-combobox__item-main">
                        <span className="hirael-combobox__item-label">{item.label}</span>
                        {item.tag && (
                          <span className="hirael-combobox__item-tag">{item.tag}</span>
                        )}
                      </div>
                      {item.sublabel && (
                        <div className="hirael-combobox__item-sub">{item.sublabel}</div>
                      )}
                    </div>

                    {isSelected && (
                      <span className="hirael-combobox__check-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
