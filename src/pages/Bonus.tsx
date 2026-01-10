import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import {
  Award,
  DollarSign,
  Plus,
  Check,
  X,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';

interface BonusRecord {
  bonus_id: number;
  employee_id: number;
  employee_name: string;
  bonus_type: string;
  amount: number;
  reason: string;
  period_month: number;
  period_year: number;
  status: string;
  approved_by?: number;
  approved_date?: string;
  created_date: string;
}

interface BonusSummary {
  totalBonuses: number;
  totalAmount: number;
  pendingCount: number;
  approvedCount: number;
}

export const Bonus = () => {
  const { user } = useAuth();
  const [bonuses, setBonuses] = useState<BonusRecord[]>([]);
  const [summary, setSummary] = useState<BonusSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    employee_id: '',
    bonus_type: 'performance',
    amount: '',
    reason: '',
  });
  const isAdmin = user?.role === 'hr_admin' || user?.role === 'manager';

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      const endpoint = isAdmin ? '/bonus' : '/bonus/my-bonuses';
      const data = await api.get<BonusRecord[]>(endpoint);
      setBonuses(data);
      calculateSummary(data);
    } catch (error) {
      console.error('Failed to fetch bonuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (data: BonusRecord[]) => {
    const summary: BonusSummary = {
      totalBonuses: data.length,
      totalAmount: data.reduce((sum, b) => sum + b.amount, 0),
      pendingCount: data.filter(b => b.status === 'pending').length,
      approvedCount: data.filter(b => b.status === 'approved').length,
    };
    setSummary(summary);
  };

  const handleSubmitBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bonus', {
        ...formData,
        employee_id: Number(formData.employee_id),
        amount: Number(formData.amount),
      });
      setShowCreateModal(false);
      setFormData({
        employee_id: '',
        bonus_type: 'performance',
        amount: '',
        reason: '',
      });
      fetchBonuses();
    } catch (error) {
      console.error('Failed to create bonus:', error);
    }
  };

  const handleApprove = async (bonusId: number) => {
    try {
      await api.put(`/bonus/${bonusId}`, { status: 'approved' });
      fetchBonuses();
    } catch (error) {
      console.error('Failed to approve bonus:', error);
    }
  };

  const handleReject = async (bonusId: number) => {
    try {
      await api.put(`/bonus/${bonusId}`, { status: 'rejected' });
      fetchBonuses();
    } catch (error) {
      console.error('Failed to reject bonus:', error);
    }
  };

  const filteredBonuses = bonuses.filter(bonus =>
    statusFilter === 'all' || bonus.status === statusFilter
  );

  const getBonusTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'bg-blue-100 text-blue-700';
      case 'annual':
        return 'bg-green-100 text-green-700';
      case 'project':
        return 'bg-yellow-100 text-yellow-700';
      case 'referral':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading bonus data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bonus Management</h1>
          <p className="text-slate-600 mt-2">Manage employee bonuses and incentives</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Bonus
          </button>
        )}
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Total Bonuses</p>
              <Award className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.totalBonuses}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Total Amount</p>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {summary.totalAmount.toLocaleString()} ALL
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Pending</p>
              <Calendar className="text-yellow-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Approved</p>
              <Check className="text-emerald-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.approvedCount}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Bonus Records</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBonuses.map((bonus) => (
                <tr key={bonus.bonus_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{bonus.employee_name}</p>
                    <p className="text-sm text-slate-500">ID: {bonus.employee_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getBonusTypeColor(
                        bonus.bonus_type
                      )}`}
                    >
                      {bonus.bonus_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    +{bonus.amount.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-slate-700 max-w-xs truncate">
                    {bonus.reason}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {bonus.period_month}/{bonus.period_year}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        bonus.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : bonus.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {bonus.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {bonus.status === 'pending' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(bonus.bonus_id)}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(bonus.bonus_id)}
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

        {filteredBonuses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No bonus records found</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Add Bonus</h2>
            </div>
            <form onSubmit={handleSubmitBonus} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="number"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bonus Type
                </label>
                <select
                  value={formData.bonus_type}
                  onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="performance">Performance</option>
                  <option value="annual">Annual</option>
                  <option value="project">Project</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount (ALL)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Bonus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
