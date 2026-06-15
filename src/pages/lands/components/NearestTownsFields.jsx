import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../url/BaseUrl';

// Assume API_BASE_URL is imported or passed. We can use BASE_URL from url/BaseUrl
const API_BASE_URL = BASE_URL;

const NearestTownsFields = ({ editFormData, handleEditChange, states = [] }) => {
  const [localStates, setLocalStates] = useState(states);
  const [nearestTownDistricts, setNearestTownDistricts] = useState([]);
  const [nearestTownMandals, setNearestTownMandals] = useState([]);

  // Fetch states if not provided
  useEffect(() => {
    if (states.length === 0) {
      const fetchStates = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/location`);
          if (res.data.success) {
            setLocalStates(res.data.data);
          }
        } catch (err) {
          console.error('Error fetching states:', err);
        }
      };
      fetchStates();
    } else {
      setLocalStates(states);
    }
  }, [states]);

  // Hydrate districts and mandals if editing an existing record
  useEffect(() => {
    const fetchHydrationData = async () => {
      const stateName = editFormData?.landDetails?.nearest_town_state;
      const districtName = editFormData?.landDetails?.nearest_town_district;

      if (stateName) {
        const selectedState = localStates.find(s => s.name === stateName);
        if (selectedState && selectedState.id) {
          try {
            const res = await axios.get(`${API_BASE_URL}/location/districts/${selectedState.id}`);
            if (res.data.success) {
              setNearestTownDistricts(res.data.data);
              
              // If we have districtName, fetch mandals too
              if (districtName) {
                const selectedDistrict = res.data.data.find(d => d.name === districtName);
                if (selectedDistrict && selectedDistrict.id) {
                  const mandalRes = await axios.get(`${API_BASE_URL}/location/mandals/${selectedDistrict.id}`);
                  if (mandalRes.data.success) {
                    setNearestTownMandals(mandalRes.data.data);
                  }
                }
              }
            }
          } catch (err) {
            console.error('Error hydrating nearest towns location data:', err);
          }
        }
      }
    };

    if (localStates.length > 0) {
      fetchHydrationData();
    }
  }, [editFormData?.landDetails?.nearest_town_state, localStates]);

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    handleEditChange('landDetails.nearest_town_state', stateName);
    handleEditChange('landDetails.nearest_town_district', '');
    handleEditChange('landDetails.nearest_town_mandal', '');
    
    setNearestTownDistricts([]);
    setNearestTownMandals([]);

    const selectedState = localStates.find(s => s.name === stateName);
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
    handleEditChange('landDetails.nearest_town_mandal', '');
    
    setNearestTownMandals([]);

    const selectedDistrict = nearestTownDistricts.find(d => d.name === districtName);
    if (selectedDistrict && selectedDistrict.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/mandals/${selectedDistrict.id}`);
        if (response.data.success) {
          setNearestTownMandals(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching nearest town mandals:', err);
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
          {nearestTownDistricts.map(district => (
            <option key={district.id} value={district.name}>{district.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NearestTownsFields;
