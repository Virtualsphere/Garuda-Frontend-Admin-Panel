const fs = require('fs');
let content = fs.readFileSync('src/pages/lands/VerifiedLandsDashboard.jsx', 'utf8');
const start = content.indexOf('const styles = {');
let stack = 0;
let end = start;
for (let i = start; i < content.length; i++) {
  if (content[i] === '{') stack++;
  else if (content[i] === '}') {
    stack--;
    if (stack === 0) {
      end = i + 1;
      break;
    }
  }
}
const replacement = `const VerifiedLandsDashboard = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updatingAction, setUpdatingAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [locationStates, setLocationStates] = useState([]);
  const [locationDistricts, setLocationDistricts] = useState([]);
  const [locationMandals, setLocationMandals] = useState([]);
  const [locationVillages, setLocationVillages] = useState([]);
`;
content = content.slice(0, start) + replacement + content.slice(end);
content += '\n};\n\nexport default VerifiedLandsDashboard;\n';
fs.writeFileSync('src/pages/lands/VerifiedLandsDashboard.jsx', content);
