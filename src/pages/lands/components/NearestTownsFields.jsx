import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../url/BaseUrl';

const API_BASE_URL = `${BASE_URL}/api`;

const NearestTownsFields = ({ editFormData, handleEditChange, states }) => {
  const [localStates, setLocalStates] = useState([]);
  // District lists (one per state, but we keep separate arrays for independence)
  const [nearestTownDistricts1, setNearestTownDistricts1] = useState([]);
  const [nearestTownDistricts2, setNearestTownDistricts2] = useState([]);
  const [nearestTownDistricts3, setNearestTownDistricts3] = useState([]);
  // Town lists (one per district)
  const [nearestTowns1, setNearestTowns1] = useState([]);
  const [nearestTowns2, setNearestTowns2] = useState([]);
  const [nearestTowns3, setNearestTowns3] = useState([]);
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

  // Helper: fetch districts for a state
  const fetchDistrictsForState = async (stateId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/location/districts/${stateId}`);
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
    return [];
  };

  // Helper: fetch towns for a district
  const fetchTownsForDistrict = async (districtId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/location/towns/${districtId}`);
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error('Error fetching towns:', err);
    }
    return [];
  };

  // Hydrate all 3 district/town pairs when editing an existing record
  useEffect(() => {
    if (localStates.length === 0) return;

    const stateName = editFormData?.landDetails?.nearest_town_state;
    if (!stateName) return;

    const hydrateAll = async () => {
      let selectedState = localStates.find(s => s.name == stateName || s.id == stateName);
      if (!selectedState && !isNaN(stateName)) {
        try {
          const stateRes = await axios.get(`${API_BASE_URL}/location/state/${stateName}`);
          if (stateRes.data.success) {
            selectedState = stateRes.data.data;
          }
        } catch (e) {
          console.error('Error fetching state by ID:', e);
        }
      }
      if (!selectedState || !selectedState.id) return;

      // Fetch districts for the state (all 3 district dropdowns share the same state)
      const districts = await fetchDistrictsForState(selectedState.id);
      setNearestTownDistricts1(districts);
      setNearestTownDistricts2(districts);
      setNearestTownDistricts3(districts);

      // Hydrate towns for district 1
      const district1Name = editFormData?.landDetails?.nearest_town_district;
      if (district1Name) {
        const d1 = districts.find(d => d.name == district1Name || d.id == district1Name);
        if (d1?.id) {
          const towns1 = await fetchTownsForDistrict(d1.id);
          setNearestTowns1(towns1);
        }
      }

      // Hydrate towns for district 2
      const district2Name = editFormData?.landDetails?.nearest_town_district_2;
      if (district2Name) {
        const d2 = districts.find(d => d.name == district2Name || d.id == district2Name);
        if (d2?.id) {
          const towns2 = await fetchTownsForDistrict(d2.id);
          setNearestTowns2(towns2);
        }
      }

      // Hydrate towns for district 3
      const district3Name = editFormData?.landDetails?.nearest_town_district_3;
      if (district3Name) {
        const d3 = districts.find(d => d.name == district3Name || d.id == district3Name);
        if (d3?.id) {
          const towns3 = await fetchTownsForDistrict(d3.id);
          setNearestTowns3(towns3);
        }
      }
    };

    hydrateAll();
   
  }, [localStates, editFormData?.landDetails?.nearest_town_state, editFormData?.landDetails?.nearest_town_district, editFormData?.landDetails?.nearest_town_district_2, editFormData?.landDetails?.nearest_town_district_3]);

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    handleEditChange('landDetails.nearest_town_state', stateName);
    // Clear all 3 districts and towns
    handleEditChange('landDetails.nearest_town_district', '');
    handleEditChange('landDetails.nearest_town_district_2', '');
    handleEditChange('landDetails.nearest_town_district_3', '');
    handleEditChange('landDetails.nearest_town_1', '');
    handleEditChange('landDetails.nearest_town_2', '');
    handleEditChange('landDetails.nearest_town_3', '');
    
    setNearestTownDistricts1([]);
    setNearestTownDistricts2([]);
    setNearestTownDistricts3([]);
    setNearestTowns1([]);
    setNearestTowns2([]);
    setNearestTowns3([]);

    let selectedState = localStates.find(s => s.name == stateName || s.id == stateName);
    if (!selectedState && !isNaN(stateName)) {
      selectedState = { id: stateName };
    }
    if (selectedState && selectedState.id) {
      const districts = await fetchDistrictsForState(selectedState.id);
      setNearestTownDistricts1(districts);
      setNearestTownDistricts2(districts);
      setNearestTownDistricts3(districts);
    }
  };

  // District change handler for town 1
  const handleDistrictChange1 = async (e) => {
    const districtName = e.target.value;
    handleEditChange('landDetails.nearest_town_district', districtName);
    handleEditChange('landDetails.nearest_town_1', '');
    setNearestTowns1([]);

    let selectedDistrict = nearestTownDistricts1.find(d => d.name == districtName || d.id == districtName);
    if (!selectedDistrict && !isNaN(districtName)) {
      selectedDistrict = { id: districtName };
    }
    if (selectedDistrict && selectedDistrict.id) {
      const towns = await fetchTownsForDistrict(selectedDistrict.id);
      setNearestTowns1(towns);
    }
  };

  // District change handler for town 2
  const handleDistrictChange2 = async (e) => {
    const districtName = e.target.value;
    handleEditChange('landDetails.nearest_town_district_2', districtName);
    handleEditChange('landDetails.nearest_town_2', '');
    setNearestTowns2([]);

    let selectedDistrict = nearestTownDistricts2.find(d => d.name == districtName || d.id == districtName);
    if (!selectedDistrict && !isNaN(districtName)) {
      selectedDistrict = { id: districtName };
    }
    if (selectedDistrict && selectedDistrict.id) {
      const towns = await fetchTownsForDistrict(selectedDistrict.id);
      setNearestTowns2(towns);
    }
  };

  // District change handler for town 3
  const handleDistrictChange3 = async (e) => {
    const districtName = e.target.value;
    handleEditChange('landDetails.nearest_town_district_3', districtName);
    handleEditChange('landDetails.nearest_town_3', '');
    setNearestTowns3([]);

    let selectedDistrict = nearestTownDistricts3.find(d => d.name == districtName || d.id == districtName);
    if (!selectedDistrict && !isNaN(districtName)) {
      selectedDistrict = { id: districtName };
    }
    if (selectedDistrict && selectedDistrict.id) {
      const towns = await fetchTownsForDistrict(selectedDistrict.id);
      setNearestTowns3(towns);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shared State Dropdown */}
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

      {/* Block 1: District 1 + Primary Urban Hub */}
      <div className="border border-teal-100 rounded-lg p-3 bg-teal-50/30">
        <div className="text-[8px] font-bold text-teal-600 uppercase tracking-wider mb-2">Primary Town</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">District</label>
            <select
              value={editFormData?.landDetails?.nearest_town_district || ''}
              onChange={handleDistrictChange1}
              disabled={!editFormData?.landDetails?.nearest_town_state}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select District</option>
              {editFormData?.landDetails?.nearest_town_district && !nearestTownDistricts1.some(d => d.name === editFormData.landDetails.nearest_town_district) && (
                <option value={editFormData.landDetails.nearest_town_district}>{editFormData.landDetails.nearest_town_district}</option>
              )}
              {nearestTownDistricts1.map(district => (
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
              {editFormData?.landDetails?.nearest_town_1 && !nearestTowns1.some(t => t.name === editFormData.landDetails.nearest_town_1) && (
                <option value={editFormData.landDetails.nearest_town_1}>{editFormData.landDetails.nearest_town_1}</option>
              )}
              {nearestTowns1.map(town => (
                <option key={town.id} value={town.name}>{town.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Block 2: District 2 + Secondary Node */}
      <div className="border border-teal-100 rounded-lg p-3 bg-teal-50/30">
        <div className="text-[8px] font-bold text-teal-600 uppercase tracking-wider mb-2">Secondary Town</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">District</label>
            <select
              value={editFormData?.landDetails?.nearest_town_district_2 || ''}
              onChange={handleDistrictChange2}
              disabled={!editFormData?.landDetails?.nearest_town_state}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select District</option>
              {editFormData?.landDetails?.nearest_town_district_2 && !nearestTownDistricts2.some(d => d.name === editFormData.landDetails.nearest_town_district_2) && (
                <option value={editFormData.landDetails.nearest_town_district_2}>{editFormData.landDetails.nearest_town_district_2}</option>
              )}
              {nearestTownDistricts2.map(district => (
                <option key={district.id} value={district.name}>{district.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Secondary Node</label>
            <select
              value={editFormData?.landDetails?.nearest_town_2 || ''}
              onChange={(e) => handleEditChange('landDetails.nearest_town_2', e.target.value)}
              disabled={!editFormData?.landDetails?.nearest_town_district_2}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Pick Secondary Town</option>
              {editFormData?.landDetails?.nearest_town_2 && !nearestTowns2.some(t => t.name === editFormData.landDetails.nearest_town_2) && (
                <option value={editFormData.landDetails.nearest_town_2}>{editFormData.landDetails.nearest_town_2}</option>
              )}
              {nearestTowns2.map(town => (
                <option key={town.id} value={town.name}>{town.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Block 3: District 3 + Tertiary Node */}
      <div className="border border-teal-100 rounded-lg p-3 bg-teal-50/30">
        <div className="text-[8px] font-bold text-teal-600 uppercase tracking-wider mb-2">Tertiary Town</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">District</label>
            <select
              value={editFormData?.landDetails?.nearest_town_district_3 || ''}
              onChange={handleDistrictChange3}
              disabled={!editFormData?.landDetails?.nearest_town_state}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Select District</option>
              {editFormData?.landDetails?.nearest_town_district_3 && !nearestTownDistricts3.some(d => d.name === editFormData.landDetails.nearest_town_district_3) && (
                <option value={editFormData.landDetails.nearest_town_district_3}>{editFormData.landDetails.nearest_town_district_3}</option>
              )}
              {nearestTownDistricts3.map(district => (
                <option key={district.id} value={district.name}>{district.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Tertiary Node</label>
            <select
              value={editFormData?.landDetails?.nearest_town_3 || ''}
              onChange={(e) => handleEditChange('landDetails.nearest_town_3', e.target.value)}
              disabled={!editFormData?.landDetails?.nearest_town_district_3}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">Pick Tertiary Town</option>
              {editFormData?.landDetails?.nearest_town_3 && !nearestTowns3.some(t => t.name === editFormData.landDetails.nearest_town_3) && (
                <option value={editFormData.landDetails.nearest_town_3}>{editFormData.landDetails.nearest_town_3}</option>
              )}
              {nearestTowns3.map(town => (
                <option key={town.id} value={town.name}>{town.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearestTownsFields;
