import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ShieldCheckIcon, RefreshCwIcon, Play, List, Users, Download, Shield } from 'lucide-react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase';
import { storage, ExamSubmission } from '../utils/storage';
import { TrackManagement } from '../components/TrackManagement';
import { ExamControlPage } from './admin/ExamControlPage';
import { RoleManagement } from '../components/RoleManagement';
import { exportToExcel } from '../utils/exportExcel';
import { useAuth } from '../contexts/AuthContext';
import { MigrationUtility } from '../components/MigrationUtility';

type TabType = 'tracks' | 'exam-control' | 'role-management';
export function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('tracks');
  const [currentExamName, setCurrentExamName] = useState<string>('No exam running');
  useEffect(() => {
    loadSubmissions();
    loadExamStatus();
    
    // Set up real-time listener for submissions
    const unsubscribe = storage.subscribeToSubmissions((realTimeSubmissions) => {
      console.log('Admin Dashboard: Real-time update received', realTimeSubmissions.length);
      setSubmissions(realTimeSubmissions);
    });
    
    const interval = setInterval(() => {
      loadExamStatus();
    }, 30000);
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    filterAndSortSubmissions();
  }, [submissions, searchQuery, sortField, sortDirection]);
  
  const loadSubmissions = async () => {
    const data = await storage.getSubmissions();
    setSubmissions(data);
  };
  const loadExamStatus = async () => {
    try {
      const db = getDatabase(app);
      const snapshot = await get(ref(db, 'exam/status'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.isStarted && data.trackName) {
          setCurrentExamName(data.trackName);
        } else {
          setCurrentExamName('No exam running');
        }
      }
    } catch (error) {
      console.error('Error loading exam status:', error);
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSubmissions();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  const filterAndSortSubmissions = () => {
    let filtered = [...submissions];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => (s.studentName || 'Unknown Student').toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query));
    }
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (a.studentName || 'Unknown Student').localeCompare(b.studentName || 'Unknown Student');
          break;
        case 'id':
          comparison = a.studentId.localeCompare(b.studentId);
          break;
        case 'time':
          comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    setFilteredSubmissions(filtered);
  };
  const handleSort = (field: 'name' | 'id' | 'time' | 'score') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setAnswerFilter('all'); // Reset filter when expanding
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  const getAllQuestions = (submission: ExamSubmission) => {
    const allQuestions: {
      questionNumber: number;
      answer: string | null;
    }[] = [];
    for (let i = 1; i <= 40; i++) {
      allQuestions.push({
        questionNumber: i,
        answer: submission.answers[i] && submission.answers[i].trim() !== '' ? submission.answers[i] : null
      });
    }
    return allQuestions;
  };
  const getFilteredQuestions = (submission: ExamSubmission) => {
    const allQuestions = getAllQuestions(submission);
    switch (answerFilter) {
      case 'answered':
        return allQuestions.filter(q => q.answer !== null);
      case 'unanswered':
        return allQuestions.filter(q => q.answer === null);
      default:
        return allQuestions;
    }
  };
  const getAnswerStats = (submission: ExamSubmission) => {
    const allQuestions = getAllQuestions(submission);
    const answered = allQuestions.filter(q => q.answer !== null).length;
    const unanswered = allQuestions.filter(q => q.answer === null).length;
    return {
      answered,
      unanswered,
      total: 40
    };
  };

  const getMarkingStats = (submission: ExamSubmission) => {
    if (!submission.marks) {
      return { correct: 0, incorrect: 0, unmarked: 40, total: 40 };
    }
    let correct = 0;
    let incorrect = 0;
    let unmarked = 0;
    
    for (let i = 1; i <= 40; i++) {
      const mark = submission.marks[i];
      if (mark === 'correct') correct++;
      else if (mark === 'incorrect') incorrect++;
      else unmarked++;
    }
    
    return { correct, incorrect, unmarked, total: 40 };
  };

  const handleMarkQuestion = async (submissionId: string, questionNumber: number, mark: 'correct' | 'incorrect' | null) => {
    await storage.updateMark(submissionId, questionNumber, mark);
    await loadSubmissions();
  };

  const handlePublishResult = async (submissionId: string) => {
    const success = await storage.publishResult(submissionId);
    if (success) {
      await loadSubmissions();
      alert('Result published successfully!');
    } else {
      alert('Please mark all 40 questions before publishing the result.');
    }
  };

  const isAllMarked = (submission: ExamSubmission): boolean => {
    if (!submission.marks) return false;
    const stats = getMarkingStats(submission);
    return stats.unmarked === 0;
  };
  const SortIcon = ({
    field
  }: {
    field: 'name' | 'id' | 'time' | 'score';
  }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-blue-600 font-medium">{currentExamName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => exportToExcel(submissions, { type: 'all' })} 
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export All</span>
              </button>
              <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Auto-refresh: 30s</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => navigate('/admin/students')}
              className="px-4 py-2 font-medium transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
              data-testid="students-management-tab"
            >
              <Users className="w-4 h-4" />
              Students
            </button>
            <button
              onClick={() => navigate('/admin/batches')}
              className="px-4 py-2 font-medium transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
              data-testid="batches-management-tab"
            >
              <Users className="w-4 h-4" />
              Batches
            </button>
            <button
              onClick={() => navigate('/admin/submissions')}
              className="px-4 py-2 font-medium transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
              data-testid="submissions-tab"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'tracks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="track-management-tab"
            >
              <List className="w-4 h-4" />
              Track Management
            </button>
            <button
              onClick={() => setActiveTab('exam-control')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'exam-control'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Play className="w-4 h-4" />
              Exam Control
            </button>
            <button
              onClick={() => setActiveTab('role-management')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'role-management'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="role-management-tab"
            >
              <Shield className="w-4 h-4" />
              Role Management
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'tracks' ? (
          <TrackManagement />
        ) : activeTab === 'exam-control' ? (
          <ExamControlPage />
        ) : activeTab === 'role-management' ? (
          <RoleManagement currentUserEmail={useAuth().user?.email || ''} />
        ) : null}
      </main>
      
      {/* Migration Utility - Fixed position button */}
      <MigrationUtility />
    </div>;
}