import { useState, useEffect, useRef } from 'react';
import Badge from '../../../components/ui/Badge';
import { PERSONNEL_BY_TYPE, AUDITOR_DIRECTORY } from '../data/mockAuditData';

/**
 * Individual Member Row Component with Typeahead Name & Auto-populated ID
 */
function MemberRowItem({
  row,
  index,
  totalRows,
  onTypeChange,
  onNameSelect,
  onNameChange,
  onIdChange,
  onRemove,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Available personnel for this row's Type
  const typeCandidates = PERSONNEL_BY_TYPE[row.type] || AUDITOR_DIRECTORY.filter(p => p.role.includes(row.type));

  // Filter candidates by what's typed in name
  const filteredCandidates = typeCandidates.filter(c => {
    const q = row.name.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.station && c.station.toLowerCase().includes(q))
    );
  });

  // Check if current ID was auto-populated from a recognized directory member
  const matchedPerson = AUDITOR_DIRECTORY.find(
    p => p.name.toLowerCase() === row.name.trim().toLowerCase() && p.id === row.id.trim()
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleSelectCandidate = (candidate) => {
    onNameSelect(row.tempId, candidate.name, candidate.id);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (val) => {
    onNameChange(row.tempId, val);
    setIsDropdownOpen(true);

    // If typed value exactly matches a known candidate in the directory, auto-populate ONLY ID
    const exact = typeCandidates.find(c => c.name.toLowerCase() === val.trim().toLowerCase());
    if (exact) {
      onIdChange(row.tempId, exact.id);
    }
  };

  return (
    <div className="ism-drawer-member-card">
      <div className="ism-drawer-member-card__header">
        <div className="ism-drawer-member-card__badge-wrap">
          <span className="ism-drawer-member-num">Member #{index + 1}</span>
          <Badge
            variant={row.type === 'Reviewer' ? 'info' : row.type === 'Observer' ? 'warning' : 'primary'}
            size="xs"
          >
            {row.type}
          </Badge>
        </div>
        {totalRows > 1 && (
          <button
            type="button"
            className="ism-drawer-row-remove"
            onClick={() => onRemove(row.tempId)}
            title="Remove member row"
          >
            ✕ Remove
          </button>
        )}
      </div>

      <div className="ism-drawer-row-grid">
        {/* Field 1: Type Dropdown (Auditor, Reviewer, Observer) */}
        <div className="ism-form-field">
          <label className="ism-field-label">
            Type <span className="ism-req-star">*</span>
          </label>
          <div className="ism-select-icon-wrap">
            <select
              className="ism-select ism-select--enhanced"
              value={row.type}
              onChange={e => onTypeChange(row.tempId, e.target.value)}
              id={`ism-drawer-type-${index}`}
            >
              <option value="Auditor">Auditor</option>
              <option value="Reviewer">Reviewer</option>
              <option value="Observer">Observer</option>
            </select>
          </div>
        </div>

        {/* Field 2: Name Input with Searchable Dropdown (NOT auto-populated on Type change) */}
        <div className="ism-form-field ism-typeahead-field" ref={dropdownRef}>
          <div className="ism-field-label-row">
            <label className="ism-field-label">
              Name <span className="ism-req-star">*</span>
            </label>
            <span className="ism-field-hint">Click or type to search {row.type}s</span>
          </div>

          <div className="ism-typeahead-input-wrap">
            <svg
              className="ism-typeahead-search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="ism-input ism-input--with-icon ism-input--typeahead"
              placeholder={`Select or type ${row.type.toLowerCase()} name...`}
              value={row.name}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={e => handleInputChange(e.target.value)}
              autoComplete="off"
              id={`ism-drawer-name-${index}`}
            />
            {row.name && (
              <button
                type="button"
                className="ism-typeahead-clear-btn"
                onClick={() => {
                  onNameChange(row.tempId, '');
                  onIdChange(row.tempId, '');
                  setIsDropdownOpen(true);
                  inputRef.current?.focus();
                }}
                title="Clear name"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Menu */}
          {isDropdownOpen && (
            <div className="ism-typeahead-dropdown">
              <div className="ism-typeahead-dropdown__header">
                <span>Certified {row.type} Directory ({filteredCandidates.length})</span>
                <span className="ism-typeahead-dropdown__sub">Select person to auto-fill ID</span>
              </div>
              <div className="ism-typeahead-dropdown__list">
                {filteredCandidates.length === 0 ? (
                  <div className="ism-typeahead-empty">
                    <span>No {row.type} found matching "{row.name}". You can type a custom name.</span>
                  </div>
                ) : (
                  filteredCandidates.map(candidate => (
                    <div
                      key={candidate.id}
                      className={`ism-typeahead-item ${row.id === candidate.id ? 'ism-typeahead-item--selected' : ''}`}
                      onClick={() => handleSelectCandidate(candidate)}
                    >
                      <div className="ism-typeahead-avatar">
                        {candidate.name
                          .split(' ')
                          .map(w => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="ism-typeahead-item__info">
                        <div className="ism-typeahead-item__top">
                          <span className="ism-typeahead-name">{candidate.name}</span>
                          <span className="ism-typeahead-id-tag">ID: {candidate.id}</span>
                        </div>
                        <div className="ism-typeahead-item__bottom">
                          <span className="ism-typeahead-role">{candidate.role}</span>
                          {candidate.station && (
                            <span className="ism-typeahead-station">· {candidate.station}</span>
                          )}
                        </div>
                      </div>
                      {row.id === candidate.id && (
                        <div className="ism-typeahead-check">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--iri-primary)" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Field 3: ID (Auto-populates when Name is chosen from dropdown, also editable) */}
        <div className="ism-form-field">
          <div className="ism-field-label-row">
            <label className="ism-field-label">
              ID <span className="ism-req-star">*</span>
            </label>
            {matchedPerson && (
              <span className="ism-id-autopop-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Auto-populated
              </span>
            )}
          </div>
          <div className="ism-id-input-wrap">
            <input
              type="text"
              className={`ism-input ism-input--mono ${matchedPerson ? 'ism-input--autopopulated' : ''}`}
              placeholder="Auto-populated from name"
              value={row.id}
              onChange={e => onIdChange(row.tempId, e.target.value)}
              id={`ism-drawer-id-${index}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddAuditorDrawer({
  isOpen,
  onClose,
  onSaveAuditor,
  onSaveAuditors,
  currentAuditors = [],
  onRemoveAuditor,
}) {
  const [rows, setRows] = useState([
    {
      tempId: 1,
      type: 'Auditor',
      name: '', // Name will NOT autopopulate
      id: '',   // ID will autopopulate when Name is selected
    },
  ]);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setRows([
        {
          tempId: Date.now(),
          type: 'Auditor',
          name: '',
          id: '',
        },
      ]);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Add another member row with selected Type and empty Name/ID
  const handleAddRow = () => {
    const existingTypes = rows.map(r => r.type);
    let nextType = 'Auditor';
    if (!existingTypes.includes('Reviewer')) {
      nextType = 'Reviewer';
    } else if (!existingTypes.includes('Observer')) {
      nextType = 'Observer';
    } else {
      nextType = 'Auditor';
    }

    setRows(prev => [
      ...prev,
      {
        tempId: Date.now() + Math.random(),
        type: nextType,
        name: '', // Name will NOT autopopulate
        id: '',
      },
    ]);
  };

  const handleRemoveRow = (tempId) => {
    if (rows.length <= 1) return;
    setRows(prev => prev.filter(r => r.tempId !== tempId));
  };

  // Change Type for a specific row — resets Name and ID (Name will NOT autopopulate)
  const handleTypeChange = (tempId, newType) => {
    setRows(prev =>
      prev.map(r => {
        if (r.tempId === tempId) {
          return {
            ...r,
            type: newType,
            name: '', // Reset name on type change
            id: '',   // Reset id on type change
          };
        }
        return r;
      })
    );
  };

  // When candidate is selected from dropdown: sets Name and ONLY ID auto-populates
  const handleNameSelect = (tempId, nameVal, idVal) => {
    setRows(prev =>
      prev.map(r => (r.tempId === tempId ? { ...r, name: nameVal, id: idVal } : r))
    );
  };

  const handleNameChange = (tempId, nameVal) => {
    setRows(prev =>
      prev.map(r => (r.tempId === tempId ? { ...r, name: nameVal } : r))
    );
  };

  const handleIdChange = (tempId, idVal) => {
    setRows(prev =>
      prev.map(r => (r.tempId === tempId ? { ...r, id: idVal } : r))
    );
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const incompleteRows = rows.filter(r => (r.name.trim() && !r.id.trim()) || (!r.name.trim() && r.id.trim()));
    if (incompleteRows.length > 0) {
      alert('Please enter both Name and ID for each member.');
      return;
    }

    const validRows = rows.filter(r => r.name.trim() && r.id.trim());
    if (validRows.length === 0) {
      alert('Please select or enter at least one team member name and ID.');
      return;
    }

    const newRecords = validRows.map(r => ({
      id: r.id.trim(),
      name: r.name.trim(),
      type: r.type,
      role: r.type,
      status: 'Active',
    }));

    if (onSaveAuditors) {
      onSaveAuditors(newRecords);
    } else if (onSaveAuditor) {
      newRecords.forEach(rec => onSaveAuditor(rec));
    }
    onClose();
  };

  return (
    <div className="ism-drawer-backdrop" onClick={onClose}>
      <aside
        className="ism-drawer ism-drawer--wide"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ism-drawer-title"
      >
        {/* ── Drawer Header ── */}
        <div className="ism-drawer__header">
          <div className="ism-drawer__title-wrap">
            <div className="ism-drawer__icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <div>
              <h3 className="ism-drawer__title" id="ism-drawer-title">Add Audit Team</h3>
              <p className="ism-drawer__caption">
                Add Auditor, Reviewer, or Observer. Choose name from dropdown to auto-fill ID.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ism-drawer__close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* ── Drawer Form Body ── */}
        <form onSubmit={handleSave} className="ism-drawer__form">
          <div className="ism-drawer__body">
            {/* Current Appointed Team (Lead Auditor Edwin D & other assigned members) */}
            {currentAuditors.length > 0 && (
              <div className="ism-drawer-current-team">
                <div className="ism-team-section-header">
                  <span className="ism-team-section-title">Current Appointed Members</span>
                  <span className="ism-team-count-badge">
                    {currentAuditors.length} {currentAuditors.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="ism-drawer-team-chips">
                  {currentAuditors.map(m => {
                    const isLead = m.isLead || m.id === '838' || m.role === 'Lead Auditor';
                    const roleType = m.type || m.role || 'Auditor';
                    const badgeVariant = isLead
                      ? 'primary'
                      : roleType === 'Reviewer'
                      ? 'info'
                      : roleType === 'Observer'
                      ? 'warning'
                      : 'scheduled';

                    return (
                      <div key={`${m.id}-${roleType}`} className="ism-drawer-member-chip">
                        <Badge variant={badgeVariant} size="xs">
                          {isLead ? 'Lead Auditor' : roleType}
                        </Badge>
                        <span className="ism-chip-name">{m.name}</span>
                        <span className="ism-chip-id">({m.id})</span>
                        {!isLead && onRemoveAuditor && (
                          <button
                            type="button"
                            className="ism-chip-remove"
                            onClick={() => onRemoveAuditor(m.id)}
                            title="Remove member"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* List of Member Rows */}
            <div className="ism-drawer-member-list">
              {rows.map((row, index) => (
                <MemberRowItem
                  key={row.tempId}
                  row={row}
                  index={index}
                  totalRows={rows.length}
                  onTypeChange={handleTypeChange}
                  onNameSelect={handleNameSelect}
                  onNameChange={handleNameChange}
                  onIdChange={handleIdChange}
                  onRemove={handleRemoveRow}
                />
              ))}
            </div>

            {/* + Add Member Button */}
            <button
              type="button"
              className="ism-add-row-btn"
              onClick={handleAddRow}
              id="ism-drawer-add-another-btn"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>+ Add Member</span>
            </button>
          </div>

          {/* ── Drawer Footer ── */}
          <div className="ism-drawer__footer">
            <button
              type="button"
              className="ent-btn ent-btn--secondary"
              onClick={onClose}
              id="ism-drawer-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ent-btn ent-btn--primary"
              id="ism-drawer-save-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Save Members ({rows.filter(r => r.name.trim() && r.id.trim()).length || rows.length})</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
