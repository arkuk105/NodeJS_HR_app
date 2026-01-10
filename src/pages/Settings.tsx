import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building,
  DollarSign,
  Users,
  Bell,
  Shield,
  Save,
  RefreshCw,
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'company' | 'tax' | 'payroll' | 'notifications' | 'security'>('company');
  const [isSaving, setIsSaving] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    companyName: 'TechCorp Albania',
    registrationNumber: 'L12345678X',
    taxIdNumber: 'K12345678A',
    address: 'Tirana, Albania',
    phone: '+355 4 123 4567',
    email: 'info@techcorp.al',
    fiscalYear: 'January',
  });

  const [taxSettings, setTaxSettings] = useState({
    socialInsuranceRate: 16.7,
    healthInsuranceRate: 3.4,
    pensionRate: 15,
    personalIncomeTaxThreshold: 40000,
    pitRate1: 0,
    pitRate2: 13,
    pitRate3: 23,
    pitBracket1: 40000,
    pitBracket2: 200000,
  });

  const [payrollSettings, setPayrollSettings] = useState({
    paymentDay: '25',
    currency: 'ALL',
    overtimeRate: 125,
    weekendRate: 150,
    nightShiftRate: 120,
    autoCalculateTax: true,
    roundSalaries: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    leaveRequests: true,
    payrollReminders: true,
    birthdayReminders: true,
    contractExpiry: true,
    performanceReviews: true,
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const isAdmin = user?.role === 'hr_admin';

  if (!isAdmin) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Shield className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600">You don't have permission to access settings.</p>
          <p className="text-sm text-slate-500 mt-2">Please contact your HR administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-2">Configure system settings and company information</p>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'company'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building size={20} />
          Company Info
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'tax'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <DollarSign size={20} />
          Tax Configuration
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'payroll'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users size={20} />
          Payroll Settings
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell size={20} />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'security'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield size={20} />
          Security
        </button>
      </div>

      {activeTab === 'company' && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registration Number (NIPT)
              </label>
              <input
                type="text"
                value={companySettings.registrationNumber}
                onChange={(e) => setCompanySettings({ ...companySettings, registrationNumber: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tax ID Number
              </label>
              <input
                type="text"
                value={companySettings.taxIdNumber}
                onChange={(e) => setCompanySettings({ ...companySettings, taxIdNumber: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fiscal Year Start
              </label>
              <select
                value={companySettings.fiscalYear}
                onChange={(e) => setCompanySettings({ ...companySettings, fiscalYear: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="January">January</option>
                <option value="April">April</option>
                <option value="July">July</option>
                <option value="October">October</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                value={companySettings.address}
                onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Albanian Tax Configuration</h2>
          <p className="text-slate-600 mb-6">Configure tax rates according to Albanian legislation</p>

          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Social Contributions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Social Insurance Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxSettings.socialInsuranceRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, socialInsuranceRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Employee contribution: 16.7%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Health Insurance Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxSettings.healthInsuranceRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, healthInsuranceRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Employee contribution: 3.4%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pension Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxSettings.pensionRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, pensionRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Employer contribution: 15%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Income Tax (PIT)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tax-Free Threshold (ALL)
                  </label>
                  <input
                    type="number"
                    value={taxSettings.personalIncomeTaxThreshold}
                    onChange={(e) => setTaxSettings({ ...taxSettings, personalIncomeTaxThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Income up to this amount: 0% tax</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Bracket Upper Limit (ALL)
                  </label>
                  <input
                    type="number"
                    value={taxSettings.pitBracket1}
                    onChange={(e) => setTaxSettings({ ...taxSettings, pitBracket1: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rate for Income 40,001 - 200,000 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxSettings.pitRate2}
                    onChange={(e) => setTaxSettings({ ...taxSettings, pitRate2: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rate for Income Above 200,000 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxSettings.pitRate3}
                    onChange={(e) => setTaxSettings({ ...taxSettings, pitRate3: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Payroll Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Day of Month
              </label>
              <select
                value={payrollSettings.paymentDay}
                onChange={(e) => setPayrollSettings({ ...payrollSettings, paymentDay: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={payrollSettings.currency}
                onChange={(e) => setPayrollSettings({ ...payrollSettings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">ALL - Albanian Lek</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Overtime Rate (%)
              </label>
              <input
                type="number"
                value={payrollSettings.overtimeRate}
                onChange={(e) => setPayrollSettings({ ...payrollSettings, overtimeRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">125% = time and a quarter</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weekend Rate (%)
              </label>
              <input
                type="number"
                value={payrollSettings.weekendRate}
                onChange={(e) => setPayrollSettings({ ...payrollSettings, weekendRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">150% = time and a half</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Night Shift Rate (%)
              </label>
              <input
                type="number"
                value={payrollSettings.nightShiftRate}
                onChange={(e) => setPayrollSettings({ ...payrollSettings, nightShiftRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Automation</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={payrollSettings.autoCalculateTax}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, autoCalculateTax: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-slate-800">Auto-calculate taxes</p>
                  <p className="text-sm text-slate-600">Automatically calculate PIT, social insurance, and health insurance</p>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={payrollSettings.roundSalaries}
                  onChange={(e) => setPayrollSettings({ ...payrollSettings, roundSalaries: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-slate-800">Round final amounts</p>
                  <p className="text-sm text-slate-600">Round net salary to nearest whole number</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-slate-800">Enable Email Notifications</p>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
            </label>

            <div className="pl-8 space-y-4 border-l-2 border-slate-200">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.leaveRequests}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, leaveRequests: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!notificationSettings.emailNotifications}
                />
                <p className="text-slate-800">Leave requests and approvals</p>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.payrollReminders}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, payrollReminders: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!notificationSettings.emailNotifications}
                />
                <p className="text-slate-800">Payroll processing reminders</p>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.birthdayReminders}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, birthdayReminders: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!notificationSettings.emailNotifications}
                />
                <p className="text-slate-800">Employee birthday reminders</p>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.contractExpiry}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, contractExpiry: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!notificationSettings.emailNotifications}
                />
                <p className="text-slate-800">Contract expiry alerts</p>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.performanceReviews}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, performanceReviews: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!notificationSettings.emailNotifications}
                />
                <p className="text-slate-800">Performance review reminders</p>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Password Policy</h3>
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700">• Minimum 8 characters</p>
                <p className="text-sm text-slate-700">• Must contain uppercase and lowercase letters</p>
                <p className="text-sm text-slate-700">• Must contain at least one number</p>
                <p className="text-sm text-slate-700">• Password expires after 90 days</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Session Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="15">15 minutes</option>
                    <option value="30" selected>30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Protection</h3>
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700">All data is encrypted in transit and at rest</p>
                <p className="text-sm text-slate-700">Regular automated backups every 24 hours</p>
                <p className="text-sm text-slate-700">Compliant with Albanian data protection regulations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
        <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};
