import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, Search, Filter, Download, Upload as UploadIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { BASE_URL } from '../../url/BaseUrl';
const API_BASE = `${BASE_URL}/api`;
const ITEMS_PER_PAGE = 10;

export default function EmployeeManagementAdvanced() {
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [view, setView] = useState('list');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    other_phone: '',
    role: 'FIELD_AGENT',
    secondary_role: {},
    blood_group: 'O+',
    about: '',
    address: '',
    shirt_size: 'M',
    aadhar_number: '',
    aadhar_photo: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    phone_pe_number: '',
    google_pay_number: '',
    upi_id: '',
    work_state: '',
    work_state_id: '',
    work_district: [],
    work_district_id: '',
    work_mandal: [],
    work_mandal_id: '',
    work_village: [],
    work_village_id: '',
    new_land_price: 250,
    verification_price: 40,
    buyer_visit_price: 100,
    referal_price: 50,
    status: 'ACTIVE',
  });

  const [locationFilters, setLocationFilters] = useState({
    selectedState: '',
    selectedStateObj: null,
    selectedDistrict: '',
    selectedDistrictObj: null,
    selectedMandal: '',
    selectedMadalObj: null,
    selectedVillage: '',
    districts: [],
    mandals: [],
    villages: [],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
    fetchLocations();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/employee/all`);
      const data = await response.json();
      setEmployees(data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE}/location`);
      const data = await response.json();
      // Handle nested structure
      setLocations(data.data || []);
    } catch (err) {
      console.error('Failed to fetch locations', err);
      setError('Failed to load location data');
    }
  };

  const handleStateChange = (stateId) => {
    // Find the selected state object
    const selectedStateObj = locations.find(state => state.id === parseInt(stateId));
    
    setLocationFilters(prev => ({
      ...prev,
      selectedState: stateId,
      selectedStateObj: selectedStateObj,
      selectedDistrict: '',
      selectedDistrictObj: null,
      selectedMandal: '',
      selectedMadalObj: null,
      selectedVillage: '',
      districts: selectedStateObj?.districts || [],
      mandals: [],
      villages: [],
    }));

    setFormData(prev => ({
      ...prev,
      work_state: selectedStateObj?.name || '',
      work_state_id: stateId,
      work_district: [],
      work_district_id: '',
      work_mandal: [],
      work_mandal_id: '',
      work_village: [],
      work_village_id: '',
    }));
  };

  const handleDistrictChange = (districtId) => {
    if (!locationFilters.selectedStateObj) return;
    
    // Find district in the nested structure
    const selectedDistrictObj = locationFilters.selectedStateObj.districts?.find(
      d => d.id === parseInt(districtId)
    );

    setLocationFilters(prev => ({
      ...prev,
      selectedDistrict: districtId,
      selectedDistrictObj: selectedDistrictObj,
      selectedMandal: '',
      selectedMadalObj: null,
      selectedVillage: '',
      mandals: selectedDistrictObj?.mandals || [],
      villages: [],
    }));

    setFormData(prev => ({
      ...prev,
      work_district: selectedDistrictObj?.name ? [selectedDistrictObj.name] : [],
      work_district_id: districtId,
      work_mandal: [],
      work_mandal_id: '',
      work_village: [],
      work_village_id: '',
    }));
  };

  const handleMandalChange = (mandalId) => {
    if (!locationFilters.selectedDistrictObj) return;

    // Find mandal in the nested structure
    const selectedMadalObj = locationFilters.selectedDistrictObj.mandals?.find(
      m => m.id === parseInt(mandalId)
    );

    setLocationFilters(prev => ({
      ...prev,
      selectedMandal: mandalId,
      selectedMadalObj: selectedMadalObj,
      selectedVillage: '',
      villages: selectedMadalObj?.villages || [],
    }));

    setFormData(prev => ({
      ...prev,
      work_mandal: selectedMadalObj?.name ? [selectedMadalObj.name] : [],
      work_mandal_id: mandalId,
      work_village: [],
      work_village_id: '',
    }));
  };

  const handleVillageChange = (villageId) => {
    if (!locationFilters.selectedMadalObj) return;

    // Find village in the nested structure
    const selectedVillageObj = locationFilters.selectedMadalObj.villages?.find(
      v => v.id === parseInt(villageId)
    );

    setLocationFilters(prev => ({
      ...prev,
      selectedVillage: villageId,
    }));

    setFormData(prev => ({
      ...prev,
      work_village: selectedVillageObj?.name ? [selectedVillageObj.name] : [],
      work_village_id: villageId,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('photo', file);

    try {
      const response = await fetch(`${API_BASE}/upload-files`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        aadhar_photo: data.photoUrl || '',
      }));
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        // Remove IDs, keep only names
        work_state: formData.work_state,
        work_district: formData.work_district,
        work_mandal: formData.work_mandal,
        work_village: formData.work_village,
      };

      const response = await fetch(`${API_BASE}/employee/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Employee created successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchEmployees();
        resetForm();
        setView('list');
      } else {
        setError(data.message || 'Failed to create employee');
      }
    } catch (err) {
      setError('Failed to create employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        work_state: formData.work_state,
        work_district: formData.work_district,
        work_mandal: formData.work_mandal,
        work_village: formData.work_village,
      };

      const response = await fetch(`${API_BASE}/employee/update/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Employee updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchEmployees();
        resetForm();
        setView('list');
      } else {
        setError(data.message || 'Failed to update employee');
      }
    } catch (err) {
      setError('Failed to update employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/employee/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Employee deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchEmployees();
        setSelectedEmployees(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.size === 0) {
      setError('No employees selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedEmployees.size} employees?`)) return;

    setLoading(true);
    let deleted = 0;
    let failed = 0;

    for (const id of selectedEmployees) {
      try {
        const response = await fetch(`${API_BASE}/employee/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) deleted++;
        else failed++;
      } catch (err) {
        failed++;
      }
    }

    setSuccess(`Deleted ${deleted} employees${failed > 0 ? `, ${failed} failed` : ''}`);
    setTimeout(() => setSuccess(''), 3000);
    fetchEmployees();
    setSelectedEmployees(new Set());
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) {
      setError('No employees to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'State', 'Work Location'];
    const rows = filteredEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.phone,
      emp.role,
      emp.status,
      emp.work_state || '',
      `${emp.work_district?.join(', ') || ''} - ${emp.work_mandal?.join(', ') || ''}`,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setSuccess('Exported successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      other_phone: '',
      role: 'FIELD_AGENT',
      secondary_role: {},
      blood_group: 'O+',
      about: '',
      address: '',
      shirt_size: 'M',
      aadhar_number: '',
      aadhar_photo: '',
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      phone_pe_number: '',
      google_pay_number: '',
      upi_id: '',
      work_state: '',
      work_state_id: '',
      work_district: [],
      work_district_id: '',
      work_mandal: [],
      work_mandal_id: '',
      work_village: [],
      work_village_id: '',
      new_land_price: 250,
      verification_price: 40,
      buyer_visit_price: 100,
      referal_price: 50,
      status: 'ACTIVE',
    });
    setLocationFilters({
      selectedState: '',
      selectedStateObj: null,
      selectedDistrict: '',
      selectedDistrictObj: null,
      selectedMandal: '',
      selectedMadalObj: null,
      selectedVillage: '',
      districts: [],
      mandals: [],
      villages: [],
    });
    setSelectedEmployee(null);
  };

  const openEditForm = (employee) => {
    setSelectedEmployee(employee);
    
    // Populate form with employee data
    const editFormData = { ...employee };
    setFormData(editFormData);
    
    // Set location filters based on employee data
    // Find and set state
    if (employee.work_state) {
      const stateObj = locations.find(state => state.name === employee.work_state);
      if (stateObj) {
        setLocationFilters(prev => ({
          ...prev,
          selectedState: stateObj.id,
          selectedStateObj: stateObj,
          districts: stateObj.districts || [],
        }));
      }
    }
    
    setView('edit');
  };

  const openDetailView = (employee) => {
    setSelectedEmployee(employee);
    setView('detail');
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || emp.role === filterRole;
    const matchStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.size === paginatedEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(paginatedEmployees.map(emp => emp.id)));
    }
  };

  // Render List View
  const renderListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Employees</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredEmployees.length === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
            title="Export to CSV"
          >
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setView('create');
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="FIELD_AGENT">Field Agent</option>
          <option value="FIELD_EXECUTIVE">Field Executive</option>
          <option value="MANAGER">Manager</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DEACTIVE">Inactive</option>
        </select>
      </div>

      {selectedEmployees.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-blue-900 font-semibold">
            {selectedEmployees.size} employee{selectedEmployees.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Delete Selected
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>
            <X size={18} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : paginatedEmployees.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No employees found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.size === paginatedEmployees.length && paginatedEmployees.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map(employee => (
                  <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.has(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{employee.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{employee.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{employee.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        employee.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openDetailView(employee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditForm(employee)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render Form View
  const renderFormView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            resetForm();
            setView('list');
          }}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-gray-900">
          {view === 'create' ? 'Create New Employee' : 'Edit Employee'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}>
            <X size={18} />
          </button>
        </div>
      )}

      <form
        onSubmit={view === 'create' ? handleCreateEmployee : handleUpdateEmployee}
        className="space-y-6"
      >
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>
            {view === 'create' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10-digit phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Other Phone</label>
              <input
                type="tel"
                name="other_phone"
                value={formData.other_phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alternative phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shirt Size</label>
              <select
                name="shirt_size"
                value={formData.shirt_size}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
              />
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Role & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>FIELD_AGENT</option>
                <option>FIELD_EXECUTIVE</option>
                <option>MANAGER</option>
                <option>SUPERVISOR</option>
                <option>ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>ACTIVE</option>
                <option>DEACTIVE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Location */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Work Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <select
                value={locationFilters.selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {locations.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
              <select
                value={locationFilters.selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!locationFilters.selectedState || locationFilters.districts.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select District</option>
                {locationFilters.districts.map(district => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mandal</label>
              <select
                value={locationFilters.selectedMandal}
                onChange={(e) => handleMandalChange(e.target.value)}
                disabled={!locationFilters.selectedDistrict || locationFilters.mandals.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Mandal</option>
                {locationFilters.mandals.map(mandal => (
                  <option key={mandal.id} value={mandal.id}>{mandal.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Village</label>
              <select
                value={locationFilters.selectedVillage}
                onChange={(e) => handleVillageChange(e.target.value)}
                disabled={!locationFilters.selectedMandal || locationFilters.villages.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Village</option>
                {locationFilters.villages.map(village => (
                  <option key={village.id} value={village.id}>{village.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Bank & Payment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SBI"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
              <input
                type="text"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SBIN0001234"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
              <input
                type="text"
                name="upi_id"
                value={formData.upi_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., user@upi"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PhonePe Number</label>
              <input
                type="tel"
                name="phone_pe_number"
                value={formData.phone_pe_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Pay Number</label>
              <input
                type="tel"
                name="google_pay_number"
                value={formData.google_pay_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        {/* Aadhar Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aadhar Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12-digit Aadhar number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Photo</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="aadhar-upload"
                />
                <label
                  htmlFor="aadhar-upload"
                  className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50"
                >
                  <Upload size={18} />
                  <span className="text-sm font-semibold text-gray-700">
                    {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                  </span>
                </label>
              </div>
              {formData.aadhar_photo && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  ✓ Photo uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Salary Package */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Salary Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Land Price</label>
              <input
                type="number"
                name="new_land_price"
                value={formData.new_land_price}
                onChange={handleNumericChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Price</label>
              <input
                type="number"
                name="verification_price"
                value={formData.verification_price}
                onChange={handleNumericChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="40"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buyer Visit Price</label>
              <input
                type="number"
                name="buyer_visit_price"
                value={formData.buyer_visit_price}
                onChange={handleNumericChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Referral Price</label>
              <input
                type="number"
                name="referal_price"
                value={formData.referal_price}
                onChange={handleNumericChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 sticky bottom-0 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setView('list');
            }}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Processing...' : view === 'create' ? 'Create Employee' : 'Update Employee'}
          </button>
        </div>
      </form>
    </div>
  );

  // Render Detail View
  const renderDetailView = () => (
    <div className="space-y-6">
      <button
        onClick={() => {
          setSelectedEmployee(null);
          setView('list');
        }}
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedEmployee?.name}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Email</p>
                <p className="text-gray-900">{selectedEmployee?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Phone</p>
                <p className="text-gray-900">{selectedEmployee?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Alternative Phone</p>
                <p className="text-gray-900">{selectedEmployee?.other_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Role</p>
                <p className="text-gray-900">{selectedEmployee?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedEmployee?.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedEmployee?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Work Location</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-700">State:</span> {selectedEmployee?.work_state || 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">District:</span> {selectedEmployee?.work_district?.join(', ') || 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">Mandal:</span> {selectedEmployee?.work_mandal?.join(', ') || 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">Village:</span> {selectedEmployee?.work_village?.join(', ') || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Package</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-600">New Land</p>
                  <p className="text-lg font-bold text-gray-900">₹{selectedEmployee?.new_land_price || 0}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-600">Verification</p>
                  <p className="text-lg font-bold text-gray-900">₹{selectedEmployee?.verification_price || 0}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-600">Buyer Visit</p>
                  <p className="text-lg font-bold text-gray-900">₹{selectedEmployee?.buyer_visit_price || 0}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-600">Referral</p>
                  <p className="text-lg font-bold text-gray-900">₹{selectedEmployee?.referal_price || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Blood Group</p>
              <p className="text-gray-900">{selectedEmployee?.blood_group || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Shirt Size</p>
              <p className="text-gray-900">{selectedEmployee?.shirt_size || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Address</p>
              <p className="text-gray-900">{selectedEmployee?.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Aadhar Number</p>
              <p className="text-gray-900">{selectedEmployee?.aadhar_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Bank Name</p>
              <p className="text-gray-900">{selectedEmployee?.bank_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Account Number</p>
              <p className="text-gray-900">{selectedEmployee?.account_number || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => openEditForm(selectedEmployee)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Edit2 size={18} />
            Edit Employee
          </button>
          <button
            onClick={() => {
              handleDeleteEmployee(selectedEmployee.id);
              setView('list');
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {view === 'list' && renderListView()}
        {(view === 'create' || view === 'edit') && renderFormView()}
        {view === 'detail' && renderDetailView()}
      </div>
    </div>
  );
}