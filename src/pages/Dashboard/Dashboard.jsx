import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Label, Area, AreaChart
} from 'recharts';
import DropdownMenu from '../../components/ui/DropdownMenu';
import Badge from '../../components/ui/Badge';
import './Dashboard.css';

/* ============================================================
   Maritime Operational Data (IRI Master Registry Dataset)
   ============================================================ */

/* 5 KPIs matching the look & feel of the reference image */
const DASHBOARD_KPIS = [
  {
    id: 'total-audits',
    category: 'Registry',
    title: 'Total Audits',
    value: '194',
    supporting: '152 YTD executed',
    totalSegments: 14,
    activeSegments: 11,
    accentColor: '#0057BB',
    badgeBg: 'rgba(0, 87, 187, 0.08)',
    badgeColor: '#0057BB',
  },
  {
    id: 'active-audits',
    category: 'In Progress',
    title: 'Active Audits',
    value: '36',
    supporting: '8 due this week',
    totalSegments: 14,
    activeSegments: 8,
    accentColor: '#0284C7',
    badgeBg: 'rgba(2, 132, 199, 0.10)',
    badgeColor: '#0284C7',
  },
  {
    id: 'completed-audits',
    category: 'Verified',
    title: 'Completed Audits',
    value: '128',
    supporting: '66% completion rate',
    totalSegments: 14,
    activeSegments: 9,
    accentColor: '#14A05C',
    badgeBg: 'rgba(20, 160, 92, 0.10)',
    badgeColor: '#14A05C',
  },
  {
    id: 'pending-audits',
    category: 'Action Req',
    title: 'Pending Audits',
    value: '25',
    supporting: '17 sched · 8 overdue',
    totalSegments: 14,
    activeSegments: 5,
    accentColor: '#D97706',
    badgeBg: 'rgba(217, 119, 6, 0.10)',
    badgeColor: '#D97706',
  },
  {
    id: 'vessel-compliance',
    category: 'Fleet',
    title: 'Vessel Compliance',
    value: '74.2%',
    supporting: '184 / 248 vessels',
    totalSegments: 14,
    activeSegments: 10,
    accentColor: '#7C3AED',
    badgeBg: 'rgba(124, 58, 237, 0.10)',
    badgeColor: '#7C3AED',
  },
];

const AUDIT_STATUS_DATA = [
  { name: 'Completed', value: 128, color: '#14A05C', pct: 66 },
  { name: 'In Progress', value: 36, color: '#0057BB', pct: 19 },
  { name: 'Scheduled', value: 17, color: '#7C3AED', pct: 9 },
  { name: 'Overdue', value: 8, color: '#DC2626', pct: 4 },
  { name: 'Draft', value: 5, color: '#94A8BE', pct: 2 },
];

const AUDIT_ACTIVITY_DATA = [
  { month: 'May', audits: 24, inspections: 18, reviews: 12 },
  { month: 'Jun', audits: 29, inspections: 22, reviews: 15 },
  { month: 'Jul', audits: 27, inspections: 20, reviews: 14 },
  { month: 'Aug', audits: 34, inspections: 26, reviews: 19 },
  { month: 'Sep', audits: 38, inspections: 30, reviews: 21 },
];

const UPCOMING_AUDITS = [
  {
    id: 1,
    vessel: 'MV Ocean Star',
    imo: '9234567',
    flag: 'MHL',
    type: 'ISM Audit',
    auditor: 'Edwin D',
    auditorInitials: 'CK',
    dueDate: '23 Sep 2026',
    dueDays: 'in 2 days',
    status: 'Scheduled',
  },
  {
    id: 2,
    vessel: 'MT Pacific Dawn',
    imo: '9345678',
    flag: 'MHL',
    type: 'ISM Audit',
    auditor: 'A. Thomas',
    auditorInitials: 'AT',
    dueDate: '24 Sep 2026',
    dueDays: 'in 3 days',
    status: 'Scheduled',
  },
  {
    id: 3,
    vessel: 'MV Horizon',
    imo: '9456789',
    flag: 'MHL',
    type: 'ISPS Audit',
    auditor: 'S. Joseph',
    auditorInitials: 'SJ',
    dueDate: '26 Sep 2026',
    dueDays: 'in 5 days',
    status: 'Scheduled',
  },
  {
    id: 4,
    vessel: 'MV Blue Wave',
    imo: '9567890',
    flag: 'MHL',
    type: 'MLC Inspection',
    auditor: 'P. Singh',
    auditorInitials: 'PS',
    dueDate: '28 Sep 2026',
    dueDays: 'in 7 days',
    status: 'Pending',
  },
  {
    id: 5,
    vessel: 'MT Sea Crest',
    imo: '9678901',
    flag: 'MHL',
    type: 'ISM Audit',
    auditor: 'Edwin D',
    auditorInitials: 'ED',
    dueDate: '30 Sep 2026',
    dueDays: 'in 9 days',
    status: 'Scheduled',
  },
];

const VESSEL_COMPLIANCE = [
  { label: 'Compliant', value: 184, color: '#14A05C', pct: 74.2 },
  { label: 'Attention Required', value: 43, color: '#D97706', pct: 17.3 },
  { label: 'Non-Compliant', value: 14, color: '#DC2626', pct: 5.6 },
  { label: 'Under Review', value: 7, color: '#7C3AED', pct: 2.8 },
];

const FINDINGS_DATA = [
  { label: 'Major', value: 8, color: '#DC2626', desc: 'Critical non-conformities' },
  { label: 'Moderate', value: 27, color: '#D97706', desc: 'Standard non-conformities' },
  { label: 'Minor', value: 49, color: '#0057BB', desc: 'Observations & minor notes' },
];

const CAR_STATUS_DATA = [
  { label: 'Open', value: 31, color: '#0057BB' },
  { label: 'Under Review', value: 7, color: '#7C3AED' },
  { label: 'Overdue', value: 11, color: '#DC2626' },
  { label: 'Closed', value: 96, color: '#14A05C' },
];

const CERT_EXPIRY_LIST = [
  { vessel: 'MV Ocean Star', cert: 'SMC', expiry: '24 Sep 2026', daysLeft: 3, status: 'expired' },
  { vessel: 'MT Pacific Dawn', cert: 'ISSC', expiry: '29 Sep 2026', daysLeft: 8, status: 'warning' },
  { vessel: 'MV Horizon', cert: 'DOC', expiry: '04 Oct 2026', daysLeft: 13, status: 'warning' },
];

const CERT_STATUS_SUMMARY = [
  { label: 'Expired', value: 3, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)' },
  { label: 'Expires ≤ 7d', value: 7, color: '#EA580C', bg: 'rgba(234, 88, 12, 0.08)' },
  { label: 'Expires ≤ 30d', value: 18, color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)' },
  { label: 'Valid', value: 203, color: '#14A05C', bg: 'rgba(20, 160, 92, 0.08)' },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'ISM Audit completed', vessel: 'CLEAR STARS', imo: '9868778', time: '12 min ago', type: 'success' },
  { id: 2, action: 'Certificate uploaded (ISSC)', vessel: 'MT Pacific Dawn', imo: '9345678', time: '34 min ago', type: 'info' },
  { id: 3, action: 'CAP submitted for review', vessel: 'MV Horizon', imo: '9456789', time: '1 hr ago', type: 'warning' },
  { id: 4, action: 'Audit scheduled (Initial)', vessel: 'MV Blue Wave', imo: '9567890', time: '2 hrs ago', type: 'neutral' },
  { id: 5, action: 'MLC Inspection completed', vessel: 'MT Sea Crest', imo: '9678901', time: '3 hrs ago', type: 'success' },
];

/* ============================================================
   Helper Chart Components
   ============================================================ */

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="ent-chart-tooltip">
        <div className="ent-chart-tooltip__label">{label} 2026</div>
        <div className="ent-chart-tooltip__value">
          <span className="ent-chart-tooltip__dot" />
          <span>{payload[0].value} {payload[0].name || 'audits'}</span>
        </div>
      </div>
    );
  }
  return null;
}

function DonutLabel({ viewBox, total }) {
  if (!viewBox || viewBox.cx == null || viewBox.cy == null) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <text x={cx} y={cy - 7} textAnchor="middle" dominantBaseline="middle" className="ent-donut-value">
        {total}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="middle" className="ent-donut-label">
        TOTAL AUDITS
      </text>
    </g>
  );
}

/* ============================================================
   Segmented Progress Bar Component (Matching Reference Image)
   ============================================================ */
function SegmentedProgress({ total = 14, active = 9, color = '#0057BB' }) {
  return (
    <div className="kpi-segmented-progress" role="progressbar" aria-valuenow={active} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`kpi-segment ${i < active ? 'is-active' : ''}`}
          style={{
            backgroundColor: i < active ? color : 'rgba(10, 22, 40, 0.08)',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   Modern SaaS KPI Card Component (Matching Reference Image)
   ============================================================ */
function KpiCard({ kpi }) {
  return (
    <div className="kpi-ref-card" id={`kpi-${kpi.id}`}>
      {/* Top: Category/Status Badge + Title */}
      <div className="kpi-ref-card__top">
        <span
          className="kpi-ref-badge"
          style={{ backgroundColor: kpi.badgeBg, color: kpi.badgeColor }}
        >
          {kpi.category}
        </span>
        <span className="kpi-ref-card__title" title={kpi.title}>{kpi.title}</span>
      </div>

      {/* Middle: Large Metric (left) + Supporting Value (right aligned opposite) */}
      <div className="kpi-ref-card__middle">
        <span className="kpi-ref-card__value">{kpi.value}</span>
        <span className="kpi-ref-card__supporting" title={kpi.supporting}>{kpi.supporting}</span>
      </div>

      {/* Bottom: Minimal Segmented Progress Bar */}
      <SegmentedProgress
        total={kpi.totalSegments}
        active={kpi.activeSegments}
        color={kpi.accentColor}
      />
    </div>
  );
}

/* ============================================================
   Main Dashboard Component
   ============================================================ */

export default function Dashboard() {
  const navigate = useNavigate();

  const [fleetFilter, setFleetFilter] = useState('All Fleets');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [activityTab, setActivityTab] = useState('Audits');
  const [tableSearch, setTableSearch] = useState('');
  const [tableTypeFilter, setTableTypeFilter] = useState('All Types');
  const [tableStatusFilter, setTableStatusFilter] = useState('All Statuses');

  const totalAudits = AUDIT_STATUS_DATA.reduce((s, d) => s + d.value, 0);
  const totalVessels = 248;

  const filteredAudits = useMemo(() => {
    return UPCOMING_AUDITS.filter(item => {
      const matchSearch =
        tableSearch === '' ||
        item.vessel.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.imo.includes(tableSearch) ||
        item.auditor.toLowerCase().includes(tableSearch.toLowerCase());
      const matchType = tableTypeFilter === 'All Types' || item.type === tableTypeFilter;
      const matchStatus = tableStatusFilter === 'All Statuses' || item.status === tableStatusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [tableSearch, tableTypeFilter, tableStatusFilter]);

  return (
    <div className="ent-dashboard">
      {/* ── 1. Page Header ────────────────────────────────── */}
      <header className="ent-dash-header">
        <div className="ent-dash-header__top-row">
          <div className="ent-dash-breadcrumb">
            <span>IRI Maritime Audit</span>
            <span className="ent-dash-breadcrumb__sep">/</span>
            <span className="ent-dash-breadcrumb__current">Operational Dashboard</span>
          </div>
          <div className="ent-dash-sync">
            <span className="ent-dash-sync__pulse" />
            <span className="ent-dash-sync__text">Live Sync · 23 Sep 2026, 02:40 AM</span>
          </div>
        </div>

        <div className="ent-dash-header__main-row">
          <div className="ent-dash-header__info">
            <h1 className="ent-dash-title">Operational Dashboard</h1>
            <p className="ent-dash-subtitle">
              Republic of the Marshall Islands Maritime Administrator — Live fleet verification, statutory audit lifecycle, and compliance monitoring.
            </p>
          </div>

          <div className="ent-dash-controls">
            <DropdownMenu
              options={['All Fleets', 'Pacific Fleet', 'Atlantic Fleet', 'Charter Fleet']}
              value={fleetFilter}
              onChange={setFleetFilter}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              }
            />
            <DropdownMenu
              options={['Last 30 Days', 'Last 7 Days', 'Last 90 Days', 'This Year (2026)']}
              value={dateFilter}
              onChange={setDateFilter}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
            
          </div>
        </div>
      </header>

      {/* ── 2. KPI Cards Row (5 Columns matching Reference Image) ── */}
      <section className="ent-kpi-grid" aria-label="Key Performance Indicators">
        {DASHBOARD_KPIS.map(kpi => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      {/* ── 3. Primary Audit & Compliance Overview ─────────── */}
      <section className="ent-dash-row ent-dash-row--split">
        {/* Audit Activity & Trends (AreaChart) */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Audit Activity &amp; Volume</h2>
              <span className="ent-card__caption">Monthly execution volume across statutory programs</span>
            </div>
            <div className="ent-tabs" role="tablist">
              {['Audits', 'Inspections', 'Reviews'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activityTab === tab}
                  className={`ent-tab ${activityTab === tab ? 'ent-tab--active' : ''}`}
                  onClick={() => setActivityTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="ent-activity-panel">
            <div className="ent-activity-panel__chart">
              <ResponsiveContainer width="100%" height={175}>
                <AreaChart
                  data={AUDIT_ACTIVITY_DATA}
                  margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0057BB" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#0057BB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 87, 187, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#607D9B' }}
                    axisLine={{ stroke: 'rgba(0, 87, 187, 0.12)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#607D9B' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 45]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={activityTab.toLowerCase()}
                    name={activityTab}
                    stroke="#0057BB"
                    strokeWidth={2.4}
                    fill="url(#areaGrad)"
                    dot={{ r: 3.5, fill: '#0057BB', strokeWidth: 0 }}
                    activeDot={{ r: 5.5, fill: '#0057BB', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="ent-activity-stats">
              <div className="ent-activity-stat">
                <span className="ent-activity-stat__val">38</span>
                <span className="ent-activity-stat__lbl">Sep (Current)</span>
              </div>
              <div className="ent-activity-stat">
                <span className="ent-activity-stat__val ent-activity-stat__val--up">+11.8%</span>
                <span className="ent-activity-stat__lbl">vs Previous Mo</span>
              </div>
              <div className="ent-activity-stat">
                <span className="ent-activity-stat__val">152</span>
                <span className="ent-activity-stat__lbl">2026 YTD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Status Donut */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Audit Lifecycle Status</h2>
              <span className="ent-card__caption">Distribution of audits by stage</span>
            </div>
            <Badge variant="neutral" size="sm" dot={false}>
              {totalAudits} Total
            </Badge>
          </div>

          <div className="ent-status-panel">
            <div className="ent-status-panel__chart">
              <ResponsiveContainer width="100%" height={175}>
                <PieChart>
                  <Pie
                    data={AUDIT_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {AUDIT_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label
                      content={<DonutLabel total={totalAudits} />}
                      position="center"
                    />
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} audits`, name]}
                    contentStyle={{
                      fontSize: '12px',
                      background: '#0A1628',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 87, 187, 0.25)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                    }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="ent-status-panel__legend">
              {AUDIT_STATUS_DATA.map(item => (
                <div key={item.name} className="ent-status-row">
                  <div className="ent-status-row__left">
                    <span className="ent-status-row__dot" style={{ background: item.color }} />
                    <span className="ent-status-row__name">{item.name}</span>
                  </div>
                  <div className="ent-status-row__right">
                    <span className="ent-status-row__val">{item.value}</span>
                    <span className="ent-status-row__pct">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Secondary Operational Information ───────────── */}
      <section className="ent-dash-row ent-dash-row--equal">
        {/* Vessel Compliance */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Vessel Compliance Index</h2>
              <span className="ent-card__caption">Fleet regulatory adherence status</span>
            </div>
            <Badge variant="compliant" size="sm">74.2% Fleet Rate</Badge>
          </div>

          <div className="ent-compliance-body">
            <div className="ent-compliance-headline">
              <div className="ent-compliance-headline__count">
                <span className="ent-compliance-headline__num">184</span>
                <span className="ent-compliance-headline__total">/ {totalVessels} Vessels Compliant</span>
              </div>
              <span className="ent-compliance-headline__rate">Target: ≥ 85%</span>
            </div>

            <div className="ent-compliance-bar" role="progressbar" aria-valuenow={74.2} aria-valuemin={0} aria-valuemax={100}>
              {VESSEL_COMPLIANCE.map(item => (
                <div
                  key={item.label}
                  className="ent-compliance-bar__seg"
                  style={{ width: `${item.pct}%`, background: item.color }}
                  title={`${item.label}: ${item.value} vessels (${item.pct}%)`}
                />
              ))}
            </div>

            <div className="ent-compliance-grid">
              {VESSEL_COMPLIANCE.map(item => (
                <div key={item.label} className="ent-compliance-stat">
                  <div className="ent-compliance-stat__top">
                    <span className="ent-compliance-stat__dot" style={{ background: item.color }} />
                    <span className="ent-compliance-stat__label">{item.label}</span>
                  </div>
                  <div className="ent-compliance-stat__bottom">
                    <span className="ent-compliance-stat__val">{item.value}</span>
                    <span className="ent-compliance-stat__pct">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Expiry */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Statutory Certificate Expiry</h2>
              <span className="ent-card__caption">Active validity and renewal deadlines</span>
            </div>
            <Badge variant="danger" size="sm">3 Expired</Badge>
          </div>

          <div className="ent-cert-body">
            <div className="ent-cert-stats">
              {CERT_STATUS_SUMMARY.map(item => (
                <div key={item.label} className="ent-cert-stat" style={{ background: item.bg }}>
                  <span className="ent-cert-stat__num" style={{ color: item.color }}>{item.value}</span>
                  <span className="ent-cert-stat__label">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="ent-cert-list">
              <div className="ent-cert-list__header">Priority Attention (Immediate Renewal Required)</div>
              {CERT_EXPIRY_LIST.map((cert, idx) => (
                <div key={idx} className="ent-cert-item">
                  <div className="ent-cert-item__left">
                    <span className={`ent-cert-item__indicator ent-cert-item__indicator--${cert.status}`} />
                    <div>
                      <div className="ent-cert-item__vessel">{cert.vessel}</div>
                      <div className="ent-cert-item__type">Certificate: {cert.cert}</div>
                    </div>
                  </div>
                  <div className="ent-cert-item__right">
                    <span className="ent-cert-item__date">{cert.expiry}</span>
                    <span className={`ent-cert-pill ent-cert-pill--${cert.status}`}>{cert.daysLeft}d remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Findings & CAR Workflow + Quick Actions ──────── */}
      <section className="ent-dash-row ent-dash-row--split">
        {/* Open Findings & CAR Resolution */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Non-Conformities &amp; CAR Resolution</h2>
              <span className="ent-card__caption">Audit findings severity and corrective action workflow</span>
            </div>
            <Badge variant="neutral" size="sm">84 Active</Badge>
          </div>

          <div className="ent-findings-car-container">
            {/* Findings Severity */}
            <div className="ent-findings-subpart">
              <div className="ent-subpart-title">Open Findings by Severity</div>
              <div className="ent-findings-list">
                {FINDINGS_DATA.map(item => {
                  const pct = Math.round((item.value / 84) * 100);
                  return (
                    <div key={item.label} className="ent-findings-row">
                      <div className="ent-findings-row__header">
                        <div className="ent-findings-row__title">
                          <span className="ent-findings-row__dot" style={{ background: item.color }} />
                          <span className="ent-findings-row__name">{item.label}</span>
                          <span className="ent-findings-row__desc">({item.desc})</span>
                        </div>
                        <div className="ent-findings-row__value">
                          <strong>{item.value}</strong>
                          <span className="ent-findings-row__pct">{pct}%</span>
                        </div>
                      </div>
                      <div className="ent-findings-row__bar-bg">
                        <div className="ent-findings-row__bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CAR Resolution Track */}
            <div className="ent-car-subpart">
              <div className="ent-subpart-title">Corrective Action Plan (CAR) Status</div>
              <div className="ent-car-grid">
                {CAR_STATUS_DATA.map(item => (
                  <div key={item.label} className="ent-car-cell" style={{ borderTopColor: item.color }}>
                    <div className="ent-car-cell__num" style={{ color: item.color }}>{item.value}</div>
                    <div className="ent-car-cell__label">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="ent-car-progress-wrap">
                <div className="ent-car-progress-bar">
                  {CAR_STATUS_DATA.map(item => (
                    <div
                      key={item.label}
                      className="ent-car-progress-seg"
                      style={{ width: `${(item.value / 145) * 100}%`, background: item.color }}
                      title={`${item.label}: ${item.value}`}
                    />
                  ))}
                </div>
                <div className="ent-car-progress-legend">
                  <span>145 Total CARs recorded</span>
                  <span className="ent-car-progress-rate"><strong>66.2%</strong> Closed resolution rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="ent-card">
          <div className="ent-card__header">
            <div className="ent-card__title-group">
              <h2 className="ent-card__title">Recent Activity</h2>
              <span className="ent-card__caption">Audit events &amp; filing log</span>
            </div>
            <button type="button" className="ent-link-btn" onClick={() => navigate('/audit/ism')}>View All →</button>
          </div>

          <div className="ent-feed">
            {RECENT_ACTIVITY.map(item => (
              <div key={item.id} className="ent-feed-item">
                <div className={`ent-feed-item__icon ent-feed-item__icon--${item.type}`}>
                  {item.type === 'success' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {item.type === 'info' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                  {item.type === 'warning' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  {item.type === 'neutral' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                    </svg>
                  )}
                </div>
                <div className="ent-feed-item__content">
                  <div className="ent-feed-item__action">{item.action}</div>
                  <div className="ent-feed-item__vessel">
                    <span>{item.vessel}</span>
                    <span className="ent-dot-sep">·</span>
                    <span className="ent-feed-item__imo">IMO {item.imo}</span>
                  </div>
                </div>
                <div className="ent-feed-item__time">{item.time}</div>
              </div>
            ))}
          </div>

          <div className="ent-sys-status">
            <div className="ent-sys-status__title">Maritime Registry Connectors</div>
            <div className="ent-sys-status__row">
              <div className="ent-sys-status__item">
                <span className="ent-sys-dot ent-sys-dot--ok" />
                <span className="ent-sys-name">Master Registry</span>
                <span className="ent-sys-state ent-sys-state--ok">Online</span>
              </div>
              <div className="ent-sys-status__item">
                <span className="ent-sys-dot ent-sys-dot--ok" />
                <span className="ent-sys-name">LRIT Tracking</span>
                <span className="ent-sys-state ent-sys-state--ok">Active</span>
              </div>
              <div className="ent-sys-status__item">
                <span className="ent-sys-dot ent-sys-dot--warn" />
                <span className="ent-sys-name">IMO GISIS</span>
                <span className="ent-sys-state ent-sys-state--warn">Syncing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Upcoming Audits Directory ──────────────────── */}
      <section className="ent-card ent-table-card" aria-label="Upcoming Audits">
        <div className="ent-card__header ent-table-card__header">
          <div className="ent-card__title-group">
            <div className="ent-table-card__title-row">
              <h2 className="ent-card__title">Upcoming Audits &amp; Inspections</h2>
              <Badge variant="scheduled" size="sm">
                17 Scheduled
              </Badge>
            </div>
            <span className="ent-card__caption">
              Pending maritime audits due for execution across Marshall Islands registry
            </span>
          </div>

          <div className="ent-table-toolbar">
            <div className="ent-search-field">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Filter vessel, IMO, or auditor..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="ent-search-field__input"
                aria-label="Filter table"
              />
              {tableSearch && (
                <button
                  type="button"
                  className="ent-search-field__clear"
                  onClick={() => setTableSearch('')}
                  aria-label="Clear filter"
                >×</button>
              )}
            </div>

            <DropdownMenu
              options={['All Types', 'ISM Audit', 'ISPS Audit', 'MLC Inspection']}
              value={tableTypeFilter}
              onChange={setTableTypeFilter}
              size="sm"
            />
            <DropdownMenu
              options={['All Statuses', 'Scheduled', 'Pending', 'In Progress']}
              value={tableStatusFilter}
              onChange={setTableStatusFilter}
              size="sm"
            />
          </div>
        </div>

        <div className="ent-table-wrapper">
          <table className="ent-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Vessel / Registry</th>
                <th style={{ width: '18%' }}>Audit Type</th>
                <th style={{ width: '20%' }}>Lead Auditor</th>
                <th style={{ width: '16%' }}>Due Date</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="ent-table__empty">
                    No scheduled audits match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAudits.map(row => (
                  <tr key={row.id} className="ent-table__row">
                    <td>
                      <div className="ent-vessel-cell">
                        <div className="ent-vessel-cell__flag-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                            <line x1="6" y1="1" x2="6" y2="4" />
                            <line x1="10" y1="1" x2="10" y2="4" />
                            <line x1="14" y1="1" x2="14" y2="4" />
                          </svg>
                        </div>
                        <div className="ent-vessel-cell__text">
                          <div className="ent-vessel-cell__name">{row.vessel}</div>
                          <div className="ent-vessel-cell__meta">
                            <span>IMO {row.imo}</span>
                            <span className="ent-dot-sep">·</span>
                            <span className="ent-flag-tag">{row.flag} Flag</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="ent-audit-type-tag">{row.type}</span></td>
                    <td>
                      <div className="ent-auditor-cell">
                        <span className="ent-auditor-cell__avatar">{row.auditorInitials}</span>
                        <span className="ent-auditor-cell__name">{row.auditor}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ent-date-cell">
                        <span className="ent-date-cell__date">{row.dueDate}</span>
                        <span className="ent-date-cell__sub">{row.dueDays}</span>
                      </div>
                    </td>
                    <td><Badge variant={row.status} size="sm">{row.status}</Badge></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="ent-table__action-btn"
                        onClick={() => navigate('/audit/ism')}
                        title={`Open audit for ${row.vessel}`}
                      >
                        <span>Open</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
