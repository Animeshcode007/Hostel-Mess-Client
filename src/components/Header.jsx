import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-white/95 text-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-2 sm:p-3">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
          <img
            src="/logo.png"
            alt="IET DAVV Logo"
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          <span className="font-bold text-green-800 tracking-wide text-base sm:text-xl md:text-2xl">
            IET DAVV HOSTEL MESS
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            to="/admin/login"
            className="flex-shrink-0 bg-gray-800 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm"
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
