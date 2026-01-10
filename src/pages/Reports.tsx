import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import {
  BarChart,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Download,
} from 'lucide-react';

interface ReportSummary {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  attendanceRate: number;
  leaveUtilization: number;
}

export const Reports = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReportSummary();
  }, []);

  const fetchReportSummary = async () => {
    try {
      const data = await api.get<ReportSummary>('/reports/summary');
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch report summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reportTypes = [
    {
      title: 'Employee Report',
      description: 'Comprehensive employee data and statistics',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Payroll Report',
      description: 'Salary, bonuses, and deductions breakdown',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Attendance Report',
      description: 'Employee attendance and punctuality metrics',
      icon: Calendar,
      color: 'bg-yellow-500',
    },
    {
      title: 'Leave Report',
      description: 'Leave balance and utilization analysis',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Performance Report',
      description: 'Employee performance reviews and ratings',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
    {
      title: 'Bonus Report',
      description: 'Bonus distribution and approval status',
      icon: BarChart,
      color: 'bg-emerald-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-600 mt-2">Generate and download comprehensive reports</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} className="opacity-80" />
              <p className="text-4xl font-bold">{summary.totalEmployees}</p>
            </div>
            <p className="text-blue-100 text-sm">Total Employees</p>
            <p className="text-2xl font-semibold mt-2">{summary.activeEmployees} Active</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={32} className="opacity-80" />
              <p className="text-4xl font-bold">{(summary.totalPayroll / 1000000).toFixed(1)}M</p>
            </div>
            <p className="text-green-100 text-sm">Total Payroll (ALL)</p>
            <p className="text-2xl font-semibold mt-2">
              {summary.averageSalary.toLocaleString()} Avg
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar size={32} className="opacity-80" />
              <p className="text-4xl font-bold">{summary.attendanceRate}%</p>
            </div>
            <p className="text-yellow-100 text-sm">Attendance Rate</p>
            <p className="text-2xl font-semibold mt-2">{summary.leaveUtilization}% Leave Used</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 ${report.color} bg-opacity-10 rounded-xl w-fit mb-4`}>
                <Icon className={report.color.replace('bg-', 'text-')} size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{report.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{report.description}</p>
              <button className="flex items-center gap-2 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <Download size={18} />
                Generate Report
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Reports</h2>
        <div className="text-center py-8 text-slate-500">
          <FileText className="mx-auto mb-3 opacity-50" size={48} />
          <p>No recent reports generated</p>
          <p className="text-sm mt-1">Generate a report to see it here</p>
        </div>
      </div>
    </div>
  );
};
