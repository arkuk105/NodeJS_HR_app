import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaves: number;
  thisMonthPayroll: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    thisMonthPayroll: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<DashboardStats>('/reports/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    if (user?.role === 'hr_admin' || user?.role === 'manager') {
      fetchStats();
    }
  }, [user]);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      visible: ['hr_admin', 'manager'],
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: TrendingUp,
      color: 'bg-green-500',
      visible: ['hr_admin', 'manager'],
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'bg-yellow-500',
      visible: ['hr_admin', 'manager', 'supervisor'],
    },
    {
      title: 'Monthly Payroll',
      value: `${stats.thisMonthPayroll.toLocaleString()} ALL`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      visible: ['hr_admin'],
    },
  ];

  const filteredCards = statCards.filter(card =>
    user && card.visible.includes(user.role)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')}`} size={24} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role === 'hr_admin' && (
              <>
                <a href="/employees" className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium text-slate-800">Manage Employees</h3>
                  <p className="text-sm text-slate-600 mt-1">Add, edit, or view employee information</p>
                </a>
                <a href="/payroll" className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <h3 className="font-medium text-slate-800">Process Payroll</h3>
                  <p className="text-sm text-slate-600 mt-1">Calculate and manage monthly payroll</p>
                </a>
              </>
            )}
            <a href="/attendance" className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-slate-800">Mark Attendance</h3>
              <p className="text-sm text-slate-600 mt-1">Record daily attendance</p>
            </a>
            <a href="/leave" className="block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <h3 className="font-medium text-slate-800">Request Leave</h3>
              <p className="text-sm text-slate-600 mt-1">Submit or manage leave requests</p>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-slate-500">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};
