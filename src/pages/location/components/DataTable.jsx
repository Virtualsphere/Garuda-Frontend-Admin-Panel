/**
 * DataTable — Renders the correct data table for the active tab
 *
 * Each tab has its own table layout:
 *   - States:   Name, Code, District Capacity, Mapped Area, Management
 *   - Districts: Name, Code, Mandal Capacity, Mapped Area, Management
 *   - Towns:    Name, Code, Area Coverage, Mapped Area, Management
 *   - Mandals:  Name, Code, Village Capacity, Mapped Area, Management
 *   - Sectors:  Name (colored dot), Code, Clustering, Lifecycle, Management
 *   - Villages: Name, Sector Allotment, Mapped Area, Management
 *   - Roads:    Entity + ID, Category (icon), Type, Length, Status, Management
 *
 * All data and action handlers are received as props from the parent.
 */
import { Edit, Trash2, MapPin, ChevronRight, Search, Route, AlertCircle } from 'lucide-react';

export default function DataTable({
  activeTab, loading,
  // Data arrays
  states, districts, towns, mandals, villages, roadsPaths,
  // Context state (to decide what empty message to show)
  stateContext, districtContext, mandalContext,
  // Search & filter (roads-paths only)
  searchQuery, onSearchChange, infraFilter, onInfraFilterChange,
  // Action handlers
  onEdit, onDelete, onDrillDown,
}) {
  // ─── Loading Spinner ──────────────────────────────────────
  if (loading) {
    return (
      <div className="loc-loading">
        <div className="loc-loading__spinner"></div>
        <p className="loc-loading__text">Loading...</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // STATES TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'states') {
    return (
      <div className="loc-table-wrap">
        <table className="loc-table">
          <thead>
            <tr>
              <th>ADMINISTRATIVE STATE</th>
              <th>CODE</th>
              <th>DISTRICT CAPACITY</th>
              <th>MAPPED AREA (HA)</th>
              <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state) => (
              <tr key={state.id}>
                <td className="loc-table__name">{state.name}</td>
                <td><span className="loc-code-badge">{state.code || '—'}</span></td>
                <td className="loc-table__meta">{state.district_count || 0} Districts Registered</td>
                <td className="loc-table__meta loc-table__meta--blue">Calculated on commit</td>
                <td className="loc-table__actions">
                  <button onClick={() => onEdit(state)} className="loc-action-btn loc-action-btn--icon" title="Edit">
                    <MapPin size={15} />
                  </button>
                  <button className="loc-action-btn loc-action-btn--outline">ATTACH AREA</button>
                  <button onClick={() => onDrillDown('districts', state.id)} className="loc-action-btn loc-action-btn--primary">
                    DISTRICTS <ChevronRight size={14} />
                  </button>
                  <button onClick={() => onDelete('states', state.id)} className="loc-action-btn loc-action-btn--delete" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {states.length === 0 && (
              <tr><td colSpan="5" className="loc-table__empty">No states found. Add a state using the form above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // DISTRICTS TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'districts') {
    if (!stateContext) {
      return <div className="loc-table-wrap"><div className="loc-empty-state">Select state context to synchronize districts.</div></div>;
    }
    return (
      <div className="loc-table-wrap">
        <table className="loc-table">
          <thead>
            <tr>
              <th>DISTRICT NAME</th>
              <th>CODE</th>
              <th>MANDAL CAPACITY</th>
              <th>MAPPED AREA (HA)</th>
              <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d) => (
              <tr key={d.id}>
                <td className="loc-table__name">{d.name}</td>
                <td><span className="loc-code-badge">{d.code || '—'}</span></td>
                <td className="loc-table__meta">{d.mandal_count || 0} Mandals Registered</td>
                <td className="loc-table__meta loc-table__meta--blue">Calculated on commit</td>
                <td className="loc-table__actions">
                  <button onClick={() => onEdit(d)} className="loc-action-btn loc-action-btn--icon" title="Edit"><Edit size={14} /></button>
                  <button onClick={() => onDrillDown('mandals', d.id)} className="loc-action-btn loc-action-btn--primary">
                    MANDALS <ChevronRight size={14} />
                  </button>
                  <button onClick={() => onDelete('districts', d.id)} className="loc-action-btn loc-action-btn--delete" title="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {districts.length === 0 && (
              <tr><td colSpan="5" className="loc-table__empty">No districts found for this state.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TOWNS TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'towns') {
    if (!stateContext || !districtContext) {
      return <div className="loc-table-wrap"><div className="loc-empty-state">Select state and district contexts to synchronize towns.</div></div>;
    }
    return (
      <div className="loc-table-wrap">
        <table className="loc-table">
          <thead>
            <tr>
              <th>TOWN NAME</th>
              <th>CODE</th>
              <th>AREA COVERAGE</th>
              <th>MAPPED AREA (HA)</th>
              <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {towns.map((town) => (
              <tr key={town.id}>
                <td className="loc-table__name">{town.name}</td>
                <td><span className="loc-code-badge">{town.code || '—'}</span></td>
                <td className="loc-table__meta">Urban Context</td>
                <td className="loc-table__meta loc-table__meta--blue">Calculated on commit</td>
                <td className="loc-table__actions">
                  <button onClick={() => onEdit(town)} className="loc-action-btn loc-action-btn--icon" title="Edit"><Edit size={14} /></button>
                  <button onClick={() => onDelete('towns', town.id)} className="loc-action-btn loc-action-btn--delete" title="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {towns.length === 0 && (
              <tr><td colSpan="5" className="loc-table__empty">No towns found. Add a town using the form above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MANDALS TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'mandals') {
    if (!districtContext) {
      return <div className="loc-table-wrap"><div className="loc-empty-state">Select district context to synchronize mandals.</div></div>;
    }
    return (
      <div className="loc-table-wrap">
        <table className="loc-table">
          <thead>
            <tr>
              <th>MANDAL NAME</th>
              <th>CODE</th>
              <th>VILLAGE CAPACITY</th>
              <th>MAPPED AREA (HA)</th>
              <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {mandals.map((m) => (
              <tr key={m.id}>
                <td className="loc-table__name">{m.name}</td>
                <td><span className="loc-code-badge">{m.code || '—'}</span></td>
                <td className="loc-table__meta">{m.village_count || 0} Villages Registered</td>
                <td className="loc-table__meta loc-table__meta--blue">Calculated on commit</td>
                <td className="loc-table__actions">
                  <button onClick={() => onEdit(m)} className="loc-action-btn loc-action-btn--icon" title="Edit"><Edit size={14} /></button>
                  <button onClick={() => onDrillDown('villages', m.id)} className="loc-action-btn loc-action-btn--primary">
                    VILLAGES <ChevronRight size={14} />
                  </button>
                  <button onClick={() => onDelete('mandals', m.id)} className="loc-action-btn loc-action-btn--delete" title="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {mandals.length === 0 && (
              <tr><td colSpan="5" className="loc-table__empty">No mandals found for this district.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // VILLAGES TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'villages') {
    if (!mandalContext) {
      return <div className="loc-table-wrap"><div className="loc-empty-state">Select state, district, and mandal registries to synchronize villages.</div></div>;
    }
    return (
      <div className="loc-table-wrap">
        <table className="loc-table">
          <thead>
            <tr>
              <th>VILLAGE NAME</th>
              <th>MAPPED AREA (HA)</th>
              <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v) => (
              <tr key={v.id}>
                <td className="loc-table__name">{v.name}</td>
                <td className="loc-table__meta loc-table__meta--blue">Calculated on commit</td>
                <td className="loc-table__actions">
                  <button onClick={() => onEdit(v)} className="loc-action-btn loc-action-btn--icon" title="Edit"><Edit size={14} /></button>
                  <button className="loc-action-btn loc-action-btn--outline">ATTACH AREA</button>
                  <button onClick={() => onDelete('villages', v.id)} className="loc-action-btn loc-action-btn--delete" title="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {villages.length === 0 && (
              <tr><td colSpan="4" className="loc-table__empty">No villages found for this mandal.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ROADS & PATHS TABLE
  // ═══════════════════════════════════════════════════════════
  if (activeTab === 'roads-paths') {
    const filteredRoads = roadsPaths.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !infraFilter || r.category === infraFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div>
        <div className="loc-table-wrap">
          {/* Search + Filter Bar */}
          <div className="loc-table-filter loc-table-filter--roads">
            <div className="loc-search-box">
              <Search size={16} className="loc-search-box__icon" />
              <input
                type="text"
                placeholder="Search route name or ID..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="loc-search-box__input"
              />
            </div>
            <select value={infraFilter} onChange={(e) => onInfraFilterChange(e.target.value)} className="loc-filter-select">
              <option value="">All Infrastructure</option>
              <option value="ROAD">Roads</option>
              <option value="PATH">Paths</option>
            </select>
          </div>

          <table className="loc-table">
            <thead>
              <tr>
                <th>ENTITY DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>TYPE</th>
                <th>CALCULATED LENGTH</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoads.map((road) => (
                <tr key={road.id}>
                  <td>
                    <div className="loc-table__name">{road.name}</div>
                    <div className="loc-table__subtext">{road.category === 'ROAD' ? 'RD' : 'PT'}{String(road.id).padStart(3, '0')}</div>
                  </td>
                  <td>
                    <span className={`loc-category-tag ${road.category === 'ROAD' ? 'loc-category-tag--road' : 'loc-category-tag--path'}`}>
                      <Route size={13} /> {road.category}
                    </span>
                  </td>
                  <td><span className="loc-type-label">{road.type}</span></td>
                  <td className="loc-table__meta">{road.length}</td>
                  <td>
                    <span className={`loc-badge ${road.status === 'MAPPED' ? 'loc-badge--mapped' : 'loc-badge--draft'}`}>{road.status}</span>
                  </td>
                  <td className="loc-table__actions">
                    <button className="loc-action-btn loc-action-btn--outline">📋 DRAFT ROUTE</button>
                    <button className="loc-action-btn loc-action-btn--delete"><MapPin size={14} /></button>
                  </td>
                </tr>
              ))}
              {filteredRoads.length === 0 && (
                <tr><td colSpan="6" className="loc-table__empty">No infrastructure records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mapping Directive Banner */}
        <div className="loc-info-banner">
          <AlertCircle size={18} className="loc-info-banner__icon" />
          <div>
            <h4 className="loc-info-banner__title">Mapping Directive</h4>
            <p className="loc-info-banner__text">
              ENSURE ALL ROAD FRONTAGES AND PATH CONNECTIONS ARE DRAFTED WITHIN 50CM PRECISION FOR ACCURATE PROPERTY ACCESSIBILITY RATINGS.{' '}
              <span style={{ color: '#f97316', fontWeight: 600 }}>Paths are categorized by mail load, Tractor, Car, Bike, or On Foot.</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
