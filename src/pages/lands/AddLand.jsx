import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../url/BaseUrl';
import { fixUrl } from '../../utils/fixUrl';
import {
  Home, ChevronRight, Maximize2,
  PlusCircle, Users, CheckSquare, Search,
  PenLine, CircleDot, Eye, FileText,
  LayoutGrid, UserCheck, CalendarCheck,
  UploadCloud, MapPin, CheckCircle, Save, 
  IndianRupee, Layers, Image as ImageIcon, 
  Video, Trash2, Camera, Compass, ShieldCheck, Check
} from 'lucide-react';
import LandVerificationDashboard from './LandVerificationDashboard';
import VerifiedLandsDashboard from './VerifiedLandsDashboard';

const INITIAL_FARMER_DETAILS = {
  name: '',
  phone: '',
  whatsapp: '',
  ownership_type: '',
  locality: '',
  ownership_status: '',
  age: '',
  literacy: '',
  nature: '',
};

const INITIAL_LAND_DETAILS = {
  total_acres: 0,
  guntas: 0,
  price_per_acres: '',
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
  nearest_town_state: '',
  nearest_town_district: '',
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
const LAND_SALE_STATUS_OPTIONS = ['TOKEN RECEIVED', 'AVAILABLE FOR SALE', 'AGREEMENT Made', 'NOT AVAILABLE', 'SOLD'];
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
const MEDIA_CATEGORIES = ['farmer_photo', 'land_soil', 'fencing', 'farm_pond', 'residence', 'shed', 'water_source', 'trees', 'rocks', 'electric_poles', 'others', 'video', 'farmer_agreement'];
const DOC_TYPES = ['PASSBOOK', 'AADHAR', 'TITLE_DEED'];

const MEDIA_LABELS = {
  farmer_photo: 'Farmer Photo',
  land_soil: 'Land Soil',
  fencing: 'Fencing',
  farm_pond: 'Farm Pond',
  residence: 'Residence',
  shed: 'Shed',
  water_source: 'Water Source',
  trees: 'Trees',
  rocks: 'Rocks',
  electric_poles: 'Electric Poles',
  others: 'Others',
  video: 'Full Site Video',
  farmer_agreement: 'Farmer Agreement',
};

const API_BASE_URL = `${BASE_URL}/api`;

const getTotalLandValue = (landDetails) =>
  (Number(landDetails?.total_acres) || 0) * (Number(landDetails?.price_per_acres) || 0);

const createEmptyFormData = () => ({
  ...INITIAL_FORM_DATA,
  farmerDetails: { ...INITIAL_FARMER_DETAILS },
  landDetails: { ...INITIAL_LAND_DETAILS },
  gps: { latitude: '', longitude: '' },
  media: [],
  documents: [],
});

// Must be defined outside AddLand — defining components inside causes remount on every keystroke.
const CardWrapper = ({ color, icon, title, watermark, children }) => (
  <div className={`land-card land-card--${color}`}>
    <div className={`land-card__header land-card__header--${color}`}>
      <div className="land-card__watermark">{watermark}</div>
      <div className={`land-card__badge land-card__badge--${color}`}>{icon}</div>
      <div className={`land-card__title land-card__title--${color}`}>{title}</div>
    </div>
    <div className="land-card__body">
      {children}
    </div>
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider"></span>
  </label>
);

const AddLand = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeNavItem, setActiveNavItem] = useState('Add land');
  const [whatsappSame, setWhatsappSame] = useState(true);

  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [nearestTownDistricts, setNearestTownDistricts] = useState([]);
  const [nearestTowns, setNearestTowns] = useState([]);

  // File upload states
  const [uploading, setUploading] = useState(false);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');

  // Boundary points state
  const [boundaryPoints, setBoundaryPoints] = useState([{ lat: '', lng: '' }]);

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

  const handleNearestTownStateChange = async (stateName, stateId) => {
    setFormData(prev => ({
      ...prev,
      landDetails: { ...prev.landDetails, nearest_town_state: stateName, nearest_town_district: '' }
    }));
    setNearestTownDistricts([]);
    setNearestTowns([]);

    if (stateId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/districts/${stateId}`);
        if (response.data.success) {
          setNearestTownDistricts(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching nearest town districts:', err);
      }
    }
  };

  const handleNearestTownDistrictChange = async (districtName, districtId) => {
    setFormData(prev => ({
      ...prev,
      landDetails: { 
        ...prev.landDetails, 
        nearest_town_district: districtName,
        nearest_town_1: '',
        nearest_town_2: '',
        nearest_town_3: ''
      }
    }));
    
    setNearestTowns([]);

    if (districtId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/towns/${districtId}`);
        if (response.data.success) {
          setNearestTowns(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching nearest towns:', err);
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
          farmerDetails: { 
            ...prev.farmerDetails, 
            [child]: value,
            ...(child === 'phone' && whatsappSame ? { whatsapp: value } : {})
          }
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
    const token = localStorage.getItem('token');
    const formDataUpload = new FormData();
    formDataUpload.append(type, file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-files`, formDataUpload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
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

  // Submit form
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const sanitizeData = (obj) => {
      if (Array.isArray(obj)) return obj.map(sanitizeData);
      if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
          if (obj[key] === "") {
            newObj[key] = null;
          } else {
            newObj[key] = sanitizeData(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    const submitData = sanitizeData({
      ...formData,
      form_status: status,
    });

    // Convert flat tree fields from landDetails into the `trees` array format
    // that the backend expects for the land_tree table
    const treeFieldMap = [
      { field: 'mango_trees_number', type: 'Mango' },
      { field: 'coconut_trees_number', type: 'Coconut' },
      { field: 'neem_trees_number', type: 'Neem' },
      { field: 'baniyan_trees_number', type: 'Banyan' },
      { field: 'tamarind_trees_number', type: 'Tamarind' },
      { field: 'sapoto_trees_number', type: 'Sapota' },
      { field: 'guava_trees_number', type: 'Guava' },
      { field: 'teak_trees_number', type: 'Teak' },
      { field: 'other_trees_number', type: 'Other' },
    ];
    const treesArray = [];
    treeFieldMap.forEach(({ field, type }) => {
      const count = Number(submitData.landDetails?.[field]) || 0;
      if (count > 0) {
        treesArray.push({ type, count });
      }
    });
    submitData.trees = treesArray;

    // Get token from localStorage (assuming JWT is stored here)
    const token = localStorage.getItem('token');
    
    // In the Admin Panel, all newly added lands bypass phone verification
    // and go straight to physical audit.
    submitData.call_verification_status = 'complete';
    submitData.physcial_verification_status = 'pending';

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
          setFormData(createEmptyFormData());
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit land data');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(createEmptyFormData());
    setDistricts([]);
    setMandals([]);
    setVillages([]);
    setBoundaryPoints([{ lat: '', lng: '' }]);
    setError(null);
    setSuccess(null);
  };

  // Get media count for a category
  const getMediaCount = (category) => {
    return formData.media.filter(m => m.category === category).length;
  };

  // Handle photo grid item click
  const handlePhotoGridClick = (category) => {
    setSelectedMediaCategory(category);
    // Trigger hidden file input
    document.getElementById('media-file-input')?.click();
  };

  // Add boundary point
  const addBoundaryPoint = () => {
    setBoundaryPoints(prev => [...prev, { lat: '', lng: '' }]);
  };

  // ========================
  // RENDER SECTIONS
  // ========================

  const renderLandAddressCard = () => (
    <CardWrapper color="red" icon="📍" title="LAND ADDRESS" watermark="🌍">
      <div className="field-row">
        <div>
          <label className="land-label">State</label>
          <select
            value={formData.state}
            onChange={(e) => {
              const selectedState = states.find(s => s.name === e.target.value);
              handleStateChange(e.target.value, selectedState?.id);
            }}
            className="land-select"
            required
          >
            <option value="">Select</option>
            {states.map(state => (
              <option key={state.id} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="land-label">District</label>
          <select
            value={formData.district}
            onChange={(e) => {
              const selectedDistrict = districts.find(d => d.name === e.target.value);
              handleDistrictChange(e.target.value, selectedDistrict?.id);
            }}
            className="land-select"
            disabled={!formData.state}
            required
          >
            <option value="">Select</option>
            {districts.map(district => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="land-label">Mandal</label>
          <select
            value={formData.mandal}
            onChange={(e) => {
              const selectedMandal = mandals.find(m => m.name === e.target.value);
              handleMandalChange(e.target.value, selectedMandal?.id);
            }}
            className="land-select"
            disabled={!formData.district}
            required
          >
            <option value="">Select</option>
            {mandals.map(mandal => (
              <option key={mandal.id} value={mandal.name}>{mandal.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="land-label">Village</label>
          <select
            value={formData.village}
            onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
            className="land-select"
            disabled={!formData.mandal}
            required
          >
            <option value="">Select</option>
            {villages.map(village => (
              <option key={village.id} value={village.name}>{village.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field-group">
        <label className="land-label">GPS Location</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="gps-input-group" style={{ flex: 1 }}>
            <input
              type="text"
              value={formData.location_latitude && formData.location_longitude
                ? `${formData.location_latitude}, ${formData.location_longitude}` : ''}
              onChange={(e) => {
                const parts = e.target.value.split(',').map(s => s.trim());
                setFormData(prev => ({
                  ...prev,
                  location_latitude: parts[0] || '',
                  location_longitude: parts[1] || ''
                }));
              }}
              placeholder="Lat, Lon"
            />
          </div>
          <button
            type="button"
            className="fetch-btn"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  setFormData(prev => ({
                    ...prev,
                    location_latitude: position.coords.latitude.toString(),
                    location_longitude: position.coords.longitude.toString()
                  }));
                });
              }
            }}
          >
            ✈ FETCH
          </button>
        </div>
      </div>
      <div className="field-group" style={{ marginTop: '12px' }}>
        <label className="land-label">Address / Landmark</label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
          className="land-input"
          placeholder="Enter address or nearby landmark"
        />
      </div>
    </CardWrapper>
  );

  const renderAcresPriceCard = () => (
    <CardWrapper color="green" icon="🏗️" title="ACRES & PRICE" watermark="🌾">
      <div className="field-row">
        <div>
          <label className="land-label">Acres</label>
          <input
            type="number"
            name="landDetails.total_acres"
            value={formData.landDetails.total_acres}
            onChange={handleInputChange}
            className="land-input"
          />
        </div>
        <div>
          <label className="land-label">Guntas</label>
          <input
            type="number"
            name="landDetails.guntas"
            value={formData.landDetails.guntas}
            onChange={handleInputChange}
            className="land-input"
          />
        </div>
      </div>
      <div className="field-group">
        <label className="land-label">Price Per Acre (In Lakhs)</label>
        <input
          type="number"
          name="landDetails.price_per_acres"
          value={formData.landDetails.price_per_acres}
          onChange={handleInputChange}
          className="land-input"
          placeholder="e.g 5 for 5 lakhs"
        />
      </div>
      <div className="field-group">
        <label className="land-label">Total Value (₹)</label>
        <input
          type="number"
          name="landDetails.total_value"
          value={formData.landDetails.total_value}
          onChange={handleInputChange}
          className="land-input"
          placeholder="Enter Total Value"
        />
      </div>
    </CardWrapper>
  );

  const renderResidencesShedsCard = () => (
    <CardWrapper color="green" icon="🏠" title="RESIDENCES & SHEDS" watermark="🏘️">
      <div className="field-group mb-4">
        <label className="land-label" style={{ marginBottom: '8px', display: 'block' }}>Residence</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0' }}>
          {RESIDENCE_OPTIONS.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={(formData.landDetails.residence || []).includes(opt)}
                onChange={(e) => handleNestedArrayChange('residence', opt, e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#22c55e' }}
              />
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569', textTransform: 'capitalize' }}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="field-row" style={{ marginTop: '16px' }}>
        <div style={{ flex: 1 }}>
          <div className="toggle-row" style={{ marginBottom: formData.landDetails.poultry_shed_number > 0 ? '8px' : '0' }}>
            <span className="toggle-row__label">Poultry Shed</span>
            <ToggleSwitch
              checked={formData.landDetails.poultry_shed_number > 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                landDetails: { ...prev.landDetails, poultry_shed_number: e.target.checked ? 1 : 0 }
              }))}
            />
          </div>
          {formData.landDetails.poultry_shed_number > 0 && (
            <input 
              type="number" 
              min="1"
              value={formData.landDetails.poultry_shed_number}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                landDetails: { ...prev.landDetails, poultry_shed_number: parseInt(e.target.value) || 0 }
              }))}
              className="land-input"
              placeholder="Number of sheds"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div className="toggle-row" style={{ marginBottom: formData.landDetails.cow_shed_number > 0 ? '8px' : '0' }}>
            <span className="toggle-row__label">Cow Shed</span>
            <ToggleSwitch
              checked={formData.landDetails.cow_shed_number > 0}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                landDetails: { ...prev.landDetails, cow_shed_number: e.target.checked ? 1 : 0 }
              }))}
            />
          </div>
          {formData.landDetails.cow_shed_number > 0 && (
            <input 
              type="number" 
              min="1"
              value={formData.landDetails.cow_shed_number}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                landDetails: { ...prev.landDetails, cow_shed_number: parseInt(e.target.value) || 0 }
              }))}
              className="land-input"
              placeholder="Number of sheds"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            />
          )}
        </div>
      </div>
    </CardWrapper>
  );

  const renderUrgencyListingCard = () => (
    <CardWrapper color="teal" icon="⚡" title="URGENCY & LISTING" watermark="🔔">
      <div>
        <div className="toggle-row">
          <span className="toggle-row__label">Urgent Sale</span>
          <ToggleSwitch
            checked={formData.urgency_listing.includes('urgent sale')}
            onChange={(e) => handleArrayChange('urgency_listing', 'urgent sale', e.target.checked)}
          />
        </div>
        <div className="toggle-row">
          <span className="toggle-row__label">Premium Listing</span>
          <ToggleSwitch
            checked={formData.urgency_listing.includes('premium listing')}
            onChange={(e) => handleArrayChange('urgency_listing', 'premium listing', e.target.checked)}
          />
        </div>
        <div className="toggle-row">
          <div>
            <span className="toggle-row__label">Verification Package</span>
            <div className="toggle-row__desc">Opt for land verification</div>
          </div>
          <ToggleSwitch
            checked={formData.verification_package}
            onChange={(e) => setFormData(prev => ({ ...prev, verification_package: e.target.checked }))}
          />
        </div>
      </div>
    </CardWrapper>
  );

  const renderFarmerDetailsCard = () => (
    <CardWrapper color="red" icon="👤" title="FARMER DETAILS" watermark="🧑‍🌾">
      <div className="field-group">
        <label className="land-label">Name</label>
        <input
          type="text"
          name="farmerDetails.name"
          value={formData.farmerDetails.name}
          onChange={handleInputChange}
          className="land-input"
          placeholder="Farmer Name"
          required
        />
      </div>
      <div className="field-group">
        <label className="land-label">Phone No</label>
        <input
          type="tel"
          name="farmerDetails.phone"
          value={formData.farmerDetails.phone}
          onChange={handleInputChange}
          className="land-input"
          placeholder="98XXXXXXXX"
          required
        />
      </div>
      <div className="field-group" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <label className="land-radio">
          <input 
            type="radio" 
            name="whatsapp_same" 
            value="yes" 
            checked={whatsappSame}
            onChange={() => {
              setWhatsappSame(true);
              setFormData(prev => ({
                ...prev,
                farmerDetails: { ...prev.farmerDetails, whatsapp: prev.farmerDetails.phone }
              }));
            }} 
          /> YES
        </label>
        <label className="land-radio">
          <input 
            type="radio" 
            name="whatsapp_same" 
            value="no" 
            checked={!whatsappSame}
            onChange={() => setWhatsappSame(false)}
          /> NO
        </label>
      </div>
      <div className="field-group">
        <label className="land-label">WhatsApp No</label>
        <input
          type="tel"
          name="farmerDetails.whatsapp"
          value={formData.farmerDetails.whatsapp}
          onChange={handleInputChange}
          className="land-input"
          placeholder="98XXXXXXXX"
          readOnly={whatsappSame}
          style={whatsappSame ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}}
        />
      </div>
      <div className="field-row">
        <div>
          <label className="land-label">Land Ownership</label>
          <select
            name="farmerDetails.ownership_type"
            value={formData.farmerDetails.ownership_type}
            onChange={handleInputChange}
            className="land-select"
          >
            <option value="">Select</option>
            {OWNERSHIP_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="land-label">Locality</label>
          <select
            name="farmerDetails.locality"
            value={formData.farmerDetails.locality}
            onChange={handleInputChange}
            className="land-select"
          >
            <option value="">Select</option>
            {LOCALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="land-label">Ownership Status</label>
          <select
            name="farmerDetails.ownership_status"
            value={formData.farmerDetails.ownership_status}
            onChange={handleInputChange}
            className="land-select"
          >
            <option value="">Select</option>
            {OWNERSHIP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="land-label">Age</label>
          <select
            name="farmerDetails.age"
            value={formData.farmerDetails.age}
            onChange={handleInputChange}
            className="land-select"
          >
            <option value="">Select</option>
            {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="field-group">
        <label className="land-label">Literacy</label>
        <select
          name="farmerDetails.literacy"
          value={formData.farmerDetails.literacy}
          onChange={handleInputChange}
          className="land-select"
        >
          <option value="">Select</option>
          {LITERACY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Nature</label>
        <select
          name="farmerDetails.nature"
          value={formData.farmerDetails.nature}
          onChange={handleInputChange}
          className="land-select"
        >
          <option value="">Select</option>
          {NATURE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </CardWrapper>
  );

  const renderWaterSourceCard = () => (
    <CardWrapper color="green" icon="💧" title="WATER SOURCE DETAILS" watermark="🌊">
      <div className="field-group mb-4">
        <label className="land-label" style={{ marginBottom: '8px', display: 'block' }}>Water Source</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '4px 0' }}>
          {WATER_SOURCE_OPTIONS.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={(formData.landDetails.water_source || []).includes(opt)}
                onChange={(e) => handleNestedArrayChange('water_source', opt, e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#22c55e' }}
              />
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#475569', textTransform: 'capitalize' }}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="field-row mt-4" style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {(formData.landDetails.water_source || []).filter(opt => opt !== 'not available').map(opt => {
          const fieldName = opt === 'borewell' ? 'number_of_bores' : `number_of_${opt.replace(/\s+/g, '_')}`;
          return (
            <div key={opt} style={{ flex: '1 1 45%' }}>
              <label className="land-label">No of {opt.charAt(0).toUpperCase() + opt.slice(1)}</label>
              <input
                type="number"
                name={`landDetails.${fieldName}`}
                value={formData.landDetails[fieldName] || ''}
                onChange={handleInputChange}
                className="land-input"
                placeholder={`Number of ${opt}`}
                style={{ padding: '8px 12px', fontSize: '12px' }}
              />
            </div>
          );
        })}
      </div>

      <div className="toggle-row field-group" style={{ marginTop: '16px' }}>
        <span className="toggle-row__label">Farm Pond</span>
        <ToggleSwitch
          checked={formData.landDetails.farm_pond}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            landDetails: { ...prev.landDetails, farm_pond: e.target.checked }
          }))}
        />
      </div>
    </CardWrapper>
  );

  const renderPathDetailsCard = () => (
    <CardWrapper color="green" icon="🛤️" title="PATH DETAILS" watermark="🚧">
      <div>
        <label className="land-label">Nearest Road Type</label>
        <select
          name="landDetails.nearest_road_type"
          value={formData.landDetails.nearest_road_type}
          onChange={handleInputChange}
          className="land-select"
        >
          <option value="">Select</option>
          {['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'GRAVEL ROAD'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Land Attached to Road</label>
        <select
          name="landDetails.land_attached_to_road"
          value={formData.landDetails.land_attached_to_road}
          onChange={handleInputChange}
          className="land-select"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Path Ownership</label>
        <input
          type="text"
          name="landDetails.path_ownership"
          value={formData.landDetails.path_ownership}
          onChange={handleInputChange}
          className="land-input"
        />
      </div>
    </CardWrapper>
  );

  const renderLandDetailsCard = () => (
    <CardWrapper color="green" icon="✅" title="LAND DETAILS" watermark="🌿">
      <div className="field-group">
        <label className="land-label">Soil Type</label>
        <select
          name="landDetails.soil_type"
          value={formData.landDetails.soil_type}
          onChange={handleInputChange}
          className="land-select"
          style={{ marginBottom: '8px' }}
        >
          <option value="">Select</option>
          <option value="Red Soil">Red Soil</option>
          <option value="Black Soil">Black Soil</option>
          <option value="Sandy Soil">Sandy Soil</option>
          <option value="Clay Soil">Clay Soil</option>
          <option value="Loamy Soil">Loamy Soil</option>
        </select>
        <input
          type="text"
          name="landDetails.soil_type_details"
          value={formData.landDetails.soil_type_details || ''}
          onChange={handleInputChange}
          className="land-input"
          placeholder="Additional Soil Details (Optional)"
        />
      </div>
      <div className="field-group">
        <label className="land-label">Fencing Status</label>
        <select
          name="landDetails.fencing_status"
          value={formData.landDetails.fencing_status}
          onChange={handleInputChange}
          className="land-select"
        >
          <option value="">Select</option>
          <option value="Fully Fenced">Fully Fenced</option>
          <option value="Partially Fenced">Partially Fenced</option>
          <option value="Not Fenced">Not Fenced</option>
          <option value="All side with gates">All side with gates</option>
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Electricity</label>
        <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
          {ELECTRICITY_OPTIONS.map(opt => (
            <label key={opt} className="land-radio">
              <input
                type="checkbox"
                name={`electricity_${opt}`}
                checked={formData.landDetails.electricity.includes(opt)}
                onChange={(e) => handleNestedArrayChange('electricity', opt, e.target.checked)}
              />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
    </CardWrapper>
  );

  const renderTreesCard = () => (
    <CardWrapper color="orange" icon="⚠️" title="TREES" watermark="🌳">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { label: 'Mango', field: 'mango_trees_number' },
          { label: 'Coconut', field: 'coconut_trees_number' },
          { label: 'Neem', field: 'neem_trees_number' },
          { label: 'Banyan', field: 'baniyan_trees_number' },
          { label: 'Tamarind', field: 'tamarind_trees_number' },
          { label: 'Sapota', field: 'sapoto_trees_number' },
          { label: 'Guava', field: 'guava_trees_number' },
          { label: 'Teak', field: 'teak_trees_number' },
        ].map(tree => (
          <div key={tree.field}>
            <label className="land-label" style={{ fontSize: '8px' }}>{tree.label}</label>
            <input
              type="number"
              name={`landDetails.${tree.field}`}
              value={formData.landDetails[tree.field]}
              onChange={handleInputChange}
              className="land-input"
              style={{ padding: '6px 8px', fontSize: '12px' }}
              placeholder="0"
            />
          </div>
        ))}
      </div>
      <div className="field-group">
        <label className="land-label">Other Trees</label>
        <input
          type="text"
          name="landDetails.other_trees_number"
          value={formData.landDetails.other_trees_number}
          onChange={handleInputChange}
          className="land-input"
          placeholder="e.g. Eucalyptus - 10"
        />
      </div>
    </CardWrapper>
  );

  const handleGetLocation = (type) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            landDetails: {
              ...prev.landDetails,
              [`land_${type}_latitude`]: position.coords.latitude.toString(),
              [`land_${type}_longitude`]: position.coords.longitude.toString()
            }
          }));
        },
        (error) => {
          alert("Error fetching location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const renderGPSCard = () => (
    <CardWrapper color="blue" icon="📍" title="GPS COORDINATES" watermark="🧭">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase' }}>Entry Coordinates</h4>
        <button type="button" onClick={() => handleGetLocation('entry')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '4px 8px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          <MapPin size={10} /> FETCH LOCATION
        </button>
      </div>
      <div className="field-group">
        <label className="land-label">Entry Latitude</label>
        <input type="text" name="landDetails.land_entry_latitude" value={formData.landDetails.land_entry_latitude} onChange={handleInputChange} className="land-input" placeholder="e.g. 17.123456" />
      </div>
      <div className="field-group">
        <label className="land-label">Entry Longitude</label>
        <input type="text" name="landDetails.land_entry_longitude" value={formData.landDetails.land_entry_longitude} onChange={handleInputChange} className="land-input" placeholder="e.g. 78.123456" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase' }}>Boundary Coordinates</h4>
        <button type="button" onClick={() => handleGetLocation('boundary')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '4px 8px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
          <MapPin size={10} /> FETCH LOCATION
        </button>
      </div>
      <div className="field-group">
        <label className="land-label">Boundary Latitude</label>
        <input type="text" name="landDetails.land_boundary_latitude" value={formData.landDetails.land_boundary_latitude} onChange={handleInputChange} className="land-input" placeholder="e.g. 17.123456" />
      </div>
      <div className="field-group">
        <label className="land-label">Boundary Longitude</label>
        <input type="text" name="landDetails.land_boundary_longitude" value={formData.landDetails.land_boundary_longitude} onChange={handleInputChange} className="land-input" placeholder="e.g. 78.123456" />
      </div>
    </CardWrapper>
  );

  const renderMortgageCard = () => (
    <CardWrapper color="teal" icon="🏦" title="MORTGAGE AVAILABILITY STATUS" watermark="💳">
      <div className="space-y-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative flex items-center justify-center w-4 h-4">
            <input 
              type="checkbox" 
              checked={formData.mortage_availability_status.includes('CURRENTLY MORTGAGED')} 
              onChange={(e) => handleArrayChange('mortage_availability_status', 'CURRENTLY MORTGAGED', e.target.checked)} 
              className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[3px] checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer m-0" 
            />
            <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white flex items-center justify-center w-full h-full">
              <Check size={12} strokeWidth={4} />
            </div>
          </div>
          <span className="text-[11px] text-gray-700 font-medium">Mortgaged</span>
        </label>
        
        <hr className="border-gray-200 my-4" />

        <div className="space-y-2">
          <div className="text-[11px] font-medium text-gray-800">Available for Mortgage</div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="add_available_for_mortgage"
                  checked={formData.mortage_availability_status.includes('AVAILABLE FOR MORTGAGE')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let arr = [...formData.mortage_availability_status];
                      arr = arr.filter(x => x !== 'NOT AVAILABLE');
                      if (!arr.includes('AVAILABLE FOR MORTGAGE')) arr.push('AVAILABLE FOR MORTGAGE');
                      setFormData(prev => ({ ...prev, mortage_availability_status: arr }));
                    }
                  }}
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-teal-600 transition-all cursor-pointer"
                />
                <div className="absolute w-2 h-2 bg-teal-600 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
              </div>
              <span className="text-[11px] text-gray-700 font-medium">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="add_available_for_mortgage"
                  checked={formData.mortage_availability_status.includes('NOT AVAILABLE')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let arr = [...formData.mortage_availability_status];
                      arr = arr.filter(x => x !== 'AVAILABLE FOR MORTGAGE');
                      if (!arr.includes('NOT AVAILABLE')) arr.push('NOT AVAILABLE');
                      setFormData(prev => ({ ...prev, mortage_availability_status: arr }));
                    }
                  }}
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-teal-600 transition-all cursor-pointer"
                />
                <div className="absolute w-2 h-2 bg-teal-600 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
              </div>
              <span className="text-[11px] text-gray-700 font-medium">No</span>
            </label>
          </div>
        </div>
      </div>
    </CardWrapper>
  );

  const renderComplaintsCard = () => (
    <CardWrapper color="orange" icon="⚠️" title="COMPLAINTS" watermark="📋">
      <div>
        {COMPLAINT_OPTIONS.map(opt => (
          <label key={opt} className="land-checkbox">
            <input
              type="checkbox"
              checked={formData.landDetails.complaints.includes(opt)}
              onChange={(e) => handleNestedArrayChange('complaints', opt, e.target.checked)}
            />
            {opt}
          </label>
        ))}
      </div>
    </CardWrapper>
  );

  const renderLandSaleStatusCard = () => (
    <CardWrapper color="teal" icon="🟢" title="LAND SALE AVAILABLE STATUS" watermark="💰">
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          {[{value: 'TOKEN RECEIVED', label: 'Token Received'}, {value: 'AGREEMENT Made', label: 'Agreement Made'}, {value: 'SOLD', label: 'Sold'}].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center w-4 h-4">
                <input 
                  type="checkbox" 
                  checked={formData.land_sale_available_status.includes(opt.value)} 
                  onChange={(e) => handleArrayChange('land_sale_available_status', opt.value, e.target.checked)} 
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[3px] checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer m-0" 
                />
                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white flex items-center justify-center w-full h-full">
                  <Check size={12} strokeWidth={4} />
                </div>
              </div>
              <span className="text-[11px] text-gray-700 font-medium">{opt.label}</span>
            </label>
          ))}
        </div>

        <hr className="border-gray-200 my-4" />

        <div className="space-y-2">
          <div className="text-[11px] font-medium text-gray-800">Available for Sale</div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="add_available_for_sale"
                  checked={formData.land_sale_available_status.includes('AVAILABLE FOR SALE')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let arr = [...formData.land_sale_available_status];
                      arr = arr.filter(x => x !== 'NOT AVAILABLE');
                      if (!arr.includes('AVAILABLE FOR SALE')) arr.push('AVAILABLE FOR SALE');
                      setFormData(prev => ({ ...prev, land_sale_available_status: arr }));
                    }
                  }}
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-teal-600 transition-all cursor-pointer"
                />
                <div className="absolute w-2 h-2 bg-teal-600 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
              </div>
              <span className="text-[11px] text-gray-700 font-medium">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="add_available_for_sale"
                  checked={formData.land_sale_available_status.includes('NOT AVAILABLE')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let arr = [...formData.land_sale_available_status];
                      arr = arr.filter(x => x !== 'AVAILABLE FOR SALE');
                      if (!arr.includes('NOT AVAILABLE')) arr.push('NOT AVAILABLE');
                      setFormData(prev => ({ ...prev, land_sale_available_status: arr }));
                    }
                  }}
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-teal-600 transition-all cursor-pointer"
                />
                <div className="absolute w-2 h-2 bg-teal-600 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
              </div>
              <span className="text-[11px] text-gray-700 font-medium">No</span>
            </label>
          </div>
        </div>
      </div>
    </CardWrapper>
  );

  const renderSuggestedFarmerCard = () => (
    <CardWrapper color="teal" icon="🏠" title="SUGGESTED FARMER DETAILS" watermark="👨‍🌾">
      <div className="field-group">
        <label className="land-label">Name</label>
        <input type="text" className="land-input" placeholder="Farmer Name" />
      </div>
      <div className="field-group">
        <label className="land-label">Phone No</label>
        <input type="tel" className="land-input" placeholder="98XXXXXXXX" />
      </div>
      <div>
        <label className="land-label">State</label>
        <select className="land-select">
          <option value="">Select</option>
          {states.map(state => (
            <option key={state.id} value={state.name}>{state.name}</option>
          ))}
        </select>
      </div>
    </CardWrapper>
  );

  const renderDocumentsCard = () => (
    <CardWrapper color="green" icon="📄" title="DOCUMENTS" watermark="📁">
      {DOC_TYPES.map(docType => (
        <div key={docType} className="field-group">
          <label className="land-label">{docType.replace('_', ' ')}</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              setSelectedDocType(docType);
              handleAddDocument(e);
            }}
            className="land-input"
            style={{ padding: '4px 8px' }}
          />
          {formData.documents.filter(d => d.doc_type === docType).map((doc, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', padding: '6px 10px', background: '#f0fdf4', borderRadius: '6px', fontSize: '11px' }}>
              <a href={fixUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a' }}>View</a>
              <button
                type="button"
                onClick={() => handleRemoveDocument(formData.documents.indexOf(doc))}
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
    </CardWrapper>
  );

  const renderNearestTownsCard = () => (
    <CardWrapper color="teal" icon="📍" title="NEAREST TOWNS" watermark="📍">
      <div className="field-group">
        <label className="land-label">State</label>
        <select
          value={formData.landDetails.nearest_town_state}
          onChange={(e) => {
            const selectedState = states.find(s => s.name === e.target.value);
            handleNearestTownStateChange(e.target.value, selectedState?.id);
          }}
          className="land-select"
        >
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state.id} value={state.name}>{state.name}</option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">District</label>
        <select
          value={formData.landDetails.nearest_town_district}
          onChange={(e) => {
            const selectedDistrict = nearestTownDistricts.find(d => d.name === e.target.value);
            handleNearestTownDistrictChange(e.target.value, selectedDistrict?.id);
          }}
          className="land-select"
          disabled={!formData.landDetails.nearest_town_state}
        >
          <option value="">Select District</option>
          {nearestTownDistricts.map(district => (
            <option key={district.id} value={district.name}>{district.name}</option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Primary Urban Hub</label>
        <select 
          className="land-select"
          value={formData.landDetails.nearest_town_1 || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, landDetails: { ...prev.landDetails, nearest_town_1: e.target.value } }))}
          disabled={!formData.landDetails.nearest_town_district}
        >
          <option value="">Pick Primary Town</option>
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>
      <div className="field-group">
        <label className="land-label">Secondary Node</label>
        <select 
          className="land-select"
          value={formData.landDetails.nearest_town_2 || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, landDetails: { ...prev.landDetails, nearest_town_2: e.target.value } }))}
          disabled={!formData.landDetails.nearest_town_district}
        >
          <option value="">Pick Secondary Town</option>
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="land-label">Tertiary Node</label>
        <select 
          className="land-select"
          value={formData.landDetails.nearest_town_3 || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, landDetails: { ...prev.landDetails, nearest_town_3: e.target.value } }))}
          disabled={!formData.landDetails.nearest_town_district}
        >
          <option value="">Pick Tertiary Town</option>
          {nearestTowns.map(town => (
            <option key={town.id} value={town.name}>{town.name}</option>
          ))}
        </select>
      </div>
    </CardWrapper>
  );

  const renderPhotosVideoCard = () => (
    <CardWrapper color="green" icon="📸" title="LAND PHOTOS & VIDEO" watermark="🖼️">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Media List */}
        {formData.media.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {formData.media.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                {item.type === 'image' ? (
                  <img src={fixUrl(item.url)} alt={item.category} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                ) : (
                  <video src={fixUrl(item.url)} style={{ width: '100%', height: '80px', objectFit: 'cover' }} controls />
                )}
                <div style={{ padding: '4px 6px', fontSize: '9px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>{item.category.replace('_', ' ')}</div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(idx)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {uploading && <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>Uploading...</div>}
      </div>
    </CardWrapper>
  );

  const renderPhotoGridCard = () => (
    <div className="photo-grid-wrapper">

      <div className="photo-grid">
        {MEDIA_CATEGORIES.map(cat => {
          const count = getMediaCount(cat);
          return (
            <div
              key={cat}
              className={`photo-grid__item ${selectedMediaCategory === cat ? 'photo-grid__item--active' : ''} ${count > 0 ? 'photo-grid__item--has-media' : ''}`}
              onClick={() => handlePhotoGridClick(cat)}
            >
              {count > 0 && <span className="photo-grid__count">{count}</span>}
              <div className="photo-grid__icon">📷</div>
              <div className="photo-grid__label">{MEDIA_LABELS[cat]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ========================
  // MAIN RETURN
  // ========================

  return (
    <div className="land-form-container" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Hidden file input for photo grid */}
      <input
        id="media-file-input"
        type="file"
        accept="image/*,video/*"
        onChange={handleAddMedia}
        disabled={uploading || !selectedMediaCategory}
        style={{ display: 'none' }}
      />

      {/* Breadcrumb Bar */}
      <div className="land-breadcrumb">
        <div className="land-breadcrumb__left">
          <Home size={14} />
          <span className="land-breadcrumb__text">REGISTRY</span>
          <ChevronRight size={12} className="land-breadcrumb__sep" />
          <span className="land-breadcrumb__text">lands</span>
          <ChevronRight size={12} className="land-breadcrumb__sep" />
          <span className="land-breadcrumb__text land-breadcrumb__text--bold">new</span>
        </div>
        <button className="land-breadcrumb__expand">
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Pill Navigation Bar */}
      <nav className="pill-nav">
        {[
          { label: 'Add land', icon: <PlusCircle size={13} /> },
          { label: 'Crew', icon: <Users size={13} /> },
          { label: 'Work allotment', icon: <CheckSquare size={13} /> },
          { label: 'Verification', icon: <Search size={13} /> },
          { label: 'Verified Lands', icon: <ShieldCheck size={13} /> },
          { label: 'Edit data', icon: <PenLine size={13} /> },
          { label: 'Publish', icon: <CircleDot size={13} /> },
          { label: 'Trainee observation', icon: <Eye size={13} /> },
          { label: 'Farmer sheet', icon: <FileText size={13} /> },
          { label: 'Dashboard', icon: <LayoutGrid size={13} /> },
          { label: 'Farmers allotment', icon: <UserCheck size={13} /> },
          { label: 'Attendance', icon: <CalendarCheck size={13} /> },
        ].map((item) => (
          <button
            key={item.label}
            className={`pill-nav__item${activeNavItem === item.label ? ' pill-nav__item--active' : ''}`}
            onClick={() => setActiveNavItem(item.label)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Conditionally render based on active nav item */}
      {activeNavItem === 'Verification' ? (
        <LandVerificationDashboard />
      ) : activeNavItem === 'Verified Lands' ? (
        <VerifiedLandsDashboard />
      ) : (
        <>
          {/* Page Header */}
          <div className="land-page-header" style={{ padding: '0 24px' }}>
            <div>
              <h1 className="land-page-header__title">ADD NEW LAND</h1>
              <p className="land-page-header__subtitle">REGISTRY CORE • HIGH-PRECISION ACQUISITION</p>
            </div>
            <div className="land-page-header__actions">
              <button type="button" className="btn-reset" onClick={handleReset}>
                ↺ RESET
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={(e) => handleSubmit(e, 'complete')}
                disabled={loading}
              >
                {loading ? 'SAVING...' : 'SAVE LAND'}
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && <div className="land-alert land-alert--error" style={{ margin: '0 24px 16px' }}>{error}</div>}
          {success && <div className="land-alert land-alert--success" style={{ margin: '0 24px 16px' }}>{success}</div>}

          {/* 3-Column Grid */}
          <div className="land-grid" style={{ padding: '0 24px 24px' }}>
            {/* COLUMN 1 — Left */}
            <div className="land-column">
              {renderLandAddressCard()}
              {renderFarmerDetailsCard()}
              {renderDocumentsCard()}
              {renderPhotosVideoCard()}
            </div>

            {/* COLUMN 2 — Center */}
            <div className="land-column">
              {renderAcresPriceCard()}
              {renderResidencesShedsCard()}
              {renderWaterSourceCard()}
              {renderPathDetailsCard()}
              {renderLandDetailsCard()}
              {renderGPSCard()}
              {renderTreesCard()}

              {renderComplaintsCard()}
            </div>

            {/* COLUMN 3 — Right */}
            <div className="land-column">
              {renderUrgencyListingCard()}
              {renderMortgageCard()}
              {renderLandSaleStatusCard()}
              {activeNavItem !== 'Edit data' && renderSuggestedFarmerCard()}
              {renderNearestTownsCard()}
              {renderPhotoGridCard()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddLand;