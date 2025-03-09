import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ title = "Suzi" }) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="block">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">Tvoj pomoćnik u poslovanju!</p>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Administracija
                </Link>
              )}
              <Link 
                to="/materijali" 
                className="text-gray-600 hover:text-gray-900"
              >
                Materijali
              </Link>
              
              {isAdmin && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Admin
                </span>
              )}
              
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800"
              >
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800"
              >
                Prijava
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Registracija
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}