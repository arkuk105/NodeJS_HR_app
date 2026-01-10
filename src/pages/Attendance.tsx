import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AttendanceRecord {
  attendance_id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out: string;
  status: string;
  hours_worked: number;
  notes: string;
  employee_name?: string;
}

export const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [quickMarkStatus, setQuickMarkStatus] = useState<string>('');
  const isAdmin = user?.role === 'hr_admin' || user?.role === 'manager';

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    try {
      const endpoint = isAdmin
        ? `/attendance?month=${selectedMonth + 1}&year=${selectedYear}`
        : `/attendance/my-attendance?month=${selectedMonth + 1}&year=${selectedYear}`;
      const data = await api.get<AttendanceRecord[]>(endpoint);
      setAttendance(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMark = async (status: 'present' | 'absent' | 'half_day') => {
    try {
      await api.post('/attendance', {
        date: new Date().toISOString().split('T')[0],
        status,
        check_in: new Date().toISOString(),
      });
      setQuickMarkStatus(`Marked as ${status}`);
      fetchAttendance();
      setTimeout(() => setQuickMarkStatus(''), 3000);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      setQuickMarkStatus('Failed to mark attendance');
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const record = attendance.find((a) => a.date.split('T')[0] === dateStr);

      days.push(
        <div
          key={day}
          className={`h-24 border border-slate-200 p-2 ${
            date.toDateString() === new Date().toDateString()
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white'
          }`}
        >
          <div className="flex flex-col h-full">
            <span className="text-sm font-medium text-slate-700">{day}</span>
            {record && (
              <div className="flex-1 flex items-center justify-center">
                {record.status === 'present' && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
                {record.status === 'absent' && (
                  <XCircle className="text-red-500" size={24} />
                )}
                {record.status === 'half_day' && (
                  <AlertCircle className="text-yellow-500" size={24} />
                )}
                {record.status === 'late' && (
                  <Clock className="text-orange-500" size={24} />
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
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

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const stats = {
    present: attendance.filter((a) => a.status === 'present').length,
    absent: attendance.filter((a) => a.status === 'absent').length,
    halfDay: attendance.filter((a) => a.status === 'half_day').length,
    late: attendance.filter((a) => a.status === 'late').length,
  };

  const attendanceRate =
    attendance.length > 0
      ? ((stats.present + stats.halfDay * 0.5) / attendance.length) * 100
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Attendance Management</h1>
        <p className="text-slate-600 mt-2">Track and manage employee attendance</p>
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Mark Attendance</h2>
          {quickMarkStatus && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
              {quickMarkStatus}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => handleQuickMark('present')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={20} />
              Present
            </button>
            <button
              onClick={() => handleQuickMark('half_day')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <AlertCircle size={20} />
              Half Day
            </button>
            <button
              onClick={() => handleQuickMark('absent')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle size={20} />
              Absent
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Present</p>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.present}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Absent</p>
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Half Day</p>
            <AlertCircle className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.halfDay}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Attendance Rate</p>
            <CalendarIcon className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{attendanceRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            {monthNames[selectedMonth]} {selectedYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center font-semibold text-slate-700"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-sm text-slate-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500" size={20} />
            <span className="text-sm text-slate-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-yellow-500" size={20} />
            <span className="text-sm text-slate-600">Half Day</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-orange-500" size={20} />
            <span className="text-sm text-slate-600">Late</span>
          </div>
        </div>
      </div>
    </div>
  );
};
