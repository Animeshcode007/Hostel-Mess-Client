import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-white/95 text-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-3">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="IET DAVV Logo"
            className="h-12 w-12"
          />
          <span className="text-xl sm:text-2xl font-bold text-green-800 tracking-wide">
            IET DAVV HOSTEL MESS
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            to="/admin/login"
            className="bg-gray-800 text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300 shadow-sm"
          >
            Admin login
          </Link>
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold text-gray-600">MESS OWNER</div>
            <div className="font-semibold text-gray-800">+91 9644479332</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
