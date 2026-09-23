import { useRef } from 'react';
import Badge from '../../../components/ui/Badge';

const ATTACHMENT_TYPES = [
  { id: 'audit-plan', label: 'Audit Plan', required: true },
  { id: 'attendance-list', label: 'Attendance List', required: true },
  { id: 'certificate', label: 'Certificate', required: false },
  { id: 'crew-list', label: 'Crew List', required: false },
  { id: 'new-file-attachment', label: 'New File Attachment', required: false },
  { id: 'attachmentnewdemo', label: 'Attachmentnewdemo', required: false },
  { id: 'attachmentdemo2', label: 'Attachmentdemo2', required: false },
  { id: 'attachmentdemo3', label: 'Attachmentdemo3', required: false },
];

export default function AttachmentsStep({
  attachments = [],
  onAttachFile,
  onRemoveAttachment,
  isLocked,
}) {
  const fileInputRefs = useRef({});

  // Resolve attached file for each type
  const getAttachedFile = (typeLabel) => {
    return attachments.find(
      a => a.type?.toUpperCase().trim() === typeLabel.toUpperCase().trim()
    );
  };

  const handleFileInputChange = (typeLabel, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onAttachFile) {
      onAttachFile(typeLabel, file);
    }
    e.target.value = '';
  };

  const handleDownload = (doc) => {
    const blob = new Blob(
      [`Republic of the Marshall Islands Maritime Administrator\nDocument: ${doc.name}\nType: ${doc.type}\nStatus: Verified Filing`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const requiredCompleteCount = ATTACHMENT_TYPES.filter(
    item => item.required && getAttachedFile(item.label)
  ).length;

  return (
    <div className="ism-form-step">
      {/* ── Single Unified Card: Attachment to This Report ── */}
      <div className="ent-card ism-form-card ism-attachments-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Attachment to This Report</h3>
            <span className="ent-card__caption">
              Mandatory statutory documents (* required) and supplementary audit filings
            </span>
          </div>

          <div className="ism-header-badge-group">
            <Badge variant={requiredCompleteCount === 2 ? 'completed' : 'warning'} size="sm">
              {requiredCompleteCount} of 2 Required Attached
            </Badge>
          </div>
        </div>

        <div className="ent-table-wrapper ism-attachments-table-wrap">
          <table className="ent-table ism-attachments-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Attachment Type</th>
                <th style={{ width: '38%' }}>Attached File</th>
                <th style={{ width: '16%' }}>Status</th>
                <th style={{ width: '18%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ATTACHMENT_TYPES.map(item => {
                const attached = getAttachedFile(item.label);

                return (
                  <tr key={item.id} className="ent-table__row ism-attachment-row">
                    <td>
                      <div className="ism-attachment-type-cell">
                        <span className="ism-attachment-type-name">{item.label}</span>
                        {item.required && (
                          <span className="ism-req-star" title="Mandatory attachment required for audit submission">
                            *
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {attached ? (
                        <div className="ism-file-cell">
                          <div className="ism-file-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iri-primary)" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div className="ism-file-info">
                            <span className="ism-file-name" title={attached.name}>
                              {attached.name}
                            </span>
                            {attached.size && (
                              <span className="ism-file-meta-tag">{attached.size}</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="ism-file-placeholder">No file attached</span>
                      )}
                    </td>

                    <td>
                      {attached ? (
                        <Badge variant="success" size="sm">
                          Attached
                        </Badge>
                      ) : item.required ? (
                        <Badge variant="danger" size="sm">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          Optional
                        </Badge>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="ism-table-actions">
                        {attached ? (
                          <>
                            <button
                              type="button"
                              className="ent-btn ent-btn--secondary ent-btn--xs"
                              onClick={() => handleDownload(attached)}
                              title={`Download ${attached.name}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              <span>Download</span>
                            </button>

                            {!isLocked && (
                              <button
                                type="button"
                                className="ent-btn ent-btn--danger-ghost ent-btn--xs"
                                onClick={() => onRemoveAttachment(attached.id)}
                                title={`Delete ${attached.name}`}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            )}
                          </>
                        ) : (
                          !isLocked && (
                            <>
                              <input
                                type="file"
                                ref={el => (fileInputRefs.current[item.id] = el)}
                                style={{ display: 'none' }}
                                onChange={e => handleFileInputChange(item.label, e)}
                              />
                              <button
                                type="button"
                                className="ent-btn ent-btn--secondary ent-btn--xs ism-upload-action-btn"
                                onClick={() => fileInputRefs.current[item.id]?.click()}
                                title={`Upload file for ${item.label}`}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--iri-primary)" strokeWidth="2.2">
                                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                              </button>
                            </>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
