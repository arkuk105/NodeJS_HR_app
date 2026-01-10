import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Edit,
  Users,
  Award,
  Clock,
  FileText
} from 'lucide-react';

interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  team: string;
  status: string;
  hire_date: string;
  birth_date: string;
  salary_base: number;
  national_id: string;
}

interface EmployeeStats {
  totalLeaves: number;
  usedLeaves: number;
  pendingLeaves: number;
  attendanceRate: number;
  lastReviewScore: number;
  currentMonthSalary: number;
}

export const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmployee();
    fetchEmployeeStats();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await api.get<Employee>(`/employees/${id}`);
      setEmployee(data);
    } catch (error) {
      console.error('Failed to fetch employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeStats = async () => {
    try {
      const data = await api.get<EmployeeStats>(`/employees/${id}/stats`);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch employee stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading employee details...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-600 mb-4">Employee not found</p>
        <Link to="/employees" className="text-blue-600 hover:text-blue-700">
          Back to Employees
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'performance', name: 'Performance', icon: Award },
    { id: 'attendance', name: 'Attendance', icon: Clock },
    { id: 'documents', name: 'Documents', icon: FileText },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Employees
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-blue-100 text-lg">{employee.position}</p>
              <div className="flex items-center gap-4 mt-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : employee.status === 'on_leave'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {employee.status.replace('_', ' ')}
                </span>
                <span className="text-blue-100">ID: {employee.employee_id}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Edit size={18} />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-800">{employee.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Phone className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium text-slate-800">{employee.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Briefcase className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Department</p>
              <p className="text-sm font-medium text-slate-800">{employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Base Salary</p>
              <p className="text-sm font-medium text-slate-800">{employee.salary_base.toLocaleString()} ALL</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-medium text-slate-800">{employee.first_name} {employee.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">National ID</p>
                  <p className="font-medium text-slate-800">{employee.national_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium text-slate-800">
                    {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Hire Date</p>
                  <p className="font-medium text-slate-800">
                    {new Date(employee.hire_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium text-slate-800">{employee.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Employment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Position</p>
                  <p className="font-medium text-slate-800">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-medium text-slate-800">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Team</p>
                  <p className="font-medium text-slate-800">{employee.team || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Employment Status</p>
                  <p className="font-medium text-slate-800 capitalize">{employee.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {stats && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Stats</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-600">Attendance Rate</p>
                        <p className="text-sm font-semibold text-slate-800">{stats.attendanceRate}%</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${stats.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-600">Leave Balance</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {stats.totalLeaves - stats.usedLeaves}/{stats.totalLeaves}
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${((stats.totalLeaves - stats.usedLeaves) / stats.totalLeaves) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Last Review Score</p>
                      <p className="text-lg font-bold text-blue-600">{stats.lastReviewScore}/5.0</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-600">Pending Leaves</p>
                      <p className="text-lg font-bold text-yellow-600">{stats.pendingLeaves}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
                  <h2 className="text-lg font-semibold mb-2">Current Month Salary</h2>
                  <p className="text-3xl font-bold">{stats.currentMonthSalary.toLocaleString()} ALL</p>
                  <p className="text-emerald-100 text-sm mt-2">Base + Bonuses - Deductions</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance History</h2>
          <p className="text-slate-500">Performance reviews will be displayed here</p>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Attendance Records</h2>
          <p className="text-slate-500">Attendance history will be displayed here</p>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Employee Documents</h2>
          <p className="text-slate-500">Documents will be displayed here</p>
        </div>
      )}
    </div>
  );
};
