import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storage, ExamSubmission } from '../../utils/storage';
import { ArrowLeft, Printer, CheckCircle, XCircle, Clock, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { PrintableResult } from '../../components/PrintableResult';

export function ResultDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = () => {
    setIsLoading(true);
    try {
      const allSubmissions = storage.getSubmissions();
      const found = allSubmissions.find(s => s.id === submissionId);
      
      // Verify this submission belongs to the logged-in student
      if (found && found.studentId === user?.studentId) {
        setSubmission(found);
      } else {
        // Unauthorized or not found
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Error loading submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSectionStats = () => {
    if (!submission || !submission.marks) return [];
    
    const sections = [
      { name: 'Section 1', questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { name: 'Section 2', questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { name: 'Section 3', questions: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { name: 'Section 4', questions: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ];

    return sections.map(section => {
      const correct = section.questions.filter(
        q => submission.marks![q] === 'correct'
      ).length;
      const incorrect = section.questions.filter(
        q => submission.marks![q] === 'incorrect'
      ).length;
      const unanswered = section.questions.filter(
        q => !submission.marks![q]
      ).length;
      
      return {
        section: section.name,
        correct,
        incorrect,
        unanswered,
        total: section.questions.length,
        percentage: Math.round((correct / section.questions.length) * 100)
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Result not found</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If result is not published yet
  if (!submission.resultPublished) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⏳ Result Pending</h2>
            <p className="text-gray-600 mb-6">
              Your submission is being reviewed. Results will be published soon.
              You will be able to view your detailed results once they are published.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sectionStats = calculateSectionStats();
  const radarData = sectionStats.map(s => ({
    subject: s.section.replace('Section ', 'Sec '),
    score: s.percentage,
    fullMark: 100
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Exam Result Details</h1>
              <p className="text-gray-600">Published on {format(new Date(submission.publishedAt!), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => setShowPrintPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span className="text-sm font-medium">Print Result</span>
              </button>
            </div>
          </div>

          {/* Exam Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Exam Code</p>
              <p className="text-lg font-semibold text-gray-900 font-mono">{submission.examCode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Track</p>
              <p className="text-lg font-semibold text-gray-900">{submission.trackName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {format(new Date(submission.submittedAt), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Time Spent</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                {submission.timeSpent}
              </p>
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">🎯 Your Score</h2>
            <div className="text-6xl font-bold mb-2">{submission.manualScore}%</div>
            <p className="text-blue-100 text-lg">
              {Object.values(submission.marks || {}).filter(m => m === 'correct').length} out of 40 correct
            </p>
          </div>
        </div>

        {/* Section-wise Performance */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Section-wise Performance</h3>
          <div className="space-y-6">
            {sectionStats.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{section.section}</span>
                    <span className="text-sm text-gray-600">
                      Questions {idx * 10 + 1}-{idx * 10 + 10}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      {section.correct}/{section.total}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {section.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${section.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {section.correct} Correct
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-600" />
                    {section.incorrect} Incorrect
                  </span>
                  {section.unanswered > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {section.unanswered} Unanswered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Radar Chart */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Performance Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Radar chart showing your performance across all four sections
          </p>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Generated on {format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>
          <p className="mt-2">Student: {submission.studentName} ({submission.studentId})</p>
        </div>
      </main>
    </div>
  );
}
