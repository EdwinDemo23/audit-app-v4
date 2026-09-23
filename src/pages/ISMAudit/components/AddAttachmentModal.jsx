import { useState } from 'react';

const ATTACHMENT_TYPES = [
  { value: 'AUDIT PLAN', label: 'AUDIT PLAN', mandatory: true },
  { value: 'ATTENDANCE LIST', label: 'ATTENDANCE LIST', mandatory: true },
  { value: 'CERTIFICATE', label: 'CERTIFICATE', mandatory: false },
  { value: 'NON-CONFORMITY REPORT (NCR)', label: 'NON-CONFORMITY REPORT (NCR)', mandatory: false },
  { value: 'CREW / SAFE MANNING LIST', label: 'CREW / SAFE MANNING LIST', mandatory: false },
  { value: 'OTHER EVIDENCE / PHOTOS', label: 'OTHER EVIDENCE / PHOTOS', mandatory: false },
];

export default function AddAttachmentModal({ isOpen, onClose, onAddAttachments }) {
  const [rows, setRows] = useState([
    { id: 1, type: 'AUDIT PLAN', fileName: 'ISM_Audit_Plan_Majuro.pdf', comments: 'Formal audit itinerary agreed with Master', size: '1.8 MB' },
    { id: 2, type: 'ATTENDANCE LIST', fileName: 'Opening_Closing_Attendance.pdf', comments: 'Signed attendance list with ship officers', size: '1.2 MB' },
  ]);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'CERTIFICATE',
        fileName: '',
        comments: '',
        size: '1.5 MB',
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleFileSelect = (id) => {
    // Simulate file chooser
    const sampleNames = ['SMC_Certificate_Copy.pdf', 'Shipboard_SMS_Manual_Rev4.pdf', 'Emergency_Drill_Log_2026.pdf', 'Crew_List_Majuro.pdf'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    handleRowChange(id, 'fileName', randomName);
  };

  const handleSubmit = () => {
    const validRows = rows.filter(r => r.fileName && r.fileName.trim() !== '');
    if (validRows.length === 0) return;

    onAddAttachments(
      validRows.map(r => ({
        id: 'ATT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: r.fileName,
        type: r.type,
        comments: r.comments,
        size: r.size || '1.4 MB',
        uploadedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'uploaded',
        required: r.type === 'AUDIT PLAN' || r.type === 'ATTENDANCE LIST',
      }))
    );
    onClose();
  };

  return (
    <div className="ism-modal-backdrop" onClick={onClose}>
      <div className="ism-modal-card ism-modal-card--lg" onClick={e => e.stopPropagation()}>
        {/* Header matching screenshot 115544 */}
        <div className="ism-modal-header">
          <div>
            <h3 className="ism-modal-title">Audit Attachments</h3>
            <p className="ism-modal-caption">
              Upload statutory verification evidence and compliance records (Mandatory items marked with *)
            </p>
          </div>
          <button type="button" className="ism-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="ism-modal-body ism-modal-body--scroll">
          <div className="ism-attachment-rows">
            {rows.map((row, index) => {
              const selectedTypeObj = ATTACHMENT_TYPES.find(t => t.value === row.type);
              const isMandatory = selectedTypeObj?.mandatory;

              return (
                <div key={row.id} className="ism-attachment-row-card">
                  <div className="ism-attachment-row-card__top">
                    {/* File Attachment Controls */}
                    <div className="ism-attachment-file-controls">
                      <button
                        type="button"
                        className="ism-attach-icon-btn"
                        onClick={() => handleFileSelect(row.id)}
                        title="Browse & Upload File"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="ism-attach-delete-btn"
                        onClick={() => handleRemoveRow(row.id)}
                        title="Delete this row"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>

                      <div className="ism-attachment-filename-wrap">
                        <input
                          type="text"
                          className="ism-input ism-input--file"
                          placeholder="Select or enter file name..."
                          value={row.fileName}
                          onChange={e => handleRowChange(row.id, 'fileName', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Document Type Selector */}
                    <div className="ism-attachment-type-wrap">
                      <label className="ism-field-label">
                        Types {isMandatory && <span className="ism-req-star">*</span>}
                      </label>
                      <select
                        className="ism-select"
                        value={row.type}
                        onChange={e => handleRowChange(row.id, 'type', e.target.value)}
                      >
                        {ATTACHMENT_TYPES.map(t => (
                          <option key={t.value} value={t.value}>
                            {t.label} {t.mandatory ? '(Mandatory *)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comments Field */}
                  <div className="ism-attachment-row-card__bottom">
                    <label className="ism-field-label">Comments / Remarks</label>
                    <textarea
                      className="ism-textarea ism-textarea--sm"
                      rows={2}
                      placeholder="Add brief details regarding this document..."
                      value={row.comments}
                      onChange={e => handleRowChange(row.id, 'comments', e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Add Row Button matching Screenshot 115544 */}
          <div className="ism-add-row-action">
            <button
              type="button"
              className="ism-float-add-btn"
              onClick={handleAddRow}
              title="Add another document row"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="ism-modal-footer">
          <button type="button" className="ent-btn ent-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ent-btn ent-btn--primary"
            onClick={handleSubmit}
            id="ism-add-attachments-btn"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
