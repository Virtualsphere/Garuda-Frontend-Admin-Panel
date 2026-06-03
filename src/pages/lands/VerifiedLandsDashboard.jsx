import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Loader2,
  ShieldCheck,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Upload,
  Building2,
  TreePine,
  Droplets,
  Zap,
  ArrowRight,
  Save,
  X,
} from "lucide-react";
import { BASE_URL } from "../../url/BaseUrl";
import { FormCard } from "./components/FormCard";
import { LandEditForm } from "./components/LandEditForm";
import { styles } from "./utils/styles";
import {
  AVATAR_COLORS,
  getAvatarColor,
  formatPriceShort,
  formatPrice,
} from "./utils/helpers";
import { StatusBadge } from "./components/StatusBadge";
import {
  DOC_TYPES,
  WATER_SOURCE_OPTIONS,
  ELECTRICITY_OPTIONS,
  SOIL_TYPES,
  COMPLAINT_OPTIONS,
  LAND_SALE_STATUS_OPTIONS,
  URGENCY_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  LOCALITY_OPTIONS,
  OWNERSHIP_STATUS_OPTIONS,
  AGE_OPTIONS,
  LITERACY_OPTIONS,
  NATURE_OPTIONS,
  MEDIA_CATEGORIES,
  MORTGAGE_STATUS_OPTIONS,
} from "./utils/constants";
import { fixUrl } from "../../utils/fixUrl";

const API_BASE_URL = `${BASE_URL}/api`;

// Avatar colors for farmer initials
const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6d28d9",
  "#be185d",
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
  if (!price) return "₹0";
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}K`;
  return `₹${price}`;
};

// Format price helper
const formatPrice = (price) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Status badge component
const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIcon = () => {
    if (status === "complete") return <CheckCircle className="w-3 h-3 mr-1" />;
    if (status === "rejected") return <XCircle className="w-3 h-3 mr-1" />;
    return <Clock className="w-3 h-3 mr-1" />;
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStyles()}`}
    >
      {getIcon()}
      {status || "pending"}
    </span>
  );
};

// ============================================
// INLINE STYLES (matching phone verification)
// ============================================
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8f9fb",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "28px 32px 0",
  },
  headerLeft: {},
  headerTitle: {
    fontSize: "24px",
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginTop: "4px",
  },
  searchContainer: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    padding: "10px 16px 10px 40px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#334155",
    background: "#ffffff",
    width: "320px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  tableContainer: {
    margin: "24px 32px 32px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  th: {
    padding: "14px 20px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#64748b",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  tr: (isHovered) => ({
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.15s ease",
    background: isHovered ? "#fafbfe" : "transparent",
    cursor: "pointer",
  }),
  td: {
    padding: "16px 20px",
    verticalAlign: "middle",
  },
  farmerCell: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: "200px",
  },
  avatar: (bgColor) => ({
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    flexShrink: 0,
    boxShadow: `0 2px 8px ${bgColor}40`,
  }),
  farmerInfo: {},
  farmerName: {
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#1e40af",
    lineHeight: 1.3,
    cursor: "pointer",
  },
  farmerId: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#f97316",
    marginTop: "1px",
  },
  farmerPhone: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  addressMain: {
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#1e293b",
    lineHeight: 1.4,
  },
  addressSub: {
    fontSize: "11.5px",
    color: "#94a3b8",
    fontWeight: 500,
    marginTop: "2px",
  },
  unitProfile: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    whiteSpace: "nowrap",
  },
  executiveName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  verifiedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 16px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.35)",
    whiteSpace: "nowrap",
    fontFamily: "'Inter', sans-serif",
  },
  viewBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 16px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    border: "none",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.35)",
    whiteSpace: "nowrap",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s ease",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: 500,
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #f1f5f9",
  },
  pageBtn: (disabled) => ({
    padding: "6px",
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  }),
  pageNum: (isActive) => ({
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: isActive ? 700 : 500,
    color: isActive ? "#fff" : "#475569",
    background: isActive ? "#22c55e" : "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  }),
  // Stats bar
  statsBar: {
    display: "flex",
    gap: "16px",
    margin: "20px 32px 0",
  },
  statCard: {
    flex: 1,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statIcon: (color) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  }),
  statValue: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "2px",
  },
};

useEffect(() => {
  fetchVerifiedLands();
}, []);

// Fetch all location states on mount
useEffect(() => {
  const fetchLocationStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/location`);
      if (response.data.success) {
        setLocationStates(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching location states:", err);
    }
  };
  fetchLocationStates();
}, []);

// Location cascading handlers
const handleLocationStateChange = async (stateName) => {
  handleEditChange("state", stateName);
  handleEditChange("district", "");
  handleEditChange("mandal", "");
  handleEditChange("village", "");
  setLocationDistricts([]);
  setLocationMandals([]);
  setLocationVillages([]);

  const selectedState = locationStates.find((s) => s.name === stateName);
  if (selectedState?.id) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/location/districts/${selectedState.id}`,
      );
      if (response.data.success) {
        setLocationDistricts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  }
};

const handleLocationDistrictChange = async (districtName) => {
  handleEditChange("district", districtName);
  handleEditChange("mandal", "");
  handleEditChange("village", "");
  setLocationMandals([]);
  setLocationVillages([]);

  const selectedDistrict = locationDistricts.find(
    (d) => d.name === districtName,
  );
  if (selectedDistrict?.id) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/location/mandals/${selectedDistrict.id}`,
      );
      if (response.data.success) {
        setLocationMandals(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching mandals:", err);
    }
  }
};

const handleLocationMandalChange = async (mandalName) => {
  handleEditChange("mandal", mandalName);
  handleEditChange("village", "");
  setLocationVillages([]);

  const selectedMandal = locationMandals.find((m) => m.name === mandalName);
  if (selectedMandal?.id) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/location/villages/${selectedMandal.id}`,
      );
      if (response.data.success) {
        setLocationVillages(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching villages:", err);
    }
  }
};

// File upload handler
const handleFileUpload = async (file, type) => {
  setUploading(true);
  const token = localStorage.getItem("token");
  const formDataUpload = new FormData();
  formDataUpload.append(type, file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload-files`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formDataUpload,
    });

    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();

    if (type === "photo") {
      return data.photoUrl;
    } else if (type === "document") {
      return data.documentUrl;
    } else {
      return data.videoUrl;
    }
  } catch (err) {
    console.error("Upload error:", err);
    setError("Failed to upload file");
    return null;
  } finally {
    setUploading(false);
  }
};

// Add media to the form
const handleAddMedia = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !selectedMediaCategory) {
    setError("Please select a category and a file");
    return;
  }

  const fileType = file.type.startsWith("image/") ? "image" : "video";
  const url = await handleFileUpload(
    file,
    fileType === "image" ? "photo" : "video",
  );

  if (url) {
    const newMedia = {
      category: selectedMediaCategory,
      type: fileType,
      url: url,
      created_at: new Date().toISOString(),
    };
    setEditFormData((prev) => ({
      ...prev,
      media: [...(prev.media || []), newMedia],
    }));
    setSelectedMediaCategory("");
    e.target.value = "";
    setError(null);
  }
};

// Add document to the form
const uploadSpecificDocument = async (e, type) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = await handleFileUpload(file, "document");
  if (url) {
    const newDoc = {
      doc_type: type,
      file_url: url,
      created_at: new Date().toISOString(),
    };
    setEditFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc],
    }));
  }
};

// Handle edit form changes for nested objects
const handleEditChange = (path, value) => {
  setEditFormData((prev) => {
    const newData = JSON.parse(JSON.stringify(prev));
    const keys = path.split(".");
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
  setEditFormData((prev) => {
    const newData = JSON.parse(JSON.stringify(prev));
    const keys = path.split(".");
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
      current[lastKey] = currentArray.filter((item) => item !== value);
    }

    return newData;
  });
};

// Initialize edit form when editing starts
const startEditing = async (land) => {
  const clonedData = JSON.parse(JSON.stringify(land));

  // Normalize landDetails - ensure it exists
  if (!clonedData.landDetails) {
    clonedData.landDetails = {};
  }

  // Normalize electricity
  const electricityArr = clonedData.landDetails.electricity || [];
  if (electricityArr.length > 0) {
    const val = electricityArr[0]?.toLowerCase?.() || "";
    if (val.includes("single")) {
      clonedData.landDetails.electricity_phase = "SINGLE";
    } else if (val.includes("three")) {
      clonedData.landDetails.electricity_phase = "THREE";
    }
  }

  // Normalize tree fields
  const treeFields = [
    "mango_trees_number",
    "coconut_trees_number",
    "neem_trees_number",
    "baniyan_trees_number",
    "tamarind_trees_number",
    "sapoto_trees_number",
    "guava_trees_number",
    "teak_trees_number",
    "other_trees_number",
  ];
  treeFields.forEach((field) => {
    let val = clonedData.landDetails[field];
    if (typeof val === "string") {
      const match = val.match(/\d+/);
      val = match ? parseInt(match[0], 10) : 0;
    }
    clonedData.landDetails[field] =
      val !== undefined && val !== null && val !== "" ? Number(val) : 0;
  });

  // Parse GPS
  const parseGPS = (val) => {
    if (typeof val === "string" && val.includes(",")) {
      return val.split(",").map((s) => s.trim());
    }
    return null;
  };

  if (clonedData.landDetails) {
    const entryCoords = parseGPS(clonedData.landDetails.land_entry_latitude);
    if (entryCoords && entryCoords.length >= 2) {
      clonedData.landDetails.land_entry_latitude = entryCoords[0];
      clonedData.landDetails.land_entry_longitude = entryCoords[1];
    }

    const boundaryCoords = parseGPS(
      clonedData.landDetails.land_boundary_latitude,
    );
    if (boundaryCoords && boundaryCoords.length >= 2) {
      clonedData.landDetails.land_boundary_latitude = boundaryCoords[0];
      clonedData.landDetails.land_boundary_longitude = boundaryCoords[1];
    }
  }

  // Normalize road type
  if (clonedData.landDetails.nearest_road_type) {
    clonedData.landDetails.nearest_road_type =
      clonedData.landDetails.nearest_road_type.toUpperCase();
  }

  // Normalize village
  if (clonedData.village) {
    clonedData.village = clonedData.village.trim();
  }

  // Normalize arrays
  if (!Array.isArray(clonedData.landDetails.residence)) {
    clonedData.landDetails.residence = [];
  }
  if (typeof clonedData.landDetails.water_source === "string") {
    try {
      clonedData.landDetails.water_source = JSON.parse(
        clonedData.landDetails.water_source,
      );
    } catch (e) {
      clonedData.landDetails.water_source = [];
    }
  }
  if (!Array.isArray(clonedData.landDetails.water_source)) {
    clonedData.landDetails.water_source = [];
  } else {
    const newWaterSource = [];
    clonedData.landDetails.water_source.forEach((item) => {
      if (typeof item === "string") {
        const parts = item.split("-");
        if (parts.length > 1) {
          const type = parts[0].trim().toLowerCase();
          const count = parseInt(parts[1], 10) || 0;
          newWaterSource.push(type);
          const fieldName =
            type === "borewell"
              ? "number_of_bores"
              : `number_of_${type.replace(/\s+/g, "_")}`;
          clonedData.landDetails[fieldName] = count;
        } else {
          newWaterSource.push(item.trim().toLowerCase());
        }
      }
    });
    clonedData.landDetails.water_source = newWaterSource;
  }

  if (typeof clonedData.landDetails.complaints === "string") {
    try {
      clonedData.landDetails.complaints = JSON.parse(
        clonedData.landDetails.complaints,
      );
    } catch (e) {
      clonedData.landDetails.complaints = [];
    }
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
  setSelectedLand(clonedData);

  // Pre-populate cascading location dropdowns
  try {
    if (land.state) {
      const stateObj = locationStates.find((s) => s.name === land.state);
      if (stateObj?.id) {
        const distRes = await axios.get(
          `${API_BASE_URL}/location/districts/${stateObj.id}`,
        );
        if (distRes.data.success) {
          setLocationDistricts(distRes.data.data);
          if (land.district) {
            const distObj = distRes.data.data.find(
              (d) => d.name === land.district,
            );
            if (distObj?.id) {
              const mandalRes = await axios.get(
                `${API_BASE_URL}/location/mandals/${distObj.id}`,
              );
              if (mandalRes.data.success) {
                setLocationMandals(mandalRes.data.data);
                if (land.mandal) {
                  const mandalObj = mandalRes.data.data.find(
                    (m) => m.name === land.mandal,
                  );
                  if (mandalObj?.id) {
                    const villageRes = await axios.get(
                      `${API_BASE_URL}/location/villages/${mandalObj.id}`,
                    );
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
    console.error("Error pre-populating location dropdowns:", err);
  }
};

const cancelEditing = () => {
  setIsEditing(false);
  setSelectedLand(null);
};

const saveLandChanges = async () => {
  setUpdatingAction("save");
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/land/${selectedLand.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editFormData),
    });
    if (!response.ok) throw new Error("Failed to update land");

    await fetchVerifiedLands();
    setIsEditing(false);
    setSelectedLand(null);
    alert("Land updated successfully!");
  } catch (error) {
    console.error("Error updating land:", error);
    alert("Failed to update land");
  } finally {
    setUpdatingAction(null);
  }
};
// Filter lands by search
const filteredLands = lands.filter(
  (land) =>
    land.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.mandal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.farmerDetails?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    land.farmerDetails?.phone?.includes(searchTerm),
);

// Pagination
const totalPages = Math.ceil(filteredLands.length / itemsPerPage);
const paginatedLands = filteredLands.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage,
);

const renderInlineEditForm = () => {
  return (
    <LandEditForm
      selectedLand={selectedLand}
      isEditing={isEditing}
      editFormData={editFormData}
      updatingAction={updatingAction}
      handleEditChange={handleEditChange}
      handleLocationStateChange={handleLocationStateChange}
      handleLocationDistrictChange={handleLocationDistrictChange}
      handleFileUpload={handleFileUpload}
      saveLandChanges={saveLandChanges}
      cancelEditing={cancelEditing}
      locationStates={locationStates}
      locationDistricts={locationDistricts}
      locationMandals={locationMandals}
      locationVillages={locationVillages}
    />
  );
};

if (isEditing) {
  return <div style={styles.container}>{renderInlineEditForm()}</div>;
}

return (
  <div style={styles.container}>
    {/* Header */}
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <h1 style={styles.headerTitle}>VERIFIED LANDS</h1>
        <p style={styles.headerSubtitle}>
          All Successfully Verified Land Records
        </p>
      </div>
      <div style={styles.searchContainer}>
        <Search size={15} style={styles.searchIcon} />
        <input
          type="text"
          placeholder={`Search Verified Lands (${filteredLands.length} Records)...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.searchInput}
          onFocus={(e) => {
            e.target.style.borderColor = "#22c55e";
            e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>

    {/* Stats Bar */}
    <div style={styles.statsBar}>
      <div style={styles.statCard}>
        <div style={styles.statIcon("#22c55e")}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <div style={styles.statValue}>{lands.length}</div>
          <div style={styles.statLabel}>Total Verified</div>
        </div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statIcon("#3b82f6")}>
          <MapPin size={20} />
        </div>
        <div>
          <div style={styles.statValue}>
            {lands
              .reduce((sum, l) => sum + (l.landDetails?.total_acres || 0), 0)
              .toFixed(1)}
          </div>
          <div style={styles.statLabel}>Total Acres</div>
        </div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statIcon("#f97316")}>
          <CheckCircle size={20} />
        </div>
        <div>
          <div style={styles.statValue}>
            {new Set(lands.map((l) => l.district).filter(Boolean)).size}
          </div>
          <div style={styles.statLabel}>Districts</div>
        </div>
      </div>
    </div>

    {/* Table */}
    <div style={styles.tableContainer}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <Loader2
            size={32}
            style={{ animation: "spin 1s linear infinite", color: "#22c55e" }}
          />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : paginatedLands.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>
            ✅
          </div>
          <div>No verified lands found</div>
          {searchTerm && (
            <div style={{ marginTop: "4px", fontSize: "13px" }}>
              with search term: "{searchTerm}"
            </div>
          )}
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.th}>Farmer</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Unit Profile</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLands.map((land) => {
                const farmerName = land.farmerDetails?.name || "Unknown";
                const avatarColor = getAvatarColor(farmerName);
                const landId = `L${String(land.id).padStart(3, "0")}`;
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
                            onClick={() => startEditing(land)}
                          >
                            {farmerName}
                          </div>
                          <div style={styles.farmerId}>{landId}</div>
                          <div style={styles.farmerPhone}>
                            <Phone size={10} />
                            {land.farmerDetails?.phone || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td style={styles.td}>
                      <div style={styles.addressMain}>
                        {land.village || "N/A"}, Registry Mandal
                      </div>
                      <div style={styles.addressSub}>
                        {land.mandal || "N/A"}, {land.state || "N/A"}
                      </div>
                    </td>

                    {/* Unit Profile */}
                    <td style={styles.td}>
                      <div style={styles.unitProfile}>
                        {acres} AC • {formatPriceShort(pricePerAcre)}/AC
                      </div>
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <div style={styles.verifiedBadge}>
                        <ShieldCheck size={12} />
                        VERIFIED
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        style={{
                          ...styles.viewBtn,
                          background:
                            "linear-gradient(135deg, #f97316, #ea580c)",
                          boxShadow: "0 2px 8px rgba(249, 115, 22, 0.35)",
                        }}
                        onClick={() => startEditing(land)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 14px rgba(249, 115, 22, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(249, 115, 22, 0.35)";
                        }}
                      >
                        <Edit size={12} /> Edit
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={styles.pageBtn(currentPage === 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <div
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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
  </div>
);

export default VerifiedLandsDashboard;
