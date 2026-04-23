import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { label: 'Risk', path: '/risk', accent: 'from-amber-500 to-orange-500', icon: 'R' },
  { label: 'History', path: '/history', accent: 'from-stone-500 to-stone-700', icon: 'H' },
  { label: 'Fairness', path: '/fairness', accent: 'from-emerald-500 to-teal-600', icon: 'F' },
  { label: 'Performance', path: '/performance', accent: 'from-sky-500 to-blue-600', icon: 'P' },
  { label: 'Impact', path: '/impact', accent: 'from-rose-500 to-orange-500', icon: 'I' },
];

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg className={`h-4 w-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none">
      <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="M8 4.75H6.75A1.75 1.75 0 0 0 5 6.5v7a1.75 1.75 0 0 0 1.75 1.75H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 7l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.75 10H8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-stone-300 bg-[linear-gradient(180deg,#fcfbf8_0%,#f5efe6_100%)] shadow-[16px_0_40px_rgba(120,53,15,0.08)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-24' : 'w-72'
      }`}
    >
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-stone-300/90 px-5">
        {!isCollapsed && (
          <div>
            <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-stone-900 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              FairCred
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Decision Suite</div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-stone-300 bg-white/90 text-stone-700 shadow-sm transition-all hover:border-amber-300 hover:text-amber-800"
          aria-label="Toggle Navigation"
        >
          <CollapseIcon collapsed={isCollapsed} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {!isCollapsed && (
          <div className="mb-4 rounded-[24px] border-2 border-stone-300 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(120,53,15,0.10)]">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500">Navigation</div>
            <div className="mt-1 text-sm text-stone-600">Choose a workspace view</div>
          </div>
        )}

        <nav className="space-y-2.5">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group relative flex w-full items-center overflow-hidden rounded-[24px] border-2 px-3 py-3.5 text-left transition-all ${
                  isActive
                    ? 'border-amber-400 bg-white text-stone-900 shadow-[0_14px_32px_rgba(217,119,6,0.14)]'
                    : 'border-stone-300/90 bg-white/92 text-stone-700 shadow-[0_8px_20px_rgba(120,53,15,0.07)] hover:border-stone-400 hover:bg-white hover:shadow-[0_12px_24px_rgba(120,53,15,0.10)]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-amber-500 to-orange-500" />
                )}

                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${item.accent} text-white`
                      : 'border border-stone-200 bg-stone-50 text-stone-700 group-hover:bg-stone-100 group-hover:text-stone-800'
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="ml-3 flex min-w-0 flex-1 items-center justify-between">
                    <div>
                      <div className="truncate text-sm font-bold">{item.label}</div>
                      <div className="mt-0.5 text-xs text-stone-500">
                        {item.label === 'Risk' && 'Assess borrower eligibility'}
                        {item.label === 'History' && 'Review prior decisions'}
                        {item.label === 'Fairness' && 'Monitor parity insights'}
                        {item.label === 'Performance' && 'Compare model quality'}
                        {item.label === 'Impact' && 'Track business outcomes'}
                      </div>
                    </div>

                    <svg
                      className={`ml-3 h-4 w-4 flex-shrink-0 transition-all ${isActive ? 'translate-x-0 text-amber-700' : '-translate-x-1 text-stone-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-stone-300/90 p-4">
        <button
          onClick={handleLogout}
          className={`group flex w-full items-center rounded-[24px] border-2 border-red-200/80 bg-red-50/70 px-3 py-3 text-sm font-semibold text-red-700 transition-all hover:border-red-300 hover:bg-red-50 ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm transition-colors group-hover:bg-red-100">
            <LogoutIcon />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <div className="text-sm font-bold">Sign Out</div>
              <div className="mt-0.5 text-xs text-red-500">Exit current session</div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
