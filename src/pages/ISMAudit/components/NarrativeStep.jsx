import Badge from '../../../components/ui/Badge';

export default function NarrativeStep({
  narrativeText,
  onNarrativeChange,
  vessel,
  auditReportNo,
  validationError,
  isLocked,
}) {
  const insertTemplate = (templateType) => {
    if (isLocked) return;

    let textToAppend = '';
    if (templateType === 'executive') {
      textToAppend = `1. EXECUTIVE AUDIT SUMMARY:
An onboard International Safety Management (ISM) Code verification was executed on vessel ${vessel?.name || 'Vessel'} (IMO ${vessel?.imo || 'IMO'}). The audit verified shipboard implementation of the company Safety Management System (SMS) in compliance with IMO Resolution A.1071(28). All statutory documents, records, safety policies, and equipment maintenance protocols were systematically sampled and inspected.`;
    } else if (templateType === 'meetings') {
      textToAppend = `\n\n2. OPENING & CLOSING MEETINGS:
The Opening Meeting was convened in the ship's conference room with the Master, Chief Engineer, Chief Officer, and key department heads in attendance. The audit scope, objectives, sampling criteria, and schedule were reviewed and mutually agreed upon.
The Closing Meeting was conducted upon completion of verification. Audit findings, non-conformities, and agreed corrective action plans were comprehensively briefed to ship's command.`;
    } else if (templateType === 'drills') {
      textToAppend = `\n\n3. EMERGENCY DRILLS & SHIPBOARD OPERATIONS:
Observed an unannounced Fire Drill and Abandon Ship Drill. Crew demonstrated satisfactory familiarization with muster duties, life-saving appliances, and emergency radio equipment under SOLAS and ISM Code Section 8. Emergency generator and fire pumps were tested under load and performed within regulatory operating tolerances.`;
    }

    onNarrativeChange(narrativeText ? `${narrativeText}\n\n${textToAppend}` : textToAppend);
  };

  return (
    <div className="ism-form-step">
      <div className={`ent-card ism-form-card ${validationError ? 'ism-card--error' : ''}`}>
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Narrative Report / Executive Audit Summary</h3>
            <span className="ent-card__caption">
              Detailed narrative report separate from individual findings (Screenshot 115727)
            </span>
          </div>

          <div className="ism-header-badge-group">
            {narrativeText && narrativeText.trim().length > 30 ? (
              <Badge variant="completed" size="sm">
                Narrative Complete ({narrativeText.trim().split(/\s+/).length} words)
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                Content Required
              </Badge>
            )}
          </div>
        </div>

        {/* Template Quick Actions */}
        {!isLocked && (
          <div className="ism-narrative-templates">
            <span className="ism-narrative-templates__label">Standard Section Templates:</span>
            <div className="ism-narrative-templates__chips">
              <button
                type="button"
                className="ism-narrative-chip"
                onClick={() => insertTemplate('executive')}
              >
                + Executive Summary
              </button>
              <button
                type="button"
                className="ism-narrative-chip"
                onClick={() => insertTemplate('meetings')}
              >
                + Opening & Closing Minutes
              </button>
              <button
                type="button"
                className="ism-narrative-chip"
                onClick={() => insertTemplate('drills')}
              >
                + Emergency Drills & Crew Notes
              </button>
            </div>
          </div>
        )}

        {/* Rich Text Editor Mock matching Screenshot 115727 */}
        <div className="ism-editor-container">
          {/* Toolbar matching screenshot 115727 */}
          <div className="ism-editor-toolbar">
            <div className="ism-toolbar-group">
              <button type="button" className="ism-tool-btn ism-tool-btn--magic" title="Templates" onClick={() => insertTemplate('executive')}>
                <span>✨▾</span>
              </button>
            </div>

            <div className="ism-toolbar-sep" />

            <div className="ism-toolbar-group">
              <button type="button" className="ism-tool-btn" title="Bold"><strong>B</strong></button>
              <button type="button" className="ism-tool-btn" title="Italic"><em>I</em></button>
              <button type="button" className="ism-tool-btn" title="Underline"><u>U</u></button>
              <button type="button" className="ism-tool-btn" title="Strikethrough"><s>S</s></button>
            </div>

            <div className="ism-toolbar-sep" />

            <div className="ism-toolbar-group">
              <span className="ism-tool-text">14 ▾</span>
              <span className="ism-tool-text ism-tool-text--color">A ▾</span>
            </div>

            <div className="ism-toolbar-sep" />

            <div className="ism-toolbar-group">
              <button type="button" className="ism-tool-btn" title="Bullet List">•≡</button>
              <button type="button" className="ism-tool-btn" title="Numbered List">1≡</button>
              <button type="button" className="ism-tool-btn" title="Align">≡▾</button>
            </div>

            <div className="ism-toolbar-sep" />

            <div className="ism-toolbar-group">
              <button type="button" className="ism-tool-btn" title="Insert Link">🔗</button>
              <button type="button" className="ism-tool-btn" title="Fullscreen">⛶</button>
              <button type="button" className="ism-tool-btn" title="Help">?</button>
            </div>

            <div className="ism-toolbar-sep" />

            <div className="ism-toolbar-group">
              <button type="button" className="ism-tool-btn" title="Undo">↺</button>
              <button type="button" className="ism-tool-btn" title="Redo">↻</button>
            </div>
          </div>

          {/* Textarea body */}
          <div className="ism-editor-body">
            <textarea
              className="ism-narrative-textarea"
              rows={14}
              placeholder="Enter comprehensive narrative report, auditor observations, opening/closing meeting minutes, SMS implementation analysis, and recommendations to Flag State Administration..."
              value={narrativeText}
              onChange={e => onNarrativeChange(e.target.value)}
              disabled={isLocked}
              id="ism-narrative-input"
            />
          </div>
        </div>

        {validationError && (
          <div className="ism-form-validation-error-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
