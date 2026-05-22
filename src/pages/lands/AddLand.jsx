import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../url/BaseUrl';

const INITIAL_FARMER_DETAILS = {
  name: '',
  phone: '',
  whatsapp: '',
  ownership_type: 'Ancestral',
  locality: 'Local',
  ownership_status: 'Own',
  age: 'Upto 30',
  literacy: 'Illiterate',
  nature: 'Calm',
};

const INITIAL_LAND_DETAILS = {
  total_acres: 0,
  guntas: 0,
  price_per_acres: 0,
  total_value: 0,
  nearest_road_type: '',
  land_attached_to_road: 'no',
  path_ownership: '',
  land_entry_latitude: '',
  land_entry_longitude: '',
  land_boundary_latitude: '',
  land_boundary_longitude: '',
  soil_type: '',
  fencing_status: '',
  electricity: [],
  residence: [],
  poultry_shed_number: 0,
  cow_shed_number: 0,
  water_source: [],
  number_of_bores: 0,
  farm_pond: false,
  mango_trees_number: '',
  coconut_trees_number: '',
  neem_trees_number: '',
  baniyan_trees_number: '',
  tamarind_trees_number: '',
  sapoto_trees_number: '',
  guava_trees_number: '',
  teak_trees_number: '',
  other_trees_number: '',
  complaints: [],
};

const INITIAL_FORM_DATA = {
  state: '',
  district: '',
  mandal: '',
  village: '',
  location_latitude: '',
  location_longitude: '',
  land_sale_available_status: [],
  mortage_availability_status: [],
  urgency_listing: [],
  verification_package: false,
  form_status: 'draft',
  farmerDetails: { ...INITIAL_FARMER_DETAILS },
  landDetails: { ...INITIAL_LAND_DETAILS },
  gps: { latitude: '', longitude: '' },
  media: [],
  documents: [],
};

// Options for select fields
const LAND_SALE_STATUS_OPTIONS = ['TOKEN RECEIVED', 'MORTGAGED', 'AVAILABLE FOR SALE', 'AGREEMENT Made', 'NOT AVAILABLE', 'SOLD'];
const MORTGAGE_STATUS_OPTIONS = ['AVAILABLE FOR MORTGAGE', 'CURRENTLY MORTGAGED', 'NOT AVAILABLE'];
const URGENCY_OPTIONS = ['urgent sale', 'premium listing'];
const OWNERSHIP_TYPE_OPTIONS = ['Ancestral', 'Purchased'];
const LOCALITY_OPTIONS = ['Local', 'Non-local'];
const OWNERSHIP_STATUS_OPTIONS = ['Own', 'Joint'];
const AGE_OPTIONS = ['Upto 30', '30-50', '50+'];
const LITERACY_OPTIONS = ['Illiterate', 'Literate', 'High School', 'Graduate'];
const NATURE_OPTIONS = ['Calm', 'Polite', 'Normal', 'Rude'];
const ELECTRICITY_OPTIONS = ['single phase', 'three phase'];
const RESIDENCE_OPTIONS = ['developed farm', 'rcc house', 'asbestos shelter', 'hut'];
const WATER_SOURCE_OPTIONS = ['borewell', 'cheruvu', 'canal', 'not available'];
const COMPLAINT_OPTIONS = [
  'Siblings Issue (own Brother or Sister)',
  'Cousins Issue (of uncles family)',
  'Boundary',
  'Rocks In Land',
  'Electric Poles',
  'Sealing',
  'path issue',
  'No Path at all'
];
const MEDIA_CATEGORIES = ['farmer_photo', 'land_soil', 'fencing', 'farm_pond', 'residence', 'shed', 'water_source', 'trees', 'rocks', 'electric_poles', 'others', 'video'];
const DOC_TYPES = ['PASSBOOK', 'AADHAR', 'TITLE_DEED'];

const API_BASE_URL = `${BASE_URL}/api`;

const AddLand = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  // File upload states
  const [uploading, setUploading] = useState(false);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');

  // Fetch all locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/location`);
      if (response.data.success) {
        setStates(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations');
    }
  };

  // Handle state change - fetch districts
  const handleStateChange = async (stateName, stateId) => {
    setFormData(prev => ({ ...prev, state: stateName, district: '', mandal: '', village: '' }));
    setDistricts([]);
    setMandals([]);
    setVillages([]);

    if (stateId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/districts/${stateId}`);
        if (response.data.success) {
          setDistricts(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    }
  };

  // Handle district change - fetch mandals
  const handleDistrictChange = async (districtName, districtId) => {
    setFormData(prev => ({ ...prev, district: districtName, mandal: '', village: '' }));
    setMandals([]);
    setVillages([]);

    if (districtId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/mandals/${districtId}`);
        if (response.data.success) {
          setMandals(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching mandals:', err);
      }
    }
  };

  // Handle mandal change - fetch villages
  const handleMandalChange = async (mandalName, mandalId) => {
    setFormData(prev => ({ ...prev, mandal: mandalName, village: '' }));
    setVillages([]);

    if (mandalId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/villages/${mandalId}`);
        if (response.data.success) {
          setVillages(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching villages:', err);
      }
    }
  };

  // Generic input handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    // Handle nested fields (farmerDetails.xxx, landDetails.xxx, gps.xxx)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'farmerDetails') {
        setFormData(prev => ({
          ...prev,
          farmerDetails: { ...prev.farmerDetails, [child]: value }
        }));
      } else if (parent === 'landDetails') {
        setFormData(prev => ({
          ...prev,
          landDetails: { ...prev.landDetails, [child]: type === 'checkbox' ? checked : value }
        }));
      } else if (parent === 'gps') {
        setFormData(prev => ({
          ...prev,
          gps: { ...prev.gps, [child]: value }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // Handle array fields (multi-select)
  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  // Handle nested array fields (landDetails.electricity, etc.)
  const handleNestedArrayChange = (field, value, checked) => {
    setFormData(prev => {
      const currentArray = prev.landDetails[field] || [];
      if (checked) {
        return { ...prev, landDetails: { ...prev.landDetails, [field]: [...currentArray, value] } };
      } else {
        return { ...prev, landDetails: { ...prev.landDetails, [field]: currentArray.filter(item => item !== value) } };
      }
    });
  };

  // File upload handler
  const handleFileUpload = async (file, type) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append(type, file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-files`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (type === 'photo') {
        return response.data.photoUrl;
      } else if (type === 'document') {
        return response.data.documentUrl;
      } else {
        return response.data.videoUrl;
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Add media to the form
  const handleAddMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedMediaCategory) {
      setError('Please select a category and a file');
      return;
    }

    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const url = await handleFileUpload(file, fileType === 'image' ? 'photo' : 'video');

    if (url) {
      const newMedia = {
        category: selectedMediaCategory,
        type: fileType,
        url: url
      };
      setFormData(prev => ({ ...prev, media: [...prev.media, newMedia] }));
      setSelectedMediaCategory('');
      e.target.value = '';
    }
  };

  // Remove media
  const handleRemoveMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // Add document to the form
  const handleAddDocument = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDocType) {
      setError('Please select a document type and a file');
      return;
    }

    const url = await handleFileUpload(file, 'document');

    if (url) {
      const newDoc = {
        doc_type: selectedDocType,
        file_url: url
      };
      setFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
      setSelectedDocType('');
      e.target.value = '';
    }
  };

  // Remove document
  const handleRemoveDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Calculate total value when acres or price changes
  useEffect(() => {
    const acres = formData.landDetails.total_acres;
    const price = formData.landDetails.price_per_acres;
    if (acres && price) {
      setFormData(prev => ({
        ...prev,
        landDetails: { ...prev.landDetails, total_value: acres * price }
      }));
    }
  }, [formData.landDetails.total_acres, formData.landDetails.price_per_acres]);

  // Submit form
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const submitData = { ...formData, form_status: status };

    // Get token from localStorage (assuming JWT is stored here)
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/land`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setSuccess(`Land ${status === 'draft' ? 'saved as draft' : 'submitted successfully'}!`);
        if (status !== 'draft') {
          setFormData(INITIAL_FORM_DATA);
          setCurrentSection(0);
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit land data');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { title: 'Basic Information', description: 'Location and land status' },
    { title: 'Farmer Details', description: 'Information about the farmer' },
    { title: 'Land Details', description: 'Physical characteristics of the land' },
    { title: 'GPS & Utilities', description: 'Coordinates and amenities' },
    { title: 'Media & Documents', description: 'Photos, videos and legal documents' },
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Location Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <select
            value={formData.state}
            onChange={(e) => {
              const selectedState = states.find(s => s.name === e.target.value);
              handleStateChange(e.target.value, selectedState?.id);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
          <select
            value={formData.district}
            onChange={(e) => {
              const selectedDistrict = districts.find(d => d.name === e.target.value);
              handleDistrictChange(e.target.value, selectedDistrict?.id);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!formData.state}
            required
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mandal *</label>
          <select
            value={formData.mandal}
            onChange={(e) => {
              const selectedMandal = mandals.find(m => m.name === e.target.value);
              handleMandalChange(e.target.value, selectedMandal?.id);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!formData.district}
            required
          >
            <option value="">Select Mandal</option>
            {mandals.map(mandal => (
              <option key={mandal.id} value={mandal.name}>{mandal.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
          <select
            value={formData.village}
            onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!formData.mandal}
            required
          >
            <option value="">Select Village</option>
            {villages.map(village => (
              <option key={village.id} value={village.name}>{village.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Latitude</label>
          <input
            type="text"
            name="location_latitude"
            value={formData.location_latitude}
            onChange={handleInputChange}
            placeholder="e.g., 17.2403"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Longitude</label>
          <input
            type="text"
            name="location_longitude"
            value={formData.location_longitude}
            onChange={handleInputChange}
            placeholder="e.g., 78.4294"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Status Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Land Sale Available Status</label>
        <div className="flex flex-wrap gap-3">
          {LAND_SALE_STATUS_OPTIONS.map(status => (
            <label key={status} className="inline-flex items-center">
              <input
                type="checkbox"
                value={status}
                checked={formData.land_sale_available_status.includes(status)}
                onChange={(e) => handleArrayChange('land_sale_available_status', status, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Availability Status</label>
        <div className="flex flex-wrap gap-3">
          {MORTGAGE_STATUS_OPTIONS.map(status => (
            <label key={status} className="inline-flex items-center">
              <input
                type="checkbox"
                value={status}
                checked={formData.mortage_availability_status.includes(status)}
                onChange={(e) => handleArrayChange('mortage_availability_status', status, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Listing</label>
        <div className="flex flex-wrap gap-3">
          {URGENCY_OPTIONS.map(urgency => (
            <label key={urgency} className="inline-flex items-center">
              <input
                type="checkbox"
                value={urgency}
                checked={formData.urgency_listing.includes(urgency)}
                onChange={(e) => handleArrayChange('urgency_listing', urgency, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{urgency}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="verification_package"
          checked={formData.verification_package}
          onChange={handleInputChange}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label className="ml-2 text-sm text-gray-700">Verification Package</label>
      </div>
    </div>
  );

  const renderFarmerDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name *</label>
          <input
            type="text"
            name="farmerDetails.name"
            value={formData.farmerDetails.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="farmerDetails.phone"
            value={formData.farmerDetails.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <input
            type="tel"
            name="farmerDetails.whatsapp"
            value={formData.farmerDetails.whatsapp}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
          <select
            name="farmerDetails.ownership_type"
            value={formData.farmerDetails.ownership_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {OWNERSHIP_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
          <select
            name="farmerDetails.locality"
            value={formData.farmerDetails.locality}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {LOCALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Status</label>
          <select
            name="farmerDetails.ownership_status"
            value={formData.farmerDetails.ownership_status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {OWNERSHIP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
          <select
            name="farmerDetails.age"
            value={formData.farmerDetails.age}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Literacy</label>
          <select
            name="farmerDetails.literacy"
            value={formData.farmerDetails.literacy}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {LITERACY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nature</label>
          <select
            name="farmerDetails.nature"
            value={formData.farmerDetails.nature}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {NATURE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const renderLandDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Acres</label>
          <input
            type="number"
            name="landDetails.total_acres"
            value={formData.landDetails.total_acres}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guntas</label>
          <input
            type="number"
            name="landDetails.guntas"
            value={formData.landDetails.guntas}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Acre</label>
          <input
            type="number"
            name="landDetails.price_per_acres"
            value={formData.landDetails.price_per_acres}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
          <input
            type="number"
            name="landDetails.total_value"
            value={formData.landDetails.total_value}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Road Type</label>
          <input
            type="text"
            name="landDetails.nearest_road_type"
            value={formData.landDetails.nearest_road_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land Attached to Road</label>
          <select
            name="landDetails.land_attached_to_road"
            value={formData.landDetails.land_attached_to_road}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Path Ownership</label>
          <input
            type="text"
            name="landDetails.path_ownership"
            value={formData.landDetails.path_ownership}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
          <input
            type="text"
            name="landDetails.soil_type"
            value={formData.landDetails.soil_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fencing Status</label>
          <input
            type="text"
            name="landDetails.fencing_status"
            value={formData.landDetails.fencing_status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Boundary Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land Entry Latitude</label>
          <input
            type="text"
            name="landDetails.land_entry_latitude"
            value={formData.landDetails.land_entry_latitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land Entry Longitude</label>
          <input
            type="text"
            name="landDetails.land_entry_longitude"
            value={formData.landDetails.land_entry_longitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land Boundary Latitude</label>
          <input
            type="text"
            name="landDetails.land_boundary_latitude"
            value={formData.landDetails.land_boundary_latitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land Boundary Longitude</label>
          <input
            type="text"
            name="landDetails.land_boundary_longitude"
            value={formData.landDetails.land_boundary_longitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Checkbox groups */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Available</label>
        <div className="flex flex-wrap gap-3">
          {ELECTRICITY_OPTIONS.map(opt => (
            <label key={opt} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.landDetails.electricity.includes(opt)}
                onChange={(e) => handleNestedArrayChange('electricity', opt, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Residence Type</label>
        <div className="flex flex-wrap gap-3">
          {RESIDENCE_OPTIONS.map(opt => (
            <label key={opt} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.landDetails.residence.includes(opt)}
                onChange={(e) => handleNestedArrayChange('residence', opt, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Water Source</label>
        <div className="flex flex-wrap gap-3">
          {WATER_SOURCE_OPTIONS.map(opt => (
            <label key={opt} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.landDetails.water_source.includes(opt)}
                onChange={(e) => handleNestedArrayChange('water_source', opt, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Complaints/Issues</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {COMPLAINT_OPTIONS.map(opt => (
            <label key={opt} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.landDetails.complaints.includes(opt)}
                onChange={(e) => handleNestedArrayChange('complaints', opt, e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Poultry Sheds</label>
          <input
            type="number"
            name="landDetails.poultry_shed_number"
            value={formData.landDetails.poultry_shed_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Cow Sheds</label>
          <input
            type="number"
            name="landDetails.cow_shed_number"
            value={formData.landDetails.cow_shed_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bores</label>
          <input
            type="number"
            name="landDetails.number_of_bores"
            value={formData.landDetails.number_of_bores}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="landDetails.farm_pond"
          checked={formData.landDetails.farm_pond}
          onChange={handleInputChange}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label className="ml-2 text-sm text-gray-700">Farm Pond Available</label>
      </div>

      {/* Trees Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mango Trees (e.g., mango-10)</label>
          <input
            type="text"
            name="landDetails.mango_trees_number"
            value={formData.landDetails.mango_trees_number}
            onChange={handleInputChange}
            placeholder="mango-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coconut Trees</label>
          <input
            type="text"
            name="landDetails.coconut_trees_number"
            value={formData.landDetails.coconut_trees_number}
            onChange={handleInputChange}
            placeholder="coconut-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Neem Trees</label>
          <input
            type="text"
            name="landDetails.neem_trees_number"
            value={formData.landDetails.neem_trees_number}
            onChange={handleInputChange}
            placeholder="neem-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Baniyan Trees</label>
          <input
            type="text"
            name="landDetails.baniyan_trees_number"
            value={formData.landDetails.baniyan_trees_number}
            onChange={handleInputChange}
            placeholder="baniyan-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tamarind Trees</label>
          <input
            type="text"
            name="landDetails.tamarind_trees_number"
            value={formData.landDetails.tamarind_trees_number}
            onChange={handleInputChange}
            placeholder="tamarind-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sapota Trees</label>
          <input
            type="text"
            name="landDetails.sapoto_trees_number"
            value={formData.landDetails.sapoto_trees_number}
            onChange={handleInputChange}
            placeholder="sapoto-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guava Trees</label>
          <input
            type="text"
            name="landDetails.guava_trees_number"
            value={formData.landDetails.guava_trees_number}
            onChange={handleInputChange}
            placeholder="guava-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teak Trees</label>
          <input
            type="text"
            name="landDetails.teak_trees_number"
            value={formData.landDetails.teak_trees_number}
            onChange={handleInputChange}
            placeholder="teak-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other Trees</label>
          <input
            type="text"
            name="landDetails.other_trees_number"
            value={formData.landDetails.other_trees_number}
            onChange={handleInputChange}
            placeholder="banana-10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderGPSAndUtilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPS Latitude</label>
          <input
            type="text"
            name="gps.latitude"
            value={formData.gps.latitude}
            onChange={handleInputChange}
            placeholder="e.g., 17.2403"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPS Longitude</label>
          <input
            type="text"
            name="gps.longitude"
            value={formData.gps.longitude}
            onChange={handleInputChange}
            placeholder="e.g., 78.4294"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Get current location button */}
      <button
        type="button"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              setFormData(prev => ({
                ...prev,
                gps: {
                  latitude: position.coords.latitude.toString(),
                  longitude: position.coords.longitude.toString()
                }
              }));
            });
          }
        }}
        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        Get Current Location
      </button>
    </div>
  );

  const renderMediaAndDocuments = () => (
    <div className="space-y-8">
      {/* Media Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Media (Photos & Videos)</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedMediaCategory}
            onChange={(e) => setSelectedMediaCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            {MEDIA_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
          </select>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleAddMedia}
            disabled={uploading || !selectedMediaCategory}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>

        {/* Media List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {formData.media.map((item, idx) => (
            <div key={idx} className="relative border rounded-lg p-2">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.category} className="w-full h-32 object-cover rounded" />
              ) : (
                <video src={item.url} className="w-full h-32 object-cover rounded" controls />
              )}
              <p className="text-xs text-gray-600 mt-1">{item.category}</p>
              <button
                type="button"
                onClick={() => handleRemoveMedia(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Documents</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Document Type</option>
            {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleAddDocument}
            disabled={uploading || !selectedDocType}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Documents List */}
        <div className="space-y-2">
          {formData.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <span className="font-medium">{doc.doc_type}</span>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline text-sm">
                  View Document
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDocument(idx)}
                className="bg-red-500 text-white rounded-md px-3 py-1 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Add New Land Listing</h1>
            <p className="text-green-100 text-sm mt-1">Fill in the details below to list a new land property</p>
          </div>

          {/* Progress Steps */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex flex-wrap">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSection(idx)}
                  className={`mr-8 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    currentSection === idx
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={(e) => e.preventDefault()} className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            <div className="mb-6">
              {currentSection === 0 && renderBasicInfo()}
              {currentSection === 1 && renderFarmerDetails()}
              {currentSection === 2 && renderLandDetails()}
              {currentSection === 3 && renderGPSAndUtilities()}
              {currentSection === 4 && renderMediaAndDocuments()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                {currentSection === sections.length - 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, 'complete')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, 'review')}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLand;