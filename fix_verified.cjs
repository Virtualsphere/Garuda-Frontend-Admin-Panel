const fs = require('fs');
let content = fs.readFileSync('src/pages/lands/VerifiedLandsDashboard.jsx', 'utf8');

const startStr = 'const renderInlineEditForm = () => {';
const endStr = '  if (isEditing) {';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find boundaries.');
  process.exit(1);
}

const replacement = `const renderInlineEditForm = () => {
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
      <LandEditForm
        selectedLand={selectedLand}
        isEditing={isEditing}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleEditChange={handleEditChange}
        handleArrayChange={handleArrayChange}
        handleAddMedia={handleAddMedia}
        uploading={uploading}
        handleFileUpload={handleFileUpload}
        uploadSpecificDocument={uploadSpecificDocument}
        selectedMediaCategory={selectedMediaCategory}
        setSelectedMediaCategory={setSelectedMediaCategory}
        error={error}
        locationStates={locationStates}
        locationDistricts={locationDistricts}
        locationMandals={locationMandals}
        locationVillages={locationVillages}
        handleLocationStateChange={handleLocationStateChange}
        handleLocationDistrictChange={handleLocationDistrictChange}
        handleLocationMandalChange={handleLocationMandalChange}
        editTab={editTab}
        setEditTab={setEditTab}
        updatingAction={updatingAction}
        saveLandChanges={saveLandChanges}
        cancelEditing={cancelEditing}
        title="EDIT VERIFIED LAND"
      />
    );
  };

`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('src/pages/lands/VerifiedLandsDashboard.jsx', newContent);
console.log('Successfully replaced renderInlineEditForm!');
