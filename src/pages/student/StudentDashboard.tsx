import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, BookOpen, BarChart3, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { examSessionService, ExamSession } from '../../services/examSessionService';
import { storage, ExamSubmission } from '../../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingExams, setUpcomingExams] = useState<ExamSession[]>([]);
  const [mySubmissions, setMySubmissions] = useState<ExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    examsTaken: 0,
    averageScore: 0,
    bestScore: 0,
    upcomingCount: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all exam sessions
      const allSessions = await examSessionService.getAllExamSessions();
      
      // Get all submissions first
      const allSubmissions = await storage.getSubmissions();
      
      // Filter upcoming exams for student's batch
      const upcoming = allSessions.filter(session => {
        // Show scheduled or active exams that include student's batch
        const isScheduledOrActive = session.status === 'scheduled' || session.status === 'active';
        const isBatchAllowed = user?.batchId && session.allowedBatches.includes(user.batchId);
        
        // Check if student has already submitted for this exam
        const hasSubmitted = allSubmissions.some(
          sub => sub.studentId === user?.studentId && sub.examCode === session.examCode
        );
        
        return isScheduledOrActive && isBatchAllowed && !hasSubmitted;
      });
      setUpcomingExams(upcoming);

      // Get student's submissions
      const studentSubmissions = allSubmissions.filter(
        sub => sub.studentId === user?.studentId
      );
      setMySubmissions(studentSubmissions);

      // Calculate stats
      const publishedSubmissions = studentSubmissions.filter(sub => sub.resultPublished);
      
      // For mock tests, use overall band (converted to percentage for consistency)
      // For partial tests, use manualScore
      const scores = publishedSubmissions
        .map(sub => {
          if (sub.testType === 'mock' && sub.overallBand !== undefined) {
            // Convert band score (0-9) to percentage (0-100) for display consistency
            return Math.round((sub.overallBand / 9) * 100);
          }
          return sub.manualScore || 0;
        })
        .filter(score => score > 0);
      
      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      setStats({
        examsTaken: studentSubmissions.length,
        averageScore: avgScore,
        bestScore: bestScore,
        upcomingCount: upcoming.length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartExam = (examCode: string) => {
    navigate(`/student/exam/${examCode}`);
  };

  const handleViewResult = (submissionId: string) => {
    navigate(`/student/results/${submissionId}`);
  };

  // Prepare chart data
  const chartData = mySubmissions
    .filter(sub => {
      if (!sub.resultPublished) return false;
      // Include if it has manualScore OR if it's a mock test with overallBand
      return sub.manualScore || (sub.testType === 'mock' && sub.overallBand !== undefined);
    })
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map(sub => {
      let score = sub.manualScore || 0;
      // For mock tests, convert band score to percentage for chart display
      if (sub.testType === 'mock' && sub.overallBand !== undefined) {
        score = Math.round((sub.overallBand / 9) * 100);
      }
      return {
        date: format(new Date(sub.submittedAt), 'MMM dd'),
        score,
        track: sub.trackName
      };
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/main-logo.png" 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">👋 Welcome back, {user?.name}!</h2>
          <p className="text-blue-100">Student ID: {user?.studentId}</p>
          {user?.batch && <p className="text-blue-100">Batch: {user?.batch}</p>}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Exams Taken</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.examsTaken}</p>
            <p className="text-sm text-gray-600 mt-1">Total exams completed</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Average Score</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.averageScore > 0 ? `${stats.averageScore}%` : '--'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Overall performance</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Best Score</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.bestScore > 0 ? `${stats.bestScore}%` : '--'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Your highest score</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Upcoming Exams</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.upcomingCount}</p>
            <p className="text-sm text-gray-600 mt-1">Scheduled exams</p>
          </div>
        </div>

        {/* Upcoming Exams Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Exams
          </h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : upcomingExams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingExams.map(exam => (
                    <tr key={exam.examCode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{exam.trackName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{exam.examCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exam.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exam.startTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {exam.duration} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {exam.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {exam.status === 'active' ? (
                          <button
                            onClick={() => handleStartExam(exam.examCode)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Start Exam
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Not started yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming exams scheduled</p>
              <p className="text-sm text-gray-400 mt-2">Check back later for new exam sessions</p>
            </div>
          )}
        </div>

        {/* My Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            My Results
          </h3>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : mySubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mySubmissions
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map(submission => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {submission.examCode || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.trackName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.resultPublished ? (
                          submission.testType === 'mock' && submission.overallBand !== undefined ? (
                            <div className="text-left">
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {submission.overallBand.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-600 space-y-0.5">
                                <div>L: {submission.sectionScores?.listening?.toFixed(1) || '--'}</div>
                                <div>R: {submission.sectionScores?.reading?.toFixed(1) || '--'}</div>
                                <div>W: {submission.sectionScores?.writing?.toFixed(1) || '--'}</div>
                                <div>S: {submission.sectionScores?.speaking?.toFixed(1) || '--'}</div>
                              </div>
                            </div>
                          ) : submission.manualScore ? (
                            <div className="text-lg font-bold text-green-600">
                              {submission.manualScore}%
                            </div>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.resultPublished ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {submission.resultPublished ? (
                          <button
                            onClick={() => handleViewResult(submission.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Result
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Not available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No results available</p>
              <p className="text-sm text-gray-400 mt-2">Complete exams to view your results</p>
            </div>
          )}
        </div>

        {/* Performance Graph */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              My Performance Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Score (%)"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing performance across {chartData.length} published exam{chartData.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-900 text-sm">
            <span className="font-semibold">💡 Tip:</span> Make sure to check this dashboard regularly for upcoming exams and published results.
          </p>
        </div>
      </main>
    </div>
  );
}
