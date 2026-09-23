import Badge from '../../../components/ui/Badge';

export default function SignatureStep({
  auditors,
  onAttachSignature,
  onDelegateSignature,
  onRemoveSignature,
  leadSignatureDate,
  onDateChange,
  isLocked,
}) {
  return (
    <div className="ism-form-step">
      <div className="ent-card ism-form-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Auditor & Reviewer Digital Signatures</h3>
            <span className="ent-card__caption">
              Statutory sign-off table matching Screenshot 115657 (IMO Resolution A.1071(28))
            </span>
          </div>
          <Badge variant="scheduled" size="sm">
            Digital Endorsement
          </Badge>
        </div>

        {/* Signature Table matching Screenshot 115657 */}
        <div className="ent-table-wrapper">
          <table className="ent-table ism-sig-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Type</th>
                <th style={{ width: '28%' }}>Name</th>
                <th style={{ width: '22%' }}>Date</th>
                <th style={{ width: '28%', textAlign: 'right' }}>Signature</th>
              </tr>
            </thead>
            <tbody>
              {auditors.map(auditor => {
                const isLead = auditor.isLead || auditor.role === 'Lead Auditor' || auditor.id === '838';

                return (
                  <tr key={auditor.id} className="ent-table__row">
                    <td>
                      <span className="ism-sig-type-tag">
                        {isLead ? 'LEAD AUDITOR' : (auditor.role || auditor.type || 'Auditor').toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="ism-sig-name-cell">
                        <span className="ism-sig-name">{auditor.name}</span>
                        <span className="ism-sig-id">ID: {auditor.id}</span>
                      </div>
                    </td>

                    <td>
                      <div className="ism-sig-date-wrap">
                        <input
                          type="date"
                          className="ism-input ism-input--sm"
                          value={isLead ? (leadSignatureDate || '2026-08-25') : (auditor.signedDate || '2026-08-25')}
                          onChange={e => onDateChange && onDateChange(e.target.value)}
                          disabled={auditor.signed || isLocked}
                        />
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {auditor.signed ? (
                        <div className="ism-signed-stamp-badge">
                          <div className="ism-stamp-icon">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div className="ism-stamp-text">
                            <span className="ism-stamp-verified">Attached & Verified</span>
                            <span className="ism-stamp-time">Cryptographic Token Active</span>
                          </div>
                          {!isLocked && (
                            <button
                              type="button"
                              className="ism-sig-remove-btn"
                              onClick={() => onRemoveSignature(auditor.id)}
                              title="Clear signature"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ) : auditor.delegated ? (
                        <div className="ism-delegated-badge">
                          <Badge variant="warning" size="sm">
                            Delegated to Lead
                          </Badge>
                          {!isLocked && (
                            <button
                              type="button"
                              className="ism-sig-remove-btn"
                              onClick={() => onAttachSignature(auditor.id)}
                            >
                              Sign Now
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="ism-sig-actions">
                          {!isLead && !isLocked && (
                            <button
                              type="button"
                              className="ent-btn ent-btn--secondary ent-btn--sm"
                              onClick={() => onDelegateSignature(auditor.id)}
                              title="Delegate signing authority to Lead Auditor"
                            >
                              Delegate
                            </button>
                          )}
                          <button
                            type="button"
                            className="ent-btn ent-btn--primary ent-btn--sm"
                            onClick={() => onAttachSignature(auditor.id)}
                            disabled={isLocked}
                            id={`ism-sign-btn-${auditor.id}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 19l7-7 3 3-7 7-3-3z" />
                              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                              <path d="M2 2l7.586 7.586" />
                              <circle cx="11" cy="11" r="2" />
                            </svg>
                            <span>Attach</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Technical Reviewer Placeholder Stage */}
              <tr className="ent-table__row ism-reviewer-row">
                <td>
                  <span className="ism-sig-type-tag ism-sig-type-tag--reviewer">
                    TECHNICAL REVIEWER
                  </span>
                </td>
                <td>
                  <div className="ism-sig-name-cell">
                    <span className="ism-sig-name">Administration Review Officer</span>
                    <span className="ism-sig-id">RMI Headquarters - Reston, VA</span>
                  </div>
                </td>
                <td>
                  <span className="ism-sig-pending-text">Pending Final Submission</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Badge variant="neutral" size="sm">
                    Review Initiated on Submit
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Digital Signature Audit Seal Notice */}
        <div className="ism-sig-seal-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0057BB" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <strong>Republic of the Marshall Islands Cryptographic Verification:</strong> Digital signatures attached to this audit session comply with the International Maritime Organization FAL.5/Circ.39/Rev.2 guidelines on electronic certificates and statutory endorsements.
          </div>
        </div>
      </div>
    </div>
  );
}
