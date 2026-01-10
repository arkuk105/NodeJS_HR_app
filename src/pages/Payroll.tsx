import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Calculator,
  Download,
  Eye,
  CheckCircle,
  X,
} from 'lucide-react';

interface PayrollRecord {
  payroll_id: number;
  employee_id: number;
  employee_name: string;
  period_month: number;
  period_year: number;
  base_salary: number;
  bonuses: number;
  deductions: number;
  tax_amount: number;
  social_security: number;
  net_salary: number;
  status: string;
  processed_date?: string;
}

interface PayrollSummary {
  totalEmployees: number;
  totalGross: number;
  totalNet: number;
  totalTax: number;
  totalDeductions: number;
}

export const Payroll = () => {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    fetchPayroll();
  }, [selectedMonth, selectedYear]);

  const fetchPayroll = async () => {
    try {
      const data = await api.get<PayrollRecord[]>(
        `/payroll?month=${selectedMonth}&year=${selectedYear}`
      );
      setPayrolls(data);
      calculateSummary(data);
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (data: PayrollRecord[]) => {
    const summary: PayrollSummary = {
      totalEmployees: data.length,
      totalGross: data.reduce((sum, p) => sum + p.base_salary + p.bonuses, 0),
      totalNet: data.reduce((sum, p) => sum + p.net_salary, 0),
      totalTax: data.reduce((sum, p) => sum + p.tax_amount, 0),
      totalDeductions: data.reduce((sum, p) => sum + p.deductions + p.social_security, 0),
    };
    setSummary(summary);
  };

  const handleProcessPayroll = async () => {
    setIsProcessing(true);
    try {
      await api.post('/payroll/process', {
        month: selectedMonth,
        year: selectedYear,
      });
      fetchPayroll();
    } catch (error) {
      console.error('Failed to process payroll:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting payroll data...');
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading payroll data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-slate-600 mt-2">Process and manage employee payroll</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleProcessPayroll}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator size={20} />
            {isProcessing ? 'Processing...' : 'Process Payroll'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Period Selection</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Employees</p>
              <Users className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.totalEmployees}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Gross Salary</p>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {summary.totalGross.toLocaleString()} ALL
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Net Salary</p>
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {summary.totalNet.toLocaleString()} ALL
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Tax</p>
              <Calculator className="text-red-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {summary.totalTax.toLocaleString()} ALL
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">Deductions</p>
              <Calendar className="text-orange-500" size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {summary.totalDeductions.toLocaleString()} ALL
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Payroll for {monthNames[selectedMonth - 1]} {selectedYear}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Employee
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Base Salary
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Bonuses
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Gross
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Tax
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Social Sec.
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Deductions
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Net Salary
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payrolls.map((payroll) => (
                <tr key={payroll.payroll_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{payroll.employee_name}</p>
                    <p className="text-sm text-slate-500">ID: {payroll.employee_id}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-700">
                    {payroll.base_salary.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right text-green-600 font-medium">
                    +{payroll.bonuses.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    {(payroll.base_salary + payroll.bonuses).toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right text-red-600">
                    -{payroll.tax_amount.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right text-orange-600">
                    -{payroll.social_security.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right text-red-600">
                    -{payroll.deductions.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    {payroll.net_salary.toLocaleString()} ALL
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        payroll.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : payroll.status === 'processed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {payroll.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedPayroll(payroll)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payrolls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No payroll data for this period</p>
            <p className="text-sm text-slate-400 mt-2">
              Click "Process Payroll" to generate payroll for this period
            </p>
          </div>
        )}
      </div>

      {selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Payroll Details
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedPayroll.employee_name} - {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayroll(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Base Salary</span>
                    <span className="font-medium text-slate-800">
                      {selectedPayroll.base_salary.toLocaleString()} ALL
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Bonuses</span>
                    <span className="font-medium text-green-600">
                      +{selectedPayroll.bonuses.toLocaleString()} ALL
                    </span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-50 px-4 rounded-lg">
                    <span className="font-semibold text-slate-700">Gross Salary</span>
                    <span className="font-bold text-slate-800">
                      {(selectedPayroll.base_salary + selectedPayroll.bonuses).toLocaleString()} ALL
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Income Tax (13%)</span>
                    <span className="font-medium text-red-600">
                      -{selectedPayroll.tax_amount.toLocaleString()} ALL
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Social Security (9.5%)</span>
                    <span className="font-medium text-orange-600">
                      -{selectedPayroll.social_security.toLocaleString()} ALL
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Other Deductions</span>
                    <span className="font-medium text-red-600">
                      -{selectedPayroll.deductions.toLocaleString()} ALL
                    </span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-50 px-4 rounded-lg">
                    <span className="font-semibold text-slate-700">Total Deductions</span>
                    <span className="font-bold text-red-600">
                      -{(selectedPayroll.tax_amount + selectedPayroll.social_security + selectedPayroll.deductions).toLocaleString()} ALL
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 mb-1">Net Salary</p>
                    <p className="text-3xl font-bold">
                      {selectedPayroll.net_salary.toLocaleString()} ALL
                    </p>
                  </div>
                  <CheckCircle size={48} className="text-emerald-200" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedPayroll.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : selectedPayroll.status === 'processed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selectedPayroll.status}
                  </span>
                </div>
                {selectedPayroll.processed_date && (
                  <div>
                    <p className="text-sm text-slate-600">Processed Date</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {new Date(selectedPayroll.processed_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedPayroll(null)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
