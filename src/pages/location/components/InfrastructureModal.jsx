/**
 * InfrastructureModal — Register Infrastructure popup for Roads & Paths
 */
import React from 'react';
import { X } from 'lucide-react';
import { INFRA_CATEGORIES, ROAD_TYPES, PATH_TYPES } from '../locationConfig';

export default function InfrastructureModal({ show, formData, onFormChange, onSubmit, onClose }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="loc-modal-overlay" onClick={onClose}>
      <div className="loc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="loc-modal__close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="loc-modal__title">REGISTER INFRASTRUCTURE</h2>
        <p className="loc-modal__subtitle">ENTER NAME AND SELECT ACCESSIBILITY CLASSIFICATION.</p>

        <form onSubmit={handleSubmit}>
          {/* Route Designation */}
          <div className="loc-modal__field">
            <label className="loc-modal__label">ROUTE DESIGNATION</label>
            <input
              type="text"
              required
              value={formData.routeName}
              onChange={(e) => onFormChange({ ...formData, routeName: e.target.value })}
              placeholder="e.g. South Bypass"
              className="loc-modal__input"
            />
          </div>

          <div className="loc-modal__row">
            {/* Category Dropdown */}
            <div className="loc-modal__field">
              <label className="loc-modal__label">CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) => onFormChange({ ...formData, category: e.target.value, specificType: '' })}
                className="loc-modal__select"
              >
                {INFRA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            {/* Specific Type Dropdown */}
            <div className="loc-modal__field">
              <label className="loc-modal__label">SPECIFIC TYPE</label>
              <select
                value={formData.specificType}
                onChange={(e) => onFormChange({ ...formData, specificType: e.target.value })}
                className="loc-modal__select"
              >
                <option value="">Select</option>
                {(formData.category === 'Road' ? ROAD_TYPES : PATH_TYPES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="loc-modal__submit">
            COMMIT TO REGISTRY
          </button>
        </form>
      </div>
    </div>
  );
}
