import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard.jsx'
import AddLand from './pages/lands/AddLand.jsx'
import Location from './pages/location/Location.jsx'
import EmployeeManagementAdvanced from './pages/hr/EmployeeManagementAdvanced.jsx'
import LandVerificationDashboard from './pages/lands/LandVerificationDashboard.jsx'
import LandPhysicalVerificationDashboard from './pages/lands/LandPhysicalVerificationDashboard.jsx'
import LandFinalVerificationDashboard from './pages/lands/LandFinalVerificationDashboard.jsx'
import Login from './pages/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add/land" element={<AddLand />} />
          <Route path="/location" element={<Location />} />
          <Route path="/employees" element={<EmployeeManagementAdvanced />} />
          <Route path="/call/verification" element={<LandVerificationDashboard />} />
          <Route path="/physical/verification" element={<LandPhysicalVerificationDashboard />} />
          <Route path="/final/verification" element={<LandFinalVerificationDashboard />} />
        </Route>
        <Route index element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
