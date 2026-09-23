import { useState, useRef, useEffect } from 'react';
import Badge from '../../../components/ui/Badge';
import { AUDITOR_DIRECTORY } from '../data/mockAuditData';

export default function AddAuditorModal({
  isOpen,
  onClose,
  onAddAuditor,
  onRemoveAuditor,
  currentAuditors = [],
}) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Auditor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [validationError, setValidationError] = useState('');

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAddingMember(false);
      setSelectedRole('Auditor');
      setSearchQuery('');
      setSelectedPerson(null);
      setIsDropdownOpen(false);
      setValidationError('');
    }
  }, [isOpen]);

  // Click outside to close the searchable dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  // Build quick lookup for currently added auditors by ID and Name
  const currentAuditorMap = new Map();
  currentAuditors.forEach(a => {
    currentAuditorMap.set(String(a.id), a);
    currentAuditorMap.set(a.name.toLowerCase(), a);
  });

  // Filter directory by name or ID
  const filteredCandidates = AUDITOR_DIRECTORY.filter(person => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      person.name.toLowerCase().includes(q) ||
      person.id.toLowerCase().includes(q) ||
      (person.station && person.station.toLowerCase().includes(q))
    );
  });

  const handleSelectPerson = (person) => {
    const existing = currentAuditorMap.get(String(person.id)) || currentAuditorMap.get(person.name.toLowerCase());
    if (existing) {
      setValidationError(`${person.name} is already assigned as ${existing.role}${existing.isLead || existing.id === '838' ? ' (Lead)' : ''}.`);
      return;
    }

    setSelectedPerson(person);
    setSearchQuery(person.name);
    setValidationError('');
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setValidationError('');
    setIsDropdownOpen(true);
    setHighlightedIndex(0);

    // If user cleared or typed away from previously selected person
    if (selectedPerson && selectedPerson.name !== val) {
      setSelectedPerson(null);
    }
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredCandidates.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredCandidates.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCandidates.length) {
        const candidate = filteredCandidates[highlightedIndex];
        handleSelectPerson(candidate);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleAddMember = () => {
    if (!selectedPerson) {
      setValidationError('Please select an accredited person from the directory.');
      return;
    }

    // Verify uniqueness rule: one person = one role, cannot be added twice
    const existing = currentAuditorMap.get(String(selectedPerson.id)) || currentAuditorMap.get(selectedPerson.name.toLowerCase());
    if (existing) {
      setValidationError(`${selectedPerson.name} is already part of the audit team.`);
      return;
    }

    onAddAuditor({
      id: selectedPerson.id,
      name: selectedPerson.name,
      email: selectedPerson.email,
      role: selectedRole,
      isLead: false,
      authorization: selectedPerson.authorization || `RMI-AUD-${selectedPerson.id}`,
      station: selectedPerson.station || 'Accredited Inspector',
      signed: false,
      signedDate: null,
      delegated: false,
    });

    // Reset inputs to allow adding more members smoothly
    setSelectedPerson(null);
    setSearchQuery('');
    setSelectedRole('Auditor');
    setValidationError('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="ism-modal-backdrop" onClick={handleClose}>
      <div
        className="ism-modal-card ism-modal-card--team"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ism-team-modal-title"
      >
        {/* Modal Header */}
        <div className="ism-modal-header">
          <div>
            <h3 className="ism-modal-title" id="ism-team-modal-title">
              Audit Team
            </h3>
            <p className="ism-modal-caption">
              Manage appointed auditors, observers, and reviewers for this ISM audit
            </p>
          </div>
          <button
            type="button"
            className="ism-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="ism-modal-body ism-modal-body--scroll">
          {/* Current Team Roster */}
          <div className="ism-team-list-section">
            <div className="ism-team-section-header">
              <span className="ism-team-section-title">Current Members</span>
              <span className="ism-team-count-badge">
                {currentAuditors.length} {currentAuditors.length === 1 ? 'member' : 'members'}
              </span>
            </div>

            <div className="ism-team-members-list">
              {currentAuditors.map(member => {
                const isLead = member.isLead || member.role === 'Lead Auditor' || member.id === '838';
                const roleBadgeVariant = isLead
                  ? 'primary'
                  : member.role === 'Observer'
                  ? 'warning'
                  : member.role === 'Reviewer'
                  ? 'info'
                  : 'neutral';

                return (
                  <div
                    key={member.id}
                    className={`ism-team-member-row ${isLead ? 'ism-team-member-row--lead' : ''}`}
                  >
                    <div className="ism-team-member-row__left">
                      <div
                        className={`ism-team-member-avatar ${
                          isLead ? 'ism-team-member-avatar--lead' : ''
                        }`}
                      >
                        {member.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="ism-team-member-info">
                        <div className="ism-team-member-name-line">
                          <span className="ism-team-member-name">{member.name}</span>
                          <span className="ism-mono-tag">ID: {member.id}</span>
                        </div>
                        <div className="ism-team-member-role-line">
                          <Badge variant={roleBadgeVariant} size="sm">
                            {member.role || 'Auditor'}
                          </Badge>
                          {isLead && (
                            <span className="ism-lead-pill">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              Lead Signatory
                            </span>
                          )}
                          <span className="ism-team-member-station">
                            {member.station || member.email || 'Accredited'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ism-team-member-row__right">
                      {isLead ? (
                        <span
                          className="ism-lead-locked-tag"
                          title="Lead Auditor is the logged-in user and cannot be removed"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                          Locked
                        </span>
                      ) : (
                        onRemoveAuditor && (
                          <button
                            type="button"
                            className="ism-team-remove-btn"
                            onClick={() => onRemoveAuditor(member.id)}
                            title={`Remove ${member.name}`}
                          >
                            Remove
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Team Member Interaction */}
          <div className="ism-team-add-container">
            {!isAddingMember ? (
              <button
                type="button"
                className="ism-team-add-trigger-btn"
                onClick={() => {
                  setIsAddingMember(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                id="ism-add-member-trigger-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>+ Add team member</span>
              </button>
            ) : (
              <div className="ism-team-add-panel">
                <div className="ism-team-add-panel__header">
                  <span className="ism-team-add-panel__title">Add Participant</span>
                  <button
                    type="button"
                    className="ism-team-add-panel__close"
                    onClick={() => {
                      setIsAddingMember(false);
                      setSelectedPerson(null);
                      setSearchQuery('');
                      setValidationError('');
                    }}
                    title="Cancel addition"
                  >
                    ✕
                  </button>
                </div>

                <div className="ism-team-add-grid">
                  {/* Role Selector */}
                  <div className="ism-form-field">
                    <label className="ism-field-label">
                      Role <span className="ism-req">*</span>
                    </label>
                    <select
                      className="ism-select"
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value)}
                      id="ism-member-role-select"
                    >
                      <option value="Auditor">Auditor</option>
                      <option value="Observer">Observer</option>
                      <option value="Reviewer">Reviewer</option>
                    </select>
                  </div>

                  {/* Searchable Name Field + Typeahead Dropdown */}
                  <div className="ism-form-field ism-typeahead-field" ref={dropdownRef}>
                    <label className="ism-field-label">
                      Name <span className="ism-req">*</span>
                    </label>
                    <div className="ism-typeahead-input-wrap">
                      <svg
                        className="ism-typeahead-search-icon"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="ism-input ism-typeahead-input"
                        placeholder="Click or type name (e.g. Pu...)"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        onKeyDown={handleKeyDown}
                        id="ism-member-name-input"
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="ism-typeahead-clear-btn"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedPerson(null);
                            setValidationError('');
                            searchInputRef.current?.focus();
                          }}
                          aria-label="Clear search"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Searchable Dropdown List */}
                    {isDropdownOpen && (
                      <div className="ism-typeahead-dropdown" id="ism-typeahead-listbox">
                        <div className="ism-typeahead-dropdown__header">
                          Accredited Auditor Directory ({filteredCandidates.length})
                        </div>
                        <div className="ism-typeahead-dropdown__list">
                          {filteredCandidates.length === 0 ? (
                            <div className="ism-typeahead-empty">
                              No matching accredited person found
                            </div>
                          ) : (
                            filteredCandidates.map((candidate, idx) => {
                              const existingMember =
                                currentAuditorMap.get(String(candidate.id)) ||
                                currentAuditorMap.get(candidate.name.toLowerCase());
                              const isAlreadyAdded = Boolean(existingMember);
                              const isSelected = selectedPerson?.id === candidate.id;
                              const isHighlighted = idx === highlightedIndex;

                              return (
                                <div
                                  key={candidate.id}
                                  className={`ism-typeahead-option ${
                                    isHighlighted ? 'ism-typeahead-option--highlighted' : ''
                                  } ${isSelected ? 'ism-typeahead-option--selected' : ''} ${
                                    isAlreadyAdded ? 'ism-typeahead-option--disabled' : ''
                                  }`}
                                  onClick={() => {
                                    if (!isAlreadyAdded) {
                                      handleSelectPerson(candidate);
                                    }
                                  }}
                                  onMouseEnter={() => setHighlightedIndex(idx)}
                                >
                                  <div className="ism-typeahead-option__avatar">
                                    {candidate.name
                                      .split(' ')
                                      .map(n => n[0])
                                      .join('')
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </div>
                                  <div className="ism-typeahead-option__info">
                                    <div className="ism-typeahead-option__title-row">
                                      <span className="ism-typeahead-option__name">
                                        {candidate.name}
                                      </span>
                                      <span className="ism-mono-tag">ID: {candidate.id}</span>
                                    </div>
                                    <div className="ism-typeahead-option__sub-row">
                                      <span>{candidate.station || candidate.email}</span>
                                      {isAlreadyAdded && (
                                        <span className="ism-already-added-tag">
                                          Already added · {existingMember.role}
                                          {existingMember.isLead || existingMember.id === '838'
                                            ? ' (Lead)'
                                            : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Read-Only ID Field */}
                  <div className="ism-form-field">
                    <label className="ism-field-label">ID (Read-Only)</label>
                    <div className="ism-input-wrap ism-input-wrap--locked">
                      <input
                        type="text"
                        className="ism-input ism-input--readonly ism-input--mono"
                        placeholder="Auto-populated"
                        value={selectedPerson ? selectedPerson.id : ''}
                        readOnly
                        id="ism-member-id-input"
                      />
                      <svg
                        className="ism-lock-icon"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <span className="ism-field-hint">Auto-populated from registry</span>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="ism-team-inline-alert" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Action buttons inside entry */}
                <div className="ism-team-add-actions">
                  <button
                    type="button"
                    className="ent-btn ent-btn--secondary ent-btn--sm"
                    onClick={() => {
                      setIsAddingMember(false);
                      setSelectedPerson(null);
                      setSearchQuery('');
                      setValidationError('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="ent-btn ent-btn--primary ent-btn--sm"
                    onClick={handleAddMember}
                    disabled={!selectedPerson}
                    id="ism-add-member-confirm-btn"
                  >
                    Add to Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="ism-modal-footer ism-modal-footer--between">
          <span className="ism-team-footer-summary">
            All assigned participants are accredited under RMI Maritime Registry.
          </span>
          <div className="ism-modal-footer-actions">
            <button
              type="button"
              className="ent-btn ent-btn--primary"
              onClick={handleClose}
              id="ism-save-team-btn"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
