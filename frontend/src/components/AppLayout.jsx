import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  FileText,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

import { motion } from "framer-motion";

export default function AppLayout() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef();

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2)
    : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname.includes("report")) return "Resume Report";
    if (location.pathname.includes("upload")) return "Upload Resume";
    return "Dashboard";
  };

  useEffect(() => {

    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.25 }}
        className={`fixed lg:relative inset-y-0 left-0 z-30
        bg-white/[0.04] backdrop-blur-xl shadow-xl
        border-r border-white/[0.06] flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        transition-transform duration-300`}
      >

        {/* LOGO */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">

          {!sidebarCollapsed && (
            <div>
              <span className="text-white font-semibold text-sm">
                ResumeAI
              </span>
              <p className="text-slate-500 text-xs">
                Career Platform
              </p>
            </div>
          )}

          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-3 space-y-2">

          {/* DASHBOARD */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
            ${
              location.pathname === "/dashboard"
                ? "bg-purple-600/20 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >

            <LayoutDashboard size={18} />

            {!sidebarCollapsed && "Dashboard"}

          </button>

          {/* REPORT */}
          <button
            onClick={() => navigate("/report")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
            ${
              location.pathname === "/report"
                ? "bg-purple-600/20 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >

            <FileText size={18} />

            {!sidebarCollapsed && "Resume Report"}

          </button>

        </nav>

        {/* USER INFO */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/[0.06]">

            <p className="text-white text-sm">
              {user?.name}
            </p>

            <p className="text-slate-500 text-xs">
              {user?.email}
            </p>

          </div>
        )}

      </motion.aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white lg:hidden"
            >
              ☰
            </button>

            <div>

              <h1 className="text-white text-lg font-semibold">
                {getPageTitle()}
              </h1>

              <p className="text-slate-500 text-xs">
                {new Date().toLocaleDateString("en-US", {
                  weekday:"long",
                  month:"long",
                  day:"numeric"
                })}
              </p>

            </div>

          </div>

          {/* USER MENU */}
          <div ref={menuRef} className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-white/[0.04]
              border border-white/[0.07] rounded-xl px-4 py-2"
            >

              <div className="w-6 h-6 rounded-full bg-gradient-to-br
              from-purple-500 to-blue-500 flex items-center justify-center">

                <span className="text-white text-xs font-bold">
                  {initials}
                </span>

              </div>

              <span className="text-white text-sm">
                {user?.name?.split(" ")[0]}
              </span>

            </button>

            {menuOpen && (

              <div className="absolute right-0 mt-2 w-44 bg-slate-900
              border border-white/10 rounded-xl shadow-xl">

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-2 text-sm
                  text-white hover:bg-white/10"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm
                  text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>

  );
}
