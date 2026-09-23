import { useState } from 'react';
import { ISM_CODE_ELEMENTS } from '../data/mockAuditData';

export default function NewFindingModal({ isOpen, onClose, onSaveFinding, vessel, auditReportNo }) {
  const [findingType, setFindingType] = useState('Non-Conformity (NC)');
  const [elementId, setElementId] = useState('6');
  const [statement, setStatement] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  
  // Default CAP dates
  const today = new Date();
  const capDefault = new Date(today);
  capDefault.setDate(today.getDate() + 30);
  const closureDefault = new Date(today);
  closureDefault.setDate(today.getDate() + 90);

  const [capDueDate, setCapDueDate] = useState(capDefault.toISOString().split('T')[0]);
  const [targetClosureDate, setTargetClosureDate] = useState(closureDefault.toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!statement.trim()) return;

    const selectedElement = ISM_CODE_ELEMENTS.find(e => e.id === elementId);

    const newFinding = {
      id: 'FIND-' + Date.now().toString().slice(-4),
      type: findingType, // 'Major Non-Conformity (MNC)' | 'Non-Conformity (NC)' | 'Observation (OBS)'
      elementCode: selectedElement ? selectedElement.code : '6.0',
      elementTitle: selectedElement ? selectedElement.title : 'Resources and Personnel',
      statement: statement.trim(),
      correctiveAction: correctiveAction.trim(),
      capDueDate,
      targetClosureDate,
      status: 'Open',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    onSaveFinding(newFinding);
    onClose();
  };

  return (
    <div className="ism-modal-backdrop" onClick={onClose}>
      <div className="ism-modal-card ism-modal-card--md" onClick={e => e.stopPropagation()}>
        <div className="ism-modal-header">
          <div>
            <h3 className="ism-modal-title">Record Audit Finding</h3>
            <p className="ism-modal-caption">
              Vessel: {vessel?.name || 'Selected Vessel'} (IMO: {vessel?.imo || '—'}) · Report: {auditReportNo || 'ISM-2026-0921'}
            </p>
          </div>
          <button type="button" className="ism-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ism-modal-body">
          {/* Finding Type */}
          <div className="ism-form-grid ism-form-grid--2">
            <div className="ism-form-field">
              <label className="ism-field-label">Finding Classification <span className="ism-req-star">*</span></label>
              <select
                className="ism-select"
                value={findingType}
                onChange={e => setFindingType(e.target.value)}
              >
                <option value="Non-Conformity (NC)">Non-Conformity (NC)</option>
                <option value="Major Non-Conformity (MNC)">Major Non-Conformity (MNC)</option>
                <option value="Observation (OBS)">Observation (OBS)</option>
              </select>
            </div>

            {/* ISM Element */}
            <div className="ism-form-field">
              <label className="ism-field-label">ISM Code Element / Clause <span className="ism-req-star">*</span></label>
              <select
                className="ism-select"
                value={elementId}
                onChange={e => setElementId(e.target.value)}
              >
                {ISM_CODE_ELEMENTS.map(el => (
                  <option key={el.id} value={el.id}>
                    Clause {el.code} - {el.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statement of Fact / Objective Evidence */}
          <div className="ism-form-field">
            <label className="ism-field-label">
              Statement of Fact / Objective Evidence <span className="ism-req-star">*</span>
            </label>
            <textarea
              className="ism-textarea"
              rows={3}
              placeholder="Detail specific non-fulfillment of ISM requirement substantiated by objective evidence..."
              value={statement}
              onChange={e => setStatement(e.target.value)}
            />
          </div>

          {/* Corrective Action Requirement */}
          <div className="ism-form-field">
            <label className="ism-field-label">Corrective Action Requirement (CAR)</label>
            <textarea
              className="ism-textarea ism-textarea--sm"
              rows={2}
              placeholder="Action required by company and vessel management to prevent recurrence..."
              value={correctiveAction}
              onChange={e => setCorrectiveAction(e.target.value)}
            />
          </div>

          {/* Due Dates */}
          <div className="ism-form-grid ism-form-grid--2">
            <div className="ism-form-field">
              <label className="ism-field-label">CAP Submission Due Date <span className="ism-req-star">*</span></label>
              <input
                type="date"
                className="ism-input"
                value={capDueDate}
                onChange={e => setCapDueDate(e.target.value)}
              />
              <span className="ism-field-hint">Normally within 30 days of audit closing</span>
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">Target Closure Date</label>
              <input
                type="date"
                className="ism-input"
                value={targetClosureDate}
                onChange={e => setTargetClosureDate(e.target.value)}
              />
              <span className="ism-field-hint">Normally within 90 days of CAP approval</span>
            </div>
          </div>
        </div>

        <div className="ism-modal-footer">
          <button type="button" className="ent-btn ent-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ent-btn ent-btn--primary"
            disabled={!statement.trim()}
            onClick={handleSave}
            id="ism-save-finding-btn"
          >
            Save Finding
          </button>
        </div>
      </div>
    </div>
  );
}
