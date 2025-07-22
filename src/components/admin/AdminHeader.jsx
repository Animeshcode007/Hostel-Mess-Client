import React from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  UserCog,
  Home,
  Search,
  CalendarCheck,
  Plane,
  Users,
  AlertTriangle,
  BarChart2,
} from "lucide-react";

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-colors
        ${
          isActive
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-500 hover:bg-gray-100"
        }`}
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

const AdminHeader = ({
  searchTerm,
  setSearchTerm,
  activeView,
  setActiveView,
  handleLogout,
  viewsWithSearch,
}) => {
  const handleCopy = (e) => {
    e.preventDefault();
    const customText = "animesh_khare";
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", customText);
    }
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/logo.png"
              alt="IET DAVV Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <span onCopy={handleCopy} className="hidden md:block text-xl font-bold text-green-800 tracking-wide">
              IET DAVV HOSTEL MESS
            </span>
          </div>
          <div className="relative w-full max-w-md">
            {viewsWithSearch.includes(activeView) && (
              <>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 text-sm"
                />
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              title="Homepage"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            >
              {" "}
              <Home size={20} />{" "}
            </Link>
            <button
              onClick={() => setActiveView("profile")}
              title="Profile"
              className={`p-2 rounded-full transition-colors ${
                activeView === "profile"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {" "}
              <UserCog size={20} />{" "}
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            >
              {" "}
              <LogOut size={20} />{" "}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <nav className="flex justify-around items-center space-x-2 bg-gray-50 p-1 rounded-xl">
            <NavItem
              icon={<CalendarCheck size={24} />}
              label="Attendance"
              isActive={activeView === "attendance"}
              onClick={() => setActiveView("attendance")}
            />
            <NavItem
              icon={<Plane size={24} />}
              label="Leave"
              isActive={activeView === "leave"}
              onClick={() => setActiveView("leave")}
            />
            <NavItem
              icon={<Users size={24} />}
              label="Students"
              isActive={activeView === "students"}
              onClick={() => setActiveView("students")}
            />
            <NavItem
              icon={<AlertTriangle size={24} />}
              label="Issues"
              isActive={activeView === "issues"}
              onClick={() => setActiveView("issues")}
            />
            <NavItem
              icon={<BarChart2 size={24} />}
              label="Reports"
              isActive={activeView === "reports"}
              onClick={() => setActiveView("reports")}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
