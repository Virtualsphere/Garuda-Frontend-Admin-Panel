import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Bell
} from 'lucide-react';
import { BASE_URL } from '../../url/BaseUrl';
import { fixUrl, IMAGE_NOT_FOUND_PLACEHOLDER } from "../../utils/fixUrl";

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
const RESIDENCE_OPTIONS = ['developed farm', 'rcc house', 'asbestos shelter', 'hut'];
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
const MEDIA_CATEGORIES = ['farmer_photo', 'land_soil', 'fencing', 'farm_pond', 'residence', 'shed', 'water_source', 'trees', 'rocks', 'electric_poles', 'others', 'video'];
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
    margin: '24px 32px 0',
    background: '#ffffff',
    borderRadius: '12px 12px 0 0',
    border: '1px solid #e2e8f0',
    borderBottom: 'none',
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
    borderRadius: '0 0 12px 12px',
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
  const themes = {
    red: { bg: 'bg-red-50', border: 'border-t-red-500', text: 'text-red-600', iconBg: 'bg-red-500' },
    green: { bg: 'bg-green-50', border: 'border-t-green-500', text: 'text-green-600', iconBg: 'bg-green-500' },
    blue: { bg: 'bg-blue-50', border: 'border-t-blue-500', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    orange: { bg: 'bg-orange-50', border: 'border-t-orange-500', text: 'text-orange-600', iconBg: 'bg-orange-500' },
    teal: { bg: 'bg-teal-50', border: 'border-t-teal-500', text: 'text-teal-600', iconBg: 'bg-teal-500' },
  };
  const theme = themes[colorTheme] || themes.blue;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden border-t-4 ${theme.border}`}>
      <div className={`pt-4 pb-3 px-6 flex flex-col items-center justify-center border-b border-gray-100 ${theme.bg}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm ${theme.iconBg}`}>
          <Icon size={16} />
        </div>
        <h3 className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
};

// Main Component
const LandPhysicalVerificationDashboard = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);
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

  // Fetch lands for physical audit (phone complete; physical pending or complete)
  const fetchLands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/pending-call-verification/complete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch lands');
      const result = await response.json();

      let landsData = result.data || result;
      if (!Array.isArray(landsData)) landsData = [landsData];

      landsData = landsData.filter((land) => {
        const phoneComplete = land.call_verification_status === 'complete';
        if (statusFilter === 'pending') {
          return phoneComplete && land.physcial_verification_status === 'pending';
        }
        return phoneComplete && land.physcial_verification_status === 'complete';
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

  // Update land data (physical audit commit → physical & overall verification complete)
  const updateLand = async (id, data) => {
    setUpdating(true);
    const payload = {
      ...data,
      call_verification_status: 'complete',
      physcial_verification_status: 'complete',
      verification_status: 'pending', // Set to pending so it goes to final verification
    };
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
      if (!response.ok) throw new Error('Failed to update land');
      const result = await response.json();

      await fetchLands();

      if (selectedLand?.id === id) {
        const updatedLand = lands.find(l => l.id === id);
        if (updatedLand) setSelectedLand(updatedLand);
      }

      setIsEditing(false);
      setSelectedLand(null);
      alert('Land updated successfully!');
    } catch (error) {
      console.error('Error updating land:', error);
      alert('Failed to update land');
    } finally {
      setUpdating(false);
    }
  };

  // Handle edit form changes for nested objects
  const handleEditChange = (path, value) => {
    setEditFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

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
  const startEditing = (land) => {
    const clonedData = JSON.parse(JSON.stringify(land));

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

    // Backend sends mixed case like "Highway", "Double Road" but options are "HIGHWAY", "DOUBLE ROAD"
    if (clonedData.landDetails.nearest_road_type) {
      clonedData.landDetails.nearest_road_type = clonedData.landDetails.nearest_road_type.toUpperCase();
    }

    // Normalize village - trim whitespace/tab characters
    if (clonedData.village) {
      clonedData.village = clonedData.village.trim();
    }

    // Normalize arrays that might come as null from backend
    if (!Array.isArray(clonedData.landDetails.residence)) {
      clonedData.landDetails.residence = [];
    }
    if (!Array.isArray(clonedData.landDetails.water_source)) {
      clonedData.landDetails.water_source = [];
    }
    if (typeof clonedData.landDetails.complaints === 'string') {
      try { clonedData.landDetails.complaints = JSON.parse(clonedData.landDetails.complaints); } catch (e) { clonedData.landDetails.complaints = []; }
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
  };

  // Cancel editing and go back to phone verification list
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedLand(null);
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
        <div className="bg-[#0B1120] rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 shadow-lg mx-6 mt-2 gap-4">
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
          <div className="flex items-center gap-3">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg text-xs font-bold tracking-wide hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={14} /> BACK TO REGISTRY
            </button>
            <button
              onClick={() => updateLand(selectedLand.id, editFormData)}
              className="px-5 py-2 bg-[#f97316] text-white rounded-lg text-xs font-bold tracking-wide hover:bg-[#ea580c] transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2"
              disabled={updating}
            >
              {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              COMMIT AUDIT
            </button>
          </div>
        </div>

        {/* 4-Column Masonry Grid */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

          {/* COLUMN 1 */}
          <div className="flex flex-col gap-6">
            <FormCard title="1. ADDRESS REGISTRY" icon={MapPin} colorTheme="red">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">State</label>
                  <input type="text" value={editFormData.state || ''} onChange={(e) => handleEditChange('state', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">District</label>
                  <input type="text" value={editFormData.district || ''} onChange={(e) => handleEditChange('district', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Mandal</label>
                  <input type="text" value={editFormData.mandal || ''} onChange={(e) => handleEditChange('mandal', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Village</label>
                  <input type="text" value={editFormData.village || ''} onChange={(e) => handleEditChange('village', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" />
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
              <div className="mt-4">
                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Address / Landmark</label>
                <input type="text" value={editFormData.address || ''} onChange={(e) => handleEditChange('address', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" placeholder="Enter address or nearby landmark" />
              </div>
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
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider w-1/2">NUMBER HAS WHATSAPP?</label>
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
                <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Type of Residence</label>
                <div className="flex flex-wrap gap-4">
                  {['developed farm', 'rcc house', 'asbestos shelter', 'hut'].map(opt => (
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
                  <select value={editFormData.landDetails?.soil_type || 'Red'} onChange={(e) => handleEditChange('landDetails.soil_type', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white mb-2">
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                  <input type="text" value={editFormData.landDetails?.soil_type_details || ''} onChange={(e) => handleEditChange('landDetails.soil_type_details', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium" placeholder="Additional details..." />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Fencing Status</label>
                  <select value={editFormData.landDetails?.fencing_status || 'Fully Fenced'} onChange={(e) => handleEditChange('landDetails.fencing_status', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white">
                    <option value="Fully Fenced">Fully Fenced</option>
                    <option value="Partially Fenced">Partially Fenced</option>
                    <option value="Not Fenced">Not Fenced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Electricity</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="electricity_phase" checked={editFormData.landDetails?.electricity_phase === 'SINGLE' || (editFormData.landDetails?.electricity || []).some(e => e?.toLowerCase?.().includes('single'))} onChange={() => { handleEditChange('landDetails.electricity_phase', 'SINGLE'); handleEditChange('landDetails.electricity', ['single phase']); }} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">SINGLE</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="electricity_phase" checked={editFormData.landDetails?.electricity_phase === 'THREE' || (editFormData.landDetails?.electricity || []).some(e => e?.toLowerCase?.().includes('three'))} onChange={() => { handleEditChange('landDetails.electricity_phase', 'THREE'); handleEditChange('landDetails.electricity', ['three phase']); }} className="peer appearance-none w-4 h-4 border-2 border-orange-400 rounded-full checked:border-orange-500 transition-all cursor-pointer" />
                        <div className="absolute w-2 h-2 bg-orange-500 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">THREE</span>
                    </label>
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
                  {[...new Set(editFormData.landDetails?.water_source || [])].filter(opt => opt !== 'not available').map(opt => {
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                  const validMedia = (editFormData.media || []).filter(m => m.category && m.category.toLowerCase() !== 'default');
                  const mediaItem = validMedia[i - 1];
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
                {['PASSBOOK', 'AADHAR CARD', 'PREVIOUS TITLE DEEDS'].map((docType) => {
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

            <FormCard title="10. SALE STATUS" icon={CheckCircle} colorTheme="green">
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Status</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['TOKEN RECEIVED', 'AVAILABLE FOR SALE', 'AGREEMENT Made', 'NOT AVAILABLE', 'SOLD'].map(opt => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={(editFormData.land_sale_available_status || []).includes(opt)}
                            onChange={(e) => handleArrayChange('land_sale_available_status', opt, e.target.checked)}
                            className="peer appearance-none w-4 h-4 border-2 border-green-400 rounded-sm checked:bg-white checked:border-green-500 transition-all cursor-pointer"
                          />
                          <div className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-green-500">
                            <CheckCircle size={14} className="stroke-[3]" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </FormCard>

            <FormCard title="11. MORTGAGE STATUS" icon={Building2} colorTheme="blue">
              <div className="space-y-4">
                <div>
                  <select value={editFormData.mortage_availability_status || 'AVAILABLE FOR MORTGAGE'} onChange={(e) => handleEditChange('mortage_availability_status', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-[11px] outline-none focus:border-blue-400 font-bold bg-white">
                    <option value="AVAILABLE FOR MORTGAGE">AVAILABLE FOR MORTGAGE</option>
                    <option value="CURRENTLY MORTGAGED">CURRENTLY MORTGAGED</option>
                    <option value="NOT AVAILABLE">NOT AVAILABLE</option>
                  </select>
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
                  className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${activeTab === tab
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
                  <div><strong>Path Ownership:</strong> {selectedLand.landDetails.path_ownership || 'N/A'}</div>
                  <div><strong>Soil Type:</strong> {selectedLand.landDetails.soil_type || 'N/A'} {selectedLand.landDetails.soil_type_details ? `(${selectedLand.landDetails.soil_type_details})` : ''}</div>
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
    { key: 'phone', label: '1. Physical Verification' },
    { key: 'verify', label: '2. Verify' },
    { key: 'physical', label: '3. Physical Audit' },
    { key: 'review', label: '4. Review' },
  ];

  return (
    <div style={{ width: '100%' }}>


      {/* Content */}
      {isEditing ? renderInlineEditForm() : (
        /* Table (Physical Verification) */
        <div style={styles.tableContainer}>
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
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    <th style={styles.th}>Farmer</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Unit Profile</th>
                    <th style={styles.th}>Assigned Executive</th>
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
                          <div style={styles.farmerCell}>
                            <div style={styles.avatar(avatarColor)}>
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
                        <td style={styles.td}>
                          <div style={styles.executiveName}>
                            {land.assigned_executive || land.employeeName || 'UNASSIGNED'}
                          </div>
                        </td>

                        {/* Management */}
                        <td style={{ ...styles.td, textAlign: 'right' }}>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
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

export default LandPhysicalVerificationDashboard;


