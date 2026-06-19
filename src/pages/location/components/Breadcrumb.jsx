/**
 * Breadcrumb — Top navigation trail
 * Shows: 🏛 REGISTRY > roads > {activeTab}
 */
import { ChevronRight, Maximize2 } from 'lucide-react';

export default function Breadcrumb({ activeTab }) {
  return (
    <div className="loc-breadcrumb">
      <div className="loc-breadcrumb__left">
        <span className="loc-breadcrumb__icon">🏛</span>
        <span className="loc-breadcrumb__text">REGISTRY</span>
        <ChevronRight size={12} className="loc-breadcrumb__sep" />
        <span className="loc-breadcrumb__text">roads</span>
        <ChevronRight size={12} className="loc-breadcrumb__sep" />
        <span className="loc-breadcrumb__text loc-breadcrumb__text--bold">{activeTab}</span>
      </div>
      <button className="loc-breadcrumb__expand">
        <Maximize2 size={14} />
      </button>
    </div>
  );
}
