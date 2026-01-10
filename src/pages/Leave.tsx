import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  AlertCircle,
  Filter,
  ChevronDown,
} from 'lucide-react';

interface LeaveRequest {
  leave_id: number;
  employee_id: number;
  employee_name?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  approved_by?: number;
  approved_date?: string;
  created_at: string;
}

interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  used_annual: number;
  used_sick: number;
  used_personal: number;
}

export const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    leave_type: 'annual',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const isAdmin = user?.role === 'hr_admin' || user?.role === 'manager' || user?.role === 'supervisor';

  useEffect(() => {
    fetchLeaves();
    if (!isAdmin) {
      fetchBalance();
    }
  }, []);

  const fetchLeaves = async () => {
    try {
      const endpoint = isAdmin ? '/leave' : '/leave/my-leaves';
      const data = await api.get<LeaveRequest[]>(endpoint);
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const data = await api.get<LeaveBalance>('/leave/balance');
      setBalance(data);
    } catch (error) {
      console.error('Failed to fetch leave balance:', error);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leave', formData);
      setShowRequestModal(false);
      setFormData({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
      });
      fetchLeaves();
      if (!isAdmin) {
        fetchBalance();
      }
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      await api.put(`/leave/${leaveId}`, { status: 'approved' });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleReject = async (leaveId: number) => {
    try {
      await api.put(`/leave/${leaveId}`, { status: 'rejected' });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  };

  const filteredLeaves = leaves.filter(leave =>
    statusFilter === 'all' || leave.status === statusFilter
  );

  const stats = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Leave Management</h1>
          <p className="text-slate-600 mt-2">Manage leave requests and balance</p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Request Leave
          </button>
        )}
      </div>

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <p className="text-blue-100 mb-2">Annual Leave</p>
            <p className="text-3xl font-bold mb-1">{balance.annual - balance.used_annual}</p>
            <p className="text-sm text-blue-100">of {balance.annual} days remaining</p>
            <div className="mt-4 w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${((balance.annual - balance.used_annual) / balance.annual) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <p className="text-green-100 mb-2">Sick Leave</p>
            <p className="text-3xl font-bold mb-1">{balance.sick - balance.used_sick}</p>
            <p className="text-sm text-green-100">of {balance.sick} days remaining</p>
            <div className="mt-4 w-full bg-green-400 bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${((balance.sick - balance.used_sick) / balance.sick) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
            <p className="text-yellow-100 mb-2">Personal Leave</p>
            <p className="text-3xl font-bold mb-1">{balance.personal - balance.used_personal}</p>
            <p className="text-sm text-yellow-100">of {balance.personal} days remaining</p>
            <div className="mt-4 w-full bg-yellow-400 bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${((balance.personal - balance.used_personal) / balance.personal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Pending</p>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Approved</p>
            <Check className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Rejected</p>
            <X className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Leave Requests</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {isAdmin && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Employee</th>}
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Start Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">End Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Days</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                {isAdmin && <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeaves.map((leave) => (
                <tr key={leave.leave_id} className="hover:bg-slate-50">
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{leave.employee_name || `Employee ${leave.employee_id}`}</p>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="capitalize text-slate-700">{leave.leave_type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{leave.days} days</td>
                  <td className="px-6 py-4 text-slate-700 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : leave.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {leave.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(leave.leave_id)}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(leave.leave_id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeaves.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No leave requests found</p>
          </div>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Request Leave</h2>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
