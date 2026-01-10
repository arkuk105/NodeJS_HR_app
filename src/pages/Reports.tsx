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
  Filter,
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    department: 'all',
    reportFormat: 'pdf',
  });

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-600 mt-2">Generate and download comprehensive reports</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Filter size={20} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Report Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="hr">HR</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Format
              </label>
              <select
                value={filters.reportFormat}
                onChange={(e) => setFilters({ ...filters, reportFormat: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
              <button
                onClick={() => {
                  console.log('Generating report:', report.title, 'with filters:', filters);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download size={18} />
                Generate {filters.reportFormat.toUpperCase()}
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
