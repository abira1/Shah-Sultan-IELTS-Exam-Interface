import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, BookOpen, CheckCircle, Clock, ArrowRight, FileText } from 'lucide-react';
import { storage, ExamSubmission } from '../../utils/storage';
import { allTracks } from '../../data/tracks';

export function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    setIsLoading(true);
    const allSubmissions = storage.getSubmissions();
    
    // Filter by assigned tracks if teacher has assigned tracks
    if (user?.assignedTracks && user.assignedTracks.length > 0) {
      const filtered = allSubmissions.filter(s => 
        user.assignedTracks!.includes(s.trackId)
      );
      setSubmissions(filtered);
    } else {
      setSubmissions([]);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate statistics
  const getPendingCount = () => {
    return submissions.filter(s => !s.marks || Object.keys(s.marks).length === 0).length;
  };

  const getGradedTodayCount = () => {
    const today = new Date().toDateString();
    return submissions.filter(s => {
      if (!s.marks || Object.keys(s.marks).length === 0 || s.resultPublished) return false;
      // Check if any mark was added today (we don't have timestamp for marks, so we check publishedAt)
      return s.publishedAt && new Date(s.publishedAt).toDateString() === today;
    }).length;
  };

  const getTotalThisMonthCount = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return submissions.filter(s => {
      const submittedDate = new Date(s.submittedAt);
      return submittedDate >= firstDayOfMonth;
    }).length;
  };

  // Get assigned track details
  const getAssignedTracks = () => {
    if (!user?.assignedTracks || user.assignedTracks.length === 0) {
      return [];
    }
    
    return user.assignedTracks.map(trackId => {
      const track = allTracks.find(t => t.id === trackId);
      if (!track) return null;
      
      const trackSubmissions = submissions.filter(s => s.trackId === trackId);
      const pending = trackSubmissions.filter(s => !s.marks || Object.keys(s.marks).length === 0).length;
      const graded = trackSubmissions.filter(s => s.marks && Object.keys(s.marks).length > 0).length;
      
      return {
        ...track,
        totalSubmissions: trackSubmissions.length,
        pending,
        graded
      };
    }).filter(Boolean);
  };

  // Get recent pending submissions
  const getRecentPendingSubmissions = () => {
    return submissions
      .filter(s => !s.marks || Object.keys(s.marks).length === 0)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  };

  const assignedTracks = getAssignedTracks();
  const recentPending = getRecentPendingSubmissions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-purple-100">Manage your assigned tracks and grade student submissions</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Pending Submissions</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900" data-testid="pending-count">{getPendingCount()}</p>
                <p className="text-sm text-gray-600 mt-1">Awaiting grading</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Graded Today</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900" data-testid="graded-today-count">{getGradedTodayCount()}</p>
                <p className="text-sm text-gray-600 mt-1">Submissions graded</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total This Month</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900" data-testid="total-month-count">{getTotalThisMonthCount()}</p>
                <p className="text-sm text-gray-600 mt-1">All submissions</p>
              </div>
            </div>

            {/* Assigned Tracks */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  My Assigned Tracks
                </h3>
                {assignedTracks.length > 0 && (
                  <button
                    onClick={() => navigate('/teacher/submissions')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    data-testid="view-all-submissions-button"
                  >
                    View All Submissions
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {assignedTracks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No tracks assigned yet</p>
                  <p className="text-sm text-gray-400 mt-2">Contact admin to assign tracks to you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedTracks.map((track: any) => (
                    <button
                      key={track.id}
                      onClick={() => navigate('/teacher/submissions')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                      data-testid={`track-card-${track.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-600">{track.shortName}</span>
                          <span className="text-sm font-medium text-gray-900">{track.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="font-semibold text-orange-600">{track.pending}</span>
                          <span className="text-gray-600">Pending</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">{track.graded}</span>
                          <span className="text-gray-600">Graded</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {track.totalSubmissions} total submissions
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Submissions (Pending Grading)
              </h3>
              
              {recentPending.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No pending submissions</p>
                  <p className="text-sm text-gray-400 mt-2">New submissions will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Exam Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Track
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentPending.map((submission) => {
                        const track = allTracks.find(t => t.id === submission.trackId);
                        return (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-mono text-sm text-blue-600">{submission.examCode || 'N/A'}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                              <div className="text-xs text-gray-500">{submission.studentId}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{track?.shortName} - {submission.trackName}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={() => navigate('/teacher/submissions')}
                                className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1"
                                data-testid={`grade-submission-${submission.id}`}
                              >
                                Grade
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
              <p className="text-purple-900 text-sm">
                <span className="font-semibold">💡 Tip:</span> You can only grade and view submissions for your assigned tracks. Contact the administrator if you need access to additional tracks.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
