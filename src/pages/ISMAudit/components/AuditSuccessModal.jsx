import Badge from '../../../components/ui/Badge';

export default function AuditSuccessModal({
  isOpen,
  onClose,
  auditData,
  vessel,
  findings,
  onResetForNewAudit,
}) {
  if (!isOpen) return null;

  return (
    <div className="ism-modal-backdrop">
      <div className="ism-modal-card ism-modal-card--md ism-modal-card--success" onClick={e => e.stopPropagation()}>
        <div className="ism-success-banner">
          <div className="ism-success-icon-wrap">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="ism-success-title">ISM Audit Created Successfully</h3>
          <p className="ism-success-desc">
            The International Safety Management Code audit has been officially recorded in the Republic of the Marshall Islands Registry.
          </p>
        </div>

        <div className="ism-success-details">
          <div className="ism-success-grid">
            <div className="ism-success-item">
              <span className="ism-success-item__label">Audit Report Number</span>
              <span className="ism-success-item__val ism-mono-tag ism-mono-tag--lg">
                {auditData.auditReportNo}
              </span>
            </div>

            <div className="ism-success-item">
              <span className="ism-success-item__label">Vessel Particulars</span>
              <span className="ism-success-item__val">
                {vessel?.name} <span className="ism-success-item__meta">(IMO {vessel?.imo})</span>
              </span>
            </div>

            <div className="ism-success-item">
              <span className="ism-success-item__label">Audit Scope & Sub Type</span>
              <span className="ism-success-item__val">
                {auditData.auditSubType} · {auditData.scope}
              </span>
            </div>

            <div className="ism-success-item">
              <span className="ism-success-item__label">Execution Date & Place</span>
              <span className="ism-success-item__val">
                {auditData.auditDate} · {auditData.auditPlace}
              </span>
            </div>

            <div className="ism-success-item">
              <span className="ism-success-item__label">Lead Auditor</span>
              <span className="ism-success-item__val">
                {auditData.auditorName} (ID: {auditData.auditorId})
              </span>
            </div>

            <div className="ism-success-item">
              <span className="ism-success-item__label">Findings Summary</span>
              <span className="ism-success-item__val">
                <Badge variant={findings.length > 0 ? 'warning' : 'success'} size="sm">
                  {findings.length} Finding{findings.length === 1 ? '' : 's'} Recorded
                </Badge>
              </span>
            </div>
          </div>

          <div className="ism-success-seal-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Record Digitally Signed & Locked under RMI Maritime Standard A.1071(28)</span>
          </div>
        </div>

        <div className="ism-modal-footer ism-modal-footer--between">
          <button
            type="button"
            className="ent-btn ent-btn--secondary"
            onClick={onResetForNewAudit}
          >
            Create Another Audit
          </button>

          <div className="ism-success-actions">
            <button
              type="button"
              className="ent-btn ent-btn--secondary"
              onClick={() => {
                window.print();
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print Audit Report</span>
            </button>

            <button
              type="button"
              className="ent-btn ent-btn--primary"
              onClick={onClose}
            >
              View Completed Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
