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
  Zap
} from 'lucide-react';
import { BASE_URL } from '../../url/BaseUrl';
import { fixUrl, IMAGE_NOT_FOUND_PLACEHOLDER } from '../../utils/fixUrl';

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
  'Cousins Issue (of uncles family)',
  'Boundary',
  'Rocks In Land',
  'Electric Poles',
  'Sealing',
  'path issue',
  'No Path at all'
];
const MEDIA_CATEGORIES = ['farmer_photo', 'land_soil', 'fencing', 'farm_pond', 'residence', 'shed', 'water_source', 'trees', 'rocks', 'electric_poles', 'farmer_aggrement', 'others', 'video'];
const DOC_TYPES = ['PASSBOOK', 'AADHAR', 'TITLE_DEED'];

// Status badge component
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

// Main Component
const LandFinalVerificationDashboard = () => {
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
  const [previewMedia, setPreviewMedia] = useState(null);

  // Fetch lands based on status filter
  const fetchLands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/pending-final-verification/${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch lands');
      const result = await response.json();
      
      let landsData = result.data || result;
      if (!Array.isArray(landsData)) landsData = [landsData];
      
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

  // Update land data
  const updateLand = async (id, data) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/land/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update land');
      const result = await response.json();
      
      await fetchLands();
      
      if (selectedLand?.id === id) {
        const updatedLand = lands.find(l => l.id === id);
        if (updatedLand) setSelectedLand(updatedLand);
      }
      
      setIsEditing(false);
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
      const newData = { ...prev };
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
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = [];
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      const currentArray = current[lastKey] || [];
      
      if (checked) {
        current[lastKey] = [...currentArray, value];
      } else {
        current[lastKey] = currentArray.filter(item => item !== value);
      }
      
      return newData;
    });
  };

  // Initialize edit form when editing starts
  const startEditing = (land) => {
    const clonedData = JSON.parse(JSON.stringify(land));
    setEditFormData(clonedData);
    setIsEditing(true);
    setEditTab('basic');
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
                      className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setPreviewMedia(item)}
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

  // Render edit form with multiple tabs
  const renderEditForm = () => {
    if (!selectedLand || !isEditing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold">Edit Land #{selectedLand.id}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={() => updateLand(selectedLand.id, editFormData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                disabled={updating}
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b px-4 bg-gray-50">
            <div className="flex gap-4 overflow-x-auto">
              {['basic', 'farmer', 'land', 'status', 'media', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setEditTab(tab)}
                  className={`px-4 py-3 font-medium capitalize whitespace-nowrap border-b-2 ${
                    editTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : 
                   tab === 'farmer' ? 'Farmer Details' :
                   tab === 'land' ? 'Land Details' :
                   tab === 'status' ? 'Status & Options' :
                   tab === 'media' ? 'Media Gallery' : 'Documents'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* BASIC INFO TAB */}
            {editTab === 'basic' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Location Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        value={editFormData.state || ''}
                        onChange={(e) => handleEditChange('state', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">District</label>
                      <input
                        type="text"
                        value={editFormData.district || ''}
                        onChange={(e) => handleEditChange('district', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mandal</label>
                      <input
                        type="text"
                        value={editFormData.mandal || ''}
                        onChange={(e) => handleEditChange('mandal', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Village</label>
                      <input
                        type="text"
                        value={editFormData.village || ''}
                        onChange={(e) => handleEditChange('village', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location Latitude</label>
                      <input
                        type="text"
                        value={editFormData.location_latitude || ''}
                        onChange={(e) => handleEditChange('location_latitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location Longitude</label>
                      <input
                        type="text"
                        value={editFormData.location_longitude || ''}
                        onChange={(e) => handleEditChange('location_longitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Verification Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Verification Status</label>
                      <select
                        value={editFormData.verification_status || 'draft'}
                        onChange={(e) => handleEditChange('verification_status', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="draft">Draft</option>
                        <option value="complete">Complete</option>
                        <option value="review">Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Physical Verification Status</label>
                      <select
                        value={editFormData.physcial_verification_status || 'pending'}
                        onChange={(e) => handleEditChange('physcial_verification_status', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Verification Status</label>
                      <select
                        value={editFormData.verification_status || 'pending'}
                        onChange={(e) => handleEditChange('verification_status', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Availability</label>
                      <select
                        value={editFormData.availablity || 'available'}
                        onChange={(e) => handleEditChange('availablity', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">GPS Coordinates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">GPS Latitude</label>
                      <input
                        type="text"
                        value={editFormData.gps?.latitude || ''}
                        onChange={(e) => handleEditChange('gps.latitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">GPS Longitude</label>
                      <input
                        type="text"
                        value={editFormData.gps?.longitude || ''}
                        onChange={(e) => handleEditChange('gps.longitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FARMER DETAILS TAB */}
            {editTab === 'farmer' && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Farmer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={editFormData.farmerDetails?.name || ''}
                      onChange={(e) => handleEditChange('farmerDetails.name', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={editFormData.farmerDetails?.phone || ''}
                      onChange={(e) => handleEditChange('farmerDetails.phone', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={editFormData.farmerDetails?.whatsapp || ''}
                      onChange={(e) => handleEditChange('farmerDetails.whatsapp', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ownership Type</label>
                    <select
                      value={editFormData.farmerDetails?.ownership_type || 'Ancestral'}
                      onChange={(e) => handleEditChange('farmerDetails.ownership_type', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {OWNERSHIP_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Locality</label>
                    <select
                      value={editFormData.farmerDetails?.locality || 'Local'}
                      onChange={(e) => handleEditChange('farmerDetails.locality', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {LOCALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ownership Status</label>
                    <select
                      value={editFormData.farmerDetails?.ownership_status || 'Own'}
                      onChange={(e) => handleEditChange('farmerDetails.ownership_status', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {OWNERSHIP_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <select
                      value={editFormData.farmerDetails?.age || 'Upto 30'}
                      onChange={(e) => handleEditChange('farmerDetails.age', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Literacy</label>
                    <select
                      value={editFormData.farmerDetails?.literacy || 'Illiterate'}
                      onChange={(e) => handleEditChange('farmerDetails.literacy', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {LITERACY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nature</label>
                    <select
                      value={editFormData.farmerDetails?.nature || 'Calm'}
                      onChange={(e) => handleEditChange('farmerDetails.nature', e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      {NATURE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* LAND DETAILS TAB */}
            {editTab === 'land' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Land Area & Value</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Acres</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.total_acres || 0}
                        onChange={(e) => handleEditChange('landDetails.total_acres', parseFloat(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Guntas</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.guntas || 0}
                        onChange={(e) => handleEditChange('landDetails.guntas', parseFloat(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price per Acre (₹)</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.price_per_acres || 0}
                        onChange={(e) => handleEditChange('landDetails.price_per_acres', parseFloat(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Value (₹)</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.total_value || 0}
                        onChange={(e) => handleEditChange('landDetails.total_value', parseFloat(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Land Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nearest Road Type</label>
                      <select
                        value={editFormData.landDetails?.nearest_road_type || ''}
                        onChange={(e) => handleEditChange('landDetails.nearest_road_type', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="">Select</option>
                        {['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'GRAVEL ROAD'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Land Attached to Road</label>
                      <select
                        value={editFormData.landDetails?.land_attached_to_road || 'yes'}
                        onChange={(e) => handleEditChange('landDetails.land_attached_to_road', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Path Ownership</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.path_ownership || ''}
                        onChange={(e) => handleEditChange('landDetails.path_ownership', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Soil Type</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.soil_type || ''}
                        onChange={(e) => handleEditChange('landDetails.soil_type', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fencing Status</label>
                      <select
                        value={editFormData.landDetails?.fencing_status || 'Fully Fenced'}
                        onChange={(e) => handleEditChange('landDetails.fencing_status', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="Fully Fenced">Fully Fenced</option>
                        <option value="Partially Fenced">Partially Fenced</option>
                        <option value="Not Fenced">Not Fenced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Bores</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.number_of_bores || 0}
                        onChange={(e) => handleEditChange('landDetails.number_of_bores', parseInt(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Poultry Sheds</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.poultry_shed_number || 0}
                        onChange={(e) => handleEditChange('landDetails.poultry_shed_number', parseInt(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Number of Cow Sheds</label>
                      <input
                        type="number"
                        value={editFormData.landDetails?.cow_shed_number || 0}
                        onChange={(e) => handleEditChange('landDetails.cow_shed_number', parseInt(e.target.value))}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Boundary Coordinates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Land Entry Latitude</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.land_entry_latitude || ''}
                        onChange={(e) => handleEditChange('landDetails.land_entry_latitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Land Entry Longitude</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.land_entry_longitude || ''}
                        onChange={(e) => handleEditChange('landDetails.land_entry_longitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Land Boundary Latitude</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.land_boundary_latitude || ''}
                        onChange={(e) => handleEditChange('landDetails.land_boundary_latitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Land Boundary Longitude</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.land_boundary_longitude || ''}
                        onChange={(e) => handleEditChange('landDetails.land_boundary_longitude', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Electricity & Water</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Electricity Available</label>
                      <div className="flex flex-wrap gap-3">
                        {ELECTRICITY_OPTIONS.map(opt => (
                          <label key={opt} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={(editFormData.landDetails?.electricity || []).includes(opt)}
                              onChange={(e) => handleArrayChange('landDetails.electricity', opt, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Water Source</label>
                      <div className="flex flex-wrap gap-3">
                        {WATER_SOURCE_OPTIONS.map(opt => (
                          <label key={opt} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={(editFormData.landDetails?.water_source || []).includes(opt)}
                              onChange={(e) => handleArrayChange('landDetails.water_source', opt, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Residence Type</label>
                      <div className="flex flex-wrap gap-3">
                        {RESIDENCE_OPTIONS.map(opt => (
                          <label key={opt} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={(editFormData.landDetails?.residence || []).includes(opt)}
                              onChange={(e) => handleArrayChange('landDetails.residence', opt, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.landDetails?.farm_pond || false}
                        onChange={(e) => handleEditChange('landDetails.farm_pond', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <label className="ml-2 text-sm text-gray-700">Farm Pond Available</label>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Trees Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Mango Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.mango_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.mango_trees_number', e.target.value)}
                        placeholder="e.g., mango-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coconut Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.coconut_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.coconut_trees_number', e.target.value)}
                        placeholder="e.g., coconut-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Neem Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.neem_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.neem_trees_number', e.target.value)}
                        placeholder="e.g., neem-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Banyan Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.baniyan_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.baniyan_trees_number', e.target.value)}
                        placeholder="e.g., baniyan-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tamarind Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.tamarind_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.tamarind_trees_number', e.target.value)}
                        placeholder="e.g., tamarind-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sapota Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.sapoto_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.sapoto_trees_number', e.target.value)}
                        placeholder="e.g., sapoto-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Guava Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.guava_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.guava_trees_number', e.target.value)}
                        placeholder="e.g., guava-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teak Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.teak_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.teak_trees_number', e.target.value)}
                        placeholder="e.g., teak-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Other Trees</label>
                      <input
                        type="text"
                        value={editFormData.landDetails?.other_trees_number || ''}
                        onChange={(e) => handleEditChange('landDetails.other_trees_number', e.target.value)}
                        placeholder="e.g., banana-10"
                        className="w-full border rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Complaints/Issues</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {COMPLAINT_OPTIONS.map(opt => (
                      <label key={opt} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={(editFormData.landDetails?.complaints || []).includes(opt)}
                          onChange={(e) => handleArrayChange('landDetails.complaints', opt, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STATUS & OPTIONS TAB */}
            {editTab === 'status' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Land Sale Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {LAND_SALE_STATUS_OPTIONS.map(status => (
                      <label key={status} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={status}
                          checked={(editFormData.land_sale_available_status || []).includes(status)}
                          onChange={(e) => handleArrayChange('land_sale_available_status', status, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Mortgage Availability Status</h3>
                  <div className="flex flex-wrap gap-3">
                    {MORTGAGE_STATUS_OPTIONS.map(status => (
                      <label key={status} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={status}
                          checked={(editFormData.mortage_availability_status || []).includes(status)}
                          onChange={(e) => handleArrayChange('mortage_availability_status', status, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Urgency Listing</h3>
                  <div className="flex flex-wrap gap-3">
                    {URGENCY_OPTIONS.map(urgency => (
                      <label key={urgency} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={urgency}
                          checked={(editFormData.urgency_listing || []).includes(urgency)}
                          onChange={(e) => handleArrayChange('urgency_listing', urgency, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{urgency}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Options</h3>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.verification_package || false}
                        onChange={(e) => handleEditChange('verification_package', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Verification Package</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* MEDIA TAB */}
            {editTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Media (Photos & Videos)</h3>
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <select
                      value={selectedMediaCategory}
                      onChange={(e) => setSelectedMediaCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {MEDIA_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.replace(/_/g, ' ').toUpperCase()}</option>
                      ))}
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
                    {(editFormData.media || []).map((item, idx) => (
                      <div key={idx} className="relative border rounded-lg p-2 bg-gray-50">
                        {item.type === 'image' ? (
                          <img 
                            src={fixUrl(item.url)} 
                            alt={item.category} 
                            className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewMedia(item)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = IMAGE_NOT_FOUND_PLACEHOLDER;
                            }}
                          />
                        ) : (
                          <video src={fixUrl(item.url)} className="w-full h-32 object-cover rounded" controls />
                        )}
                        <p className="text-xs text-gray-600 mt-1 truncate">{item.category}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {editTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Documents</h3>
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Document Type</option>
                      {DOC_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleAddDocument}
                      disabled={uploading || !selectedDocType}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>

                  {/* Documents List */}
                  <div className="space-y-2">
                    {(editFormData.documents || []).map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-medium">{doc.doc_type}</span>
                            <a 
                              href={fixUrl(doc.file_url)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="ml-4 text-blue-600 hover:underline text-sm"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="bg-red-500 text-white rounded-md px-3 py-1 text-sm hover:bg-red-600 flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                  <div><strong>Location:</strong> {selectedLand.location_latitude}, {selectedLand.location_longitude}</div>
                  <div><strong>Verification Status:</strong> <StatusBadge status={selectedLand.verification_status} /></div>
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
                  <div><strong>Soil Type:</strong> {selectedLand.landDetails.soil_type || 'N/A'}</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Land Final Verification Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage final verification for land listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {['pending', 'complete'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by village, district, farmer name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Lands</div>
            <div className="text-2xl font-bold">{lands.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Filtered Lands</div>
            <div className="text-2xl font-bold">{filteredLands.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Current Page</div>
            <div className="text-2xl font-bold">{currentPage} / {totalPages || 1}</div>
          </div>
        </div>

        {/* Land List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : paginatedLands.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No lands found for status: {statusFilter}
              {searchTerm && ` with search term: "${searchTerm}"`}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physical Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedLands.map((land) => (
                      <tr key={land.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{land.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{land.village || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{land.mandal}, {land.district}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {land.farmerDetails?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {land.farmerDetails?.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={land.verification_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={land.physcial_verification_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedLand(land)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
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
                          className={`px-3 py-1 rounded ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedLand && !isEditing && renderDetailModal()}
      {isEditing && renderEditForm()}
    </div>
  );
};

export default LandFinalVerificationDashboard;