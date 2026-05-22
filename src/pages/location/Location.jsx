import React, { useState, useEffect } from 'react';
import { Plus, Lock, Map, List, Search, ChevronDown, MapPin, AlertCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { BASE_URL } from '../../url/BaseUrl';

const API_BASE_URL = `${BASE_URL}/api`; // Update with your backend URL

export default function Location() {
  const [activeTab, setActiveTab] = useState('states');
  const [stateContext, setStateContext] = useState('');
  const [districtContext, setDistrictContext] = useState('');
  const [mandalContext, setMandalContext] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [roadsPaths, setRoadsPaths] = useState([]);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    state_id: '',
    district_id: '',
    mandal_id: ''
  });

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'states') fetchStates();
    else if (activeTab === 'districts') fetchDistricts();
    else if (activeTab === 'mandals') fetchMandals();
    else if (activeTab === 'villages') fetchVillages();
    else if (activeTab === 'sectors') fetchSectors();
    else if (activeTab === 'roads-paths') fetchRoadsPaths();
  }, [activeTab]);

  // API Calls
  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/location`);
      const data = await response.json();
      if (data.success) {
        setStates(data.data);
      }
    } catch (err) {
      setError('Failed to fetch states');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateId = null) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/location/districts`;
      if (stateId || stateContext) {
        url = `${API_BASE_URL}/location/districts/${stateId || stateContext}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
      } else if (Array.isArray(data)) {
        setDistricts(data);
      }
    } catch (err) {
      setError('Failed to fetch districts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMandals = async (districtId = null) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/location/mandals`;
      if (districtId || districtContext) {
        url = `${API_BASE_URL}/location/mandals/${districtId || districtContext}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setMandals(data.data);
      } else if (Array.isArray(data)) {
        setMandals(data);
      }
    } catch (err) {
      setError('Failed to fetch mandals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVillages = async (mandalId = null) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/location/villages`;
      if (mandalId || mandalContext) {
        url = `${API_BASE_URL}/location/villages/${mandalId || mandalContext}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setVillages(data.data);
      } else if (Array.isArray(data)) {
        setVillages(data);
      }
    } catch (err) {
      setError('Failed to fetch villages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    // Mock data for sectors - replace with actual API when available
    setSectors([
      { id: 1, name: 'Parveda Sector', clustering: '1 Units Mapped', lifecycle: 'YES' },
      { id: 2, name: 'Mokila Sector', clustering: '1 Units Mapped', lifecycle: 'YES' },
      { id: 3, name: 'Chilkur Sector', clustering: '0 Units Mapped', lifecycle: 'YES' },
      { id: 4, name: 'Chevella Sector', clustering: '2 Units Mapped', lifecycle: 'YES' }
    ]);
  };

  const fetchRoadsPaths = async () => {
    // Mock data for roads/paths - replace with actual API when available
    setRoadsPaths([
      { id: 1, name: 'Shankarpally Highway', category: 'ROAD', type: 'HIGHWAY', length: '12.4 km', status: 'MAPPED' },
      { id: 2, name: 'Mokila Double Road', category: 'ROAD', type: 'DOUBLE ROAD', length: '4.2 km', status: 'MAPPED' },
      { id: 3, name: 'Parveda Path', category: 'PATH', type: 'TRACTOR', length: '1.8 km', status: 'DRAFT' },
      { id: 4, name: 'Hillside Walkway', category: 'PATH', type: 'ON FOOT', length: '0.5 km', status: 'MAPPED' }
    ]);
  };

  // Create operations
  const createState = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStates();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create state');
      return false;
    }
  };

  const createDistrict = async (name, state_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/district`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, state_id: parseInt(state_id) })
      });
      const data = await response.json();
      if (data.success) {
        await fetchDistricts();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create district');
      return false;
    }
  };

  const createMandal = async (name, district_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/mandal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, district_id: parseInt(district_id) })
      });
      const data = await response.json();
      if (data.success) {
        await fetchMandals();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create mandal');
      return false;
    }
  };

  const createVillage = async (name, mandal_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/village`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mandal_id: parseInt(mandal_id) })
      });
      const data = await response.json();
      if (data.success) {
        await fetchVillages();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to create village');
      return false;
    }
  };

  // Update operations
  const updateState = async (id, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/state/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        await fetchStates();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update state');
      return false;
    }
  };

  const updateDistrict = async (id, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/district/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        await fetchDistricts();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update district');
      return false;
    }
  };

  const updateMandal = async (id, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/mandal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        await fetchMandals();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update mandal');
      return false;
    }
  };

  const updateVillage = async (id, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/village/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        await fetchVillages();
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update village');
      return false;
    }
  };

  // Delete operations
  const deleteState = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state? This will also delete all associated districts, mandals, and villages.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/location/state/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchStates();
      } else {
        setError('Failed to delete state');
      }
    } catch (err) {
      setError('Failed to delete state');
    }
  };

  const deleteDistrict = async (id) => {
    if (!window.confirm('Are you sure you want to delete this district?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/location/district/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchDistricts();
      } else {
        setError('Failed to delete district');
      }
    } catch (err) {
      setError('Failed to delete district');
    }
  };

  const deleteMandal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mandal?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/location/mandal/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchMandals();
      } else {
        setError('Failed to delete mandal');
      }
    } catch (err) {
      setError('Failed to delete mandal');
    }
  };

  const deleteVillage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this village?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/location/village/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchVillages();
      } else {
        setError('Failed to delete village');
      }
    } catch (err) {
      setError('Failed to delete village');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (editingItem) {
      if (activeTab === 'states') success = await updateState(editingItem.id, formData.name);
      else if (activeTab === 'districts') success = await updateDistrict(editingItem.id, formData.name);
      else if (activeTab === 'mandals') success = await updateMandal(editingItem.id, formData.name);
      else if (activeTab === 'villages') success = await updateVillage(editingItem.id, formData.name);
    } else {
      if (activeTab === 'states') success = await createState(formData.name);
      else if (activeTab === 'districts') success = await createDistrict(formData.name, formData.state_id);
      else if (activeTab === 'mandals') success = await createMandal(formData.name, formData.district_id);
      else if (activeTab === 'villages') success = await createVillage(formData.name, formData.mandal_id);
    }
    
    if (success) {
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({ name: '', state_id: '', district_id: '', mandal_id: '' });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...formData, name: item.name });
    setShowAddForm(true);
  };

  const tabs = [
    { id: 'states', label: 'STATES' },
    { id: 'districts', label: 'DISTRICTS' },
    { id: 'mandals', label: 'MANDALS' },
    { id: 'villages', label: 'VILLAGES' },
    { id: 'sectors', label: 'SECTORS' },
    { id: 'roads-paths', label: 'ROADS & PATHS' }
  ];

  const renderAddForm = () => {
    if (!showAddForm) return null;

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">
            {editingItem ? `EDIT ${activeTab.toUpperCase()}` : `ADD NEW ${activeTab.toUpperCase()}`}
          </h3>
          <button onClick={() => { setShowAddForm(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {(activeTab === 'districts' || activeTab === 'mandals' || activeTab === 'villages') && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  {activeTab === 'districts' ? 'STATE' : activeTab === 'mandals' ? 'DISTRICT' : 'MANDAL'}
                </label>
                <select
                  required
                  value={activeTab === 'districts' ? formData.state_id : activeTab === 'mandals' ? formData.district_id : formData.mandal_id}
                  onChange={(e) => {
                    if (activeTab === 'districts') setFormData({ ...formData, state_id: e.target.value });
                    else if (activeTab === 'mandals') setFormData({ ...formData, district_id: e.target.value });
                    else setFormData({ ...formData, mandal_id: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select {activeTab === 'districts' ? 'State' : activeTab === 'mandals' ? 'District' : 'Mandal'}</option>
                  {activeTab === 'districts' && states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                  {activeTab === 'mandals' && districts.map(district => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                  {activeTab === 'villages' && mandals.map(mandal => (
                    <option key={mandal.id} value={mandal.id}>{mandal.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`Enter ${activeTab.slice(0, -1)} name...`}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors">
              <Save size={18} />
              {editingItem ? 'UPDATE' : `ADD ${activeTab.toUpperCase()}`}
            </button>
            <button type="button" onClick={() => { setShowAddForm(false); setEditingItem(null); }} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      );
    }

    if (activeTab === 'states') {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">STATE NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">CREATED AT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{state.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(state.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(state)} className="text-blue-600 hover:text-blue-700 font-bold text-xs px-2 py-1 rounded hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteState(state.id)} className="text-red-600 hover:text-red-700 font-bold text-xs px-2 py-1 rounded hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {states.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">No states found. Click "ADD STATE" to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'districts') {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <select 
              value={stateContext} 
              onChange={(e) => { setStateContext(e.target.value); fetchDistricts(e.target.value); }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DISTRICT NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">STATE</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{district.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{district.state?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(district)} className="text-blue-600 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteDistrict(district.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'mandals') {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <select 
              value={districtContext} 
              onChange={(e) => { setDistrictContext(e.target.value); fetchMandals(e.target.value); }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">MANDAL NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DISTRICT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {mandals.map((mandal) => (
                <tr key={mandal.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{mandal.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{mandal.district?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(mandal)} className="text-blue-600 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMandal(mandal.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'villages') {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <select 
              value={mandalContext} 
              onChange={(e) => { setMandalContext(e.target.value); fetchVillages(e.target.value); }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">All Mandals</option>
              {mandals.map(mandal => (
                <option key={mandal.id} value={mandal.id}>{mandal.name}</option>
              ))}
            </select>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">VILLAGE NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">MANDAL</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {villages.map((village) => (
                <tr key={village.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{village.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{village.mandal?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(village)} className="text-blue-600 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteVillage(village.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'sectors') {
      return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">SECTOR NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">CLUSTERING</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">LIFECYCLE</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ACTIONS</th>
               </tr>
            </thead>
            <tbody>
              {sectors.map((sector) => (
                <tr key={sector.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{sector.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sector.clustering}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-green-700 bg-green-100">
                      {sector.lifecycle}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded font-bold text-xs">
                      <MapPin size={16} />
                      ATTACH VILLAGES
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'roads-paths') {
      return (
        <div>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search route name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ENTITY DESCRIPTION</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">CATEGORY</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">TYPE</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">CALCULATED LENGTH</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">MANAGEMENT</th>
                 </tr>
              </thead>
              <tbody>
                {roadsPaths.filter(road => 
                  road.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((road) => (
                  <tr key={road.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{road.name}</p>
                        <p className="text-xs text-slate-500">ID: {road.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        road.category === 'ROAD' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {road.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{road.type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{road.length}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        road.status === 'MAPPED' ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
                      }`}>
                        {road.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded font-bold text-xs">
                        📋 DRAFT ROUTE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-blue-900 uppercase tracking-wider">Mapping Directive</h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  ENSURE ALL ROAD PRIVILEGES AND PATH CONNECTIONS ARE DRAFTED WITHIN DESIGNATED PRECISION FOR ACCURATE PROPERTY ACCESSIBILITY RATINGS. PATHS ARE CATEGORIZED BY MAIL LOAD, TRACTOR, CAR, BIKE OR ON FOOT.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const tabConfig = {
    states: { title: 'REGISTRY: STATES', subtitle: 'ADMINISTRATIVE PERIMETERS AND STATE-LEVEL OVERSIGHT', icon: '🗺️' },
    districts: { title: 'REGISTRY: DISTRICTS', subtitle: 'ADMINISTRATIVE DISTRICTS AND TERRITORIAL BOUNDARIES', icon: '📍' },
    mandals: { title: 'REGISTRY: MANDALS', subtitle: 'ADMINISTRATIVE MANDALS AND TERRITORIAL CLUSTERING', icon: '📌' },
    villages: { title: 'REGISTRY: VILLAGES', subtitle: 'VILLAGE DRAFTING AND TERRITORIAL CLUSTERING', icon: '🏞️' },
    sectors: { title: 'REGISTRY: SECTORS', subtitle: 'CLUSTERING AND TERRITORIAL INTELLIGENCE', icon: '🎯' },
    'roads-paths': { title: 'INFRASTRUCTURE: ROADS & PATHS', subtitle: 'CONNECTIVITY AND ACCESSIBILITY MANAGEMENT', icon: '🛣️' }
  };

  const currentConfig = tabConfig[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 py-0">
        <div className="flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-orange-500 bg-orange-50 text-orange-700'
                  : 'border-b-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1">
                <span>{currentConfig.icon}</span>
                {currentConfig.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {currentConfig.subtitle}
              </p>
            </div>
            {activeTab !== 'roads-paths' && activeTab !== 'sectors' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors"
              >
                <Plus size={18} />
                ADD {activeTab.toUpperCase()}
              </button>
            )}
            {activeTab === 'sectors' && (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors">
                  <List size={16} />
                  LIST
                </button>
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                  MAP ALLOTMENT
                </button>
              </div>
            )}
            {activeTab === 'roads-paths' && (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors">
                  <List size={16} />
                  LIST
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                  <Map size={16} />
                  MAP
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-sm transition-colors">
                  <Plus size={16} />
                  ADD INFRASTRUCTURE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button onClick={() => setError(null)} className="float-right text-red-700">×</button>
          </div>
        )}

        {/* Add Form */}
        {renderAddForm()}

        {/* Table */}
        {renderTable()}
      </div>
    </div>
  );
}