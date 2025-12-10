import { useState, useEffect, Fragment } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  SearchIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckIcon,
  XIcon,
  SendIcon,
  ArrowLeft,
  Filter,
  X as CloseIcon,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Home
} from 'lucide-react';
import { storage, ExamSubmission } from '../../utils/storage';
import { allTracks } from '../../data/tracks';
import { examSessionService, ExamSession } from '../../services/examSessionService';
import { useAuth } from '../../contexts/AuthContext';
import { exportToExcel, exportSummaryToExcel } from '../../utils/exportExcel';
import { PrintableResult } from '../../components/PrintableResult';
import { FolderIcon } from '../../components/FolderIcon';

type AnswerFilter = 'all' | 'answered' | 'unanswered';
type SortField = 'name' | 'id' | 'time' | 'score';
type NavigationLevel = 'tracks' | 'exams' | 'submissions';

interface BreadcrumbItem {
  level: NavigationLevel;
  label: string;
  trackId?: string;
  examCode?: string;
}

export function SubmissionsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const examCodeFilter = searchParams.get('examCode');

  // Navigation state
  const [navigationLevel, setNavigationLevel] = useState<NavigationLevel>('tracks');
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [currentExamCode, setCurrentExamCode] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { level: 'tracks', label: 'All Tracks' }
  ]);

  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ExamSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [selectedExamCode, setSelectedExamCode] = useState<string>(examCodeFilter || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Available exam codes for filter
  const [availableExamCodes, setAvailableExamCodes] = useState<string[]>([]);
  
  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Print preview
  const [printSubmission, setPrintSubmission] = useState<ExamSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
    loadExamSessions();
    
    // Set up real-time listener
    const unsubscribe = storage.subscribeToSubmissions((realTimeSubmissions) => {
      console.log('Real-time update: Received submissions', realTimeSubmissions.length);
      
      // Filter by assigned tracks if user is a teacher
      let filteredData = realTimeSubmissions;
      if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
        filteredData = realTimeSubmissions.filter(s => user.assignedTracks!.includes(s.trackId));
      }
      
      setSubmissions(filteredData);
    });

    // Cleanup listener on unmount
    return () => {
      console.log('Unsubscribing from real-time updates');
      unsubscribe();
    };
  }, [user, role]);

  useEffect(() => {
    filterAndSortSubmissions();
  }, [submissions, searchQuery, sortField, sortDirection, selectedTrackId, selectedExamCode]);

  useEffect(() => {
    // Extract unique exam codes from submissions
    const codes = [...new Set(submissions.map(s => s.examCode).filter(Boolean))] as string[];
    setAvailableExamCodes(codes);
  }, [submissions]);

  const loadSubmissions = async () => {
    try {
      let data = await storage.getSubmissions();
      
      // Filter by assigned tracks if user is a teacher
      if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
        data = data.filter(s => user.assignedTracks!.includes(s.trackId));
      }
      
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const loadExamSessions = async () => {
    try {
      const sessions = await examSessionService.getAllExamSessions();
      
      // Filter by assigned tracks if user is a teacher
      let filteredSessions = sessions;
      if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
        filteredSessions = sessions.filter(s => user.assignedTracks!.includes(s.trackId));
      }
      
      setExamSessions(filteredSessions);
    } catch (error) {
      console.error('Error loading exam sessions:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSubmissions();
    await loadExamSessions();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filterAndSortSubmissions = () => {
    let filtered = [...submissions];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          (s.studentName || 'Unknown Student').toLowerCase().includes(query) ||
          s.studentId.toLowerCase().includes(query) ||
          (s.examCode && s.examCode.toLowerCase().includes(query))
      );
    }

    // Filter by track
    if (selectedTrackId !== 'all') {
      filtered = filtered.filter((s) => s.trackId === selectedTrackId);
    }

    // Filter by exam code
    if (selectedExamCode !== 'all') {
      filtered = filtered.filter((s) => s.examCode === selectedExamCode);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = (a.studentName || 'Unknown Student').localeCompare(
            b.studentName || 'Unknown Student'
          );
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setAnswerFilter('all');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Navigation helpers
  const handleNavigateToTrack = (trackId: string) => {
    const track = allTracks.find(t => t.id === trackId);
    if (!track) return;

    setCurrentTrackId(trackId);
    setCurrentExamCode(null);
    setNavigationLevel('exams');
    setBreadcrumbs([
      { level: 'tracks', label: 'All Tracks' },
      { level: 'exams', label: track.name, trackId }
    ]);
  };

  const handleNavigateToExamCode = (examCode: string) => {
    const track = allTracks.find(t => t.id === currentTrackId);
    
    setCurrentExamCode(examCode);
    setNavigationLevel('submissions');
    setBreadcrumbs([
      { level: 'tracks', label: 'All Tracks' },
      { level: 'exams', label: track?.name || 'Track', trackId: currentTrackId || undefined },
      { level: 'submissions', label: `Exam: ${examCode}`, trackId: currentTrackId || undefined, examCode }
    ]);

    // Set filters for existing detailed view
    setSelectedTrackId(currentTrackId || 'all');
    setSelectedExamCode(examCode);
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.level === 'tracks') {
      setNavigationLevel('tracks');
      setCurrentTrackId(null);
      setCurrentExamCode(null);
      setBreadcrumbs([{ level: 'tracks', label: 'All Tracks' }]);
      setSelectedTrackId('all');
      setSelectedExamCode('all');
    } else if (item.level === 'exams' && item.trackId) {
      setNavigationLevel('exams');
      setCurrentTrackId(item.trackId);
      setCurrentExamCode(null);
      const track = allTracks.find(t => t.id === item.trackId);
      setBreadcrumbs([
        { level: 'tracks', label: 'All Tracks' },
        { level: 'exams', label: track?.name || 'Track', trackId: item.trackId }
      ]);
      setSelectedTrackId(item.trackId);
      setSelectedExamCode('all');
    }
  };

  // Get submissions grouped by track
  const getTrackSubmissions = (trackId: string) => {
    return submissions.filter(s => s.trackId === trackId);
  };

  // Get unique exam codes for a track (from both submissions and exam sessions)
  const getExamCodesForTrack = (trackId: string) => {
    // Get exam codes from submissions
    const trackSubmissions = getTrackSubmissions(trackId);
    const submissionExamCodes = trackSubmissions.map(s => s.examCode).filter(Boolean) as string[];
    
    // Get exam codes from exam sessions
    const trackSessions = examSessions.filter(s => s.trackId === trackId);
    const sessionExamCodes = trackSessions.map(s => s.examCode);
    
    // Merge and deduplicate
    const allExamCodes = [...new Set([...submissionExamCodes, ...sessionExamCodes])];
    
    // Sort by exam code (most recent first based on date in code)
    return allExamCodes.sort((a, b) => b.localeCompare(a));
  };

  // Get submissions for a specific exam code
  const getExamCodeSubmissions = (examCode: string) => {
    return submissions.filter(s => s.examCode === examCode && s.trackId === currentTrackId);
  };

  const getAllQuestions = (submission: ExamSubmission) => {
    const allQuestions: {
      questionNumber: number;
      answer: string | null;
    }[] = [];
    
    // Ensure answers object exists
    if (!submission.answers || typeof submission.answers !== 'object') {
      // Return empty questions if no answers
      for (let i = 1; i <= 40; i++) {
        allQuestions.push({
          questionNumber: i,
          answer: null
        });
      }
      return allQuestions;
    }
    
    for (let i = 1; i <= 40; i++) {
      const answer = submission.answers[i];
      allQuestions.push({
        questionNumber: i,
        answer: answer && typeof answer === 'string' && answer.trim() !== '' ? answer : null
      });
    }
    return allQuestions;
  };

  const getFilteredQuestions = (submission: ExamSubmission) => {
    const allQuestions = getAllQuestions(submission);
    switch (answerFilter) {
      case 'answered':
        return allQuestions.filter((q) => q.answer !== null);
      case 'unanswered':
        return allQuestions.filter((q) => q.answer === null);
      default:
        return allQuestions;
    }
  };

  const getAnswerStats = (submission: ExamSubmission) => {
    const allQuestions = getAllQuestions(submission);
    const answered = allQuestions.filter((q) => q.answer !== null).length;
    const unanswered = allQuestions.filter((q) => q.answer === null).length;
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
    // Real-time listener will auto-update, but we can also manually refresh
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };

  // Get track-based stats (filter by assigned tracks for teachers)
  const getTrackStats = () => {
    const stats: Record<string, { total: number; avgScore: number }> = {};
    const tracksToShow = role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0
      ? allTracks.filter(t => user.assignedTracks!.includes(t.id))
      : allTracks;
      
    tracksToShow.forEach((track) => {
      const trackSubmissions = submissions.filter((s) => s.trackId === track.id);
      stats[track.id] = {
        total: trackSubmissions.length,
        avgScore:
          trackSubmissions.length > 0
            ? Math.round(trackSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / trackSubmissions.length)
            : 0
      };
    });
    return stats;
  };

  const trackStats = getTrackStats();
  
  // Get filtered tracks for display (show only assigned tracks for teachers)
  const getDisplayTracks = () => {
    if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
      return allTracks.filter(t => user.assignedTracks!.includes(t.id));
    }
    return allTracks;
  };
  
  const displayTracks = getDisplayTracks();

  const clearFilters = () => {
    setSelectedTrackId('all');
    setSelectedExamCode('all');
    setSearchQuery('');
  };

  const handleExportFiltered = () => {
    exportToExcel(filteredSubmissions, {
      type: selectedTrackId !== 'all' ? 'track' : selectedExamCode !== 'all' ? 'examCode' : 'all',
      trackId: selectedTrackId !== 'all' ? selectedTrackId : undefined,
      examCode: selectedExamCode !== 'all' ? selectedExamCode : undefined
    });
    setShowExportMenu(false);
  };

  const handleExportAll = () => {
    exportToExcel(submissions, { type: 'all' });
    setShowExportMenu(false);
  };

  const handleExportSummary = () => {
    exportSummaryToExcel(submissions, 'track');
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="back-to-dashboard-button"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {role === 'teacher' ? 'My Submissions' : 'Exam Submissions'}
                </h1>
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 mt-1">
                  {breadcrumbs.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index === 0 ? (
                        <button
                          onClick={() => handleBreadcrumbClick(item)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <button
                            onClick={() => handleBreadcrumbClick(item)}
                            className={`text-sm font-medium transition-colors ${
                              index === breadcrumbs.length - 1
                                ? 'text-gray-900'
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            {item.label}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </nav>

                {role === 'teacher' && navigationLevel === 'tracks' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing submissions for your assigned tracks only
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  data-testid="export-button"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      <button
                        onClick={handleExportFiltered}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">Export Filtered ({filteredSubmissions.length})</div>
                          <div className="text-xs text-gray-500">Current view with filters</div>
                        </div>
                      </button>
                      <button
                        onClick={handleExportAll}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">Export All ({submissions.length})</div>
                          <div className="text-xs text-gray-500">All submissions</div>
                        </div>
                      </button>
                      <button
                        onClick={handleExportSummary}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-gray-900">Export Summary</div>
                          <div className="text-xs text-gray-500">Track-wise statistics</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="toggle-filters-button"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="refresh-submissions-button"
              >
                <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CloseIcon className="w-3 h-3" />
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Track Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Track</label>
                  <select
                    value={selectedTrackId}
                    onChange={(e) => setSelectedTrackId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="track-filter-select"
                  >
                    <option value="all">All Tracks</option>
                    {displayTracks.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.name} ({trackStats[track.id]?.total || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exam Code Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Session</label>
                  <select
                    value={selectedExamCode}
                    onChange={(e) => setSelectedExamCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="exam-code-filter-select"
                  >
                    <option value="all">All Sessions</option>
                    {availableExamCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                    {availableExamCodes.length === 0 && (
                      <option disabled>No exam codes available</option>
                    )}
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Student name or ID..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="search-submissions-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Level 1: Tracks View */}
        {navigationLevel === 'tracks' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Track</h2>
              <p className="text-gray-600">Choose a track to view its exam sessions</p>
            </div>
            
            {displayTracks.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderIcon size={32} />
                </div>
                <p className="text-gray-500 font-medium mb-2">No tracks available</p>
                <p className="text-sm text-gray-400">
                  {role === 'teacher' ? 'No tracks have been assigned to you yet' : 'No tracks found'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayTracks.map((track) => {
                  const trackSubmissions = getTrackSubmissions(track.id);
                  const examCodes = getExamCodesForTrack(track.id);
                  const gradedCount = trackSubmissions.filter((s) => s.marks && Object.keys(s.marks).length > 0).length;
                  const publishedCount = trackSubmissions.filter((s) => s.resultPublished).length;
                  
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleNavigateToTrack(track.id)}
                      className="bg-white rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-400 hover:shadow-lg hover:scale-105 group"
                      data-testid={`track-folder-${track.id}`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <FolderIcon size={48} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm font-bold text-gray-500 mb-1">
                            {track.shortName}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {track.name}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Exam Sessions</span>
                          <span className="font-semibold text-blue-600">{examCodes.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Submissions</span>
                          <span className="font-semibold text-gray-900">{trackSubmissions.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Average Score</span>
                          <span className="font-semibold text-purple-600">
                            {trackStats[track.id]?.avgScore || 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-600 font-medium">✓ {gradedCount} Graded</span>
                          <span className="text-purple-600 font-medium">⬆ {publishedCount} Published</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Level 2: Exams View */}
        {navigationLevel === 'exams' && currentTrackId && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select an Exam Session</h2>
              <p className="text-gray-600">Choose an exam session to view submissions</p>
            </div>
            
            {(() => {
              const examCodes = getExamCodesForTrack(currentTrackId);
              
              if (examCodes.length === 0) {
                return (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderIcon size={32} />
                    </div>
                    <p className="text-gray-500 font-medium mb-2">No exam sessions found</p>
                    <p className="text-sm text-gray-400">
                      There are no exam sessions for this track yet
                    </p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examCodes.map((examCode) => {
                    const examSubmissions = getExamCodeSubmissions(examCode);
                    const gradedCount = examSubmissions.filter((s) => s.marks && Object.keys(s.marks).length > 0).length;
                    const publishedCount = examSubmissions.filter((s) => s.resultPublished).length;
                    const pendingCount = examSubmissions.length - gradedCount;
                    
                    // Get exam session info
                    const examSession = examSessions.find(s => s.examCode === examCode);
                    
                    // Determine session date (prefer exam session created date, fallback to first submission)
                    let sessionDate: Date | null = null;
                    
                    if (examSession) {
                      // Use exam session date/time
                      const dateTimeStr = `${examSession.date}T${examSession.startTime}`;
                      sessionDate = new Date(dateTimeStr);
                    } else if (examSubmissions.length > 0) {
                      // Fallback to first submission date
                      const firstSubmission = examSubmissions.reduce((earliest, current) => {
                        const currentTime = current.submittedAt ? new Date(current.submittedAt).getTime() : 0;
                        const earliestTime = earliest.submittedAt ? new Date(earliest.submittedAt).getTime() : 0;
                        return currentTime < earliestTime ? current : earliest;
                      }, examSubmissions[0]);
                      
                      sessionDate = firstSubmission?.submittedAt 
                        ? new Date(firstSubmission.submittedAt)
                        : null;
                    }
                    
                    const formatDate = (date: Date | null) => {
                      if (!date) return 'Date not available';
                      
                      const options: Intl.DateTimeFormatOptions = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      };
                      
                      return date.toLocaleDateString('en-US', options);
                    };
                    
                    return (
                      <button
                        key={examCode}
                        onClick={() => handleNavigateToExamCode(examCode)}
                        className="bg-white rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-400 hover:shadow-lg hover:scale-105 group"
                        data-testid={`exam-folder-${examCode}`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <FolderIcon size={40} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-mono font-bold text-gray-900 mb-1 break-all">
                              {examCode}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(sessionDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Submissions</span>
                            <span className="font-semibold text-gray-900">{examSubmissions.length}</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                            {gradedCount > 0 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✓ {gradedCount} Graded
                              </span>
                            )}
                            {publishedCount > 0 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                ⬆ {publishedCount} Published
                              </span>
                            )}
                            {pendingCount > 0 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                ⏳ {pendingCount} Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Level 3: Submissions Detail View */}
        {navigationLevel === 'submissions' && (
          <>
            {/* Statistics */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
                  <div className="text-3xl font-bold text-gray-900">{filteredSubmissions.length}</div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Average Score</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredSubmissions.length > 0
                      ? Math.round(
                          filteredSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / filteredSubmissions.length
                        )
                      : 0}
                    %
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Graded</div>
                  <div className="text-3xl font-bold text-green-600">
                    {filteredSubmissions.filter((s) => s.marks && Object.keys(s.marks).length > 0).length}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Published</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {filteredSubmissions.filter((s) => s.resultPublished).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Track Cards Overview */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayTracks.map((track) => {
                const trackSubmissions = submissions.filter((s) => s.trackId === track.id);
                const isSelected = selectedTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrackId(isSelected ? 'all' : track.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    data-testid={`track-card-${track.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-gray-900">{track.shortName}</span>
                      <span className="text-2xl font-bold text-blue-600">{trackSubmissions.length}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">{track.name}</p>
                    <p className="text-xs text-gray-500">
                      Avg: {trackStats[track.id]?.avgScore || 0}% • {track.duration} mins
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Submissions Table */}
          </>
        )}

        {/* Submissions Table - Only for Level 3 */}
        {navigationLevel === 'submissions' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">
                {searchQuery || selectedTrackId !== 'all' || selectedExamCode !== 'all'
                  ? 'No matching submissions'
                  : 'No submissions yet'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery || selectedTrackId !== 'all' || selectedExamCode !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Waiting for students to complete exams...'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Student Name
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('id')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Student ID
                        <SortIcon field="id" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Track / Exam Code
                    </th>
                    <th
                      onClick={() => handleSort('time')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Submitted At
                        <SortIcon field="time" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('score')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Score
                        <SortIcon field="score" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => {
                    const stats = getAnswerStats(submission);
                    const track = allTracks.find((t) => t.id === submission.trackId);
                    return (
                      <Fragment key={submission.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">
                              {submission.studentName || 'Unknown Student'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm text-gray-600">{submission.studentId || 'Unknown'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-gray-900">
                                {track?.shortName || 'N/A'} - {submission.trackName}
                              </span>
                              {submission.examCode && (
                                <span className="font-mono text-xs text-blue-600">{submission.examCode}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className="text-lg font-semibold text-blue-600">{submission.score}%</span>
                              {submission.resultPublished && submission.manualScore !== undefined && (
                                <span className="text-sm font-semibold text-green-600">
                                  Manual: {submission.manualScore}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircleIcon className="w-3 h-3" />
                                Completed
                              </span>
                              {submission.resultPublished && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <SendIcon className="w-3 h-3" />
                                  Published
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleExpand(submission.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                              data-testid={`view-submission-${submission.id}`}
                            >
                              {expandedId === submission.id ? (
                                <>
                                  Hide <ChevronUpIcon className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  View <ChevronDownIcon className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedId === submission.id && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Detailed Answers & Marking</h4>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">Time Spent: {submission.timeSpent}</span>
                                      <span className="text-green-600 font-medium">{stats.answered} Answered</span>
                                      <span className="text-orange-600 font-medium">{stats.unanswered} Unanswered</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setAnswerFilter('all')}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        answerFilter === 'all'
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      All ({stats.total})
                                    </button>
                                    <button
                                      onClick={() => setAnswerFilter('answered')}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        answerFilter === 'answered'
                                          ? 'bg-green-600 text-white'
                                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      Answered ({stats.answered})
                                    </button>
                                    <button
                                      onClick={() => setAnswerFilter('unanswered')}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        answerFilter === 'unanswered'
                                          ? 'bg-orange-600 text-white'
                                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      Unanswered ({stats.unanswered})
                                    </button>
                                  </div>
                                </div>

                                {/* Marking Statistics */}
                                {submission.marks && (
                                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-6">
                                        <div>
                                          <div className="text-xs text-gray-500 mb-1">Marking Progress</div>
                                          <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-sm">
                                              <CheckIcon className="w-4 h-4 text-green-600" />
                                              <span className="font-semibold text-green-600">
                                                {getMarkingStats(submission).correct}
                                              </span>
                                              <span className="text-gray-600">Correct</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-sm">
                                              <XIcon className="w-4 h-4 text-red-600" />
                                              <span className="font-semibold text-red-600">
                                                {getMarkingStats(submission).incorrect}
                                              </span>
                                              <span className="text-gray-600">Incorrect</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-sm">
                                              <AlertCircleIcon className="w-4 h-4 text-gray-400" />
                                              <span className="font-semibold text-gray-600">
                                                {getMarkingStats(submission).unmarked}
                                              </span>
                                              <span className="text-gray-600">Unmarked</span>
                                            </span>
                                          </div>
                                        </div>
                                        {submission.manualScore !== undefined && (
                                          <div className="border-l pl-6">
                                            <div className="text-xs text-gray-500 mb-1">Manual Score</div>
                                            <div className="text-2xl font-bold text-blue-600">
                                              {submission.manualScore}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {submission.marks && Object.keys(submission.marks).length > 0 && (
                                          <button
                                            onClick={() => setPrintSubmission(submission)}
                                            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                            title="Print Result"
                                          >
                                            <Printer className="w-4 h-4" />
                                            Print
                                          </button>
                                        )}
                                        {submission.resultPublished ? (
                                          <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                                              <SendIcon className="w-4 h-4" />
                                              <span className="font-medium">Result Published</span>
                                            </div>
                                            {submission.publishedAt && (
                                              <div className="text-xs text-gray-500 mt-1">
                                                {new Date(submission.publishedAt).toLocaleString()}
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => handlePublishResult(submission.id)}
                                            disabled={!isAllMarked(submission)}
                                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                              isAllMarked(submission)
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                            title={
                                              !isAllMarked(submission)
                                                ? 'Please mark all questions before publishing'
                                                : 'Publish result'
                                            }
                                          >
                                            <SendIcon className="w-4 h-4" />
                                            Publish Result
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {getFilteredQuestions(submission).map((question) => {
                                    const mark = submission.marks?.[question.questionNumber];
                                    return (
                                      <div
                                        key={question.questionNumber}
                                        className={`p-3 rounded-lg border transition-all ${
                                          mark === 'correct'
                                            ? 'bg-green-50 border-green-300'
                                            : mark === 'incorrect'
                                            ? 'bg-red-50 border-red-300'
                                            : question.answer === null
                                            ? 'bg-orange-50 border-orange-200'
                                            : 'bg-white border-gray-200'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="text-xs font-semibold text-gray-700">
                                            Question {question.questionNumber}
                                          </div>
                                          {question.answer === null ? (
                                            <AlertCircleIcon className="w-4 h-4 text-orange-500" />
                                          ) : mark === 'correct' ? (
                                            <CheckIcon className="w-4 h-4 text-green-600" />
                                          ) : mark === 'incorrect' ? (
                                            <XIcon className="w-4 h-4 text-red-600" />
                                          ) : (
                                            <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                                          )}
                                        </div>

                                        <div className="text-sm font-medium mb-3 min-h-[40px]">
                                          {question.answer === null ? (
                                            <span className="text-orange-600 italic">Not Answered</span>
                                          ) : (
                                            <span className="text-gray-900">{question.answer}</span>
                                          )}
                                        </div>

                                        {/* Marking Buttons */}
                                        {!submission.resultPublished && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() =>
                                                handleMarkQuestion(
                                                  submission.id,
                                                  question.questionNumber,
                                                  mark === 'correct' ? null : 'correct'
                                                )
                                              }
                                              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                                                mark === 'correct'
                                                  ? 'bg-green-600 text-white'
                                                  : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'
                                              }`}
                                              title="Mark as correct"
                                            >
                                              <CheckIcon className="w-3 h-3" />
                                              Correct
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleMarkQuestion(
                                                  submission.id,
                                                  question.questionNumber,
                                                  mark === 'incorrect' ? null : 'incorrect'
                                                )
                                              }
                                              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                                                mark === 'incorrect'
                                                  ? 'bg-red-600 text-white'
                                                  : 'bg-white border border-red-300 text-red-700 hover:bg-red-50'
                                              }`}
                                              title="Mark as incorrect"
                                            >
                                              <XIcon className="w-3 h-3" />
                                              Incorrect
                                            </button>
                                          </div>
                                        )}

                                        {submission.resultPublished && (
                                          <div className="text-center text-xs font-medium">
                                            {mark === 'correct' ? (
                                              <span className="text-green-700">✓ Marked Correct</span>
                                            ) : mark === 'incorrect' ? (
                                              <span className="text-red-700">✗ Marked Incorrect</span>
                                            ) : (
                                              <span className="text-gray-500">Not Marked</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </main>

      {/* Printable Result Modal */}
      {printSubmission && (
        <PrintableResult
          submission={printSubmission}
          onClose={() => setPrintSubmission(null)}
        />
      )}
    </div>
  );
}
