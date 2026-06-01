import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FilePenLine,
  LayoutDashboard,
  MapPin,
  Phone,
  Users,
  X,
  PanelRight,
  LogOut
} from "lucide-react";

import { authFetch, logoutUser } from "../utils/authFetch";
import { BASE_URL } from "../url/BaseUrl";

const API_BASE = BASE_URL;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  const [loading, setLoading] = useState(true);

  const initialLoadDone = useRef(false);

  const menu = [
    {
      label: "Operations",
      items: [
        { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" },
        // { icon: FilePenLine, name: "Lands Final Verification", path: "/final/verification" },
        { icon: Phone, name: "Land", path: "/add/land" },
        { icon: Users, name: "Employees", path: "/employees" },
        { icon: MapPin, name: "Locations", path: "/location" },
      ],
    }
  ];

  // FETCH USER PROFILE
  const fetchUserProfile = async () => {
    try {
      const response = await authFetch(
        `${API_BASE}/api/employee/profile`
      );

      if (!response) {
        return false;
      }

      if (!response.ok) {
        await logoutUser();
        return false;
      }

      const data = await response.json();

      if (data.success) {
        setUserName(data.data?.name || "");
        setUserEmail(data.data?.email || "");
        setUserRole(data.data?.role || "");
        setUserImage(data.data?.photo || "");

        return true;
      }

      return false;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return false;
    }
  };

  // INITIAL AUTH CHECK
  useEffect(() => {
    if (initialLoadDone.current) return;

    initialLoadDone.current = true;

    const init = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const success = await fetchUserProfile();

        if (!success) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // CLOSE SIDEBAR ON ROUTE CHANGE
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // ACTIVE MENU
  useEffect(() => {
    const currentItem = menu
      .flatMap(section => section.items)
      .find(item => item.path === location.pathname);

    if (currentItem) {
      setActive(currentItem.name);
    }
  }, [location.pathname]);

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <div className="text-gray-600">
            Verifying authentication...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">

      {/* MOBILE MENU BUTTON */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <PanelRight size={24} />}
      </button>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed lg:static
        w-72 h-full bg-slate-900 text-white flex flex-col p-4 space-y-6
        transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* LOGO */}
        <div>
          <div
            className="text-2xl font-bold flex items-center space-x-2 mb-4 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <span>🦅</span>
            <span>Garuda Admin</span>
          </div>

          {/* USER */}
          <div className="flex items-center space-x-3 p-2 bg-slate-800 rounded-xl">

            {userImage ? (
              <img
                src={userImage}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}

            <div>
              <p className="font-semibold text-sm">
                {userName || "Employee"}
              </p>

              <p className="text-xs opacity-70">
                {userRole || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto space-y-6">

          {menu.map((section) => (
            <div key={section.label}>
              <div className="space-y-1">

                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActive(item.name);
                      navigate(item.path);
                    }}
                    className={`
                      w-full flex items-center space-x-3 py-2 px-2 rounded-lg transition-all text-left
                      ${active === item.name
                        ? "bg-indigo-600 shadow-md shadow-indigo-900/50"
                        : "hover:bg-slate-800 hover:text-indigo-300"}
                    `}
                  >
                    <item.icon size={18} />
                    <span className="text-sm">{item.name}</span>
                  </button>
                ))}

              </div>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={logoutUser}
            className="w-full flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <div className="h-12 lg:h-0" />
        <Outlet />
      </div>
    </div>
  );
}