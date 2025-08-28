import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiHome, FiFolder, FiUsers, FiLogOut, FiMenu, FiX, FiChevronDown, FiAlertTriangle } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <FiAlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                BugTracker
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Issue Management
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <FiHome className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <FiFolder className="w-4 h-4" />
                <span>Projects</span>
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Users</span>
                </NavLink>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">
                          {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 capitalize -mt-0.5">
                          {user?.role || 'employee'}
                        </span>
                      </div>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 max-w-xs bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-100 capitalize">
                              {user?.role || 'employee'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  {isMobileMenuOpen ? (
                    <FiX className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiMenu className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'text-indigo-700 bg-indigo-50 border border-indigo-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <FiHome className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <FiFolder className="w-5 h-5" />
                <span>Projects</span>
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink
                  to="/users"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <FiUsers className="w-5 h-5" />
                  <span>Users</span>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
