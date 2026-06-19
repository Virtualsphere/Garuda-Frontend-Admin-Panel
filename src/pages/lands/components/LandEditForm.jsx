// Render edit form INLINE (not modal)
  import React from 'react';
import {
  Search, ChevronLeft, ChevronRight, Eye, Edit, Save, X,
  CheckCircle, XCircle, Clock, MapPin, User, FileText,
  Image as ImageIcon, Video, Upload, Loader2, Phone,
  Building2, TreePine, Droplets, Zap, ArrowRight, Bell, Flag, ShieldCheck, Check
} from 'lucide-react';
import { FormCard } from './FormCard';
import { styles } from '../utils/styles';
import { 
  DOC_TYPES, WATER_SOURCE_TYPES, ELECTRICITY_PHASES, SOIL_TYPES, 
  COMPLAINTS_TYPES, LAND_SALE_STATUS, URGENCY_LISTING,
  OWNERSHIP_TYPE_OPTIONS, LOCALITY_OPTIONS, OWNERSHIP_STATUS_OPTIONS,
  AGE_OPTIONS, LITERACY_OPTIONS, NATURE_OPTIONS, MEDIA_CATEGORIES,
  MORTGAGE_STATUS_OPTIONS, WATER_SOURCE_OPTIONS
} from '../utils/constants';
import { getAvatarColor, formatPriceShort, formatPrice, StatusBadge } from '../utils/helpers';
import NearestTownsFields from './NearestTownsFields';

export const LandEditForm = ({
  selectedLand,
  isEditing,
  editFormData,
  setEditFormData,
  handleEditChange,
  handleArrayChange,
  handleAddMedia,
  uploading,
  handleFileUpload,
  uploadSpecificDocument,
  selectedMediaCategory,
  setSelectedMediaCategory,
  error,
  locationStates,
  locationDistricts,
  locationMandals,
  locationVillages,
  handleLocationStateChange,
  handleLocationDistrictChange,
  handleLocationMandalChange,
  editTab,
  setEditTab,
  updatingAction,
  saveLandChanges,
  cancelEditing,
  title = "TECHNICAL VERIFY WORKFLOW"
}) => {
  const fixUrl = (url) => {
    if (!url) return '';
    return url.replace('http://localhost:5173/', 'http://localhost:5000/');
  };
  const IMAGE_NOT_FOUND_PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Image+Not+Found';



    if (!selectedLand || !isEditing) return null;

    const handleSpecificDocumentUpload = async (e, type) => {
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
          <div className="land-edit-header-actions flex items-center gap-3 flex-wrap justify-center">
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
              {updatingAction === 'physical' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
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
              <div className="mt-4">
                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Address / Landmark</label>
                <input type="text" value={editFormData.address || ''} onChange={(e) => handleEditChange('address', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-red-400 font-medium" placeholder="Enter address or nearby landmark" />
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
                <input type="number" value={editFormData.landDetails?.price_per_acres || ''} onChange={(e) => handleEditChange('landDetails.price_per_acres', parseFloat(e.target.value))} className="w-full border border-gray-200 rounded-lg p-2 text-sm text-orange-500 font-bold outline-none focus:border-green-400" placeholder="e.g 5 for 5 lakhs" />
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
                      <div className="flex gap-2 items-center flex-wrap mt-2">
                        <input type="number" min="1" value={editFormData.landDetails?.poultry_shed_number || ''} onChange={(e) => handleEditChange('landDetails.poultry_shed_number', parseInt(e.target.value) || 0)} className="w-24 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400 font-bold" placeholder="No. sheds" />
                        <div className="flex gap-2 items-center">
                          <input type="number" value={editFormData.landDetails?.poultry_shed_length || ''} onChange={(e) => handleEditChange('landDetails.poultry_shed_length', e.target.value)} className="w-16 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400" placeholder="Length" />
                          <span className="text-xs text-gray-500">x</span>
                          <input type="number" value={editFormData.landDetails?.poultry_shed_width || ''} onChange={(e) => handleEditChange('landDetails.poultry_shed_width', e.target.value)} className="w-16 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400" placeholder="Width" />
                          <span className="text-xs text-gray-500">ft</span>
                        </div>
                      </div>
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
                      <div className="flex gap-2 items-center flex-wrap mt-2">
                        <input type="number" min="1" value={editFormData.landDetails?.cow_shed_number || ''} onChange={(e) => handleEditChange('landDetails.cow_shed_number', parseInt(e.target.value) || 0)} className="w-24 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400 font-bold" placeholder="No. sheds" />
                        <div className="flex gap-2 items-center">
                          <input type="number" value={editFormData.landDetails?.cow_shed_length || ''} onChange={(e) => handleEditChange('landDetails.cow_shed_length', e.target.value)} className="w-16 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400" placeholder="Length" />
                          <span className="text-xs text-gray-500">x</span>
                          <input type="number" value={editFormData.landDetails?.cow_shed_width || ''} onChange={(e) => handleEditChange('landDetails.cow_shed_width', e.target.value)} className="w-16 border border-gray-200 rounded-lg p-1.5 text-xs outline-none focus:border-green-400" placeholder="Width" />
                          <span className="text-xs text-gray-500">ft</span>
                        </div>
                      </div>
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
                    <option value="Clay Soil">Clay Soil</option>
                    <option value="Loamy Soil">Loamy Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-1 tracking-wider">Fencing Status</label>
                  <select value={editFormData.landDetails?.fencing_status || ''} onChange={(e) => handleEditChange('landDetails.fencing_status', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-green-400 font-medium bg-white">
                    <option value="">Select</option>
                    <option value="Fully Fenced">Fully Fenced</option>
                    <option value="Partially Fenced">Partially Fenced</option>
                    <option value="Not Fenced">Not Fenced</option>
                    <option value="All side with gates">All side with gates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-green-700 uppercase mb-2 tracking-wider">Electricity</label>
                  <div className="flex gap-4">
                    {['single phase', 'three phase'].map(opt => (
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
                          <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleSpecificDocumentUpload(e, docType)} disabled={uploading} />
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
                        name="available_for_sale"
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
                        name="available_for_sale"
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
                      onChange={(e) => handleArrayChange('mortage_availability_status', 'CURRENTLY MORTGAGED', e.target.checked)} 
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
                          name="available_for_mortgage"
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
                          name="available_for_mortgage"
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

