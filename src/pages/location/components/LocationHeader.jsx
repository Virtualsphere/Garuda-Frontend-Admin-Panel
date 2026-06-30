/**
 * LocationHeader — Page title + subtitle + view toggle + action button
 *
 * Different tabs show different toggles:
 *   - Sectors:     LIST (icon) | ALLOTMENT (icon)
 *   - Villages:    LIST | MAP CONTEXT
 *   - Roads:       LIST (icon) | MAP (icon) + ADD INFRASTRUCTURE button
 *   - All others:  LIST | MAP ALLOTMENT
 */
import { List, Map, LayoutGrid, PlusCircle } from 'lucide-react';

export default function LocationHeader({ config, activeTab, viewMode, onViewModeChange, onAddInfrastructure }) {
  const HeaderIcon = config.icon;

  return (
    <div className="loc-header">
      {/* Left: Icon + Title + Subtitle */}
      <div className="loc-header__left">
        <HeaderIcon size={22} className="loc-header__inline-icon" />
        <div>
          <h1 className="loc-header__title">{config.title}</h1>
          <p className="loc-header__subtitle">{config.subtitle}</p>
        </div>
      </div>

      {/* Right: View Toggle + optional action button */}
      <div className="loc-header__right">
        {activeTab === 'roads-paths' ? (
          <>
            <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange}
              options={[
                { mode: 'list', label: 'LIST', icon: <List size={14} /> },
                { mode: 'map',  label: 'MAP',  icon: <Map size={14} /> },
              ]}
            />
            <button onClick={onAddInfrastructure} className="loc-add-infra-btn">
              <PlusCircle size={16} />
              ADD INFRASTRUCTURE
            </button>
          </>
        ) : activeTab === 'villages' ? (
          <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange}
            options={[
              { mode: 'list', label: 'LIST' },
              { mode: 'map',  label: 'MAP CONTEXT' },
            ]}
          />
        ) : (
          <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange}
            options={[
              { mode: 'list', label: 'LIST' },
              { mode: 'map',  label: 'MAP ALLOTMENT' },
            ]}
          />
        )}
      </div>
    </div>
  );
}

/**
 * ViewToggle — Reusable LIST/MAP toggle button group
 * @param {Array} options - [{ mode, label, icon? }]
 */
function ViewToggle({ viewMode, onViewModeChange, options }) {
  return (
    <div className="loc-view-toggle">
      {options.map((opt) => (
        <button
          key={opt.mode}
          onClick={() => onViewModeChange(opt.mode)}
          className={`loc-view-toggle__btn ${opt.icon ? 'loc-view-toggle__btn--with-icon' : ''} ${viewMode === opt.mode ? 'loc-view-toggle__btn--active' : ''}`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
