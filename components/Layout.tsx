import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle } from 'react-icons/fa';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-dele-red text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-dele-yellow w-8 h-8 rounded-full flex items-center justify-center text-dele-red font-bold border-2 border-white group-hover:scale-110 transition-transform">
                B2
              </div>
              <span className="font-bold text-xl tracking-tight">DELE Prep AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <FaHome size={20} />
              </Link>
              <div className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <FaUserCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};