import Badge from '../../../components/ui/Badge';
import { CERTIFICATE_HISTORY_DATA } from '../data/mockAuditData';

export default function CertHistoryStep({ vessel }) {
  const historyList = (vessel && CERTIFICATE_HISTORY_DATA[vessel.imo]) || [
    {
      certNo: 'SMC-MHL-2021-0842',
      type: 'Safety Management Certificate (SMC)',
      auditType: 'Initial Verification',
      issueDate: '21-Sep-2021',
      expiryDate: '20-Sep-2026',
      issuer: 'Capt. Edwin D (838)',
      place: 'Majuro',
      status: 'Active',
      findingsCount: 1,
    },
    {
      certNo: 'SMC-INT-2021-0182',
      type: 'Interim SMC',
      auditType: 'Interim Verification',
      issueDate: '15-Mar-2021',
      expiryDate: '14-Sep-2021',
      issuer: 'Capt. Harold Vance (412)',
      place: 'Monaco',
      status: 'Superseded',
      findingsCount: 0,
    },
  ];

  return (
    <div className="ism-form-step">
      {/* ── Read-Only Information Banner ── */}
      <div className="ism-info-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0057BB" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div className="ism-info-banner__content">
          <div className="ism-info-banner__title">Historical Statutory Records (Read-Only Reference)</div>
          <div className="ism-info-banner__text">
            Certificate history is strictly informational for auditor background review. Prior certificates will not alter or overwrite the current audit session parameters.
          </div>
        </div>
      </div>

      <div className="ent-card ism-form-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Statutory Certification History — {vessel?.name}</h3>
            <span className="ent-card__caption">
              Prior Safety Management Certificates (SMC) registered under IMO {vessel?.imo}
            </span>
          </div>
          <Badge variant="neutral" size="sm">
            {historyList.length} Historical Records Found
          </Badge>
        </div>

        <div className="ent-table-wrapper">
          <table className="ent-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Certificate No.</th>
                <th style={{ width: '22%' }}>Certificate Type</th>
                <th style={{ width: '16%' }}>Audit Context</th>
                <th style={{ width: '14%' }}>Issue Date</th>
                <th style={{ width: '14%' }}>Expiry Date</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map((item, idx) => (
                <tr key={idx} className="ent-table__row">
                  <td>
                    <div className="ism-cert-cell">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0057BB" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="ism-mono-tag">{item.certNo}</span>
                    </div>
                  </td>

                  <td>
                    <span className="ism-cert-name">{item.type}</span>
                  </td>

                  <td>
                    <span className="ent-audit-type-tag">{item.auditType}</span>
                  </td>

                  <td>
                    <span className="ism-date-cell">{item.issueDate}</span>
                  </td>

                  <td>
                    <span className="ism-date-cell">{item.expiryDate}</span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <Badge
                      variant={
                        item.status === 'Active'
                          ? 'success'
                          : item.status === 'Expired'
                            ? 'danger'
                            : 'neutral'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
