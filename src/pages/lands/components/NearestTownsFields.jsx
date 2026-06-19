import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../url/BaseUrl';

const API_BASE_URL = `${BASE_URL}/api`;

const NearestTownsFields = ({ editFormData, handleEditChange, states }) => {
  const [localStates, setLocalStates] = useState([]);
  const [nearestTownDistricts, setNearestTownDistricts] = useState([]);
  const [nearestTowns, setNearestTowns] = useState([]);
  const hasFetchedStates = useRef(false);
  const hasHydrated = useRef(false);

  // Fetch states: prefer the prop, otherwise self-fetch once
  useEffect(() => {
    if (states && states.length > 0) {
      setLocalStates(states);
      hasFetchedStates.current = true;
    } else if (!hasFetchedStates.current) {
      hasFetchedStates.current = true;
      const fetchStates = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/location`);
          if (res.data.success) {
            setLocalStates(res.data.data);
          }
        } catch (err) {
          console.error('Error fetching states for NearestTownsFields:', err);
        }
      };
      fetchStates();
    }
  }, [states]);

  // Hydrate districts and towns when editing an existing record
  useEffect(() => {
    if (localStates.length === 0) return;

    const stateName = editFormData?.landDetails?.nearest_town_state;
    const districtName = editFormData?.landDetails?.nearest_town_district;

    if (!stateName) return;

    const hydrateDropdowns = async () => {
      let stateIdToUse = stateName;
      let districtIdToUse = districtName;

      // Check if stateName is actually an ID, or find it in localStates
      let selectedState = localStates.find(s => s.name == stateName || s.id == stateName);
      if (!selectedState) {
        // Fallback: try fetching state directly by ID if it looks like an ID
        if (!isNaN(stateName)) {
          try {
            const stateRes = await axios.get(`${API_BASE_URL}/location/state/${stateName}`);
            if (stateRes.data.success) {
              selectedState = stateRes.data.data;
            }
          } catch (e) {
            console.error('Error fetching state by ID:', e);
          }
        }
      }

      if (!selectedState || !selectedState.id) return;
      stateIdToUse = selectedState.id;

      try {
        const res = await axios.get(`${API_BASE_URL}/location/districts/${stateIdToUse}`);
        if (res.data.success) {
          setNearestTownDistricts(res.data.data);

          // If we also have a district, fetch towns
          if (districtName) {
            let selectedDistrict = res.data.data.find(d => d.name == districtName || d.id == districtName);
            if (!selectedDistrict && !isNaN(districtName)) {
              // The districtName might be an ID. In res.data.data, we might find it.
              selectedDistrict = res.data.data.find(d => d.id == districtName);
            }
            if (selectedDistrict && selectedDistrict.id) {
              const townRes = await axios.get(`${API_BASE_URL}/location/towns/${selectedDistrict.id}`);
              if (townRes.data.success) {
                setNearestTowns(townRes.data.data);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error hydrating nearest towns location data:', err);
      }
    };

    hydrateDropdowns();
   
  }, [localStates, editFormData?.landDetails?.nearest_town_state, editFormData?.landDetails?.nearest_town_district]);

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    handleEditChange('landDetails.nearest_town_state', stateName);
    handleEditChange('landDetails.nearest_town_district', '');
    handleEditChange('landDetails.nearest_town_1', '');
    handleEditChange('landDetails.nearest_town_2', '');
    handleEditChange('landDetails.nearest_town_3', '');
    
    setNearestTownDistricts([]);
    setNearestTowns([]);

    let selectedState = localStates.find(s => s.name == stateName || s.id == stateName);
    if (!selectedState && !isNaN(stateName)) {
      selectedState = { id: stateName }; // Assume it's an ID
    }
    if (selectedState && selectedState.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/districts/${selectedState.id}`);
        if (response.data.success) {
          setNearestTownDistricts(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching nearest town districts:', err);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const districtName = e.target.value;
    handleEditChange('landDetails.nearest_town_district', districtName);
    handleEditChange('landDetails.nearest_town_1', '');
    handleEditChange('landDetails.nearest_town_2', '');
    handleEditChange('landDetails.nearest_town_3', '');
    
    setNearestTowns([]);

    let selectedDistrict = nearestTownDistricts.find(d => d.name == districtName || d.id == districtName);
    if (!selectedDistrict && !isNaN(districtName)) {
      selectedDistrict = { id: districtName }; // Assume it's an ID
    }
    if (selectedDistrict && selectedDistrict.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/towns/${selectedDistrict.id}`);
        if (response.data.success) {
          setNearestTowns(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching nearest towns:', err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">State</label>
        <select
          value={editFormData?.landDetails?.nearest_town_state || ''}
          onChange={handleStateChange}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white"
        >
          <option value="">Select State</option>
          {/* Show current state value even if not in the loaded list */}
          {editFormData?.landDetails?.nearest_town_state && !localStates.some(s => s.name === editFormData.landDetails.nearest_town_state) && (
            <option value={editFormData.landDetails.nearest_town_state}>{editFormData.landDetails.nearest_town_state}</option>
          )}
          {localStates.map(state => (
            <option key={state.id} value={state.name}>{state.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">District</label>
        <select
          value={editFormData?.landDetails?.nearest_town_district || ''}
          onChange={handleDistrictChange}
          disabled={!editFormData?.landDetails?.nearest_town_state}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">Select District</option>
          {/* Show current district value even if not in the loaded list */}
          {editFormData?.landDetails?.nearest_town_district && !nearestTownDistricts.some(d => d.name === editFormData.landDetails.nearest_town_district) && (
            <option value={editFormData.landDetails.nearest_town_district}>{editFormData.landDetails.nearest_town_district}</option>
          )}
          {nearestTownDistricts.map(district => (
            <option key={district.id} value={district.name}>{district.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Primary Urban Hub</label>
        <select
          value={editFormData?.landDetails?.nearest_town_1 || ''}
          onChange={(e) => handleEditChange('landDetails.nearest_town_1', e.target.value)}
          disabled={!editFormData?.landDetails?.nearest_town_district}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">Pick Primary Town</option>
          {/* Show current town value even if not in the loaded list */}
          {editFormData?.landDetails?.nearest_town_1 && !nearestTowns.some(t => t.name === editFormData.landDetails.nearest_town_1) && (
            <option value={editFormData.landDetails.nearest_town_1}>{editFormData.landDetails.nearest_town_1}</option>
          )}
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Secondary Node</label>
        <select
          value={editFormData?.landDetails?.nearest_town_2 || ''}
          onChange={(e) => handleEditChange('landDetails.nearest_town_2', e.target.value)}
          disabled={!editFormData?.landDetails?.nearest_town_district}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">Pick Secondary Town</option>
          {editFormData?.landDetails?.nearest_town_2 && !nearestTowns.some(t => t.name === editFormData.landDetails.nearest_town_2) && (
            <option value={editFormData.landDetails.nearest_town_2}>{editFormData.landDetails.nearest_town_2}</option>
          )}
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Tertiary Node</label>
        <select
          value={editFormData?.landDetails?.nearest_town_3 || ''}
          onChange={(e) => handleEditChange('landDetails.nearest_town_3', e.target.value)}
          disabled={!editFormData?.landDetails?.nearest_town_district}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">Pick Tertiary Town</option>
          {editFormData?.landDetails?.nearest_town_3 && !nearestTowns.some(t => t.name === editFormData.landDetails.nearest_town_3) && (
            <option value={editFormData.landDetails.nearest_town_3}>{editFormData.landDetails.nearest_town_3}</option>
          )}
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NearestTownsFields;
