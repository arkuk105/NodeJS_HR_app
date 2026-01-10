import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Calendar,
  DollarSign,
  Award,
  FileText,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
  Briefcase,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['hr_admin', 'manager', 'supervisor', 'employee'] },
  { name: 'Employees', href: '/employees', icon: Users, roles: ['hr_admin', 'manager'] },
  { name: 'Attendance', href: '/attendance', icon: Clock, roles: ['hr_admin', 'manager', 'supervisor', 'employee'] },
  { name: 'Leave', href: '/leave', icon: Calendar, roles: ['hr_admin', 'manager', 'supervisor', 'employee'] },
  { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['hr_admin'] },
  { name: 'Bonus', href: '/bonus', icon: Award, roles: ['hr_admin', 'manager'] },
  { name: 'Performance', href: '/performance', icon: Briefcase, roles: ['hr_admin', 'manager', 'supervisor', 'employee'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['hr_admin', 'manager', 'supervisor', 'employee'] },
  { name: 'Reports', href: '/reports', icon: BarChart, roles: ['hr_admin', 'manager'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['hr_admin'] },
];

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">HR System</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800">HR System</h1>
            <p className="text-sm text-slate-500 mt-1">Debt Collection Co.</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
