import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";
import {
  LogOut,
  CalendarCheck,
  Plane,
  Users,
  Search,
  AlertTriangle,
  BarChart2,
  UserCog,
  Home,
} from "lucide-react";

import AttendanceGrid from "../components/admin/AttendanceGrid";
import LeaveManager from "../components/admin/LeaveManager";
import StudentManager from "../components/admin/StudentManager";
import IssueManager from "../components/admin/IssueManager";
import Pagination from "../components/admin/Pagination";
import StudentDetailModal from "../components/admin/StudentDetailModal";
import Reports from "../components/admin/Reports";
import ProfileManager from "../components/admin/ProfileManager";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("attendance");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataVersion, setDataVersion] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingStudent, setViewingStudent] = useState(null);
  const navigate = useNavigate();

  const viewsWithSearch = ["attendance", "leave", "students"];
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleViewStudent = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    console.log("4. [Dashboard] handleViewStudent found student:", student);
    setViewingStudent(student);
  };

  const handleCloseModal = () => {
    setViewingStudent(null);
  };

  const fetchStudents = async (pageToFetch = 1, search = "") => {
    setLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) {
        setLoading(false);
        handleLogout();
        return;
      }
      if (adminInfo && adminInfo.token) {
        const config = {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
          params: {
            page: pageToFetch,
            limit: 20,
            search: search,
          },
        };
        const { data } = await axios.get("/api/students", config);
        console.log("2. [Dashboard] fetchStudents got new data:", data.students);
        setStudents(data.students);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const triggerRefresh = () => {
    console.log("1. [Dashboard] triggerRefresh CALLED. Refetching students...");
    fetchStudents(currentPage, debouncedSearchTerm);
  };

  useEffect(() => {
    fetchStudents(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderView = () => {
    if (loading)
      return <p className="text-center py-10">Loading student data...</p>;

    switch (activeView) {
      case "attendance":
        return (
          <AttendanceGrid
            students={filteredStudents}
            onAttendanceChange={triggerRefresh}
            onViewDetails={handleViewStudent}
          />
        );
      case "leave":
        return (
          <LeaveManager
            students={students}
            onUpdate={() => fetchStudents(currentPage, debouncedSearchTerm)}
            onViewDetails={handleViewStudent}
          />
        );
      case "students":
        return (
          <StudentManager
            students={students}
            onUpdate={() => fetchStudents(currentPage, debouncedSearchTerm)}
            onViewDetails={handleViewStudent}
          />
        );
      case "issues":
        return <IssueManager />;
      case "reports":
        return <Reports />;
      case "profile":
        return <ProfileManager />;
      default:
        return (
          <AttendanceGrid
            students={filteredStudents}
            onViewDetails={handleViewStudent}
            onAttendanceChange={triggerRefresh}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="relative w-full sm:w-auto order-3 sm:order-2">
              {viewsWithSearch.includes(activeView) && (
                <>
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by name/roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 order-2 sm:order-3">
              <Link
                to="/"
                rel="noopener noreferrer"
                title="View Public Homepage"
                className="flex items-center p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Home size={20} />
              </Link>
              <button
                onClick={() => setActiveView("profile")}
                title="Profile Settings"
                className={`flex items-center p-2 rounded-full transition-colors ${
                  activeView === "profile"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <UserCog size={20} />
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            <TabButton
              icon={<CalendarCheck size={18} />}
              label="Daily Attendance"
              isActive={activeView === "attendance"}
              onClick={() => setActiveView("attendance")}
            />
            <TabButton
              icon={<Plane size={18} />}
              label="Leave Management"
              isActive={activeView === "leave"}
              onClick={() => setActiveView("leave")}
            />
            <TabButton
              icon={<Users size={18} />}
              label="Manage Students"
              isActive={activeView === "students"}
              onClick={() => setActiveView("students")}
            />
            <TabButton
              icon={<AlertTriangle size={18} />}
              label="View Issues"
              isActive={activeView === "issues"}
              onClick={() => setActiveView("issues")}
            />
            <TabButton
              icon={<BarChart2 size={18} />}
              label="Reports"
              isActive={activeView === "reports"}
              onClick={() => setActiveView("reports")}
            />
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      {(activeView === "students" ||
        activeView === "attendance" ||
        activeView === "leave") && (
        <footer className="py-4 border-t bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </footer>
      )}
      <StudentDetailModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={handleCloseModal}
      />
    </div>
  );
};

const TabButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors
        ${
          isActive
            ? "border-indigo-500 text-indigo-600"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default AdminDashboard;
