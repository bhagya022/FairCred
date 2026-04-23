import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 text-stone-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="relative flex-1 overflow-y-auto bg-transparent p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
