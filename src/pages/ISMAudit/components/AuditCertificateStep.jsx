import Badge from '../../../components/ui/Badge';
import { AUDITOR_DIRECTORY } from '../data/mockAuditData';

export default function AuditCertificateStep({
  auditData,
  onAuditDataChange,
  validationErrors,
  isLocked,
  onOpenAddAuditor,
  availableAuditors = [],
  auditors = [],
  onRemoveAuditor,
}) {
  const handleChange = (field, value) => {
    if (isLocked) return;
    onAuditDataChange(field, value);
  };

  // Merge directory and custom/state auditors
  const auditorMap = new Map();
  AUDITOR_DIRECTORY.forEach(a => auditorMap.set(String(a.id), a));
  [...availableAuditors, ...auditors].forEach(a => auditorMap.set(String(a.id), a));
  if (auditData?.auditorId && auditData?.auditorName) {
    if (!auditorMap.has(String(auditData.auditorId))) {
      auditorMap.set(String(auditData.auditorId), {
        id: String(auditData.auditorId),
        name: auditData.auditorName,
        role: 'Auditor',
      });
    }
  }
  const allSelectableAuditors = Array.from(auditorMap.values());

  const handleSelectAuditor = (selectedId) => {
    const chosen = allSelectableAuditors.find(a => String(a.id) === String(selectedId));
    if (chosen) {
      handleChange('auditorName', chosen.name);
      handleChange('auditorId', chosen.id);
    }
  };

  return (
    <div className="ism-form-step">
      {/* ── Single Unified Card: Audit / Certificate ── */}
      <div className="ent-card ism-form-card ism-audit-cert-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Audit / Certificate</h3>
            <span className="ent-card__caption">
              Audit particulars, statutory certificate assignment, and audit schedule dates
            </span>
          </div>
          <div className="ism-header-actions-group">
            {/* <Badge variant="scheduled" size="sm">
              Status: {auditData?.auditStatus || 'COMMENCED'}
            </Badge> */}
            {!isLocked && onOpenAddAuditor && (
              <button
                type="button"
                className="ent-btn ent-btn--secondary ent-btn--sm ism-add-auditor-header-btn"
                onClick={onOpenAddAuditor}
                id="ism-add-auditor-header-btn"
                title="Add a new auditor via side drawer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Add Auditor</span>
              </button>
            )}
          </div>
        </div>

        <div className="ism-form-grid ism-form-grid--4">
          {/* ── Row 1: Auditor & Identification ── */}
          {/* 1. Auditor Name — select existing or click + Add Auditor to open right drawer */}
          <div className="ism-form-field">
            <div className="ism-field-label-row">
              <label className="ism-field-label">Auditor Name</label>
              {/*  */}
            </div>
            <select
              className="ism-select"
              value={auditData?.auditorId || ''}
              onChange={e => handleSelectAuditor(e.target.value)}
              disabled={isLocked}
              id="ism-auditor-name-select"
            >
              {auditData?.auditorName && !allSelectableAuditors.some(a => String(a.id) === String(auditData.auditorId)) && (
                <option value={auditData.auditorId}>
                  {auditData.auditorName} ({auditData.auditorId})
                </option>
              )}
              {allSelectableAuditors.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.id}) · {a.role || 'Auditor'}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Auditor ID — auto-populated from selected auditor */}
          <div className="ism-form-field">
            <label className="ism-field-label">Auditor ID</label>
            <input
              type="text"
              className="ism-input ism-input--readonly"
              placeholder="Auto-populated"
              value={auditData?.auditorId || ''}
              readOnly
              id="ism-auditor-id-input"
            />
          </div>

          {/* 3. Audit Report No. — auto-populated on Audit Sub Type selection */}
          <div className="ism-form-field">
            <label className="ism-field-label">Audit Report No.</label>
            <input
              type="text"
              className="ism-input ism-input--readonly"
              placeholder={auditData?.auditSubType ? 'Audit Report No.' : 'Select Sub Type to populate'}
              value={auditData?.auditReportNo || ''}
              readOnly
            />
          </div>

          {/* 4. Audit Sub Type — dropdown (Primary trigger for Certificate auto-population) */}
          <div className={`ism-form-field ${validationErrors?.auditSubType ? 'ism-form-field--error' : ''}`}>
            <label className="ism-field-label">
              Audit Sub Type <span className="ism-req-star">*</span>
            </label>
            <select
              className="ism-select"
              value={auditData?.auditSubType || ''}
              onChange={e => handleChange('auditSubType', e.target.value)}
              disabled={isLocked}
              id="ism-sub-type-select"
            >
              <option value="">-- Select Audit Sub Type --</option>
              <option value="INTERIM">INTERIM</option>
              <option value="INITIAL">INITIAL</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="RENEWAL">RENEWAL</option>
              <option value="ADDITIONAL">ADDITIONAL</option>
            </select>
            {validationErrors?.auditSubType && (
              <span className="ism-field-error-text">{validationErrors.auditSubType}</span>
            )}
          </div>

          {/* ── Row 2: Parameters, Dates & Status ── */}
          {/* 5. Scope — auto-populated on Audit Sub Type selection, editable */}
          <div className="ism-form-field">
            <label className="ism-field-label">Scope</label>
            <select
              className="ism-select"
              value={auditData?.scope || ''}
              onChange={e => handleChange('scope', e.target.value)}
              disabled={isLocked}
              id="ism-scope-select"
            >
              <option value="">-- Select Scope --</option>
              <option value="Full Scope">Full Scope</option>
              <option value="Half Scope">Half Scope</option>
              <option value="Reduced Scope">Reduced Scope</option>
            </select>
          </div>

          {/* 6. Audit Date — auto-populated on Vessel selection, date selector */}
          <div className={`ism-form-field ${validationErrors?.auditDate ? 'ism-form-field--error' : ''}`}>
            <label className="ism-field-label">
              Audit Date <span className="ism-req-star">*</span>
            </label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.auditDate || ''}
              onChange={e => handleChange('auditDate', e.target.value)}
              disabled={isLocked}
              id="ism-audit-date-input"
            />
            {validationErrors?.auditDate && (
              <span className="ism-field-error-text">{validationErrors.auditDate}</span>
            )}
          </div>

          {/* 7. Audit Place */}
          <div className={`ism-form-field ${validationErrors?.auditPlace ? 'ism-form-field--error' : ''}`}>
            <label className="ism-field-label">
              Audit Place <span className="ism-req-star">*</span>
            </label>
            <input
              type="text"
              className="ism-input"
              placeholder="e.g. Port of Singapore, SGP"
              value={auditData?.auditPlace || ''}
              onChange={e => handleChange('auditPlace', e.target.value)}
              disabled={isLocked}
              id="ism-audit-place-input"
            />
            {validationErrors?.auditPlace && (
              <span className="ism-field-error-text">{validationErrors.auditPlace}</span>
            )}
          </div>

          {/* 8. Audit Status — dropdown */}
          <div className="ism-form-field">
            <label className="ism-field-label">Audit Status</label>
            <select
              className="ism-select"
              value={auditData?.auditStatus || 'COMMENCED'}
              onChange={e => handleChange('auditStatus', e.target.value)}
              disabled={isLocked}
              id="ism-audit-status-select"
            >
              <option value="COMMENCED">COMMENCED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="VOID">VOID</option>
              <option value="REOPEN">REOPEN</option>
            </select>
          </div>

          {/* ── Row 3: Statutory Certificate Particulars ── */}
          {/* 9. Certificate No. — auto-populated on Audit Sub Type selection, editable */}
          <div className="ism-form-field">
            <label className="ism-field-label">Certificate No.</label>
            <input
              type="text"
              className="ism-input"
              placeholder={auditData?.auditSubType ? "Certificate No." : "Select Sub Type to populate"}
              value={auditData?.certificateNo || ''}
              onChange={e => handleChange('certificateNo', e.target.value)}
              disabled={isLocked}
              id="ism-cert-no-input"
            />
          </div>

          {/* 10. Certificate Issued — auto-populated on Audit Sub Type selection, editable */}
          <div className="ism-form-field">
            <label className="ism-field-label">Certificate Issued</label>
            <select
              className="ism-select"
              value={auditData?.certificateIssued || ''}
              onChange={e => handleChange('certificateIssued', e.target.value)}
              disabled={isLocked}
              id="ism-cert-issued-select"
            >
              <option value="">-- Select Certificate Issued --</option>
              <option value="Safety Management Certificate (SMC)">Safety Management Certificate (SMC)</option>
              <option value="Interim SMC">Interim SMC</option>
              <option value="Short Term SMC">Short Term SMC</option>
              <option value="Intermediate Endorsed">Intermediate Endorsed</option>
              <option value="Additional Endorsed">Additional Endorsed</option>
              <option value="Extension of SMC">Extension of SMC (ISM 13.12)</option>
            </select>
          </div>

          {/* 11. Issue Date — auto-populated on Audit Sub Type selection, editable date selector */}
          <div className="ism-form-field">
            <label className="ism-field-label">Issue Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.issueDate || ''}
              onChange={e => handleChange('issueDate', e.target.value)}
              disabled={isLocked}
              id="ism-issue-date-input"
            />
          </div>

          {/* 12. Expiry Date — auto-populated on Audit Sub Type selection, editable date selector */}
          <div className="ism-form-field">
            <label className="ism-field-label">Expiry Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.expiryDate || ''}
              onChange={e => handleChange('expiryDate', e.target.value)}
              disabled={isLocked}
              id="ism-expiry-date-input"
            />
          </div>

          {/* ── Row 4: Audit Schedule & Meeting Dates (STRICTLY MANUAL) ── */}
          {/* 13. Internal Audit Date — Strictly Manual */}
          <div className="ism-form-field">
            <label className="ism-field-label">Internal Audit Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.internalAuditDate || ''}
              onChange={e => handleChange('internalAuditDate', e.target.value)}
              disabled={isLocked}
              id="ism-internal-audit-date-input"
            />
          </div>

          {/* 14. Opening Meeting Date — Strictly Manual */}
          <div className={`ism-form-field ${validationErrors?.meetingDates ? 'ism-form-field--error' : ''}`}>
            <label className="ism-field-label">Opening Meeting Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.openingMeetingDate || ''}
              onChange={e => handleChange('openingMeetingDate', e.target.value)}
              disabled={isLocked}
              id="ism-opening-meeting-date-input"
            />
          </div>

          {/* 15. Closing Meeting Date — Strictly Manual */}
          <div className={`ism-form-field ${validationErrors?.meetingDates ? 'ism-form-field--error' : ''}`}>
            <label className="ism-field-label">Closing Meeting Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.closingMeetingDate || ''}
              onChange={e => handleChange('closingMeetingDate', e.target.value)}
              disabled={isLocked}
              id="ism-closing-meeting-date-input"
            />
            {validationErrors?.meetingDates && (
              <span className="ism-field-error-text">{validationErrors.meetingDates}</span>
            )}
          </div>

          {/* 16. Credit Date — Strictly Manual */}
          <div className="ism-form-field">
            <label className="ism-field-label">Credit Date</label>
            <input
              type="date"
              className="ism-input"
              value={auditData?.creditDate || ''}
              onChange={e => handleChange('creditDate', e.target.value)}
              disabled={isLocked}
              id="ism-credit-date-input"
            />
          </div>
        </div>

        {/* ── Appointed Audit Team Section (Multiple Auditors, Reviewers, Observers) ── */}
        {auditors.length > 0 && (
          <div className="ism-cert-team-roster">
            <div className="ism-cert-team-roster__header">
              <div className="ism-cert-team-roster__title-group">
                <span className="ism-cert-team-roster__title">Appointed Audit Team</span>
                <span className="ism-cert-team-roster__sub">
                  Auditors, Technical Reviewers, and Observers assigned to this audit
                </span>
              </div>
              {!isLocked && onOpenAddAuditor && (
                <button
                  type="button"
                  className="ent-btn ent-btn--secondary ent-btn--xs"
                  onClick={onOpenAddAuditor}
                  id="ism-add-team-member-inline-btn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>+ Add Auditor / Reviewer / Observer</span>
                </button>
              )}
            </div>

            <div className="ism-cert-team-grid">
              {auditors.map(member => {
                const isLead = member.isLead || member.id === '838' || member.role === 'Lead Auditor';
                const roleType = member.type || member.role || 'Auditor';
                const badgeVariant = isLead
                  ? 'primary'
                  : roleType === 'Reviewer'
                  ? 'info'
                  : roleType === 'Observer'
                  ? 'warning'
                  : 'scheduled';

                return (
                  <div key={`${member.id}-${roleType}`} className={`ism-team-chip-card ${isLead ? 'ism-team-chip-card--lead' : ''}`}>
                    <div className="ism-team-chip-card__header">
                      <Badge variant={badgeVariant} size="xs">
                        {isLead ? 'Lead Auditor' : roleType}
                      </Badge>
                      {!isLead && !isLocked && onRemoveAuditor && (
                        <button
                          type="button"
                          className="ism-team-chip-remove"
                          onClick={() => onRemoveAuditor(member.id)}
                          title={`Remove ${member.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="ism-team-chip-card__name">{member.name}</div>
                    <div className="ism-team-chip-card__meta">ID: {member.id}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
