import './Header.css';

export default function Header({ title = 'Dashboard' }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-left">
        <div className="header-breadcrumb">
          <span className="header-breadcrumb-root">IRI Audit</span>
          <span className="header-breadcrumb-sep">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
          <span className="header-breadcrumb-current">{title}</span>
        </div>
      </div>

      

      <div className="header-right">
        {/* Action Icons group */}
        <div className="header-action-group">
          {/* 1. Info */}
          <button className="header-action-btn" aria-label="Information" title="Audit Information & System Guidelines">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>

          {/* 2. Key */}
          <button className="header-action-btn" aria-label="Access Key" title="Security & Authentication">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="m21 2-9.6 9.6" />
              <path d="m15.5 7.5 3 3L22 7l-3-3" />
            </svg>
          </button>

          {/* 3. Notification */}
          <button className="header-action-btn header-notif-btn" aria-label="Notifications" title="System Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="header-notif-badge">3</span>
          </button>

          {/* 4. PDF / Document */}
          <button className="header-action-btn" aria-label="PDF / Document" title="Export PDF / Documentation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="header-divider" />

        {/* User */}
        <div className="header-user" tabIndex={0} role="button" aria-label="User profile: Edwin D">
          <div className="header-user-avatar">E</div>
          <div className="header-user-info">
            <span className="header-user-name">Edwin D</span>
            <span className="header-user-role">Senior Lead Auditor (838)</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
