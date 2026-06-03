const fs = require('fs');

['src/pages/lands/LandVerificationDashboard.jsx', 'src/pages/lands/LandPhysicalVerificationDashboard.jsx', 'src/pages/lands/LandFinalVerificationDashboard.jsx'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /\{\['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'GRAVEL ROAD', 'CAR ROAD', 'TRACTOR ROAD', 'BIKE ROAD', 'FOOT PATH'\]\.map\(opt => \(/g,
    "{['HIGHWAY', 'DOUBLE ROAD', 'SINGLE ROAD', 'GRAVEL ROAD'].map(opt => ("
  );

  content = content.replace(
    /<option value="All sides">All sides<\/option>\s*<option value="Partial">Partial<\/option>\s*<option value="None">None<\/option>/g,
    "<option value=\"\">Select</option>\n                    <option value=\"Fully Fenced\">Fully Fenced</option>\n                    <option value=\"Partially Fenced\">Partially Fenced</option>\n                    <option value=\"Not Fenced\">Not Fenced</option>"
  );

  content = content.replace(
    /editFormData\.landDetails\?\.fencing_status \|\| 'All sides'/g,
    "editFormData.landDetails?.fencing_status || ''"
  );
  
  content = content.replace(
    /\{\['TOKEN RECEIVED', 'MORTGAGED', 'AVAILABLE FOR SALE', 'AGREEMENT Made', 'NOT AVAILABLE', 'SOLD'\]\.map\(opt => \(/g,
    "{['TOKEN RECEIVED', 'AVAILABLE FOR SALE', 'AGREEMENT Made', 'NOT AVAILABLE', 'SOLD'].map(opt => ("
  );

  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
