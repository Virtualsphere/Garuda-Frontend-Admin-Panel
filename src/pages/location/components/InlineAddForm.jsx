/**
 * InlineAddForm — Entity creation form (shown below context filters)
 *
 * Uses FORM_CONFIG from locationConfig.js to render the correct
 * fields per tab (name input, code input, add button).
 *
 * Not rendered for Roads & Paths (uses the modal instead).
 */
import { PlusCircle, X } from 'lucide-react';
import { FORM_CONFIG } from '../locationConfig';

export default function InlineAddForm({ activeTab, formData, editingItem, onFormChange, onSubmit, onCancel }) {
  // Roads & Paths uses a modal, not an inline form
  if (activeTab === 'roads-paths') return null;

  const config = FORM_CONFIG[activeTab];
  if (!config) return null;

  return (
    <form onSubmit={onSubmit} className="loc-inline-form">
      {/* Name Input */}
      <div className="loc-inline-form__field" style={{ flex: 1 }}>
        <label className="loc-inline-form__label">{config.label}</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          placeholder={config.placeholder}
          className="loc-inline-form__input"
        />
      </div>

      {/* Code Input (optional — e.g. Villages don't have one) */}
      {config.codeLabel && (
        <div className="loc-inline-form__field" style={{ minWidth: 140 }}>
          <label className="loc-inline-form__label">{config.codeLabel}</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onFormChange({ ...formData, code: e.target.value.toUpperCase().slice(0, config.codeMax) })}
            placeholder={config.codePlaceholder}
            maxLength={config.codeMax}
            className="loc-inline-form__input"
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="loc-inline-form__field loc-inline-form__field--btn">
        <button type="submit" className={`loc-add-btn ${config.btnColor === 'green' ? 'loc-add-btn--green' : ''}`}>
          <PlusCircle size={16} />
          {editingItem ? 'UPDATE' : config.btnLabel}
        </button>
      </div>

      {/* Cancel Button (only visible when editing) */}
      {editingItem && (
        <div className="loc-inline-form__field loc-inline-form__field--btn">
          <button type="button" onClick={onCancel} className="loc-cancel-btn">
            <X size={16} />
          </button>
        </div>
      )}
    </form>
  );
}
