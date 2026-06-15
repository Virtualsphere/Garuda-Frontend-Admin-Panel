/**
 * ============================================================
 * useLocationApi — Custom hook for Location page API calls
 * ============================================================
 *
 * Encapsulates ALL backend communication for the Location page:
 *   - Fetch (GET) for each entity type
 *   - Create (POST) for states, districts, mandals, villages
 *   - Update (PUT) for states, districts, mandals, villages
 *   - Delete (DELETE) with confirmation prompts
 *
 * USAGE:
 *   const api = useLocationApi();
 *   api.fetchStates();
 *   api.createState('Maharashtra');
 *   api.deleteState(1);
 *
 * The hook returns all data arrays (states, districts, etc.),
 * loading/error state, and all CRUD functions.
 */

import { useState } from 'react';
import { BASE_URL } from '../../url/BaseUrl';

const API_BASE_URL = `${BASE_URL}/api`;

export default function useLocationApi() {
  // ─── Data State ───────────────────────────────────────────
  const [states, setStates]       = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals]     = useState([]);
  const [villages, setVillages]   = useState([]);
  const [sectors, setSectors]     = useState([]);
  const [towns, setTowns]         = useState([]);
  const [roadsPaths, setRoadsPaths] = useState([]);

  // ─── UI State ─────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ═══════════════════════════════════════════════════════════
  // FETCH (GET) Operations
  // ═══════════════════════════════════════════════════════════

  const fetchStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location`);
      const data = await response.json();
      if (data.success) setStates(data.data);
    } catch (err) {
      console.error('Failed to fetch states:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateId) => {
    if (!stateId) { setDistricts([]); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location/districts/${stateId}`);
      const data = await response.json();
      if (data.success) setDistricts(data.data);
      else if (Array.isArray(data)) setDistricts(data);
    } catch (err) {
      console.error('Failed to fetch districts:', err);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMandals = async (districtId) => {
    if (!districtId) { setMandals([]); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location/mandals/${districtId}`);
      const data = await response.json();
      if (data.success) setMandals(data.data);
      else if (Array.isArray(data)) setMandals(data);
    } catch (err) {
      console.error('Failed to fetch mandals:', err);
      setMandals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVillages = async (mandalId) => {
    if (!mandalId) { setVillages([]); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location/villages/${mandalId}`);
      const data = await response.json();
      if (data.success) setVillages(data.data);
      else if (Array.isArray(data)) setVillages(data);
    } catch (err) {
      console.error('Failed to fetch villages:', err);
      setVillages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTowns = async (districtId) => {
    if (!districtId) { setTowns([]); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/location/towns/${districtId}`);
      const data = await response.json();
      if (data.success) setTowns(data.data);
      else if (Array.isArray(data)) setTowns(data);
    } catch (err) {
      console.error('Failed to fetch towns:', err);
      setTowns([]);
    } finally {
      setLoading(false);
    }
  };

  /** Sectors — currently uses mock data. Replace with API call when backend is ready. */
  const fetchSectors = async () => {
    setSectors([
      { id: 1, name: 'Parveda Sector', code: 'PRV', clustering: '1 Units Mapped', lifecycle: 'LIVE', dotColor: '#22c55e' },
      { id: 2, name: 'Mokila Sector',  code: 'MKL', clustering: '1 Units Mapped', lifecycle: 'LIVE', dotColor: '#3b82f6' },
      { id: 3, name: 'Chilkur Sector', code: 'CLK', clustering: '0 Units Mapped', lifecycle: 'LIVE', dotColor: '#f97316' },
      { id: 4, name: 'Chevella Sector', code: 'CHV', clustering: '2 Units Mapped', lifecycle: 'LIVE', dotColor: '#8b5cf6' },
    ]);
  };

  /** Roads & Paths — currently uses mock data. Replace with API call when backend is ready. */
  const fetchRoadsPaths = async () => {
    setRoadsPaths([
      { id: 1, name: 'Shankarpally Highway', category: 'ROAD', type: 'HIGHWAY',     length: '12.4 km', status: 'MAPPED' },
      { id: 2, name: 'Mokila Double Road',   category: 'ROAD', type: 'DOUBLE ROAD', length: '4.2 km',  status: 'MAPPED' },
      { id: 3, name: 'Parveda Path',         category: 'PATH', type: 'TRACTOR',     length: '1.8 km',  status: 'DRAFT'  },
      { id: 4, name: 'Hillside Walkway',     category: 'PATH', type: 'ON FOOT',     length: '0.5 km',  status: 'MAPPED' },
    ]);
  };

  // ═══════════════════════════════════════════════════════════
  // CREATE (POST) Operations
  // ═══════════════════════════════════════════════════════════

  const createState = async (name) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchStates(); return true; }
      return false;
    } catch (err) { setError('Failed to create state'); return false; }
  };

  const createDistrict = async (name, stateId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/district`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, state_id: parseInt(stateId) }),
      });
      const data = await res.json();
      if (data.success) { await fetchDistricts(stateId); return true; }
      return false;
    } catch (err) { setError('Failed to create district'); return false; }
  };

  const createMandal = async (name, districtId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/mandal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, district_id: parseInt(districtId) }),
      });
      const data = await res.json();
      if (data.success) { await fetchMandals(districtId); return true; }
      return false;
    } catch (err) { setError('Failed to create mandal'); return false; }
  };

  const createVillage = async (name, mandalId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/village`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mandal_id: parseInt(mandalId) }),
      });
      const data = await res.json();
      if (data.success) { await fetchVillages(mandalId); return true; }
      return false;
    } catch (err) { setError('Failed to create village'); return false; }
  };

  const createTown = async (name, districtId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/town`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, district_id: parseInt(districtId) }),
      });
      const data = await res.json();
      if (data.success) { await fetchTowns(districtId); return true; }
      return false;
    } catch (err) { setError('Failed to create town'); return false; }
  };

  // ═══════════════════════════════════════════════════════════
  // UPDATE (PUT) Operations
  // ═══════════════════════════════════════════════════════════

  const updateState = async (id, name) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/state/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchStates(); return true; }
      return false;
    } catch (err) { setError('Failed to update state'); return false; }
  };

  const updateDistrict = async (id, name, stateId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/district/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchDistricts(stateId); return true; }
      return false;
    } catch (err) { setError('Failed to update district'); return false; }
  };

  const updateMandal = async (id, name, districtId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/mandal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchMandals(districtId); return true; }
      return false;
    } catch (err) { setError('Failed to update mandal'); return false; }
  };

  const updateVillage = async (id, name, mandalId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/village/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchVillages(mandalId); return true; }
      return false;
    } catch (err) { setError('Failed to update village'); return false; }
  };

  const updateTown = async (id, name, districtId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/location/town/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) { await fetchTowns(districtId); return true; }
      return false;
    } catch (err) { setError('Failed to update town'); return false; }
  };

  // ═══════════════════════════════════════════════════════════
  // DELETE Operations
  // ═══════════════════════════════════════════════════════════

  const deleteState = async (id) => {
    if (!window.confirm('Delete this state? All associated districts, mandals, and villages will also be deleted.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/location/state/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchStates();
      else setError('Failed to delete state');
    } catch (err) { setError('Failed to delete state'); }
  };

  const deleteDistrict = async (id, stateId) => {
    if (!window.confirm('Delete this district?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/location/district/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchDistricts(stateId);
      else setError('Failed to delete district');
    } catch (err) { setError('Failed to delete district'); }
  };

  const deleteMandal = async (id, districtId) => {
    if (!window.confirm('Delete this mandal?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/location/mandal/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchMandals(districtId);
      else setError('Failed to delete mandal');
    } catch (err) { setError('Failed to delete mandal'); }
  };

  const deleteVillage = async (id, mandalId) => {
    if (!window.confirm('Delete this village?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/location/village/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchVillages(mandalId);
      else setError('Failed to delete village');
    } catch (err) { setError('Failed to delete village'); }
  };

  const deleteTown = async (id, districtId) => {
    if (!window.confirm('Delete this town?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/location/town/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchTowns(districtId);
      else setError('Failed to delete town');
    } catch (err) { setError('Failed to delete town'); }
  };

  // ─── Utility: Add infrastructure locally ──────────────────
  const addRoad = (road) => {
    setRoadsPaths(prev => [...prev, road]);
  };

  // ─── Utility: Clear data arrays (used on context reset) ───
  const clearDistricts = () => setDistricts([]);
  const clearMandals   = () => setMandals([]);
  const clearVillages  = () => setVillages([]);
  const clearTowns     = () => setTowns([]);
  const clearError     = () => setError(null);

  // ═══════════════════════════════════════════════════════════
  // PUBLIC API — everything this hook exposes
  // ═══════════════════════════════════════════════════════════
  return {
    // Data
    states, districts, mandals, villages, sectors, towns, roadsPaths,
    loading, error,

    // Fetch
    fetchStates, fetchDistricts, fetchMandals, fetchVillages, fetchTowns,
    fetchSectors, fetchRoadsPaths,

    // CRUD Create
    createState, createDistrict, createMandal, createVillage, createTown,

    // CRUD Update
    updateState, updateDistrict, updateMandal, updateVillage, updateTown,

    // CRUD Delete
    deleteState, deleteDistrict, deleteMandal, deleteVillage, deleteTown,

    // Utility
    addRoad, clearDistricts, clearMandals, clearVillages, clearTowns,
    setError, clearError,
  };
}
