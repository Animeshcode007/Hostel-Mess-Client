import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";
// import {
//   LogOut,
//   CalendarCheck,
//   Plane,
//   Users,
//   Search,
//   AlertTriangle,
//   BarChart2,
//   UserCog,
//   Home,
// } from "lucide-react";

import AttendanceGrid from "../components/admin/AttendanceGrid";
import LeaveManager from "../components/admin/LeaveManager";
import StudentManager from "../components/admin/StudentManager";
import IssueManager from "../components/admin/IssueManager";
import Pagination from "../components/admin/Pagination";
import AdminHeader from "../components/admin/AdminHeader";
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
      <AdminHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        viewsWithSearch={viewsWithSearch}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
        {(activeView === "students" ||
          activeView === "attendance" ||
          activeView === "leave") && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <StudentDetailModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={handleCloseModal}
      />
    </div>
  );
};


export default AdminDashboard;
