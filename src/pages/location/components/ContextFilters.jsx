/**
 * ContextFilters — Parent entity dropdown selectors
 *
 * Each tab needs different context selectors:
 *   - States:      none
 *   - Districts:   STATE only + CLEAR
 *   - Towns:       STATE + DISTRICT
 *   - Mandals:     STATE + DISTRICT + CLEAR
 *   - Sectors:     STATE + DISTRICT + CLEAR
 *   - Villages:    STATE + DISTRICT + MANDAL
 *   - Roads:       none
 */
import React from 'react';
import { Filter } from 'lucide-react';

export default function ContextFilters({
  activeTab,
  states, districts, mandals,
  stateContext, districtContext, mandalContext,
  onStateChange, onDistrictChange, onMandalChange,
  onClear,
}) {
  // No filters for States or Roads tabs
  if (activeTab === 'states' || activeTab === 'roads-paths') return null;

  // ─── Helper: Render a single select dropdown ──────────────
  const renderSelect = (label, value, onChange, options, placeholder, disabled = false) => (
    <div className="loc-context-card__field">
      <label className="loc-context-card__label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="loc-context-card__select"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
      </select>
    </div>
  );

  // ─── Helper: Render the clear button ──────────────────────
  const renderClear = (label = 'CLEAR CONTEXT') => (
    <button onClick={onClear} className="loc-context-card__clear">
      <Filter size={14} />
      {label}
    </button>
  );

  // ─── Districts Tab ────────────────────────────────────────
  if (activeTab === 'districts') {
    return (
      <div className="loc-context-card">
        <div className="loc-context-card__fields">
          {renderSelect('STATE CONTEXT', stateContext, onStateChange, states, 'All States')}
        </div>
        {stateContext && renderClear()}
      </div>
    );
  }

  // ─── Towns Tab ────────────────────────────────────────────
  if (activeTab === 'towns') {
    return (
      <div className="loc-context-card">
        <div className="loc-context-card__fields">
          {renderSelect('STATE CONTEXT', stateContext, onStateChange, states, 'All States')}
          {renderSelect('DISTRICT CONTEXT', districtContext, onDistrictChange, districts, 'All Districts', !stateContext)}
        </div>
      </div>
    );
  }

  // ─── Mandals Tab ──────────────────────────────────────────
  if (activeTab === 'mandals') {
    return (
      <div className="loc-context-card">
        <div className="loc-context-card__fields">
          {renderSelect('STATE REGISTRY', stateContext, onStateChange, states, 'All States')}
          {renderSelect('DISTRICT REGISTRY', districtContext, onDistrictChange, districts, 'All Districts', !stateContext)}
        </div>
        {(stateContext || districtContext) && renderClear()}
      </div>
    );
  }

  // ─── Sectors Tab ──────────────────────────────────────────
  if (activeTab === 'sectors') {
    return (
      <div className="loc-context-card">
        <div className="loc-context-card__fields">
          {renderSelect('STATE FILTER', stateContext, onStateChange, states, 'All States')}
          {renderSelect('DISTRICT FILTER', districtContext, onDistrictChange, districts, 'All Districts', !stateContext)}
        </div>
        {(stateContext || districtContext) && renderClear('CLEAR')}
      </div>
    );
  }

  // ─── Villages Tab ─────────────────────────────────────────
  if (activeTab === 'villages') {
    return (
      <div className="loc-context-card">
        <div className="loc-context-card__fields">
          {renderSelect('STATE CONTEXT', stateContext, onStateChange, states, 'All States')}
          {renderSelect('DISTRICT CONTEXT', districtContext, onDistrictChange, districts, 'All Districts', !stateContext)}
          {renderSelect('MANDAL CONTEXT', mandalContext, onMandalChange, mandals, 'All Mandals', !districtContext)}
        </div>
      </div>
    );
  }

  return null;
}
