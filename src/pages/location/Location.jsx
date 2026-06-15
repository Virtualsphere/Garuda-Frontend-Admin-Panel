/**
 * ============================================================
 * Location — Main Orchestrator Component
 * ============================================================
 *
 * This file brings together the custom hook, config, and all UI components.
 * It manages the top-level state (active tab, search, selected contexts)
 * and passes props down to the specialized components.
 */
import React, { useState, useEffect } from 'react';

// Configuration
import { TABS, TAB_CONFIG, INITIAL_FORM_DATA, INITIAL_INFRA_FORM } from './locationConfig';

// Custom Hook
import useLocationApi from './useLocationApi';

// UI Components
import Breadcrumb from './components/Breadcrumb';
import PillNav from './components/PillNav';
import LocationHeader from './components/LocationHeader';
import ContextFilters from './components/ContextFilters';
import InlineAddForm from './components/InlineAddForm';
import DataTable from './components/DataTable';
import InfrastructureModal from './components/InfrastructureModal';

// Styles
import './Location.css';

export default function Location() {
  const api = useLocationApi();

  // ─── UI State ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('states');
  const [viewMode, setViewMode]   = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Context (Filter) State ───────────────────────────────
  const [stateContext, setStateContext]       = useState('');
  const [districtContext, setDistrictContext] = useState('');
  const [mandalContext, setMandalContext]     = useState('');

  // ─── Form State ───────────────────────────────────────────
  const [formData, setFormData]       = useState(INITIAL_FORM_DATA);
  const [editingItem, setEditingItem] = useState(null);

  // ─── Infrastructure State (Roads & Paths) ─────────────────
  const [infraFilter, setInfraFilter]       = useState('');
  const [showInfraModal, setShowInfraModal] = useState(false);
  const [infraForm, setInfraForm]           = useState(INITIAL_INFRA_FORM);

  // ═══════════════════════════════════════════════════════════
  // LIFECYCLE & EFFECTS
  // ═══════════════════════════════════════════════════════════

  // Initial fetch for top-level entities
  useEffect(() => {
    api.fetchStates();
  }, []);

  // Fetch data when active tab changes
  useEffect(() => {
    api.clearError();
    if (activeTab === 'states') api.fetchStates();
    else if (activeTab === 'districts' && stateContext) api.fetchDistricts(stateContext);
    else if (activeTab === 'districts' && !stateContext) api.clearDistricts();
    else if (activeTab === 'towns' && districtContext) api.fetchTowns(districtContext);
    else if (activeTab === 'towns' && !districtContext) api.clearTowns();
    else if (activeTab === 'mandals' && districtContext) api.fetchMandals(districtContext);
    else if (activeTab === 'mandals' && !districtContext) api.clearMandals();
    else if (activeTab === 'villages' && mandalContext) api.fetchVillages(mandalContext);
    else if (activeTab === 'villages' && !mandalContext) api.clearVillages();
    else if (activeTab === 'sectors') api.fetchSectors();
    else if (activeTab === 'roads-paths') api.fetchRoadsPaths();
  }, [activeTab]);

  // Reset local state when tab changes
  useEffect(() => {
    setSearchQuery('');
    setFormData(INITIAL_FORM_DATA);
    setEditingItem(null);
  }, [activeTab]);

  // ═══════════════════════════════════════════════════════════
  // HANDLERS: Context Changes (Cascading resets)
  // ═══════════════════════════════════════════════════════════
  const handleStateChange = (val) => {
    setStateContext(val);
    setDistrictContext('');
    setMandalContext('');
    api.clearDistricts();
    api.clearMandals();
    api.clearVillages();
    api.clearTowns();
    if (val) api.fetchDistricts(val);
  };

  const handleDistrictChange = (val) => {
    setDistrictContext(val);
    setMandalContext('');
    api.clearMandals();
    api.clearVillages();
    api.clearTowns();
    if (val) {
      if (activeTab === 'towns') api.fetchTowns(val);
      else api.fetchMandals(val);
    }
  };

  const handleMandalChange = (val) => {
    setMandalContext(val);
    api.clearVillages();
    if (val) api.fetchVillages(val);
  };

  const clearAllContext = () => {
    setStateContext('');
    setDistrictContext('');
    setMandalContext('');
    api.clearDistricts();
    api.clearMandals();
    api.clearVillages();
  };

  // ═══════════════════════════════════════════════════════════
  // HANDLERS: Forms & CRUD
  // ═══════════════════════════════════════════════════════════
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Context Validations
    if (activeTab === 'districts' && !stateContext) return api.setError('Please select a State first.');
    if (activeTab === 'mandals' && !districtContext) return api.setError('Please select a District first.');
    if (activeTab === 'towns' && !districtContext) return api.setError('Please select a District first.');
    if (activeTab === 'villages' && !mandalContext) return api.setError('Please select a Mandal first.');

    let success = false;

    if (editingItem) {
      if (activeTab === 'states') success = await api.updateState(editingItem.id, formData.name);
      else if (activeTab === 'districts') success = await api.updateDistrict(editingItem.id, formData.name, stateContext);
      else if (activeTab === 'mandals') success = await api.updateMandal(editingItem.id, formData.name, districtContext);
      else if (activeTab === 'villages') success = await api.updateVillage(editingItem.id, formData.name, mandalContext);
      else if (activeTab === 'towns') success = await api.updateTown(editingItem.id, formData.name, districtContext);
    } else {
      if (activeTab === 'states') success = await api.createState(formData.name);
      else if (activeTab === 'districts') success = await api.createDistrict(formData.name, stateContext);
      else if (activeTab === 'mandals') success = await api.createMandal(formData.name, districtContext);
      else if (activeTab === 'villages') success = await api.createVillage(formData.name, mandalContext);
      else if (activeTab === 'towns') success = await api.createTown(formData.name, districtContext);
    }

    if (success) {
      setEditingItem(null);
      setFormData(INITIAL_FORM_DATA);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({ ...formData, name: item.name, code: item.code || '' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleDeleteClick = (type, id) => {
    if (type === 'states') api.deleteState(id);
    if (type === 'districts') api.deleteDistrict(id, stateContext);
    if (type === 'mandals') api.deleteMandal(id, districtContext);
    if (type === 'villages') api.deleteVillage(id, mandalContext);
    if (type === 'towns') api.deleteTown(id, districtContext);
  };

  const handleDrillDown = (targetTab, contextId) => {
    setActiveTab(targetTab);
    if (targetTab === 'districts') handleStateChange(contextId.toString());
    if (targetTab === 'mandals' || targetTab === 'towns') handleDistrictChange(contextId.toString());
    if (targetTab === 'villages') handleMandalChange(contextId.toString());
  };

  const handleInfraSubmit = () => {
    const newRoad = {
      id: api.roadsPaths.length + 1,
      name: infraForm.routeName,
      category: infraForm.category.toUpperCase(),
      type: infraForm.specificType || 'UNCLASSIFIED',
      length: '0.0 km',
      status: 'DRAFT',
    };
    api.addRoad(newRoad);
    setInfraForm(INITIAL_INFRA_FORM);
    setShowInfraModal(false);
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="loc-page">
      <Breadcrumb activeTab={activeTab} />

      <PillNav
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="loc-content">
        <LocationHeader
          config={TAB_CONFIG[activeTab]}
          activeTab={activeTab}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddInfrastructure={() => setShowInfraModal(true)}
        />

        {api.error && (
          <div className="loc-error">
            {api.error}
            <button onClick={api.clearError} className="loc-error__close">×</button>
          </div>
        )}

        <ContextFilters
          activeTab={activeTab}
          states={api.states}
          districts={api.districts}
          mandals={api.mandals}
          stateContext={stateContext}
          districtContext={districtContext}
          mandalContext={mandalContext}
          onStateChange={handleStateChange}
          onDistrictChange={handleDistrictChange}
          onMandalChange={handleMandalChange}
          onClear={clearAllContext}
        />

        <InlineAddForm
          activeTab={activeTab}
          formData={formData}
          editingItem={editingItem}
          onFormChange={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
        />

        <DataTable
          activeTab={activeTab}
          loading={api.loading}
          states={api.states}
          districts={api.districts}
          towns={api.towns}
          mandals={api.mandals}
          sectors={api.sectors}
          villages={api.villages}
          roadsPaths={api.roadsPaths}
          stateContext={stateContext}
          districtContext={districtContext}
          mandalContext={mandalContext}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          infraFilter={infraFilter}
          onInfraFilterChange={setInfraFilter}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onDrillDown={handleDrillDown}
        />
      </div>

      <InfrastructureModal
        show={showInfraModal}
        formData={infraForm}
        onFormChange={setInfraForm}
        onSubmit={handleInfraSubmit}
        onClose={() => setShowInfraModal(false)}
      />
    </div>
  );
}