import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Star, X } from 'lucide-react';

interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  position: string;
}

interface PerformanceReviewFormProps {
  onClose: () => void;
  onSuccess: () => void;
  employeeId?: number;
}

export const PerformanceReviewForm = ({ onClose, onSuccess, employeeId }: PerformanceReviewFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: employeeId || '',
    review_period: '',
    technical_skills: 3,
    communication: 3,
    teamwork: 3,
    problem_solving: 3,
    leadership: 3,
    strengths: '',
    areas_for_improvement: '',
    goals: '',
    comments: '',
  });

  useEffect(() => {
    if (!employeeId) {
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api.get<Employee[]>('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/performance', {
        ...formData,
        employee_id: Number(formData.employee_id),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStarRating = (field: keyof typeof formData, label: string) => {
    const value = formData[field] as number;
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, [field]: star })}
              className="focus:outline-none transition-all hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= value
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-slate-300 hover:text-yellow-400'
                }
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-medium text-slate-700 min-w-[60px]">
            {value}.0 / 5.0
          </span>
        </div>
      </div>
    );
  };

  const overallRating = (
    (formData.technical_skills +
      formData.communication +
      formData.teamwork +
      formData.problem_solving +
      formData.leadership) /
    5
  ).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Create Performance Review</h2>
              <p className="text-sm text-slate-600 mt-1">
                Evaluate employee performance across multiple dimensions
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!employeeId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employee *
              </label>
              <select
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name} - {emp.position}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Review Period *
            </label>
            <input
              type="text"
              value={formData.review_period}
              onChange={(e) => setFormData({ ...formData, review_period: e.target.value })}
              placeholder="e.g., Q4 2024, January 2024"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Overall Rating</h3>
            <p className="text-3xl font-bold text-blue-600">{overallRating} / 5.0</p>
            <p className="text-sm text-slate-600 mt-1">Average of all ratings below</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Performance Ratings</h3>

            {renderStarRating('technical_skills', 'Technical Skills')}
            {renderStarRating('communication', 'Communication')}
            {renderStarRating('teamwork', 'Teamwork')}
            {renderStarRating('problem_solving', 'Problem Solving')}
            {renderStarRating('leadership', 'Leadership')}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Strengths *
            </label>
            <textarea
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              placeholder="What does this employee do exceptionally well?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Areas for Improvement *
            </label>
            <textarea
              value={formData.areas_for_improvement}
              onChange={(e) =>
                setFormData({ ...formData, areas_for_improvement: e.target.value })
              }
              placeholder="Where can this employee grow and develop?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Goals for Next Period *
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="What should this employee work towards in the next review period?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Comments
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Any other observations or notes"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Review...' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
