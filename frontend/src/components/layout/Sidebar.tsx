import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Risk', path: '/risk' },
    { label: 'History', path: '/history' },
    { label: 'Fairness', path: '/fairness' },
    { label: 'Performance', path: '/performance' },
    { label: 'Impact', path: '/impact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!isCollapsed && (
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 truncate">
            FairCred
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mx-auto"
          aria-label="Toggle Navigation"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-emerald-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 group-hover:bg-slate-700 text-slate-400 group-hover:text-slate-300'}`}>
                  <span className="text-sm font-bold">{item.label.charAt(0)}</span>
                </div>
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-colors group border border-transparent hover:border-red-500/20"
          title={isCollapsed ? "Logout" : undefined}
        >
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
            <span className="text-sm font-bold">⎋</span>
          </div>
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
