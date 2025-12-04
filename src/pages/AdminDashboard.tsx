import { useEffect, useState, Fragment } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, ShieldCheckIcon, SearchIcon, RefreshCwIcon, AlertCircleIcon, Music, Play, CheckIcon, XIcon, SendIcon } from 'lucide-react';
import { storage, ExamSubmission } from '../utils/storage';
import { AudioManager } from '../components/AudioManager';
import { ExamController } from '../components/ExamController';

const EXAM_NAME = 'P-L-2 Application for membership';

type AnswerFilter = 'all' | 'answered' | 'unanswered';
type TabType = 'submissions' | 'audio' | 'exam-control';
export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ExamSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'id' | 'time' | 'score'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('submissions');
  useEffect(() => {
    loadSubmissions();
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    filterAndSortSubmissions();
  }, [submissions, searchQuery, sortField, sortDirection]);
  const loadSubmissions = () => {
    const data = storage.getSubmissions();
    setSubmissions(data);
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSubmissions();
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

  const handleMarkQuestion = (submissionId: string, questionNumber: number, mark: 'correct' | 'incorrect' | null) => {
    storage.updateMark(submissionId, questionNumber, mark);
    loadSubmissions();
  };

  const handlePublishResult = (submissionId: string) => {
    const success = storage.publishResult(submissionId);
    if (success) {
      loadSubmissions();
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
                <p className="text-sm text-blue-600 font-medium">{EXAM_NAME}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'submissions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'audio'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Music className="w-4 h-4" />
              Audio Management
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'audio' ? (
          <AudioManager />
        ) : activeTab === 'exam-control' ? (
          <ExamController />
        ) : (
          <>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">
                Total Submissions
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {submissions.length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Average Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {submissions.length > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / submissions.length) : 0}
                %
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Completed Today</div>
              <div className="text-3xl font-bold text-green-600">
                {submissions.filter(s => {
                const today = new Date().toDateString();
                return new Date(s.submittedAt).toDateString() === today;
              }).length}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by student name or ID..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredSubmissions.length === 0 ? <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">
                {searchQuery ? 'No matching submissions' : 'No submissions yet'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Waiting for students to complete exams...'}
              </p>
            </div> : <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-1">
                        Student Name
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-1">
                        Student ID
                        <SortIcon field="id" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('time')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-1">
                        Submitted At
                        <SortIcon field="time" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('score')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
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
                  {filteredSubmissions.map(submission => {
                const stats = getAnswerStats(submission);
                return <Fragment key={submission.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">
                              {submission.studentName || 'Unknown Student'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm text-gray-600">
                              {submission.studentId || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {formatDate(submission.submittedAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className="text-lg font-semibold text-blue-600">
                                {submission.score}%
                              </span>
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
                            <button onClick={() => toggleExpand(submission.id)} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                              {expandedId === submission.id ? <>
                                  Hide <ChevronUpIcon className="w-4 h-4" />
                                </> : <>
                                  View <ChevronDownIcon className="w-4 h-4" />
                                </>}
                            </button>
                          </td>
                        </tr>
                        {expandedId === submission.id && <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      Detailed Answers & Marking
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-gray-600">
                                        Time Spent: {submission.timeSpent}
                                      </span>
                                      <span className="text-green-600 font-medium">
                                        {stats.answered} Answered
                                      </span>
                                      <span className="text-orange-600 font-medium">
                                        {stats.unanswered} Unanswered
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button onClick={() => setAnswerFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${answerFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                      All ({stats.total})
                                    </button>
                                    <button onClick={() => setAnswerFilter('answered')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${answerFilter === 'answered' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                      Answered ({stats.answered})
                                    </button>
                                    <button onClick={() => setAnswerFilter('unanswered')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${answerFilter === 'unanswered' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
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
                                              <span className="font-semibold text-green-600">{getMarkingStats(submission).correct}</span>
                                              <span className="text-gray-600">Correct</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-sm">
                                              <XIcon className="w-4 h-4 text-red-600" />
                                              <span className="font-semibold text-red-600">{getMarkingStats(submission).incorrect}</span>
                                              <span className="text-gray-600">Incorrect</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-sm">
                                              <AlertCircleIcon className="w-4 h-4 text-gray-400" />
                                              <span className="font-semibold text-gray-600">{getMarkingStats(submission).unmarked}</span>
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
                                      <div>
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
                                            title={!isAllMarked(submission) ? 'Please mark all questions before publishing' : 'Publish result'}
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
                                  {getFilteredQuestions(submission).map(question => {
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
                                            <span className="text-orange-600 italic">
                                              Not Answered
                                            </span>
                                          ) : (
                                            <span className="text-gray-900">
                                              {question.answer}
                                            </span>
                                          )}
                                        </div>

                                        {/* Marking Buttons */}
                                        {!submission.resultPublished && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => handleMarkQuestion(
                                                submission.id, 
                                                question.questionNumber, 
                                                mark === 'correct' ? null : 'correct'
                                              )}
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
                                              onClick={() => handleMarkQuestion(
                                                submission.id, 
                                                question.questionNumber, 
                                                mark === 'incorrect' ? null : 'incorrect'
                                              )}
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
                          </tr>}
                      </Fragment>;
              })}
                </tbody>
              </table>
            </div>}
        </div>
          </>
        )}
      </main>
    </div>;
}