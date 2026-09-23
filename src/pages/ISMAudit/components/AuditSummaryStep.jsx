import Badge from '../../../components/ui/Badge';

export default function AuditSummaryStep({
  auditSummaryOption,
  onOptionChange,
  auditSubType,
  findings,
  additionalAuditDate,
  onAdditionalAuditDateChange,
  isLocked,
}) {
  // Find earliest CAP due date from findings
  const ncFindings = findings.filter(f => f.type.includes('Non-Conformity') || f.type.includes('NC'));
  const earliestCapDate = ncFindings.length > 0
    ? ncFindings.sort((a, b) => new Date(a.capDueDate) - new Date(b.capDueDate))[0].capDueDate
    : 'DD/MMM/YYYY';

  return (
    <div className="ism-form-step">
      {/* ── Official IMO ISM Outcome Declaration matching Screenshot 115256 ── */}
      <div className="ent-card ism-form-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Statutory Audit Outcome Declaration</h3>
            <span className="ent-card__caption">
              Formal verification finding endorsed under IMO Resolution A.1071(28) (Screenshot 115256)
            </span>
          </div>
          <Badge variant="primary" size="sm">
            Lead Auditor Determination
          </Badge>
        </div>

        <div className="ism-summary-body">
          <p className="ism-summary-preamble">
            The undersigned has carried out the above audit according to the ISM Code and found the vessel:
          </p>

          <div className="ism-radio-group">
            {/* Option 1 */}
            <label className={`ism-radio-item ${auditSummaryOption === 1 ? 'ism-radio-item--active' : ''}`}>
              <input
                type="radio"
                name="auditSummary"
                className="ism-radio-input"
                checked={auditSummaryOption === 1}
                onChange={() => onOptionChange(1)}
                disabled={isLocked}
              />
              <div className="ism-radio-content">
                <span className="ism-radio-label">
                  Is in compliance with the requirements of the ISM Code ({auditSubType || 'auditSubType'})
                </span>
                <span className="ism-radio-sub">
                  Applicable when zero non-conformities are raised. Validates full SMS implementation.
                </span>
              </div>
            </label>

            {/* Option 2 */}
            <label className={`ism-radio-item ${auditSummaryOption === 2 ? 'ism-radio-item--active' : ''}`}>
              <input
                type="radio"
                name="auditSummary"
                className="ism-radio-input"
                checked={auditSummaryOption === 2}
                onChange={() => onOptionChange(2)}
                disabled={isLocked}
              />
              <div className="ism-radio-content">
                <span className="ism-radio-label">
                  Is in compliance with the requirements of the ISM Code ({auditSubType || 'auditSubType'}), Non-Conformity issued and corrective action plan shall be submitted by <strong>{earliestCapDate}</strong>
                </span>
                <span className="ism-radio-sub">
                  Corrective Action Plan (CAP) date automatically synchronized with logged findings.
                </span>
              </div>
            </label>

            {/* Option 3 */}
            <label className={`ism-radio-item ${auditSummaryOption === 3 ? 'ism-radio-item--active' : ''}`}>
              <input
                type="radio"
                name="auditSummary"
                className="ism-radio-input"
                checked={auditSummaryOption === 3}
                onChange={() => onOptionChange(3)}
                disabled={isLocked}
              />
              <div className="ism-radio-content">
                <span className="ism-radio-label">
                  Is in compliance with the requirements of the ISM Code ({auditSubType || 'auditSubType'}), Non-Conformity issued and corrective action plan shall be submitted by <strong>{earliestCapDate}</strong> and Additional audit to be completed by <strong>{additionalAuditDate || 'DD/MMM/YYYY'}</strong>
                </span>
                {auditSummaryOption === 3 && (
                  <div className="ism-additional-date-picker">
                    <label className="ism-field-label">Additional Verification Audit Deadline:</label>
                    <input
                      type="date"
                      className="ism-input ism-input--sm"
                      value={additionalAuditDate || ''}
                      onChange={e => onAdditionalAuditDateChange(e.target.value)}
                      disabled={isLocked}
                    />
                  </div>
                )}
              </div>
            </label>

            {/* Option 4 */}
            <label className={`ism-radio-item ${auditSummaryOption === 4 ? 'ism-radio-item--active' : ''}`}>
              <input
                type="radio"
                name="auditSummary"
                className="ism-radio-input"
                checked={auditSummaryOption === 4}
                onChange={() => onOptionChange(4)}
                disabled={isLocked}
              />
              <div className="ism-radio-content">
                <span className="ism-radio-label">
                  Is in compliance with the provisions of Section 14.0, Part B of the ISM Code (for Interim Audit)
                </span>
                <span className="ism-radio-sub">
                  Specific statutory declaration for initial flag-in or newbuild delivery under interim certification.
                </span>
              </div>
            </label>

            {/* Option 5 */}
            <label className={`ism-radio-item ${auditSummaryOption === 5 ? 'ism-radio-item--active' : ''}`}>
              <input
                type="radio"
                name="auditSummary"
                className="ism-radio-input"
                checked={auditSummaryOption === 5}
                onChange={() => onOptionChange(5)}
                disabled={isLocked}
              />
              <div className="ism-radio-content">
                <span className="ism-radio-label ism-danger-text">
                  Not approved, the audit was temporarily suspended due to the reasons stated in the Narrative report
                </span>
                <span className="ism-radio-sub">
                  Major breakdown of Safety Management System; certification denied or suspended with cause.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
