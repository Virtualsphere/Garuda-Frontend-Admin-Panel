const fs = require('fs');

const filesToFix = [
  'src/pages/lands/components/LandEditForm.jsx',
  'src/pages/lands/LandVerificationDashboard.jsx',
  'src/pages/lands/LandPhysicalVerificationDashboard.jsx',
  'src/pages/lands/LandFinalVerificationDashboard.jsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace the hardcoded options
  content = content.replace(
    /<option value="Red">Red<\/option>\s*<option value="Black">Black<\/option>\s*<option value="Alluvial">Alluvial<\/option>/g,
    `<option value="">Select</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Clay Soil">Clay Soil</option>
                    <option value="Loamy Soil">Loamy Soil</option>`
  );

  // Replace the default value in the select from 'Red' to ''
  content = content.replace(
    /editFormData\.landDetails\?\.soil_type \|\| 'Red'/g,
    "editFormData.landDetails?.soil_type || ''"
  );

  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});

// Update constants.js
const constantsFile = 'src/pages/lands/utils/constants.js';
if (fs.existsSync(constantsFile)) {
  let constantsContent = fs.readFileSync(constantsFile, 'utf8');
  constantsContent = constantsContent.replace(
    /export const SOIL_TYPES = \['Red', 'Black', 'Alluvial'\];/g,
    "export const SOIL_TYPES = ['Red Soil', 'Black Soil', 'Sandy Soil', 'Clay Soil', 'Loamy Soil'];"
  );
  fs.writeFileSync(constantsFile, constantsContent);
  console.log('Fixed ' + constantsFile);
}
