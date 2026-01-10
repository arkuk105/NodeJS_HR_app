import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { PerformanceReviewForm } from '../components/PerformanceReviewForm';
import {
  Star,
  TrendingUp,
  Target,
  Award,
  Plus,
  Eye,
  Edit,
  Calendar,
  User,
} from 'lucide-react';

interface PerformanceReview {
  review_id: number;
  employee_id: number;
  employee_name: string;
  reviewer_id: number;
  reviewer_name: string;
  review_period: string;
  review_date: string;
  overall_rating: number;
  technical_skills: number;
  communication: number;
  teamwork: number;
  problem_solving: number;
  leadership: number;
  strengths: string;
  areas_for_improvement: string;
  goals: string;
  comments: string;
  status: string;
}

interface EmployeeSummary {
  employee_id: number;
  employee_name: string;
  position: string;
  average_rating: number;
  review_count: number;
  last_review_date: string;
}

export const Performance = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'employees'>('reviews');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isAdmin = user?.role === 'hr_admin' || user?.role === 'manager';

  useEffect(() => {
    fetchReviews();
    if (isAdmin) {
      fetchEmployeeSummaries();
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const endpoint = isAdmin ? '/performance' : '/performance/my-reviews';
      const data = await api.get<PerformanceReview[]>(endpoint);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeSummaries = async () => {
    try {
      const data = await api.get<EmployeeSummary[]>('/performance/summaries');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employee summaries:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-blue-600 bg-blue-50';
    if (rating >= 2.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Performance Management</h1>
          <p className="text-slate-600 mt-2">Track and manage employee performance reviews</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Review
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'employees'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Employee Summary
          </button>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {review.employee_name}
                  </h3>
                  <p className="text-sm text-slate-600">{review.review_period}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                    review.overall_rating
                  )}`}
                >
                  {review.overall_rating.toFixed(1)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Technical Skills</span>
                  {renderStars(review.technical_skills)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Communication</span>
                  {renderStars(review.communication)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Teamwork</span>
                  {renderStars(review.teamwork)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Problem Solving</span>
                  {renderStars(review.problem_solving)}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    <p>Reviewed by {review.reviewer_name}</p>
                    <p>{new Date(review.review_date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl">
              <p className="text-slate-500">No performance reviews found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Position
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Avg Rating
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Reviews
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Last Review
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.map((employee) => (
                  <tr key={employee.employee_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{employee.employee_name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{employee.position}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                            employee.average_rating
                          )}`}
                        >
                          {employee.average_rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-700">
                      {employee.review_count}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {employee.last_review_date
                        ? new Date(employee.last_review_date).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add Review"
                      >
                        <Plus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {employees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No employee data available</p>
            </div>
          )}
        </div>
      )}

      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Performance Review</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedReview.employee_name} - {selectedReview.review_period}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Reviewer</p>
                  <p className="font-medium text-slate-800">{selectedReview.reviewer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Review Date</p>
                  <p className="font-medium text-slate-800">
                    {new Date(selectedReview.review_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Overall Rating</h3>
                  <span
                    className={`px-4 py-2 rounded-full text-lg font-bold ${getRatingColor(
                      selectedReview.overall_rating
                    )}`}
                  >
                    {selectedReview.overall_rating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Rating Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Technical Skills</span>
                    {renderStars(selectedReview.technical_skills)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Communication</span>
                    {renderStars(selectedReview.communication)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Teamwork</span>
                    {renderStars(selectedReview.teamwork)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Problem Solving</span>
                    {renderStars(selectedReview.problem_solving)}
                  </div>
                  {selectedReview.leadership > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Leadership</span>
                      {renderStars(selectedReview.leadership)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Strengths</h3>
                <p className="text-slate-600">{selectedReview.strengths}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Areas for Improvement
                </h3>
                <p className="text-slate-600">{selectedReview.areas_for_improvement}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Goals</h3>
                <p className="text-slate-600">{selectedReview.goals}</p>
              </div>

              {selectedReview.comments && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    Additional Comments
                  </h3>
                  <p className="text-slate-600">{selectedReview.comments}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedReview(null)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <PerformanceReviewForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
};
