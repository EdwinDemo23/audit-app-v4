import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    path: '/',
    implemented: true,
  },
  {
    id: 'audit-creation',
    label: 'Audit / Inspection / Review',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    children: [
      {
        id: 'audit',
        label: 'Audit',
        children: [
          { id: 'ism-audit', label: 'ISM Audit', path: '/audit/ism', implemented: true },
          { id: 'isps-audit', label: 'ISPS Audit', path: '/audit/isps' },
        ],
      },
      {
        id: 'inspection',
        label: 'Inspection',
        children: [
          { id: 'mlc-inspection', label: 'MLC Inspection', path: '/inspection/mlc' },
        ],
      },
      {
        id: 'review',
        label: 'Review',
        children: [
          { id: 'ssp-review', label: 'SSP Review', path: '/review/ssp' },
          { id: 'dmlc-review', label: 'DMLC II Review', path: '/review/dmlc' },
        ],
      },
      {
        id: 'plan-approval',
        label: 'Plan Approval',
        children: [
          { id: 'sopep', label: 'SOPEP', path: '/plan/sopep' },
          { id: 'sts', label: 'STS', path: '/plan/sts' },
          { id: 'smpep', label: 'SMPEP', path: '/plan/smpep' },
          { id: 'cow', label: 'COW', path: '/plan/cow' },
          { id: 'bws', label: 'BWS', path: '/plan/bws' },
          { id: 'voc', label: 'VOC', path: '/plan/voc' },
          { id: 'sdr', label: 'SDR', path: '/plan/sdr' },
        ],
      },
    ],
  },
  {
    id: 'doc-creation',
    label: 'DOC Creation / Search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    path: '/doc',
  },
  {
    id: 'ihm',
    label: 'IHM Part I Review',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    path: '/ihm',
  },
  {
    id: 'maintenance',
    label: 'Audit / Review Maintenance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    path: '/maintenance',
  },
  {
    id: 'car',
    label: 'CAR Maintenance / History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    path: '/car',
  },
  {
    id: 'vessel',
    label: 'Vessel / Status Statement',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    path: '/vessel',
  },
  {
    id: 'certificate',
    label: 'Certificate Creation & Search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    path: '/certificate',
  },
];

function NavItem({ item, depth = 0 }) {
  const [open, setOpen] = useState(
    item.id === 'audit-creation' || item.id === 'audit'
  );

  if (item.children) {
    return (
      <div className={`nav-group ${depth === 0 ? 'nav-group--top' : ''}`}>
        <button
          type="button"
          className={`nav-group-toggle ${depth === 0 ? 'nav-group-toggle--top' : 'nav-group-toggle--sub'}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {depth === 0 && item.icon && (
            <span className="nav-icon">{item.icon}</span>
          )}
          {depth > 0 && (
            <span className="nav-sub-bullet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          )}
          <span className="nav-label">{item.label}</span>
          <span className={`nav-chevron ${open ? 'nav-chevron--open' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        {open && (
          <div className={`nav-children ${depth === 0 ? 'nav-children--top' : 'nav-children--sub'}`}>
            {item.children.map(child => (
              <NavItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Implemented route navigation (e.g. Dashboard, ISM Audit)
  if (item.implemented) {
    return (
      <NavLink
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) =>
          `nav-item ${depth === 0 ? 'nav-item--top' : 'nav-item--leaf'} ${isActive ? 'nav-item--active' : ''}`
        }
        style={{ paddingLeft: depth > 1 ? `${(depth - 1) * 12 + 32}px` : undefined }}
      >
        {depth === 0 && item.icon && <span className="nav-icon">{item.icon}</span>}
        {depth > 0 && <span className="nav-leaf-dot" />}
        <span className="nav-label">{item.label}</span>
      </NavLink>
    );
  }

  // Non-implemented items: full normal enabled styling, pointer cursor, no disabled/muted appearance,
  // click does nothing (no navigation, no route change, no active-state change, no toast/error)
  return (
    <button
      type="button"
      className={`nav-item ${depth === 0 ? 'nav-item--top' : 'nav-item--leaf'}`}
      style={{ paddingLeft: depth > 1 ? `${(depth - 1) * 12 + 32}px` : undefined }}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {depth === 0 && item.icon && <span className="nav-icon">{item.icon}</span>}
      {depth > 0 && <span className="nav-leaf-dot" />}
      <span className="nav-label">{item.label}</span>
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <img
            src={logoImg}
            alt="Marshall Islands Registry"
            className="sidebar-logo-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/asset/logo.png';
            }}
          />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">IRI Audit</span>
          <span className="sidebar-brand-sub">Marshall Islands Registry</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.id} item={item} depth={0} />
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
          </svg>
          <span>Help & Support</span>
        </div>
        <div className="sidebar-footer-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
}
