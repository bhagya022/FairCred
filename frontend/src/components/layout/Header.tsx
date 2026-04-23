import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/risk')) return 'Risk Assessment';
    if (path.startsWith('/history')) return 'Audit History';
    if (path.startsWith('/fairness')) return 'Fairness Dashboard';
    if (path.startsWith('/performance')) return 'Model Performance';
    if (path.startsWith('/impact')) return 'Impact Analysis';
    return 'Dashboard';
  };

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
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-end border-b border-stone-200 bg-stone-50/90 px-8 shadow-sm backdrop-blur">
      <h2 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-xl font-bold tracking-wide text-stone-900">
        {getPageTitle()}
      </h2>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 rounded-full border border-stone-200 bg-stone-100 px-3 py-1.5 transition-colors hover:bg-stone-200 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-700 to-orange-500 font-bold uppercase text-white shadow-inner">
            {(user || 'U').charAt(0)}
          </div>
          <span className="hidden text-sm font-medium text-stone-800 md:block">{user || 'User'}</span>
          <svg
            className={`h-4 w-4 text-stone-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 z-50 mt-3 w-48 origin-top-right rounded-xl border border-stone-200 bg-stone-50 py-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-1 border-b border-stone-200 px-4 py-2">
              <p className="text-xs text-stone-500">Signed in as</p>
              <p className="truncate text-sm font-bold text-stone-900">{user || 'demo'}</p>
            </div>
            <button
              onClick={() => setDropdownOpen(false)}
              className="w-full px-4 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              Account Settings
            </button>
            <button
              onClick={handleLogout}
              className="mt-1 w-full border-t border-stone-200 px-4 pt-3 text-left text-sm text-red-700 transition-colors hover:bg-red-50 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
