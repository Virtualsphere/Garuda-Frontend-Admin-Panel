import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Upload,
  Loader2,
  Phone,
  Building2,
  TreePine,
  Droplets,
  Zap,
  Flag,
  ShieldCheck,
  Check,
  ArrowRight,
  Bell,
  Trash2
} from 'lucide-react';
import { BASE_URL } from '../../url/BaseUrl';
import LandPhysicalVerificationDashboard from './LandPhysicalVerificationDashboard';
import { fixUrl, IMAGE_NOT_FOUND_PLACEHOLDER } from "../../utils/fixUrl";
import NearestTownsFields from './components/NearestTownsFields';

const API_BASE_URL = `${BASE_URL}/api`;

// Option constants - match Add Land form
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
const RESIDENCE_OPTIONS = ['developed farm house', 'rcc house', 'asbestos shelter', 'hut'];
const WATER_SOURCE_OPTIONS = ['borewell', 'cheruvu', 'canal', 'not available'];
const COMPLAINT_OPTIONS = [
  'Siblings Issue (own Brother or Sister)',
  'Cousins Issue (of uncels family)',
  'Boundary',
  'Rocks In Land',
  'Electric Poles',
  'Sealing',
  'path issue',
  'No Path at all'
];
const MEDIA_CATEGORIES = ['farmer_photo', 'land_soil', 'fencing', 'farm_pond', 'residence', 'shed', 'water_source', 'trees', 'rocks', 'electric_poles', 'others', 'video', 'farmer_agreement', 'cards'];
const DOC_TYPES = ['PASSBOOK', 'AADHAR', 'TITLE_DEED'];

// Avatar colors for farmer initials
const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6d28d9', '#be185d'
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Format price in lakhs
const formatPriceShort = (price) => {
  if (!price) return '₹0';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
};

// Status badge component (kept for modals)
const StatusBadge = ({ status, type }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = () => {
    if (status === 'complete') return <CheckCircle className="w-3 h-3 mr-1" />;
    if (status === 'rejected') return <XCircle className="w-3 h-3 mr-1" />;
    return <Clock className="w-3 h-3 mr-1" />;
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStyles()}`}>
      {getIcon()}
      {status || 'pending'}
    </span>
  );
};

// Format price helper
const formatPrice = (price) => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// ============================================
// INLINE STYLES
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9fb',
    fontFamily: "'Inter', sans-serif",
  },
  // Header Section
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '28px 32px 0',
  },
  headerLeft: {},
  headerTitle: {
    fontSize: '24px',
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#94a3b8',
    marginTop: '4px',
  },
  // Search
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
  },
  searchInput: {
    padding: '10px 16px 10px 40px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#334155',
    background: '#ffffff',
    width: '320px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Inter', sans-serif",
  },
  // Pipeline Tabs
  pipelineTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    margin: '24px 32px 24px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  pipelineTab: (isActive) => ({
    flex: 1,
    padding: '14px 24px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: isActive ? '#f97316' : '#94a3b8',
    background: isActive ? '#fff' : '#fafbfc',
    border: 'none',
    borderBottom: isActive ? '3px solid #f97316' : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
  }),
  // Table
  tableContainer: {
    margin: '0 32px 32px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHead: {
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  th: {
    padding: '14px 20px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    color: '#64748b',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  tr: (isHovered) => ({
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.15s ease',
    background: isHovered ? '#fafbfe' : 'transparent',
    cursor: 'pointer',
  }),
  td: {
    padding: '16px 20px',
    verticalAlign: 'middle',
  },
  // Farmer Cell
  farmerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: '200px',
  },
  avatar: (bgColor) => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '15px',
    flexShrink: 0,
    boxShadow: `0 2px 8px ${bgColor}40`,
  }),
  farmerInfo: {},
  farmerName: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#1e40af',
    lineHeight: 1.3,
    cursor: 'pointer',
  },
  farmerId: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#f97316',
    marginTop: '1px',
  },
  farmerPhone: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '2px',
  },
  // Address Cell
  addressMain: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#1e293b',
    lineHeight: 1.4,
  },
  addressSub: {
    fontSize: '11.5px',
    color: '#94a3b8',
    fontWeight: 500,
    marginTop: '2px',
  },
  // Unit Profile
  unitProfile: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  // Executive
  executiveName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  // Start Verify Button
  verifyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 20px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', sans-serif",
  },
  // Inbound Signal Pill
  inboundPill: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    borderRadius: '50px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
    cursor: 'pointer',
    zIndex: 100,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif",
  },
  // Loading & Empty
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: 500,
  },
  // Pagination
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderTop: '1px solid #f1f5f9',
  },
  pageBtn: (disabled) => ({
    padding: '6px',
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  }),
  pageNum: (isActive) => ({
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#fff' : '#475569',
    background: isActive ? '#f97316' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  }),
};

const FormCard = ({ title, icon: Icon, colorTheme, children }) => {
  const color = colorTheme || 'blue';
  return (
    <div className={`land-card land-card--${color}`}>
      <div className={`land-card__header land-card__header--${color}`}>
        <div className={`land-card__badge land-card__badge--${color}`}>
          <Icon size={20} />
        </div>
        <div className={`land-card__title land-card__title--${color}`}>
          {title}
        </div>
      </div>
      <div className="land-card__body">
        {children}
      </div>
    </div>
  );
};

// Main Component
const LandVerificationDashboard = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updatingAction, setUpdatingAction] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('basic');
  const [editTab, setEditTab] = useState('basic');
  const [uploading, setUploading] = useState(false);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [activePipelineTab, setActivePipelineTab] = useState('phone');

  // Location dropdown states
  const [locationStates, setLocationStates] = useState([]);
  const [locationDistricts, setLocationDistricts] = useState([]);
  const [locationMandals, setLocationMandals] = useState([]);
  const [locationVillages, setLocationVillages] = useState([]);

  // Fetch lands based on status filter
  const fetchLands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/pending-call-verification/${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch lands');
      const result = await response.json();
      
      let landsData = result.data || result;
      if (!Array.isArray(landsData)) landsData = [landsData];
      
      // Unpack nearest town data for each land
      landsData = landsData.map(land => {
        if (!land.landDetails) land.landDetails = {};
        const unpackTown = (packedStr) => {
          if (!packedStr) return null;
          try {
            const parsed = JSON.parse(packedStr);
            if (parsed && typeof parsed === 'object' && parsed.town) {
              return parsed;
            }
          } catch (e) {
            return { state: land.state || '', district: land.district || '', town: packedStr };
          }
          return { state: land.state || '', district: land.district || '', town: packedStr };
        };

        if (land.nearest_town_1) {
          const unpacked = unpackTown(land.nearest_town_1);
          land.landDetails.nearest_town_state = unpacked?.state || '';
          land.landDetails.nearest_town_district = unpacked?.district || '';
          land.landDetails.nearest_town_1 = unpacked?.town || '';
          land.landDetails.nearest_town_distance_1 = unpacked?.distance || land.nearest_town_1_km || '';
        }
        if (land.nearest_town_2) {
          const unpacked = unpackTown(land.nearest_town_2);
          land.landDetails.nearest_town_district_2 = unpacked?.district || '';
          land.landDetails.nearest_town_2 = unpacked?.town || '';
          land.landDetails.nearest_town_distance_2 = unpacked?.distance || land.nearest_town_2_km || '';
        }
        if (land.nearest_town_3) {
          const unpacked = unpackTown(land.nearest_town_3);
          land.landDetails.nearest_town_district_3 = unpacked?.district || '';
          land.landDetails.nearest_town_3 = unpacked?.town || '';
          land.landDetails.nearest_town_distance_3 = unpacked?.distance || land.nearest_town_3_km || '';
        }
        return land;
      });

      setLands(landsData);
    } catch (error) {
      console.error('Error fetching lands:', error);
      alert('Failed to fetch lands');
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [statusFilter]);

  // Fetch all location states on mount
  useEffect(() => {
    const fetchLocationStates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/location`);
        if (response.data.success) {
          setLocationStates(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching location states:', err);
      }
    };
    fetchLocationStates();
  }, []);

  // Location cascading handlers
  const handleLocationStateChange = async (stateName) => {
    handleEditChange('state', stateName);
    handleEditChange('district', '');
    handleEditChange('mandal', '');
    handleEditChange('village', '');
    setLocationDistricts([]);
    setLocationMandals([]);
    setLocationVillages([]);

    const selectedState = locationStates.find(s => s.name === stateName);
    if (selectedState?.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/districts/${selectedState.id}`);
        if (response.data.success) {
          setLocationDistricts(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    }
  };

  const handleLocationDistrictChange = async (districtName) => {
    handleEditChange('district', districtName);
    handleEditChange('mandal', '');
    handleEditChange('village', '');
    setLocationMandals([]);
    setLocationVillages([]);

    const selectedDistrict = locationDistricts.find(d => d.name === districtName);
    if (selectedDistrict?.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/mandals/${selectedDistrict.id}`);
        if (response.data.success) {
          setLocationMandals(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching mandals:', err);
      }
    }
  };

  const handleLocationMandalChange = async (mandalName) => {
    handleEditChange('mandal', mandalName);
    handleEditChange('village', '');
    setLocationVillages([]);

    const selectedMandal = locationMandals.find(m => m.name === mandalName);
    if (selectedMandal?.id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/location/villages/${selectedMandal.id}`);
        if (response.data.success) {
          setLocationVillages(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching villages:', err);
      }
    }
  };

  // File upload handler
  const handleFileUpload = async (file, type) => {
    setUploading(true);
    const token = localStorage.getItem('token');
    const formDataUpload = new FormData();
    formDataUpload.append(type, file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-files`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();

      if (type === 'photo') {
        return data.photoUrl;
      } else if (type === 'document') {
        return data.documentUrl;
      } else {
        return data.videoUrl;
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
        url: url,
        created_at: new Date().toISOString()
      };
      setEditFormData(prev => ({ ...prev, media: [...(prev.media || []), newMedia] }));
      setSelectedMediaCategory('');
      e.target.value = '';
      setError(null);
    }
  };

  // Remove media
  const handleRemoveMedia = (index) => {
    setEditFormData(prev => ({
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
        file_url: url,
        created_at: new Date().toISOString()
      };
      setEditFormData(prev => ({ ...prev, documents: [...(prev.documents || []), newDoc] }));
      setSelectedDocType('');
      e.target.value = '';
      setError(null);
    }
  };

  // Remove document
  const handleRemoveDocument = (index) => {
    setEditFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Helper: convert flat tree fields from landDetails into the `trees` array
  // that the backend expects for the land_tree table
  const buildTreesArray = (landDetails) => {
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
    const trees = [];
    treeFieldMap.forEach(({ field, type }) => {
      const count = Number(landDetails?.[field]) || 0;
      if (count > 0) {
        trees.push({ type, count });
      }
    });
    return trees;
  };

  // Helper: pack shed dimensions
  const buildShedArray = (landDetails) => {
    const pLen = Number(landDetails?.poultry_shed_length) || null;
    const pWid = Number(landDetails?.poultry_shed_width) || null;
    const cLen = Number(landDetails?.cow_shed_length) || null;
    const cWid = Number(landDetails?.cow_shed_width) || null;
    
    if (pLen || pWid || cLen || cWid) {
      return [{
        poultry_shed_length: pLen,
        poultry_shed_width: pWid,
        cow_shed_length: cLen,
        cow_shed_width: cWid,
      }];
    }
    return [];
  };

  // Update land data (Verify)
  const verifyLand = async (id, data) => {
    setUpdatingAction('verify');
    
    const packTown = (state, district, town, distance) => {
      if (!town) return null;
      return JSON.stringify({ state: state || '', district: district || '', town, distance: distance || '' });
    };
    const state = data.landDetails?.nearest_town_state || '';
    const district1 = data.landDetails?.nearest_town_district || '';
    const district2 = data.landDetails?.nearest_town_district_2 || '';
    const district3 = data.landDetails?.nearest_town_district_3 || '';
    
    const payload = {
      ...data,
      trees: buildTreesArray(data.landDetails),
      shed: buildShedArray(data.landDetails),
      call_verification_status: 'complete',
      physcial_verification_status: 'complete',
      verification_status: 'complete',
      nearest_town_1: data.landDetails?.nearest_town_1 ? packTown(state, district1, data.landDetails.nearest_town_1, data.landDetails.nearest_town_distance_1) : data.nearest_town_1,
      nearest_town_2: data.landDetails?.nearest_town_2 ? packTown(state, district2, data.landDetails.nearest_town_2, data.landDetails.nearest_town_distance_2) : data.nearest_town_2,
      nearest_town_3: data.landDetails?.nearest_town_3 ? packTown(state, district3, data.landDetails.nearest_town_3, data.landDetails.nearest_town_distance_3) : data.nearest_town_3,
    };
    if (payload.landDetails) {
      delete payload.landDetails.nearest_town_state;
      delete payload.landDetails.nearest_town_district;
      delete payload.landDetails.nearest_town_district_2;
      delete payload.landDetails.nearest_town_district_3;
      delete payload.landDetails.nearest_town_1;
      delete payload.landDetails.nearest_town_2;
      delete payload.landDetails.nearest_town_3;
      delete payload.landDetails.nearest_town_distance_1;
      delete payload.landDetails.nearest_town_distance_2;
      delete payload.landDetails.nearest_town_distance_3;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/call/verify/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to verify land');
      const result = await response.json();
      
      await fetchLands();
      
      if (selectedLand?.id === id) {
        const updatedLand = lands.find(l => l.id === id);
        if (updatedLand) setSelectedLand(updatedLand);
      }
      
      setIsEditing(false);
      setActivePipelineTab('phone');
      setSelectedLand(null);
      alert('Land verified successfully!');
    } catch (error) {
      console.error('Error verifying land:', error);
      alert('Failed to verify land');
    } finally {
      setUpdatingAction(null);
    }
  };

  // Suggest Physical Verification — moves the land to the Physical Audit section
  const physicalVerifyLand = async (id, data) => {
    setUpdatingAction('physical');
    const packTown = (state, district, town, distance) => {
      if (!town) return null;
      return JSON.stringify({ state: state || '', district: district || '', town, distance: distance || '' });
    };
    const state = data.landDetails?.nearest_town_state || '';
    const district1 = data.landDetails?.nearest_town_district || '';
    const district2 = data.landDetails?.nearest_town_district_2 || '';
    const district3 = data.landDetails?.nearest_town_district_3 || '';
    
    const payload = {
      ...data,
      trees: buildTreesArray(data.landDetails),
      shed: buildShedArray(data.landDetails),
      call_verification_status: 'complete',
      physcial_verification_status: 'pending',
      verification_status: 'pending',
      nearest_town_1: data.landDetails?.nearest_town_1 ? packTown(state, district1, data.landDetails.nearest_town_1, data.landDetails.nearest_town_distance_1) : data.nearest_town_1,
      nearest_town_2: data.landDetails?.nearest_town_2 ? packTown(state, district2, data.landDetails.nearest_town_2, data.landDetails.nearest_town_distance_2) : data.nearest_town_2,
      nearest_town_3: data.landDetails?.nearest_town_3 ? packTown(state, district3, data.landDetails.nearest_town_3, data.landDetails.nearest_town_distance_3) : data.nearest_town_3,
    };
    if (payload.landDetails) {
      delete payload.landDetails.nearest_town_state;
      delete payload.landDetails.nearest_town_district;
      delete payload.landDetails.nearest_town_district_2;
      delete payload.landDetails.nearest_town_district_3;
      delete payload.landDetails.nearest_town_1;
      delete payload.landDetails.nearest_town_2;
      delete payload.landDetails.nearest_town_3;
      delete payload.landDetails.nearest_town_distance_1;
      delete payload.landDetails.nearest_town_distance_2;
      delete payload.landDetails.nearest_town_distance_3;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to suggest physical verification');
      const result = await response.json();
      
      await fetchLands();
      
      if (selectedLand?.id === id) {
        const updatedLand = lands.find(l => l.id === id);
        if (updatedLand) setSelectedLand(updatedLand);
      }
      
      setIsEditing(false);
      setActivePipelineTab('phone');
      setSelectedLand(null);
      alert('Land moved to Physical Audit section successfully!');
    } catch (error) {
      console.error('Error suggesting physical verification:', error);
      alert('Failed to suggest physical verification');
    } finally {
      setUpdatingAction(null);
    }
  };

  // Delete land
  const handleDeleteLand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this land? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete land');
      
      setLands(prev => prev.filter(land => land.id !== id));
      alert('Land deleted successfully!');
    } catch (error) {
      console.error('Error deleting land:', error);
      alert('Failed to delete land');
    }
  };

  // Handle edit form changes for nested objects
  const handleEditChange = (path, value) => {
    const finalValue = value === "" ? null : value;
    setEditFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = finalValue;
      
      return newData;
    });
  };

  // Handle array field changes (for checkboxes)
  const handleArrayChange = (path, value, checked) => {
    setEditFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      const currentArray = current[lastKey] || [];
      
      if (checked) {
        current[lastKey] = Array.from(new Set([...currentArray, value]));
      } else {
        current[lastKey] = currentArray.filter(item => item !== value);
      }
      
      return newData;
    });
  };

  // Initialize edit form when editing starts
  const startEditing = async (land) => {
    // Fetch full land details (the list endpoint may not include tree/relations data)
    let fullLand = land;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/${land.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          fullLand = result.data;
        }
      }
    } catch (err) {
      console.error('Error fetching full land details for editing:', err);
    }

    const clonedData = JSON.parse(JSON.stringify(fullLand));
    
    // Map tree array from backend to landDetails fields if tree array exists
    if (clonedData.tree && Array.isArray(clonedData.tree)) {
      if (!clonedData.landDetails) clonedData.landDetails = {};
      clonedData.tree.forEach(t => {
        if (t.type && t.count) {
          const keyMap = {
            'mango': 'mango_trees_number',
            'coconut': 'coconut_trees_number',
            'neem': 'neem_trees_number',
            'baniyan': 'baniyan_trees_number',
            'banyan': 'baniyan_trees_number',
            'tamarind': 'tamarind_trees_number',
            'sapoto': 'sapoto_trees_number',
            'sapota': 'sapoto_trees_number',
            'guava': 'guava_trees_number',
            'teak': 'teak_trees_number',
            'other': 'other_trees_number'
          };
          const normalizedType = t.type.toLowerCase();
          if (keyMap[normalizedType]) {
            clonedData.landDetails[keyMap[normalizedType]] = Number(t.count) || 0;
          }
        }
      });
    }

    // Normalize has_whatsapp based on whatsapp number and phone
    if (clonedData.farmerDetails) {
      if (clonedData.farmerDetails.whatsapp && clonedData.farmerDetails.phone && String(clonedData.farmerDetails.whatsapp).trim() === String(clonedData.farmerDetails.phone).trim()) {
        clonedData.farmerDetails.has_whatsapp = 'yes';
      } else {
        clonedData.farmerDetails.has_whatsapp = 'no';
      }
    }

    // Normalize landDetails - ensure it exists
    if (!clonedData.landDetails) {
      clonedData.landDetails = {};
    }
    
    // Normalize electricity: backend stores as array ['single phase'] or ['three phase']
    // Convert to electricity_phase for the radio buttons
    const electricityArr = clonedData.landDetails.electricity || [];
    if (electricityArr.length > 0) {
      const val = electricityArr[0]?.toLowerCase?.() || '';
      if (val.includes('single')) {
        clonedData.landDetails.electricity_phase = 'SINGLE';
      } else if (val.includes('three')) {
        clonedData.landDetails.electricity_phase = 'THREE';
      }
    }
    
    // Normalize tree fields - ensure they are numbers, extract from strings like "mango-12"
    const treeFields = [
      'mango_trees_number', 'coconut_trees_number', 'neem_trees_number',
      'baniyan_trees_number', 'tamarind_trees_number', 'sapoto_trees_number',
      'guava_trees_number', 'teak_trees_number', 'other_trees_number'
    ];
    treeFields.forEach(field => {
      let val = clonedData.landDetails[field];
      if (typeof val === 'string') {
        const match = val.match(/\d+/);
        val = match ? parseInt(match[0], 10) : 0;
      }
      // Keep 0 as 0, otherwise default to 0
      clonedData.landDetails[field] = (val !== undefined && val !== null && val !== '') ? Number(val) : 0;
    });

    // Parse GPS if they are comma-separated strings (backend might return combined strings)
    const parseGPS = (val) => {
      if (typeof val === 'string' && val.includes(',')) {
        return val.split(',').map(s => s.trim());
      }
      return null;
    };

    if (clonedData.landDetails) {
      const entryCoords = parseGPS(clonedData.landDetails.land_entry_latitude);
      if (entryCoords && entryCoords.length >= 2) {
        clonedData.landDetails.land_entry_latitude = entryCoords[0];
        clonedData.landDetails.land_entry_longitude = entryCoords[1];
      }

      const boundaryCoords = parseGPS(clonedData.landDetails.land_boundary_latitude);
      if (boundaryCoords && boundaryCoords.length >= 2) {
        clonedData.landDetails.land_boundary_latitude = boundaryCoords[0];
        clonedData.landDetails.land_boundary_longitude = boundaryCoords[1];
      }
    }
    
    // Normalize road type to uppercase to match dropdown options
    // Backend sends mixed case like "Highway", "Double Road" but options are "HIGHWAY", "DOUBLE ROAD"
    if (clonedData.landDetails.nearest_road_type) {
      clonedData.landDetails.nearest_road_type = clonedData.landDetails.nearest_road_type.toUpperCase();
    }
    
    // Normalize soil_type
    if (clonedData.landDetails.soil_type) {
      const st = clonedData.landDetails.soil_type.toLowerCase();
      if (st.includes('red')) clonedData.landDetails.soil_type = 'Red Soil';
      else if (st.includes('black')) clonedData.landDetails.soil_type = 'Black Soil';
      else if (st.includes('sand')) clonedData.landDetails.soil_type = 'Sandy Soil';
      else if (st.includes('alluvial')) clonedData.landDetails.soil_type = 'Alluvial Soil';
    }

    // Normalize fencing_status
    if (clonedData.landDetails.fencing_status) {
      const fs = clonedData.landDetails.fencing_status.toLowerCase();
      if (fs.includes('gate')) clonedData.landDetails.fencing_status = 'All side with gates';
      else if (fs.includes('fully') || fs.includes('all')) clonedData.landDetails.fencing_status = 'all sides';
      else if (fs.includes('partially')) clonedData.landDetails.fencing_status = 'partially';
      else if (fs.includes('not') || fs === 'no') clonedData.landDetails.fencing_status = 'no';
    }
    
    // Normalize village - trim whitespace/tab characters
    if (clonedData.village) {
      clonedData.village = clonedData.village.trim();
    }
    
    // Unpack nearest town data
    const unpackTown = (packedStr) => {
      if (!packedStr) return null;
      try {
        const parsed = JSON.parse(packedStr);
        if (parsed && typeof parsed === 'object' && parsed.town) {
          return parsed;
        }
      } catch (e) {
        return { state: clonedData.state || '', district: clonedData.district || '', town: packedStr };
      }
      return { state: clonedData.state || '', district: clonedData.district || '', town: packedStr };
    };

    if (clonedData.nearest_town_1) {
      const unpacked = unpackTown(clonedData.nearest_town_1);
      clonedData.landDetails.nearest_town_state = unpacked?.state || '';
      clonedData.landDetails.nearest_town_district = unpacked?.district || '';
      clonedData.landDetails.nearest_town_1 = unpacked?.town || '';
      clonedData.landDetails.nearest_town_distance_1 = unpacked?.distance || clonedData.nearest_town_1_km || '';
    }
    if (clonedData.nearest_town_2) {
      const unpacked = unpackTown(clonedData.nearest_town_2);
      clonedData.landDetails.nearest_town_district_2 = unpacked?.district || '';
      clonedData.landDetails.nearest_town_2 = unpacked?.town || '';
      clonedData.landDetails.nearest_town_distance_2 = unpacked?.distance || clonedData.nearest_town_2_km || '';
    }
    if (clonedData.nearest_town_3) {
      const unpacked = unpackTown(clonedData.nearest_town_3);
      clonedData.landDetails.nearest_town_district_3 = unpacked?.district || '';
      clonedData.landDetails.nearest_town_3 = unpacked?.town || '';
      clonedData.landDetails.nearest_town_distance_3 = unpacked?.distance || clonedData.nearest_town_3_km || '';
    }
    
    // Normalize arrays that might come as null from backend
    if (!Array.isArray(clonedData.landDetails.residence)) {
      clonedData.landDetails.residence = [];
    } else {
      clonedData.landDetails.residence = clonedData.landDetails.residence.map(r => r === 'developed farm' ? 'developed farm house' : r);
    }
    if (typeof clonedData.landDetails.water_source === 'string') {
      try { clonedData.landDetails.water_source = JSON.parse(clonedData.landDetails.water_source); } catch(e) { clonedData.landDetails.water_source = []; }
    }
    if (!Array.isArray(clonedData.landDetails.water_source)) {
      clonedData.landDetails.water_source = [];
    } else {
      // Parse strings like "cheruvu -0", "canal-2" into water_source array and number_of_X fields
      const newWaterSource = [];
      clonedData.landDetails.water_source.forEach(item => {
        if (typeof item === 'string') {
          const parts = item.split('-');
          if (parts.length > 1) {
            const type = parts[0].trim().toLowerCase();
            const count = parseInt(parts[1], 10) || 0;
            newWaterSource.push(type);
            const fieldName = type === 'borewell' ? 'number_of_bores' : `number_of_${type.replace(/\s+/g, '_')}`;
            clonedData.landDetails[fieldName] = count;
          } else {
            newWaterSource.push(item.trim().toLowerCase());
          }
        }
      });
      clonedData.landDetails.water_source = newWaterSource;
    }
    
    if (typeof clonedData.landDetails.complaints === 'string') {
      try { clonedData.landDetails.complaints = JSON.parse(clonedData.landDetails.complaints); } catch(e) { clonedData.landDetails.complaints = []; }
    }
    if (!Array.isArray(clonedData.landDetails.complaints)) {
      clonedData.landDetails.complaints = [];
    }
    if (!Array.isArray(clonedData.landDetails.electricity)) {
      clonedData.landDetails.electricity = [];
    }
    if (!Array.isArray(clonedData.land_sale_available_status)) {
      clonedData.land_sale_available_status = [];
    }
    if (!Array.isArray(clonedData.urgency_listing)) {
      clonedData.urgency_listing = [];
    }
    
    setEditFormData(clonedData);
    setIsEditing(true);
    setEditTab('basic');
    setActivePipelineTab('verify');
    

    // Pre-populate cascading location dropdowns based on existing land data
    try {
      if (land.state) {
        const stateObj = locationStates.find(s => s.name === land.state);
        if (stateObj?.id) {
          const distRes = await axios.get(`${API_BASE_URL}/location/districts/${stateObj.id}`);
          if (distRes.data.success) {
            setLocationDistricts(distRes.data.data);
            if (land.district) {
              const distObj = distRes.data.data.find(d => d.name === land.district);
              if (distObj?.id) {
                const mandalRes = await axios.get(`${API_BASE_URL}/location/mandals/${distObj.id}`);
                if (mandalRes.data.success) {
                  setLocationMandals(mandalRes.data.data);
                  if (land.mandal) {
                    const mandalObj = mandalRes.data.data.find(m => m.name === land.mandal);
                    if (mandalObj?.id) {
                      const villageRes = await axios.get(`${API_BASE_URL}/location/villages/${mandalObj.id}`);
                      if (villageRes.data.success) {
                        setLocationVillages(villageRes.data.data);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error pre-populating location dropdowns:', err);
    }
  };

  // Cancel editing and go back to phone verification list
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedLand(null);
    setActivePipelineTab('phone');
  };

  // Filter lands by search
  const filteredLands = lands.filter(land => 
    land.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.mandal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.farmerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.farmerDetails?.phone?.includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);
  const paginatedLands = filteredLands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render media gallery
  const renderMediaGallery = () => {
    if (!selectedLand.media || selectedLand.media.length === 0) {
      return <div className="text-center text-gray-500 py-8">No media available</div>;
    }

    const groupedMedia = selectedLand.media.reduce((acc, item) => {
      const category = item.category || 'default';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        {Object.entries(groupedMedia).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-semibold mb-3 capitalize">{category.replace(/_/g, ' ')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  {item.type === 'image' ? (
                    <img 
                      src={fixUrl(item.url)} 
                      alt={category} 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IMAGE_NOT_FOUND_PLACEHOLDER;
                      }}
                    />
                  ) : item.type === 'video' ? (
                    <video src={fixUrl(item.url)} className="w-full h-40 object-cover" controls />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-2 text-xs text-gray-600 bg-gray-50 truncate">
                    {category} - {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render edit form INLINE (not modal)
  const renderInlineEditForm = () => {
    if (!selectedLand || !isEditing) return null;

    const uploadSpecificDocument = async (e, type) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await handleFileUpload(file, 'document');
      if (url) {
        const newDoc = { doc_type: type, file_url: url, created_at: new Date().toISOString() };
        setEditFormData(prev => ({ ...prev, documents: [...(prev.documents || []), newDoc] }));
      }
    };

    return (
      <div className="pb-10 bg-[#f8f9fb]">
        {/* Dark Header */}
        <div className="land-edit-form-header bg-[#0B1120] rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 shadow-lg mx-3 sm:mx-6 mt-2 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-gray-400 overflow-hidden flex items-center justify-center text-xl font-bold text-white">
               {selectedLand.farmerDetails?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-0.5 tracking-tight leading-none">L{String(selectedLand.id).padStart(3, '0')}</h2>
              <div className="text-[9px] font-bold text-orange-500 tracking-widest uppercase mt-1">
                TECHNICAL VERIFY WORKFLOW • {selectedLand.farmerDetails?.name || 'UNKNOWN'}
              </div>
            </div>
          </div>
          <div className="land-edit-header-actions flex items-center gap-3 flex-wrap">
            <button 
              onClick={cancelEditing}
              className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-xs font-bold tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={14} /> BACK TO REGISTRY
            </button>
            <button 
              onClick={() => verifyLand(selectedLand.id, editFormData)}
              className="px-5 py-2 bg-[#3b82f6] text-white rounded-lg text-xs font-bold tracking-wide hover:bg-[#2563eb] transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
              disabled={updatingAction !== null}
            >
              {updatingAction === 'verify' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              VERIFY
            </button>
            <button 
              onClick={() => physicalVerifyLand(selectedLand.id, editFormData)}
              className="px-5 py-2 bg-[#f97316] text-white rounded-lg text-xs font-bold tracking-wide hover:bg-[#ea580c] transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2"
              disabled={updatingAction !== null}
            >
              {updatingAction === 'physical' ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              SUGGEST PHYSICAL VERIFICATION
            </button>
          </div>
        </div>

        {/* 4-Column Masonry Grid */}
        <div className="land-edit-form-body land-edit-grid px-3 sm:px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col gap-6">
            <FormCard title="1. ADDRESS REGISTRY" icon={MapPin} colorTheme="red">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">State</label>
                  <select 
                    value={editFormData.state || ''} 
                    onChange={(e) => handleLocationStateChange(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium bg-white"
                  >
                    <option value="">Select State</option>
                    {editFormData.state && !locationStates.some(s => s.name === editFormData.state) && (
                      <option value={editFormData.state}>{editFormData.state}</option>
                    )}
                    {locationStates.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">District</label>
                  <select 
                    value={editFormData.district || ''} 
                    onChange={(e) => handleLocationDistrictChange(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium bg-white"
                    disabled={!editFormData.state}
                  >
                    <option value="">Select District</option>
                    {editFormData.district && !locationDistricts.some(d => d.name === editFormData.district) && (
                      <option value={editFormData.district}>{editFormData.district}</option>
                    )}
                    {locationDistricts.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Mandal</label>
                  <select 
                    value={editFormData.mandal || ''} 
                    onChange={(e) => handleLocationMandalChange(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium bg-white"
                    disabled={!editFormData.district}
                  >
                    <option value="">Select Mandal</option>
                    {editFormData.mandal && !locationMandals.some(m => m.name === editFormData.mandal) && (
                      <option value={editFormData.mandal}>{editFormData.mandal}</option>
                    )}
                    {locationMandals.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Village</label>
                  <select 
                    value={editFormData.village || ''} 
                    onChange={(e) => handleEditChange('village', e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium bg-white"
                    disabled={!editFormData.mandal}
                  >
                    <option value="">Select Village</option>
                    {/* Show current village value even if not in the loaded list */}
                    {editFormData.village && !locationVillages.some(v => v.name === editFormData.village) && (
                      <option value={editFormData.village}>{editFormData.village}</option>
                    )}
                    {locationVillages.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">GPS COORDINATES</label>
                <div className="flex items-center bg-[#0B1120] rounded-lg overflow-hidden border border-gray-800">
                  <input type="text" className="bg-transparent border-none text-white px-3 py-2 text-xs w-full outline-none font-medium" value={`${editFormData.location_latitude || ''}, ${editFormData.location_longitude || ''}`} placeholder="17.4486, 78.1345" readOnly />
                  <button className="bg-[#1e293b] p-2.5 text-blue-400 hover:text-blue-300 transition-colors">
                    <MapPin size={14} />
                  </button>
                </div>
                <div className="text-[7px] text-gray-400 mt-1.5 uppercase font-bold tracking-wider">CLICK GPS TO SUGGEST NEAREST VILLAGE</div>
              </div>

            </FormCard>

            <FormCard title="1A. NEAREST TOWNS" icon={MapPin} colorTheme="teal">
              <NearestTownsFields 
                editFormData={editFormData}
                handleEditChange={handleEditChange}
                states={locationStates || []}
              />
            </FormCard>

            <FormCard title="2. FARMER DETAILS" icon={User} colorTheme="red">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Name</label>
                  <input type="text" value={editFormData.farmerDetails?.name || ''} onChange={(e) => handleEditChange('farmerDetails.name', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 text-green-600 font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Phone No</label>
                  <input type="text" value={editFormData.farmerDetails?.phone || ''} onChange={(e) => {
                    handleEditChange('farmerDetails.phone', e.target.value);
                    if (editFormData.farmerDetails?.has_whatsapp === 'yes') {
                      handleEditChange('farmerDetails.whatsapp', e.target.value);
                    }
                  }} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" />
                </div>
                
                <div className="flex items-center gap-4 border-b border-gray-100 pb-3 mt-2">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider w-1/2">SAME NO. FOR WHATSAPP?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="has_whatsapp" checked={editFormData.farmerDetails?.has_whatsapp === 'yes'} onChange={() => {
                          handleEditChange('farmerDetails.has_whatsapp', 'yes');
                          handleEditChange('farmerDetails.whatsapp', editFormData.farmerDetails?.phone || '');
                        }} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-orange-600">YES</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="has_whatsapp" checked={editFormData.farmerDetails?.has_whatsapp !== 'yes'} onChange={() => handleEditChange('farmerDetails.has_whatsapp', 'no')} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">NO</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">WhatsApp No</label>
                  <input type="text" value={editFormData.farmerDetails?.whatsapp || ''} onChange={(e) => handleEditChange('farmerDetails.whatsapp', e.target.value)} readOnly={editFormData.farmerDetails?.has_whatsapp === 'yes'} style={editFormData.farmerDetails?.has_whatsapp === 'yes' ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-bold" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Ownership</label>
                    <select value={editFormData.farmerDetails?.ownership_type || 'Ancestral'} onChange={(e) => handleEditChange('farmerDetails.ownership_type', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      {OWNERSHIP_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Locality</label>
                    <select value={editFormData.farmerDetails?.locality || 'Local'} onChange={(e) => handleEditChange('farmerDetails.locality', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      {LOCALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Status</label>
                    <select value={editFormData.farmerDetails?.ownership_status || 'Own'} onChange={(e) => handleEditChange('farmerDetails.ownership_status', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      {OWNERSHIP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Age</label>
                    <select value={editFormData.farmerDetails?.age || '30-50'} onChange={(e) => handleEditChange('farmerDetails.age', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      <option value="30-50">30-50</option>
                      {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Literacy</label>
                    <select value={editFormData.farmerDetails?.literacy || 'Literate'} onChange={(e) => handleEditChange('farmerDetails.literacy', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      <option value="Literate">Literate</option>
                      {LITERACY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Nature</label>
                    <select value={editFormData.farmerDetails?.nature || 'Calm'} onChange={(e) => handleEditChange('farmerDetails.nature', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-red-400 bg-white font-medium">
                      {NATURE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col gap-6">
            <FormCard title="3. ACRES & PRICE" icon={Building2} colorTheme="green">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Acres</label>
                  <input type="number" value={editFormData.landDetails?.total_acres || 0} onChange={(e) => handleEditChange('landDetails.total_acres', parseFloat(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-bold" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Guntas (0-39)</label>
                  <input type="number" value={editFormData.landDetails?.guntas || 0} onChange={(e) => handleEditChange('landDetails.guntas', parseFloat(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-bold" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Price per Acre (Lakhs)</label>
                <input type="number" value={editFormData.landDetails?.price_per_acres || 0} onChange={(e) => handleEditChange('landDetails.price_per_acres', parseFloat(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-orange-500 font-bold outline-none focus:border-green-400" />
              </div>
              
              <div className="mt-4">
                <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Total Value (₹)</label>
                <input type="number" value={editFormData.landDetails?.total_value || ''} onChange={(e) => handleEditChange('landDetails.total_value', parseFloat(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-orange-500 font-bold outline-none focus:border-green-400" placeholder="Enter Total Value" />
              </div>
            </FormCard>

            <FormCard title="3A. RESIDENCES & SHEDS" icon={Building2} colorTheme="green">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Type of Residence</label>
                  <div className="flex flex-wrap gap-4">
                    {['developed farm house', 'rcc house', 'asbestos shelter', 'hut'].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input type="checkbox" checked={(editFormData.landDetails?.residence || []).includes(opt)} onChange={(e) => handleArrayChange('landDetails.residence', opt, e.target.checked)} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-sm checked:bg-white checked:border-orange-500 transition-all cursor-pointer" />
                          <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-orange-500">
                            <CheckCircle size={14} className="stroke-[3]" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-100">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Poultry Shed</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={(editFormData.landDetails?.poultry_shed_number || 0) > 0} onChange={(e) => handleEditChange('landDetails.poultry_shed_number', e.target.checked ? 1 : 0)} />
                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    {(editFormData.landDetails?.poultry_shed_number || 0) > 0 && (
                      <input type="number" min="1" value={editFormData.landDetails?.poultry_shed_number || ''} onChange={(e) => handleEditChange('landDetails.poultry_shed_number', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400 font-bold" placeholder="No. of sheds" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Cow Shed</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={(editFormData.landDetails?.cow_shed_number || 0) > 0} onChange={(e) => handleEditChange('landDetails.cow_shed_number', e.target.checked ? 1 : 0)} />
                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    {(editFormData.landDetails?.cow_shed_number || 0) > 0 && (
                      <input type="number" min="1" value={editFormData.landDetails?.cow_shed_number || ''} onChange={(e) => handleEditChange('landDetails.cow_shed_number', parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400 font-bold" placeholder="No. of sheds" />
                    )}
                  </div>
                </div>
              </div>
            </FormCard>
            <FormCard title="4. PATH DETAILS" icon={MapPin} colorTheme="green">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Road Type</label>
                  <select value={editFormData.landDetails?.nearest_road_type || ''} onChange={(e) => handleEditChange('landDetails.nearest_road_type', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white">
                    <option value="">Select</option>
                    {['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'GRAVEL ROAD'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
                  <label className="block text-[9px] font-bold text-green-700 uppercase tracking-wider w-1/2">Land Attached To Road</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="land_attached_to_road" checked={editFormData.landDetails?.land_attached_to_road === 'yes'} onChange={() => handleEditChange('landDetails.land_attached_to_road', 'yes')} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-orange-600">YES</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="land_attached_to_road" checked={editFormData.landDetails?.land_attached_to_road === 'no'} onChange={() => handleEditChange('landDetails.land_attached_to_road', 'no')} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">NO</span>
                    </label>
                  </div>
                </div>
              </div>
            </FormCard>
            <FormCard title="5. LAND DETAILS" icon={TreePine} colorTheme="green">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Soil Type</label>
                  <select value={editFormData.landDetails?.soil_type || ''} onChange={(e) => handleEditChange('landDetails.soil_type', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white">
                    <option value="">Select</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Fencing Status</label>
                  <select value={editFormData.landDetails?.fencing_status || 'no'} onChange={(e) => handleEditChange('landDetails.fencing_status', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white">
                    <option value="no">no</option>
                    <option value="partially">partially</option>
                    <option value="all sides">all sides</option>
                    <option value="All side with gates">All side with gates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Electricity</label>
                  <div className="flex gap-4">
                    {ELECTRICITY_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={(editFormData.landDetails?.electricity || []).includes(opt)} 
                            onChange={(e) => handleArrayChange('landDetails.electricity', opt, e.target.checked)} 
                            className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-sm checked:bg-white checked:border-orange-500 transition-all cursor-pointer" 
                          />
                          <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-orange-500">
                            <CheckCircle size={14} className="stroke-[3]" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FormCard>
            <FormCard title="6. WATER SOURCE DETAILS" icon={Zap} colorTheme="green">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Water Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    {WATER_SOURCE_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={(editFormData.landDetails?.water_source || []).includes(opt)} 
                            onChange={(e) => handleArrayChange('landDetails.water_source', opt, e.target.checked)} 
                            className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-sm checked:bg-white checked:border-orange-500 transition-all cursor-pointer" 
                          />
                          <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-orange-500">
                            <CheckCircle size={14} className="stroke-[3]" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[...new Set(editFormData.landDetails?.water_source || [])].filter(opt => opt === 'borewell').map(opt => {
                    const fieldName = opt === 'borewell' ? 'number_of_bores' : `number_of_${opt.replace(/\s+/g, '_')}`;
                    return (
                      <div key={opt} className="flex-1 min-w-[45%]">
                        <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">No of {opt}</label>
                        <input type="number" value={editFormData.landDetails?.[fieldName] || ''} onChange={(e) => handleEditChange(`landDetails.${fieldName}`, parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-bold" />
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <label className="block text-[10px] font-bold text-green-700 uppercase tracking-wider">Farm Pond</label>
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={editFormData.landDetails?.farm_pond || false} onChange={(e) => handleEditChange('landDetails.farm_pond', e.target.checked)} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-sm checked:bg-white checked:border-orange-500 transition-all cursor-pointer" />
                    <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-orange-500">
                      <CheckCircle size={14} className="stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col gap-6">

            <FormCard title="7. TREES" icon={TreePine} colorTheme="orange">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Mango', field: 'mango_trees_number' },
                  { label: 'Coconut', field: 'coconut_trees_number' },
                  { label: 'Neem', field: 'neem_trees_number' },
                  { label: 'Banyan', field: 'baniyan_trees_number' },
                  { label: 'Tamarind', field: 'tamarind_trees_number' },
                  { label: 'Sapota', field: 'sapoto_trees_number' },
                  { label: 'Guava', field: 'guava_trees_number' },
                  { label: 'Teak', field: 'teak_trees_number' },
                  { label: 'Other', field: 'other_trees_number' }
                ].map(tree => {
                  const val = editFormData.landDetails?.[tree.field];
                  const displayValue = (val !== undefined && val !== null && val !== '') ? val : '';
                  return (
                    <div key={tree.field} className="flex flex-col">
                      <span className="text-[9px] font-bold text-orange-800 tracking-wider uppercase mb-1">{tree.label}</span>
                      <input type="number" min="0" value={displayValue} onChange={(e) => handleEditChange(`landDetails.${tree.field}`, e.target.value === '' ? '' : parseInt(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none focus:border-orange-400 font-bold" placeholder="0" />
                    </div>
                  );
                })}
              </div>
            </FormCard>

            <FormCard title="8. MULTIMEDIA REGISTRY" icon={ImageIcon} colorTheme="blue">
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9].map((i) => {
                  const validMedia = (editFormData.media || []).filter(m => m.category && m.category.toLowerCase() !== 'default' && MEDIA_CATEGORIES.includes(m.category.toLowerCase()) && m.url && typeof m.url === 'string' && m.url.trim() !== '');
                  const mediaItem = validMedia[i-1];
                  return (
                    <div key={i} className="aspect-square bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:bg-gray-100 transition-colors relative">
                      {mediaItem ? (
                         <a href={fixUrl(mediaItem.url)} target="_blank" rel="noopener noreferrer" className="w-full h-full block relative cursor-pointer group">
                           <img src={fixUrl(mediaItem.url)} className="w-full h-full object-cover rounded-lg" alt="" />
                           <div className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-lg px-1 py-0.5">
                              <span className="text-white text-[7px] font-bold uppercase truncate block text-center">
                                 {mediaItem.category?.replace('_', ' ')}
                              </span>
                           </div>
                         </a>
                      ) : (
                         i === 6 ? <Video size={16} className="text-orange-400" /> : <ImageIcon size={16} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                 <select value={selectedMediaCategory} onChange={(e) => setSelectedMediaCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[9px] outline-none focus:border-blue-400 bg-white mb-2 uppercase font-bold text-gray-600 tracking-wide">
                    <option value="">SELECT CATEGORY...</option>
                    {MEDIA_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                 </select>
                 <input type="file" accept="image/*,video/*" onChange={handleAddMedia} disabled={uploading || !selectedMediaCategory} className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </FormCard>

            <FormCard title="9. DOCUMENTS" icon={FileText} colorTheme="blue">
              <div className="space-y-3">
                {DOC_TYPES.map((docType) => {
                  const existingDoc = (editFormData.documents || []).find(d => d.doc_type === docType);
                  
                  return (
                    <div key={docType} className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm flex items-center justify-between relative group overflow-hidden">
                      {existingDoc ? (
                         <a href={fixUrl(existingDoc.file_url)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline tracking-wider uppercase cursor-pointer">{docType}</a>
                      ) : (
                         <span className="text-[10px] font-bold text-blue-800 tracking-wider uppercase">{docType}</span>
                      )}
                      <div className="flex items-center gap-2">
                        {existingDoc ? (
                           <a href={fixUrl(existingDoc.file_url)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 cursor-pointer"><CheckCircle size={16} /></a>
                        ) : null}
                        <label className="cursor-pointer text-gray-300 hover:text-blue-500 transition-colors">
                          <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => uploadSpecificDocument(e, docType)} disabled={uploading} />
                          <FileText size={16} />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormCard>
          </div>

          {/* COLUMN 4 */}
          <div className="flex flex-col gap-6">
            
            <FormCard title="10. SALE STATUS" icon={Flag} colorTheme="orange">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {[{value: 'TOKEN RECEIVED', label: 'Token Received'}, {value: 'AGREEMENT Made', label: 'Agreement Made'}, {value: 'SOLD', label: 'Sold'}].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input 
                        type="checkbox" 
                        checked={(editFormData.land_sale_available_status || []).includes(opt.value)} 
                        onChange={(e) => handleArrayChange('land_sale_available_status', opt.value, e.target.checked)} 
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[3px] checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer m-0" 
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
                        name="verification_available_for_sale"
                        checked={(editFormData.land_sale_available_status || []).includes('AVAILABLE FOR SALE')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            let arr = [...(editFormData.land_sale_available_status || [])];
                            arr = arr.filter(x => x !== 'NOT AVAILABLE');
                            if (!arr.includes('AVAILABLE FOR SALE')) arr.push('AVAILABLE FOR SALE');
                            handleEditChange('land_sale_available_status', arr);
                          }
                        }}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-orange-500 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <span className="text-[11px] text-gray-700 font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="verification_available_for_sale"
                        checked={(editFormData.land_sale_available_status || []).includes('NOT AVAILABLE')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            let arr = [...(editFormData.land_sale_available_status || [])];
                            arr = arr.filter(x => x !== 'AVAILABLE FOR SALE');
                            if (!arr.includes('NOT AVAILABLE')) arr.push('NOT AVAILABLE');
                            handleEditChange('land_sale_available_status', arr);
                          }
                        }}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-orange-500 transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <span className="text-[11px] text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>
            </FormCard>

            <FormCard title="11. MORTGAGE STATUS" icon={ShieldCheck} colorTheme="orange">
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      checked={(editFormData.mortage_availability_status || []).includes('CURRENTLY MORTGAGED')} 
                      onChange={(e) => {
                         let arr = [...(editFormData.mortage_availability_status || [])];
                         if (e.target.checked) {
                             if (!arr.includes('CURRENTLY MORTGAGED')) arr.push('CURRENTLY MORTGAGED');
                         } else {
                             arr = arr.filter(x => x !== 'CURRENTLY MORTGAGED');
                         }
                         handleEditChange('mortage_availability_status', arr);
                      }} 
                      className="peer appearance-none w-4 h-4 border border-gray-300 rounded-[3px] checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer m-0" 
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
                          name="verification_available_for_mortgage"
                          checked={(editFormData.mortage_availability_status || []).includes('AVAILABLE FOR MORTGAGE')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              let arr = [...(editFormData.mortage_availability_status || [])];
                              arr = arr.filter(x => x !== 'NOT AVAILABLE');
                              if (!arr.includes('AVAILABLE FOR MORTGAGE')) arr.push('AVAILABLE FOR MORTGAGE');
                              handleEditChange('mortage_availability_status', arr);
                            }
                          }}
                          className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-orange-500 transition-all cursor-pointer"
                        />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[11px] text-gray-700 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="verification_available_for_mortgage"
                          checked={(editFormData.mortage_availability_status || []).includes('NOT AVAILABLE')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              let arr = [...(editFormData.mortage_availability_status || [])];
                              arr = arr.filter(x => x !== 'AVAILABLE FOR MORTGAGE');
                              if (!arr.includes('NOT AVAILABLE')) arr.push('NOT AVAILABLE');
                              handleEditChange('mortage_availability_status', arr);
                            }
                          }}
                          className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-orange-500 transition-all cursor-pointer"
                        />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[11px] text-gray-700 font-medium">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </FormCard>
            
            <FormCard title="14. GPS COORDINATES" icon={MapPin} colorTheme="blue">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-blue-800 uppercase mb-1 tracking-wider">Entry Latitude</label>
                    <input type="text" value={editFormData.landDetails?.land_entry_latitude || ''} onChange={(e) => handleEditChange('landDetails.land_entry_latitude', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-400 font-medium bg-white" placeholder="e.g. 17.123456" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-blue-800 uppercase mb-1 tracking-wider">Entry Longitude</label>
                    <input type="text" value={editFormData.landDetails?.land_entry_longitude || ''} onChange={(e) => handleEditChange('landDetails.land_entry_longitude', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-400 font-medium bg-white" placeholder="e.g. 78.123456" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-blue-800 uppercase mb-1 tracking-wider">Boundary Latitude</label>
                    <input type="text" value={editFormData.landDetails?.land_boundary_latitude || ''} onChange={(e) => handleEditChange('landDetails.land_boundary_latitude', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-400 font-medium bg-white" placeholder="e.g. 17.123456" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-blue-800 uppercase mb-1 tracking-wider">Boundary Longitude</label>
                    <input type="text" value={editFormData.landDetails?.land_boundary_longitude || ''} onChange={(e) => handleEditChange('landDetails.land_boundary_longitude', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-400 font-medium bg-white" placeholder="e.g. 78.123456" />
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard title="12. LISTING CONFIG" icon={CheckCircle} colorTheme="blue">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-800 tracking-wider uppercase">Urgent Sale</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={(editFormData.urgency_listing || []).includes('urgent sale')} onChange={(e) => handleArrayChange('urgency_listing', 'urgent sale', e.target.checked)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-800 tracking-wider uppercase">Premium Listing</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={(editFormData.urgency_listing || []).includes('premium listing')} onChange={(e) => handleArrayChange('urgency_listing', 'premium listing', e.target.checked)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-800 tracking-wider uppercase">Certification Package</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editFormData.verification_package || false} onChange={(e) => handleEditChange('verification_package', e.target.checked)} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            </FormCard>
            
            <FormCard title="13. RISK AUDIT" icon={XCircle} colorTheme="red">
              <div className="space-y-4">
                {['Siblings Issue (own Brother or Sister)', 'Cousins Issue (of uncles family)', 'Boundary', 'Rocks In Land', 'Electric Poles', 'Sealing', 'path issue', 'No Path at all'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" value={status} checked={(editFormData.landDetails?.complaints || []).some(c => c?.toLowerCase?.() === status.toLowerCase())} onChange={(e) => handleArrayChange('landDetails.complaints', status, e.target.checked)} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-sm checked:bg-white checked:border-orange-500 transition-all cursor-pointer" />
                      <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-orange-500">
                        <CheckCircle size={14} className="stroke-[3]" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-red-600 tracking-wider uppercase group-hover:text-red-700 transition-colors truncate">{status}</span>
                  </label>
                ))}
                
                <div className="pt-2 border-t border-red-100 mt-2">
                  <textarea 
                    value={editFormData.registry_notes || ''} 
                    onChange={(e) => handleEditChange('registry_notes', e.target.value)}
                    placeholder="Registry notes..."
                    className="w-full border border-gray-200 rounded-lg p-2 text-[10px] font-bold text-gray-700 outline-none focus:border-red-400 min-h-[60px] resize-none"
                  />
                </div>
              </div>
            </FormCard>

          </div>
        </div>
      </div>
    );
  };

  // Render land detail modal (view only)
  const renderDetailModal = () => {
    if (!selectedLand) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Land Details #{selectedLand.id}</h2>
            <button
              onClick={() => setSelectedLand(null)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b px-4">
            <div className="flex gap-4 overflow-x-auto">
              {['basic', 'farmer', 'land', 'media', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : 
                   tab === 'farmer' ? 'Farmer Details' :
                   tab === 'land' ? 'Land Details' :
                   tab === 'media' ? 'Media Gallery' : 'Documents'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>State:</strong> {selectedLand.state || 'N/A'}</div>
                  <div><strong>District:</strong> {selectedLand.district || 'N/A'}</div>
                  <div><strong>Mandal:</strong> {selectedLand.mandal || 'N/A'}</div>
                  <div><strong>Village:</strong> {selectedLand.village || 'N/A'}</div>
                  
                  {selectedLand.landDetails?.nearest_town_state && (
                    <div className="col-span-1 md:col-span-2 mt-2 p-2 bg-gray-50 border border-gray-100 rounded-lg">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1">Nearest Towns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div><span className="text-gray-500">State:</span> {selectedLand.landDetails.nearest_town_state}</div>
                        {selectedLand.landDetails.nearest_town_1 && (
                          <div><span className="text-gray-500">Primary:</span> {selectedLand.landDetails.nearest_town_1} <span className="text-gray-400 text-xs">({selectedLand.landDetails.nearest_town_district || 'N/A'})</span></div>
                        )}
                        {selectedLand.landDetails.nearest_town_2 && (
                          <div><span className="text-gray-500">Secondary:</span> {selectedLand.landDetails.nearest_town_2} <span className="text-gray-400 text-xs">({selectedLand.landDetails.nearest_town_district_2 || 'N/A'})</span></div>
                        )}
                        {selectedLand.landDetails.nearest_town_3 && (
                          <div><span className="text-gray-500">Tertiary:</span> {selectedLand.landDetails.nearest_town_3} <span className="text-gray-400 text-xs">({selectedLand.landDetails.nearest_town_district_3 || 'N/A'})</span></div>
                        )}
                      </div>
                    </div>
                  )}
                  <div><strong>Location:</strong> {selectedLand.location_latitude}, {selectedLand.location_longitude}</div>
                  <div><strong>Call Status:</strong> <StatusBadge status={selectedLand.call_verification_status} /></div>
                  <div><strong>Form Status:</strong> <StatusBadge status={selectedLand.form_status} /></div>
                  <div><strong>Physical Status:</strong> <StatusBadge status={selectedLand.physcial_verification_status} /></div>
                  <div><strong>Verification Status:</strong> <StatusBadge status={selectedLand.verification_status} /></div>
                  <div><strong>Verification Package:</strong> {selectedLand.verification_package ? 'Yes' : 'No'}</div>
                  <div><strong>Availability:</strong> {selectedLand.availablity || 'N/A'}</div>
                  <div><strong>Created At:</strong> {new Date(selectedLand.created_at).toLocaleString()}</div>
                </div>
                
                {selectedLand.land_sale_available_status && selectedLand.land_sale_available_status.length > 0 && (
                  <div>
                    <strong>Land Sale Status:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.land_sale_available_status.map((s, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.mortage_availability_status && selectedLand.mortage_availability_status.length > 0 && (
                  <div>
                    <strong>Mortgage Status:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.mortage_availability_status.map((s, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.urgency_listing && selectedLand.urgency_listing.length > 0 && (
                  <div>
                    <strong>Urgency Listing:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.urgency_listing.map((s, i) => (
                        <span key={i} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Farmer Details Tab */}
            {activeTab === 'farmer' && selectedLand.farmerDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Name:</strong> {selectedLand.farmerDetails.name || 'N/A'}</div>
                <div><strong>Phone:</strong> {selectedLand.farmerDetails.phone || 'N/A'}</div>
                <div><strong>WhatsApp:</strong> {selectedLand.farmerDetails.whatsapp || 'N/A'}</div>
                <div><strong>Ownership Type:</strong> {selectedLand.farmerDetails.ownership_type || 'N/A'}</div>
                <div><strong>Locality:</strong> {selectedLand.farmerDetails.locality || 'N/A'}</div>
                <div><strong>Ownership Status:</strong> {selectedLand.farmerDetails.ownership_status || 'N/A'}</div>
                <div><strong>Age:</strong> {selectedLand.farmerDetails.age || 'N/A'}</div>
                <div><strong>Literacy:</strong> {selectedLand.farmerDetails.literacy || 'N/A'}</div>
                <div><strong>Nature:</strong> {selectedLand.farmerDetails.nature || 'N/A'}</div>
              </div>
            )}

            {/* Land Details Tab */}
            {activeTab === 'land' && selectedLand.landDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>Total Area:</strong> {selectedLand.landDetails.total_acres} acres {selectedLand.landDetails.guntas} guntas</div>
                  <div><strong>Price per Acre:</strong> {formatPrice(selectedLand.landDetails.price_per_acres)}</div>
                  <div><strong>Total Value:</strong> {formatPrice(selectedLand.landDetails.total_value)}</div>
                  <div><strong>Nearest Road:</strong> {selectedLand.landDetails.nearest_road_type || 'N/A'}</div>
                  <div><strong>Attached to Road:</strong> {selectedLand.landDetails.land_attached_to_road || 'N/A'}</div>

                  <div><strong>Soil Type:</strong> {selectedLand.landDetails?.soil_type || 'N/A'}</div>
                  <div><strong>Fencing Status:</strong> {selectedLand.landDetails.fencing_status || 'N/A'}</div>
                  <div><strong>Farm Pond:</strong> {selectedLand.landDetails.farm_pond ? 'Yes' : 'No'}</div>
                  <div><strong>Number of Bores:</strong> {selectedLand.landDetails.number_of_bores || 0}</div>
                  <div><strong>Poultry Sheds:</strong> {selectedLand.landDetails.poultry_shed_number || 0}</div>
                  <div><strong>Cow Sheds:</strong> {selectedLand.landDetails.cow_shed_number || 0}</div>
                </div>
                
                {selectedLand.landDetails.electricity && selectedLand.landDetails.electricity.length > 0 && (
                  <div>
                    <strong>Electricity:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.landDetails.electricity.map((e, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.landDetails.residence && selectedLand.landDetails.residence.length > 0 && (
                  <div>
                    <strong>Residence:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.landDetails.residence.map((r, i) => (
                        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{r}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.landDetails.water_source && selectedLand.landDetails.water_source.length > 0 && (
                  <div>
                    <strong>Water Source:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.landDetails.water_source.map((w, i) => (
                        <span key={i} className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                          <Droplets className="w-3 h-3" /> {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Trees Information */}
                {selectedLand.tree && selectedLand.tree.length > 0 && (
                  <div>
                    <strong>Trees Information:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.tree.map((t, i) => (
                        <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                          {t.type}: {t.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.landDetails.complaints && selectedLand.landDetails.complaints.length > 0 && (
                  <div>
                    <strong>Complaints/Issues:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLand.landDetails.complaints.map((c, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedLand.gps && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <strong>GPS Location:</strong>
                    <div>Entry: {selectedLand.landDetails?.land_entry_latitude}, {selectedLand.landDetails?.land_entry_longitude}</div>
                    <div>Boundary: {selectedLand.landDetails?.land_boundary_latitude}, {selectedLand.landDetails?.land_boundary_longitude}</div>
                    <div>GPS Point: {selectedLand.gps.latitude}, {selectedLand.gps.longitude}</div>
                  </div>
                )}
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && renderMediaGallery()}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                {selectedLand.documents && selectedLand.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedLand.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={fixUrl(doc.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-medium">{doc.doc_type}</div>
                          <div className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleString()}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">No documents available</div>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
            <button
              onClick={() => startEditing(selectedLand)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Land
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // NEW UI RENDER
  // ============================================
  const pipelineTabs = [
    { key: 'phone', label: '1. Phone Verification' },
    { key: 'verify', label: '2. Verify' },
    { key: 'physical', label: '3. Physical Audit' },
    { key: 'review', label: '4. Review' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div className="land-dash-header" style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.headerTitle}>VERIFICATION CENTER</h1>
          <p style={styles.headerSubtitle}>Administrative Ground-Truth Mission Pipeline</p>
        </div>
        <div className="land-dash-search" style={styles.searchContainer}>
          <Search size={15} style={styles.searchIcon} />
          <input
            type="text"
            placeholder={`Search Registry (${filteredLands.length} Active Leads)...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#f97316';
              e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Pipeline Tabs */}
      <div className="land-dash-tabs" style={styles.pipelineTabs}>
        {pipelineTabs.map((tab) => (
          <button
            key={tab.key}
            style={styles.pipelineTab(activePipelineTab === tab.key)}
            onClick={() => setActivePipelineTab(tab.key)}
            onMouseEnter={(e) => {
              if (activePipelineTab !== tab.key) {
                e.target.style.color = '#64748b';
                e.target.style.background = '#f1f5f9';
              }
            }}
            onMouseLeave={(e) => {
              if (activePipelineTab !== tab.key) {
                e.target.style.color = '#94a3b8';
                e.target.style.background = '#fafbfc';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on pipeline tab */}
      {activePipelineTab === 'verify' ? (
        isEditing ? renderInlineEditForm() : (
          <div style={{...styles.tableContainer, padding: '60px 20px', textAlign: 'center', color: '#64748b'}}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>👆</div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Please select a land from the <strong>Phone Verification</strong> list to start verifying.</div>
          </div>
        )
      ) : activePipelineTab === 'physical' ? (
          <LandPhysicalVerificationDashboard />
      ) : activePipelineTab === 'review' ? (
          <div style={{...styles.tableContainer, padding: '60px 20px', textAlign: 'center', color: '#64748b'}}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Review pipeline is under construction.</div>
          </div>
      ) : (
      /* Table (Phone Verification) */
      <div className="land-dash-table-container" style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#f97316' }} />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : paginatedLands.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>🔍</div>
            <div>No lands found for status: <strong>{statusFilter}</strong></div>
            {searchTerm && <div style={{ marginTop: '4px', fontSize: '13px' }}>with search term: "{searchTerm}"</div>}
          </div>
        ) : (
          <>
            <div className="land-table-wrap">
            <table className="land-dash-table" style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.th}>Farmer</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Unit Profile</th>
                  <th className="hide-mobile" style={styles.th}>Assigned Executive</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLands.map((land, index) => {
                  const farmerName = land.farmerDetails?.name || 'Unknown';
                  const avatarColor = getAvatarColor(farmerName);
                  const landId = `L${String(land.id).padStart(3, '0')}`;
                  const acres = land.landDetails?.total_acres || 0;
                  const pricePerAcre = land.landDetails?.price_per_acres || 0;

                  return (
                    <tr
                      key={land.id}
                      style={styles.tr(hoveredRow === land.id)}
                      onMouseEnter={() => setHoveredRow(land.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Farmer */}
                      <td style={styles.td}>
                        <div className="land-dash-farmer-cell" style={styles.farmerCell}>
                          <div className="land-avatar" style={styles.avatar(avatarColor)}>
                            {farmerName.charAt(0).toUpperCase()}
                          </div>
                          <div style={styles.farmerInfo}>
                            <div
                              style={styles.farmerName}
                              onClick={() => setSelectedLand(land)}
                            >
                              {farmerName}
                            </div>
                            <div style={styles.farmerId}>{landId}</div>
                            <div style={styles.farmerPhone}>
                              <Phone size={10} />
                              {land.farmerDetails?.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td style={styles.td}>
                        <div style={styles.addressMain}>
                          {land.village || 'N/A'}, Registry Mandal
                        </div>
                        <div style={styles.addressSub}>
                          {land.mandal || 'N/A'}, {land.state || 'N/A'}
                        </div>
                      </td>

                      {/* Unit Profile */}
                      <td style={styles.td}>
                        <div style={styles.unitProfile}>
                          {acres} AC • {formatPriceShort(pricePerAcre)}/AC
                        </div>
                      </td>

                      {/* Assigned Executive */}
                      <td className="hide-mobile" style={styles.td}>
                        <div style={styles.executiveName}>
                          {land.assigned_executive || land.employeeName || 'UNASSIGNED'}
                        </div>
                      </td>

                      {/* Management */}
                      <td className="land-action-cell" style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            style={styles.verifyBtn}
                            onClick={() => {
                              setSelectedLand(land);
                              startEditing(land);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 14px rgba(249, 115, 22, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(249, 115, 22, 0.35)';
                            }}
                          >
                            Start Verify <ArrowRight size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLand(land.id);
                            }}
                            style={{ 
                              background: '#fee2e2', 
                              color: '#ef4444', 
                              border: 'none', 
                              borderRadius: '8px', 
                              padding: '8px', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#fecaca';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fee2e2';
                            }}
                            title="Delete Land"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="land-dash-pagination" style={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={styles.pageBtn(currentPage === 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={styles.pageNum(currentPage === pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={styles.pageBtn(currentPage === totalPages)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {/* Inbound Signals Pill */}
      <div
        className="land-dash-inbound"
        style={styles.inboundPill}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(249, 115, 22, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.4)';
        }}
      >
        <Bell size={15} />
        Inbound Signals ({lands.length})
        <div style={{
          width: '32px', height: '18px', background: 'rgba(255,255,255,0.25)', borderRadius: '50px',
          position: 'relative', cursor: 'pointer', marginLeft: '4px'
        }}>
          <div style={{
            width: '14px', height: '14px', background: '#fff', borderRadius: '50%',
            position: 'absolute', top: '2px', right: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>

      {/* Detail modal (view only - when clicking farmer name) */}
      {selectedLand && !isEditing && renderDetailModal()}
    </div>
  );
};

export default LandVerificationDashboard;


