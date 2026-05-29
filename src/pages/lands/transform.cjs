const fs = require('fs');

const phoneSource = fs.readFileSync('d:\\development\\Garuda-Frontend-Admin-Panel\\src\\pages\\lands\\LandVerificationDashboard.jsx', 'utf8');

let newSource = phoneSource;

// 1. Change component name
newSource = newSource.replace(/const LandVerificationDashboard = /g, 'const LandPhysicalVerificationDashboard = ');
newSource = newSource.replace(/export default LandVerificationDashboard;/g, 'export default LandPhysicalVerificationDashboard;');

// 2. Change GET URL
newSource = newSource.replace(
  /land\/pending-call-verification\/\$\{statusFilter\}/g,
  'land/pending-physical-verification/${statusFilter}'
);

// 3. Change PUT URL
newSource = newSource.replace(
  /land\/call\/verify\/\$\{id\}/g,
  'land/${id}'
);

// 4. Remove pipeline tabs logic from the return block.
// In LandVerificationDashboard, the return block starts with:
// return (
//   <div style={styles.container}>
//     {/* Header Section */}
// ...
//     {/* Pipeline Tabs */}
// ...
//     {/* Content based on pipeline tab */}

// Let's replace the whole return block manually.
// Actually, it's easier to just regex out the pipeline tabs part.
// The pipeline tabs are within <div style={styles.pipelineTabs}>...</div>
// We can just find it and remove it.
newSource = newSource.replace(/\{\/\* Pipeline Tabs \*\/\}\s*<div style=\{styles\.pipelineTabs\}>[\s\S]*?<\/div>/, '');

// Also remove the conditional rendering for activePipelineTab.
// Currently it is:
//       {/* Content based on pipeline tab */}
//       {activePipelineTab === 'verify' ? (
//         isEditing ? renderInlineEditForm() : ( ... )
//       ) : activePipelineTab === 'physical' ? (
//           <LandPhysicalVerificationDashboard />
//       ) : activePipelineTab === 'review' ? (
//           <div ...>...</div>
//       ) : (
//       /* Table (Phone Verification) */
//       <div style={styles.tableContainer}>

// We want to replace all that with:
//       {isEditing ? renderInlineEditForm() : (
//       <div style={styles.tableContainer}>

const contentToReplace = /\{\/\* Content based on pipeline tab \*\/\}\s*\{activePipelineTab === 'verify' \? \([\s\S]*?\/\* Table \(Phone Verification\) \*\/\}/;

newSource = newSource.replace(contentToReplace, `{isEditing ? renderInlineEditForm() : (\n      /* Table (Physical Verification) */`);

// Fix the closing parenthesis for the isEditing ternary.
// In the original, the table had a `)}` at the end for the `else` of activePipelineTab === 'verify' ? ... : (
// We just need to make sure the end of the file matches `{isEditing ? renderInlineEditForm() : ( <div style={styles.tableContainer}> ... </div> )}`
// The original file ends with:
//           )}
//         </div>
//       )}
//
//       {/* Inbound Signals Pill */}
//       ...
//       {selectedLand && !isEditing && renderDetailModal()}
//     </div>
//   );
// };

// Let's just fix `activePipelineTab` logic entirely by replacing it.

// Remove `activePipelineTab` state from the component
newSource = newSource.replace(/const \[activePipelineTab, setActivePipelineTab\] = useState\('phone'\);\n/g, '');

// Fix `startEditing` to NOT set activePipelineTab
newSource = newSource.replace(/setActivePipelineTab\('verify'\);\n/g, '');

// Fix `cancelEditing` to NOT set activePipelineTab
newSource = newSource.replace(/setActivePipelineTab\('phone'\);\n/g, '');

// Fix updateLand success to NOT set activePipelineTab
newSource = newSource.replace(/setActivePipelineTab\('phone'\);\n/g, '');

// Replace "Phone Verification" text with "Physical Verification"
newSource = newSource.replace(/Phone Verification/g, 'Physical Verification');

fs.writeFileSync('d:\\development\\Garuda-Frontend-Admin-Panel\\src\\pages\\lands\\LandPhysicalVerificationDashboard.jsx', newSource);
console.log("Transformation complete.");
