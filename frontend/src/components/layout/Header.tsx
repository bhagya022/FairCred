import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Determine Page Title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/risk')) return 'Risk Assessment';
    if (path.startsWith('/history')) return 'Audit History';
    if (path.startsWith('/fairness')) return 'Fairness Dashboard';
    if (path.startsWith('/performance')) return 'Model Performance';
    if (path.startsWith('/impact')) return 'Impact Analysis';
    return 'Dashboard';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 shrink-0 shadow-sm relative z-20">
      
      {/* Route Title */}
      <h2 className="text-xl font-bold text-slate-200 tracking-wide">
        {getPageTitle()}
      </h2>

      {/* Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 focus:outline-none bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-inner uppercase">
            {(user || 'U').charAt(0)}
          </div>
          <span className="text-sm font-medium text-slate-200 hidden md:block">
            {user || 'User'}
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 border-b border-slate-700/50 mb-1">
              <p className="text-xs text-slate-400">Signed in as</p>
              <p className="text-sm font-bold text-slate-200 truncate">{user || 'demo'}</p>
            </div>
            <button
              onClick={() => setDropdownOpen(false)}
              className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Account Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1 border-t border-slate-700/50 pt-3"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
