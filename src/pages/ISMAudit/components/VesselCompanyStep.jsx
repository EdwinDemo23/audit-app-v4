import Badge from '../../../components/ui/Badge';

export default function VesselCompanyStep({ vessel }) {
  if (!vessel) return null;

  return (
    <div className="ism-form-step">
      {/* ── Single Unified Card: Vessel / Company ── */}
      <div className="ent-card ism-form-card ism-vessel-company-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Vessel / Company</h3>
            <span className="ent-card__caption">
              Auto-populated from Republic of the Marshall Islands Master Registry &amp; DOC Records (Read-Only)
            </span>
          </div>
          <div className="ism-header-badge-group">
            <Badge variant="success" size="sm">
              Registry Verified
            </Badge>
            <span className="ism-lock-indicator ism-lock-indicator--primary" title="Data locked from master registry">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Locked Master Data</span>
            </span>
          </div>
        </div>

        <div className="ism-vessel-company-content">
          <div className="ism-form-grid ism-form-grid--4">
            {/* ── Row 1: 4 input fields ── */}
            <div className="ism-form-field">
              <label className="ism-field-label">Vessel Name</label>
              <input className="ism-input ism-input--readonly" value={vessel.name || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">Vessel Type</label>
              <input className="ism-input ism-input--readonly" value={vessel.type || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">Official No.</label>
              <input className="ism-input ism-input--readonly" value={vessel.officialNo || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">GRT (MT)</label>
              <input className="ism-input ism-input--readonly" value={vessel.gt || ''} readOnly />
            </div>

            {/* ── Row 2: 4 input fields ── */}
            <div className="ism-form-field">
              <label className="ism-field-label">Company IMO No.</label>
              <input className="ism-input ism-input--readonly" value={vessel.company?.imoNo || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">DOC Type</label>
              <input className="ism-input ism-input--readonly" value={vessel.company?.docType || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">DOC Issuer</label>
              <input className="ism-input ism-input--readonly" value={vessel.company?.docIssuer || ''} readOnly />
            </div>

            <div className="ism-form-field">
              <label className="ism-field-label">DOC Expiry</label>
              <input className="ism-input ism-input--readonly" value={vessel.company?.docExpiry || ''} readOnly />
            </div>

            {/* ── Row 3: Name / Address of Company full width ── */}
            <div className="ism-form-field ism-form-field--full">
              <label className="ism-field-label">Name / Address of Company</label>
              <textarea
                className="ism-textarea ism-textarea--readonly ism-textarea--address"
                rows={2}
                value={[vessel.company?.name, vessel.company?.address].filter(Boolean).join('\n')}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
