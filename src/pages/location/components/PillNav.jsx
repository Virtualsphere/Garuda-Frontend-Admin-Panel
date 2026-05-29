/**
 * PillNav — Horizontal tab navigation with icons
 * Renders one pill button per tab. Active tab gets orange highlight.
 */
import React from 'react';

export default function PillNav({ tabs, activeTab, onTabChange }) {
  return (
    <div className="loc-pill-nav">
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`loc-pill-nav__item ${activeTab === tab.id ? 'loc-pill-nav__item--active' : ''}`}
          >
            <TabIcon size={14} className="loc-pill-nav__icon" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
