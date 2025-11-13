import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-xl font-bold">BizFlow</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link
              to="/clients"
              className={`px-4 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/clients')}`}
            >
              Clientes
            </Link>
            <Link
              to="/sales"
              className={`px-4 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/sales')}`}
            >
              Ventas
            </Link>
            <Link
              to="/reports"
              className={`px-4 py-2 rounded-md hover:bg-primary-700 transition-colors ${isActive('/reports')}`}
            >
              Reportes
            </Link>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">
              Hola, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-primary-700 rounded-md hover:bg-primary-800 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={handleLinkClick}
              className={`block px-3 py-2 rounded-md hover:bg-primary-800 transition-colors ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link
              to="/clients"
              onClick={handleLinkClick}
              className={`block px-3 py-2 rounded-md hover:bg-primary-800 transition-colors ${isActive('/clients')}`}
            >
              Clientes
            </Link>
            <Link
              to="/sales"
              onClick={handleLinkClick}
              className={`block px-3 py-2 rounded-md hover:bg-primary-800 transition-colors ${isActive('/sales')}`}
            >
              Ventas
            </Link>
            <Link
              to="/reports"
              onClick={handleLinkClick}
              className={`block px-3 py-2 rounded-md hover:bg-primary-800 transition-colors ${isActive('/reports')}`}
            >
              Reportes
            </Link>
          </div>
          <div className="border-t border-primary-600 pt-4 pb-3 px-5">
            <div className="mb-3">
              <p className="text-sm text-primary-100">Usuario</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-primary-800 rounded-md hover:bg-primary-900 transition-colors text-left"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
