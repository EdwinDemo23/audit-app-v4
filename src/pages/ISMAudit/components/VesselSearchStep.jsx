import { useState } from 'react';
import { FLEET_REGISTRY } from '../data/mockAuditData';

export default function VesselSearchStep({ onSelect }) {
  const [searchCriterion, setSearchCriterion] = useState('IMO Number'); // 'IMO Number' | 'Vessel Name' | 'Vessel ID'
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(null); // { query: string, criterion: string }
  const [filterType, setFilterType] = useState('All');
  const [validationMsg, setValidationMsg] = useState('');
  const [validationType, setValidationType] = useState('info'); // 'info' | 'success' | 'warning'

  // Missing data helper: displays 'N/A' when unavailable
  const renderValue = (val) => {
    if (val === null || val === undefined || val === '' || val === 'N/A') {
      return <span className="ism-na-val">N/A</span>;
    }
    return val;
  };

  // Clear Quick Lookup search
  const handleClearQuickSearch = () => {
    setSearchQuery('');
    setAppliedSearch(null);
    setValidationMsg('');
  };

  // Reset all table and quick lookup filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setAppliedSearch(null);
    setValidationMsg('');
    setFilterType('All');
  };

  // Handle Search Submission from Vessel Registry Quick Lookup
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setValidationMsg('');

    const query = searchQuery.trim();
    if (!query) {
      setValidationMsg('Please enter a search query.');
      setValidationType('warning');
      setAppliedSearch(null);
      return;
    }

    const qLower = query.toLowerCase();

    // Check matches based on criterion
    const matches = FLEET_REGISTRY.filter(v => {
      if (searchCriterion === 'IMO Number') {
        return v.imo ? v.imo.toLowerCase().includes(qLower) : false;
      } else if (searchCriterion === 'Vessel Name') {
        return v.name ? v.name.toLowerCase().includes(qLower) : false;
      } else if (searchCriterion === 'Vessel ID') {
        return (
          (v.id ? v.id.toLowerCase().includes(qLower) : false) ||
          (v.officialNo ? v.officialNo.toLowerCase().includes(qLower) : false)
        );
      }
      return false;
    });

    setAppliedSearch({
      query: query,
      criterion: searchCriterion,
    });

    if (matches.length === 1) {
      setValidationMsg(`Found 1 vessel matching ${searchCriterion} "${query}": ${matches[0].name} (IMO ${matches[0].imo || 'N/A'}). Select it below to proceed.`);
      setValidationType('success');
    } else if (matches.length > 1) {
      setValidationMsg(`Found ${matches.length} vessels matching ${searchCriterion} "${query}". Select one from the directory table below.`);
      setValidationType('info');
    } else {
      setValidationMsg(`No vessel found matching ${searchCriterion} "${query}". Please verify records.`);
      setValidationType('warning');
    }

    // Smoothly ensure table is visible in viewport
    const tableEl = document.getElementById('ism-fleet-directory-card');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Active quick search query: combines applied search or live input
  const activeQuickQuery = (appliedSearch ? appliedSearch.query : searchQuery).trim().toLowerCase();
  const activeQuickCriterion = appliedSearch ? appliedSearch.criterion : searchCriterion;

  const filteredVessels = FLEET_REGISTRY.filter(v => {
    // 1. Vessel Type pill filter
    const matchType =
      filterType === 'All' || (v.type && v.type.toLowerCase().includes(filterType.toLowerCase()));

    // 2. Quick Lookup search filter (filters table whenever searched or typed)
    let matchQuick = true;
    if (activeQuickQuery) {
      if (activeQuickCriterion === 'IMO Number') {
        matchQuick = v.imo ? v.imo.toLowerCase().includes(activeQuickQuery) : false;
      } else if (activeQuickCriterion === 'Vessel Name') {
        matchQuick = v.name ? v.name.toLowerCase().includes(activeQuickQuery) : false;
      } else if (activeQuickCriterion === 'Vessel ID') {
        matchQuick =
          (v.id ? v.id.toLowerCase().includes(activeQuickQuery) : false) ||
          (v.officialNo ? v.officialNo.toLowerCase().includes(activeQuickQuery) : false);
      }
    }

    return matchType && matchQuick;
  });

  return (
    <div className="ism-search-layout">
      {/* ── Search Hero Section matching Screenshot 110301 / 113418 ── */}
      <div className="ism-search-hero">
        <div className="ism-search-hero__content">
          <div className="ism-search-hero__tag">
            <span className="ism-search-hero__flag" />
            <span>Republic of the Marshall Islands Maritime Administrator</span>
          </div>
          <h2 className="ism-search-hero__title">Initiate ISM Audit</h2>
          <p className="ism-search-hero__desc">
            Search or select an active vessel to start an ISM audit.
          </p>
        </div>

        {/* ── Search Bar matching Screenshot 113418 ── */}
        <div className="ism-search-vessel-bar">
          <label className="ism-field-label">Vessel Registry Quick Lookup</label>
          <form className="ism-search-input-group" onSubmit={handleSearchSubmit}>
            {/* Criterion Selector Dropdown matching screenshot */}
            <div className="ism-criterion-dropdown-wrap">
              <select
                className="ism-criterion-select"
                value={searchCriterion}
                onChange={e => {
                  setSearchCriterion(e.target.value);
                  setAppliedSearch(null);
                  setValidationMsg('');
                }}
                id="ism-search-criterion"
              >
                <option value="IMO Number">IMO Number</option>
                <option value="Vessel Name">Vessel Name</option>
                <option value="Vessel ID">Vessel ID</option>
              </select>
            </div>

            {/* Query Input */}
            <div className="ism-search-input-wrap">
              <input
                type="text"
                className="ism-search-input"
                placeholder={
                  searchCriterion === 'IMO Number'
                    ? 'Enter 7-digit IMO (e.g. 9868778)'
                    : searchCriterion === 'Vessel Name'
                    ? 'Enter vessel name (e.g. CLEAR STARS)'
                    : 'Enter Vessel ID / Official No (e.g. V001 or 8656)'
                }
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                id="ism-search-query-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ism-input-clear-btn"
                  onClick={handleClearQuickSearch}
                  title="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="ent-btn ent-btn--primary ism-search-submit-btn"
              id="ism-vessel-search-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search Vessel</span>
            </button>
          </form>

          {validationMsg && (
            <div className={`ism-search-validation-msg ism-search-validation-msg--${validationType}`}>
              <div className="ism-search-validation-msg__content">
                {validationType === 'success' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : validationType === 'warning' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
                <span>{validationMsg}</span>
              </div>
              {filteredVessels.length === 1 && (
                <button
                  type="button"
                  className="ent-btn ent-btn--primary ent-btn--sm ism-quick-select-inline"
                  onClick={() => onSelect(filteredVessels[0])}
                  id="ism-quick-select-single-btn"
                >
                  Proceed with {filteredVessels[0].name} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Select Recent Vessels ── */}
      <div className="ism-quick-vessels">
        <span className="ism-quick-vessels__label">Recent Registry Queries:</span>
        <div className="ism-quick-vessels__chips">
          {FLEET_REGISTRY.slice(0, 4).map(v => (
            <button
              key={v.id}
              type="button"
              className="ism-vessel-chip-btn"
              onClick={() => onSelect(v)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              </svg>
              <span className="ism-vessel-chip-btn__name">{v.name}</span>
              <span className="ism-vessel-chip-btn__imo">{v.id} · IMO {v.imo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Fleet Directory Table ── */}
      <div className="ent-card ism-vessels-card" id="ism-fleet-directory-card">
        <div className="ism-vessels-header">
          <div className="ent-card__title-group">
            <div className="ism-vessels-title-row">
              <h3 className="ent-card__title">Registered Fleet Directory</h3>
              {activeQuickQuery && (
                <span className="ism-active-filter-badge">
                  <span>Filtered by {activeQuickCriterion}: <strong>"{searchQuery.trim() || activeQuickQuery}"</strong></span>
                  <span className="ism-active-filter-count">({filteredVessels.length} {filteredVessels.length === 1 ? 'vessel' : 'vessels'})</span>
                  <button
                    type="button"
                    className="ism-active-filter-clear"
                    onClick={handleClearQuickSearch}
                    title="Clear quick search filter"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
            <span className="ent-card__caption">
              Select an active vessel to bind registry particulars and initialize statutory audit records
            </span>
          </div>

          <div className="ism-table-filters">
            <div className="ism-filter-pills">
              {['All', 'Oil tanker', 'Bulk Carrier', 'Container', 'General Cargo'].map(t => (
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
          </div>
        </div>

        <div className="ent-table-wrapper">
          <table className="ent-table ism-fleet-table">
            <thead>
              <tr>
                <th style={{ width: '9%' }}>Vessel ID</th>
                <th style={{ width: '20%' }}>Vessel Name</th>
                <th style={{ width: '9%' }}>IMO No</th>
                <th style={{ width: '9%' }}>DOC Type No</th>
                <th style={{ width: '11%' }}>Company IMO No</th>
                <th style={{ width: '10%' }}>Company DOC</th>
                <th style={{ width: '7%' }}>Status</th>
                <th style={{ width: '9%' }}>Official No.</th>
                <th style={{ width: '8%' }}>TC Status</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVessels.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '36px 20px', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <div style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                        No vessels found matching directory filter
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', maxWidth: '420px' }}>
                        {activeQuickQuery
                          ? `No vessels match ${activeQuickCriterion} "${searchQuery.trim()}". Try checking your query or reset the filter.`
                          : 'Try adjusting your search criteria or filter pills to view available vessels.'}
                      </div>
                      <button
                        type="button"
                        className="ent-btn ent-btn--secondary ent-btn--sm"
                        style={{ marginTop: 6 }}
                        onClick={handleClearAllFilters}
                      >
                        Reset All Filters ({FLEET_REGISTRY.length} vessels)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVessels.map(v => (
                  <tr
                    key={v.id}
                    className={`ent-table__row ism-vessel-row ${activeQuickQuery ? 'ism-vessel-row--highlighted' : ''}`}
                    onClick={() => onSelect(v)}
                    title={`Click to select ${v.name} and view particulars`}
                  >
                    {/* 1. Vessel ID */}
                    <td>
                      <span className="ism-cell-mono">{renderValue(v.id)}</span>
                    </td>

                    {/* 2. Vessel Name with subtle ship icon */}
                    <td>
                      <div className="ent-vessel-name-cell">
                        <span className="ent-vessel-icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18l1.5-7h15l1.5 7H3z" />
                            <path d="M7 11V6h10v5" />
                            <path d="M12 6V2" />
                            <path d="M2 21c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
                          </svg>
                        </span>
                        <span className="ent-vessel-name-text">{renderValue(v.name)}</span>
                      </div>
                    </td>

                    {/* 3. IMO No */}
                    <td>
                      <span className="ism-cell-mono">{renderValue(v.imo)}</span>
                    </td>

                    {/* 4. DOC Type No */}
                    <td>
                      <span className="ism-cell-mono">{renderValue(v.docTypeNo || v.company?.docTypeNo)}</span>
                    </td>

                    {/* 5. Company IMO No */}
                    <td>
                      <span className="ism-cell-mono">{renderValue(v.companyImoNo || v.company?.imoNo)}</span>
                    </td>

                    {/* 6. Company DOC */}
                    <td>
                      <span>{renderValue(v.companyDoc || v.company?.docType)}</span>
                    </td>

                    {/* 7. Status (Plain text only: Active) */}
                    <td>
                      <span className="ism-plain-status">{renderValue(v.status || 'Active')}</span>
                    </td>

                    {/* 8. Official No. */}
                    <td>
                      <span className="ism-cell-mono">{renderValue(v.officialNo)}</span>
                    </td>

                    {/* 9. TC Status (Plain text: Approved) */}
                    <td>
                      <span className="ism-plain-tc-status">{renderValue(v.tcStatus || 'Approved')}</span>
                    </td>

                    {/* 10. Action (Select button) */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="ent-btn ent-btn--secondary ent-btn--sm ism-action-select-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(v);
                        }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
