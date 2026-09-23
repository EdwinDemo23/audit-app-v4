import { useState } from 'react';
import Badge from '../../../components/ui/Badge';

export default function FindingsStep({
  findings,
  onOpenNewFindingModal,
  onRemoveFinding,
  isLocked,
}) {
  const [filterType, setFilterType] = useState('All');

  const filteredFindings = findings.filter(f => {
    if (filterType === 'All') return true;
    return f.type.includes(filterType);
  });

  return (
    <div className="ism-form-step">
      <div className="ent-card ism-form-card">
        <div className="ent-card__header">
          <div className="ent-card__title-group">
            <h3 className="ent-card__title">Audit Findings & Corrective Action Requests (CAR)</h3>
            <span className="ent-card__caption">
              Log objective non-conformities and observations under the ISM Code
            </span>
          </div>

          <div className="ism-header-badge-group">
            <div className="ism-filter-pills">
              {['All', 'Major', 'Non-Conformity', 'Observation'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`ism-filter-pill ${filterType === t ? 'ism-filter-pill--active' : ''}`}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {!isLocked && (
              <button
                type="button"
                className="ent-btn ent-btn--primary ent-btn--sm"
                onClick={onOpenNewFindingModal}
                id="ism-add-finding-step-btn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>New Finding</span>
              </button>
            )}
          </div>
        </div>

        <div className="ism-findings-list">
          {filteredFindings.length === 0 ? (
            <div className="ism-empty-findings">
              <div className="ism-empty-findings__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h4 className="ism-empty-findings__title">No Findings in this Filter</h4>
              <p className="ism-empty-findings__desc">
                If deviations from the ISM Code were identified during shipboard verification, click <strong>New Finding</strong> to log non-conformities.
              </p>
            </div>
          ) : (
            filteredFindings.map(f => {
              const isMajor = f.type.includes('Major');
              const isNC = f.type.includes('Non-Conformity') && !isMajor;

              return (
                <div key={f.id} className="ism-finding-card">
                  <div className="ism-finding-card__header">
                    <div className="ism-finding-card__title-row">
                      <span className="ism-mono-tag">{f.id}</span>
                      <Badge variant={isMajor ? 'danger' : isNC ? 'warning' : 'neutral'} size="sm">
                        {f.type}
                      </Badge>
                      <span className="ent-audit-type-tag">
                        ISM Clause {f.elementCode} - {f.elementTitle}
                      </span>
                    </div>

                    {!isLocked && (
                      <button
                        type="button"
                        className="ism-doc-delete-btn"
                        onClick={() => onRemoveFinding(f.id)}
                        title="Delete finding"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="ism-finding-card__body">
                    <div className="ism-finding-section">
                      <span className="ism-finding-section__label">Statement of Fact / Objective Evidence:</span>
                      <p className="ism-finding-section__text">{f.statement}</p>
                    </div>

                    {f.correctiveAction && (
                      <div className="ism-finding-section">
                        <span className="ism-finding-section__label">Corrective Action Requirement (CAR):</span>
                        <p className="ism-finding-section__text">{f.correctiveAction}</p>
                      </div>
                    )}

                    <div className="ism-finding-meta-row">
                      <div className="ism-finding-date-pill">
                        <span className="ism-finding-date-pill__label">CAP Submission Due:</span>
                        <span className="ism-finding-date-pill__val">{f.capDueDate}</span>
                      </div>

                      <div className="ism-finding-date-pill">
                        <span className="ism-finding-date-pill__label">Target Closure:</span>
                        <span className="ism-finding-date-pill__val">{f.targetClosureDate}</span>
                      </div>

                      <div className="ism-finding-date-pill">
                        <span className="ism-finding-date-pill__label">Logged:</span>
                        <span className="ism-finding-date-pill__val">{f.createdDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
