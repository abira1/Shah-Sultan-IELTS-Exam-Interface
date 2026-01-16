import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCwIcon,
  Download,
  FileSpreadsheet,
  Printer,
  CheckIcon,
  XIcon,
  SendIcon,
  AlertCircle as AlertCircleIcon,
  Trash2,
  Upload,
  BarChart3,
} from 'lucide-react';
import { storage, ExamSubmission } from '../../utils/storage';
import { examSessionService, ExamSession } from '../../services/examSessionService';
import { useAuth } from '../../contexts/AuthContext';
import { exportToExcel, exportSummaryToExcel } from '../../utils/exportExcel';
import { PrintableResult } from '../../components/PrintableResult';
import { SectionSubmissionCard } from '../../components/SectionSubmissionCard';
import { SpeakingMarksInput } from '../../components/SpeakingMarksInput';
import { FileTree, FileNode } from '../../components/ui/file-tree';
import { buildSubmissionTree } from '../../utils/submissionTreeBuilder';
import { allTracks } from '../../data/tracks';
import { ContextMenu, ContextMenuItem } from '../../components/ui/context-menu';
import { AnswerKeyUploadModal } from '../../components/AnswerKeyUploadModal';
import { MarkingStatusModal } from '../../components/MarkingStatusModal';
import { MockTestAnswerKeyModal } from '../../components/MockTestAnswerKeyModal';
import { WritingTaskMarkingModal } from '../../components/WritingTaskMarkingModal';
import { calculateOverallBand } from '../../utils/bandScoreConversion';

// Partial Test Marking Interface Component
interface PartialTestMarkingInterfaceProps {
  submission: ExamSubmission;
  onMarkQuestion: (submissionId: string, questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => void;
  onPublishResult: (submissionId: string) => void;
  getMarkingStats: (submission: ExamSubmission) => { correct: number; incorrect: number; unmarked: number; total: number };
  getAllQuestions: (submission: ExamSubmission) => { questionNumber: number | string; answer: string | null }[];
  isAllMarked: (submission: ExamSubmission) => boolean;
}

function PartialTestMarkingInterface({
  submission,
  onMarkQuestion,
  onPublishResult,
  getMarkingStats,
  getAllQuestions,
  isAllMarked
}: PartialTestMarkingInterfaceProps) {
  const stats = getMarkingStats(submission);
  const allQuestions = getAllQuestions(submission);

  return (
    <div className="space-y-4">
      {/* Marking Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Marking Progress</h4>
          <div className="text-sm text-gray-600">
            {stats.correct + stats.incorrect} / {stats.total} marked
          </div>
        </div>
        <div className="flex gap-4 text-sm mb-2">
          <span className="text-green-600 font-medium">✓ {stats.correct} Correct</span>
          <span className="text-red-600 font-medium">✗ {stats.incorrect} Incorrect</span>
          <span className="text-gray-600 font-medium">○ {stats.unmarked} Unmarked</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${((stats.correct + stats.incorrect) / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Manual Score Display */}
      {submission.manualScore !== undefined && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium mb-1">Manual Score</div>
              <div className="text-3xl font-bold text-blue-900">{submission.manualScore}%</div>
            </div>
            <div className="text-sm text-gray-600">
              Based on {stats.correct} correct answers
            </div>
          </div>
        </div>
      )}

      {/* Questions Grid */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Questions & Answers</h4>
        <div className="grid gap-3">
          {allQuestions.map(({ questionNumber, answer }) => {
            const mark = submission.marks?.[questionNumber];
            const isWritingTask = typeof questionNumber === 'string' && questionNumber.startsWith('task');

            return (
              <div
                key={questionNumber}
                className={`border-2 rounded-lg p-4 transition-all ${
                  mark === 'correct'
                    ? 'border-green-500 bg-green-50'
                    : mark === 'incorrect'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-2">
                      {isWritingTask
                        ? `${questionNumber === 'task1' ? 'Task 1' : 'Task 2'}`
                        : `Question ${questionNumber}`
                      }
                    </div>
                    <div className="text-sm text-gray-700 bg-white rounded p-3 border border-gray-200">
                      {answer || <span className="text-gray-400 italic">No answer provided</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onMarkQuestion(submission.id, questionNumber, mark === 'correct' ? null : 'correct')}
                      disabled={submission.resultPublished}
                      className={`p-2 rounded-lg transition-colors ${
                        mark === 'correct'
                          ? 'bg-green-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Mark as correct"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onMarkQuestion(submission.id, questionNumber, mark === 'incorrect' ? null : 'incorrect')}
                      disabled={submission.resultPublished}
                      className={`p-2 rounded-lg transition-colors ${
                        mark === 'incorrect'
                          ? 'bg-red-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Mark as incorrect"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Publish Button */}
      <div className="border-t pt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {!isAllMarked(submission) && (
            <span className="flex items-center gap-2 text-orange-600">
              <AlertCircleIcon className="w-4 h-4" />
              Please mark all questions before publishing
            </span>
          )}
        </div>
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
            onClick={() => onPublishResult(submission.id)}
            disabled={!isAllMarked(submission)}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
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
  );
}

export function SubmissionsPageNew() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Data state
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tree and selection state
  const [treeData, setTreeData] = useState<FileNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);

  // Expanded submission details
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Print preview
  const [printSubmission, setPrintSubmission] = useState<ExamSubmission | null>(null);

  // Phase 3: Section navigation for mock tests
  const [currentSectionSlide, setCurrentSectionSlide] = useState<'listening' | 'reading' | 'writing'>('listening');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ node: FileNode; position: { x: number; y: number } } | null>(null);

  // Modal states
  const [answerKeyModal, setAnswerKeyModal] = useState<{ examCode: string; trackType: 'listening' | 'reading'; totalQuestions: number; existingAnswerKey?: Record<number, string> | null } | null>(null);
  const [mockTestAnswerKeyModal, setMockTestAnswerKeyModal] = useState<{ examCode: string; existingListeningKey?: Record<number, string> | null; existingReadingKey?: Record<number, string> | null } | null>(null);
  const [markingStatusModal, setMarkingStatusModal] = useState<{ examCode: string; stats: any } | null>(null);
  const [writingTaskModal, setWritingTaskModal] = useState<{
    submissionId: string;
    taskKey: string;
    taskNumber: 1 | 2;
    taskAnswer: string;
    currentBandScore?: number;
  } | null>(null);

  useEffect(() => {
    loadSubmissions();
    loadExamSessions();

    // Set up real-time listener
    const unsubscribe = storage.subscribeToSubmissions((realTimeSubmissions) => {
      console.log('Real-time update: Received submissions', realTimeSubmissions.length);

      // Filter by assigned tracks if user is a teacher
      let filteredData = realTimeSubmissions;
      if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
        // Include mock test submissions (trackId='mock') along with assigned tracks
        filteredData = realTimeSubmissions.filter(s =>
          s.trackId === 'mock' || user.assignedTracks!.includes(s.trackId)
        );
      }

      setSubmissions(filteredData);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, role]);

  // Rebuild tree when submissions or sessions change
  useEffect(() => {
    const tree = buildSubmissionTree(submissions, examSessions);
    setTreeData(tree);
  }, [submissions, examSessions]);

  // Sync selectedSubmission when submissions array updates
  useEffect(() => {
    if (selectedSubmission) {
      // Find the updated version of the selected submission
      const updatedSubmission = submissions.find(s => s.id === selectedSubmission.id);
      if (updatedSubmission) {
        // Only update if the data has actually changed to avoid infinite loops
        if (JSON.stringify(updatedSubmission) !== JSON.stringify(selectedSubmission)) {
          setSelectedSubmission(updatedSubmission);
        }
      }
    }
  }, [submissions]);

  const loadSubmissions = async () => {
    try {
      let data = await storage.getSubmissions();

      // Filter by assigned tracks if user is a teacher
      if (role === 'teacher' && user?.assignedTracks && user.assignedTracks.length > 0) {
        // Include mock test submissions (trackId='mock') along with assigned tracks
        data = data.filter(s =>
          s.trackId === 'mock' || user.assignedTracks!.includes(s.trackId)
        );
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
        // Include mock test sessions (testType='mock') along with assigned track sessions
        filteredSessions = sessions.filter(s =>
          s.testType === 'mock' || user.assignedTracks!.includes(s.trackId)
        );
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

  const handleNodeClick = (node: FileNode) => {
    setSelectedNode(node);

    // If it's a submission (file type), load the full submission data
    if (node.type === 'file' && node.metadata?.submissionId) {
      const submission = submissions.find(s => s.id === node.metadata!.submissionId);
      setSelectedSubmission(submission || null);
      setExpandedId(null); // Reset expanded state
    } else {
      setSelectedSubmission(null);
    }
  };

  const handleContextMenu = (node: FileNode, event: React.MouseEvent) => {
    // Only show context menu for session folders
    if (node.extension === 'session' && node.metadata?.examCode) {
      setContextMenu({
        node,
        position: { x: event.clientX, y: event.clientY }
      });
    }
  };

  const handleDeleteAllSubmissions = async (examCode: string, trackId: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ALL submissions for session "${examCode}"?\n\nThis will also delete the session record itself.\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Step 1: Delete all submissions for this session
      const submissionsDeleted = await storage.deleteSubmissionsByExamCode(examCode, trackId);

      if (!submissionsDeleted) {
        alert('Failed to delete submissions. Please try again.');
        return;
      }

      // Step 2: Delete the session record itself
      const sessionDeleted = await examSessionService.deleteExamSession(examCode);

      if (!sessionDeleted) {
        console.warn('Submissions deleted but failed to delete session record');
      }

      // Step 3: Refresh data to update UI
      alert('Session and all submissions deleted successfully!');
      await loadSubmissions();
      await loadExamSessions(); // Refresh sessions list to remove the deleted session
      setSelectedSubmission(null);
      setSelectedNode(null);
    } catch (error) {
      console.error('Error deleting session and submissions:', error);
      alert('Error deleting submissions: ' + error);
    }
  };

  const handleUploadAnswerKey = async (examCode: string) => {
    // Get submissions for this exam code to determine track type
    const sessionSubmissions = submissions.filter(s => s.examCode === examCode);

    if (sessionSubmissions.length === 0) {
      alert('No submissions found for this session.');
      return;
    }

    const testType = sessionSubmissions[0].testType;

    // Handle Mock Test auto-marking
    if (testType === 'mock') {
      // Fetch existing answer keys for both listening and reading
      const existingListeningKey = await storage.getAnswerKey(examCode, 'listening');
      const existingReadingKey = await storage.getAnswerKey(examCode, 'reading');

      setMockTestAnswerKeyModal({
        examCode,
        existingListeningKey,
        existingReadingKey
      });
      return;
    }

    // Handle Partial Test auto-marking
    const trackType = sessionSubmissions[0].trackType;

    if (trackType !== 'listening' && trackType !== 'reading') {
      alert('Auto-marking is only available for Listening and Reading tracks.');
      return;
    }

    // Verify all submissions have the same track type
    const allSameType = sessionSubmissions.every(s => s.trackType === trackType);
    if (!allSameType) {
      alert('All submissions in this session must be of the same track type.');
      return;
    }

    const totalQuestions = sessionSubmissions[0].totalQuestions || 40;

    // Fetch existing answer key if available
    const existingAnswerKey = await storage.getAnswerKey(examCode, trackType);

    setAnswerKeyModal({ examCode, trackType, totalQuestions, existingAnswerKey });
  };

  const handleAutoMark = async (
    answerKey: Record<number, string>,
    onProgress: (current: number, total: number, studentName: string) => void
  ) => {
    if (!answerKeyModal) return;

    try {
      const result = await storage.autoMarkSubmissions(
        answerKeyModal.examCode,
        answerKey,
        answerKeyModal.trackType,
        onProgress
      );

      if (result.success) {
        // Save the answer key for future use
        await storage.saveAnswerKey(
          answerKeyModal.examCode,
          answerKeyModal.trackType,
          answerKey
        );

        // Success is now handled by the modal's completion UI
        if (result.errors.length > 0) {
          console.error('Auto-marking errors:', result.errors);
        }
        // Reload submissions to reflect changes
        await loadSubmissions();
      } else {
        alert('Auto-marking failed: ' + result.errors.join('\n'));
      }
    } catch (error) {
      console.error('Error during auto-marking:', error);
      throw error; // Let the modal handle the error
    }
  };

  const handleMockTestAutoMark = async (
    listeningKey: Record<number, string>,
    readingKey: Record<number, string>,
    onProgress: (current: number, total: number, studentName: string, section: string) => void
  ) => {
    if (!mockTestAnswerKeyModal) return;

    try {
      // Get all mock test submissions for this exam code
      const mockSubmissions = submissions.filter(s => s.examCode === mockTestAnswerKeyModal.examCode && s.testType === 'mock');

      let successCount = 0;
      const errors: string[] = [];

      // Auto-mark each submission's listening and reading sections
      for (let i = 0; i < mockSubmissions.length; i++) {
        const submission = mockSubmissions[i];

        try {
          // Mark Listening section
          if (submission.sectionSubmissions?.listening) {
            onProgress(i + 1, mockSubmissions.length, submission.studentName, 'Listening');

            const listeningMarks: Record<number, 'correct' | 'incorrect'> = {};
            let listeningCorrectCount = 0;

            for (let q = 1; q <= 40; q++) {
              const studentAnswer = submission.sectionSubmissions.listening.answers?.[q]?.trim().toLowerCase();
              const correctAnswerRaw = listeningKey[q]?.trim() || '';

              if (!studentAnswer) {
                listeningMarks[q] = 'incorrect';
              } else {
                // Split answer key by '/' to support multiple alternative answers
                const correctAnswers = correctAnswerRaw
                  .split('/')
                  .map(ans => ans.trim().toLowerCase())
                  .filter(ans => ans.length > 0);

                // Debug logging
                console.log(`[Mock Test Listening Debug] Question ${q}:`);
                console.log(`  Student Answer: "${studentAnswer}"`);
                console.log(`  Answer Key Raw: "${correctAnswerRaw}"`);
                console.log(`  Alternatives: [${correctAnswers.map(a => `"${a}"`).join(', ')}]`);

                // Check if student answer matches ANY of the alternative answers (case-insensitive)
                const isCorrect = correctAnswers.some(correctAns => studentAnswer === correctAns);

                console.log(`  Match Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);

                if (isCorrect) {
                  listeningMarks[q] = 'correct';
                  listeningCorrectCount++;
                } else {
                  listeningMarks[q] = 'incorrect';
                }
              }
            }

            // Update listening section with marks
            const updatedListeningData = {
              ...submission.sectionSubmissions.listening,
              marks: listeningMarks,
              correctAnswers: listeningCorrectCount
            };
            await storage.updateSectionSubmission(submission.id, 'listening', updatedListeningData);
          }

          // Mark Reading section
          if (submission.sectionSubmissions?.reading) {
            onProgress(i + 1, mockSubmissions.length, submission.studentName, 'Reading');

            const readingMarks: Record<number, 'correct' | 'incorrect'> = {};
            let readingCorrectCount = 0;

            for (let q = 1; q <= 40; q++) {
              const studentAnswer = submission.sectionSubmissions.reading.answers?.[q]?.trim().toLowerCase();
              const correctAnswerRaw = readingKey[q]?.trim() || '';

              if (!studentAnswer) {
                readingMarks[q] = 'incorrect';
              } else {
                // Split answer key by '/' to support multiple alternative answers
                const correctAnswers = correctAnswerRaw
                  .split('/')
                  .map(ans => ans.trim().toLowerCase())
                  .filter(ans => ans.length > 0);

                // Debug logging
                console.log(`[Mock Test Reading Debug] Question ${q}:`);
                console.log(`  Student Answer: "${studentAnswer}"`);
                console.log(`  Answer Key Raw: "${correctAnswerRaw}"`);
                console.log(`  Alternatives: [${correctAnswers.map(a => `"${a}"`).join(', ')}]`);

                // Check if student answer matches ANY of the alternative answers (case-insensitive)
                const isCorrect = correctAnswers.some(correctAns => studentAnswer === correctAns);

                console.log(`  Match Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);

                if (isCorrect) {
                  readingMarks[q] = 'correct';
                  readingCorrectCount++;
                } else {
                  readingMarks[q] = 'incorrect';
                }
              }
            }

            // Update reading section with marks
            const updatedReadingData = {
              ...submission.sectionSubmissions.reading,
              marks: readingMarks,
              correctAnswers: readingCorrectCount
            };
            await storage.updateSectionSubmission(submission.id, 'reading', updatedReadingData);
          }

          successCount++;
        } catch (error) {
          console.error(`Error marking submission ${submission.id}:`, error);
          errors.push(`${submission.studentName}: ${error}`);
        }
      }

      // Save answer keys for future use
      await storage.saveAnswerKey(mockTestAnswerKeyModal.examCode, 'listening', listeningKey);
      await storage.saveAnswerKey(mockTestAnswerKeyModal.examCode, 'reading', readingKey);

      // Reload submissions
      await loadSubmissions();

      if (errors.length > 0) {
        console.error('Auto-marking errors:', errors);
      }
    } catch (error) {
      console.error('Error during mock test auto-marking:', error);
      throw error;
    }
  };

  const handleGetMarkingStatus = async (examCode: string) => {
    try {
      const stats = await storage.getSessionMarkingStats(examCode);
      setMarkingStatusModal({ examCode, stats });
    } catch (error) {
      console.error('Error getting marking status:', error);
      alert('Error getting marking status: ' + error);
    }
  };

  const handleExportFiltered = () => {
    if (selectedSubmission) {
      exportToExcel([selectedSubmission]);
    }
    setShowExportMenu(false);
  };

  const handleExportAll = () => {
    exportToExcel(submissions);
    setShowExportMenu(false);
  };

  const handleExportSummary = () => {
    exportSummaryToExcel(submissions, 'track');
    setShowExportMenu(false);
  };

  // Marking and publishing functions
  const isAllMarked = (submission: ExamSubmission): boolean => {
    if (!submission.marks) return false;
    const stats = getMarkingStats(submission);
    return stats.unmarked === 0;
  };

  const getMarkingStats = (submission: ExamSubmission) => {
    const totalQs = submission.totalQuestions || 40;

    if (!submission.marks) {
      return { correct: 0, incorrect: 0, unmarked: totalQs, total: totalQs };
    }

    let correct = 0;
    let incorrect = 0;
    let unmarked = 0;

    // For writing tracks with task-based questions
    if (submission.trackType === 'writing' && totalQs === 2) {
      const taskKeys = ['task1', 'task2'];
      taskKeys.forEach(key => {
        const mark = submission.marks![key];
        if (mark === 'correct') correct++;
        else if (mark === 'incorrect') incorrect++;
        else unmarked++;
      });
    } else {
      // For reading/listening tracks with numbered questions
      for (let i = 1; i <= totalQs; i++) {
        const mark = submission.marks[i];
        if (mark === 'correct') correct++;
        else if (mark === 'incorrect') incorrect++;
        else unmarked++;
      }
    }

    return { correct, incorrect, unmarked, total: totalQs };
  };

  const handleMarkQuestion = async (submissionId: string, questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => {
    // Optimistic update: Update local state immediately for instant UI feedback
    if (selectedSubmission && selectedSubmission.id === submissionId) {
      const updatedSubmission = {
        ...selectedSubmission,
        marks: {
          ...selectedSubmission.marks,
          [questionNumber]: mark
        }
      };
      setSelectedSubmission(updatedSubmission);

      // Also update in the submissions array for consistency
      setSubmissions(prevSubmissions =>
        prevSubmissions.map(s =>
          s.id === submissionId
            ? updatedSubmission
            : s
        )
      );
    }

    // Update in storage (Firebase + localStorage)
    await storage.updateMark(submissionId, questionNumber, mark);

    // The real-time listener will sync the data from Firebase
    // No need to call loadSubmissions() as it would cause unnecessary re-renders
  };

  const handlePublishResult = async (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);

    // Check if this is a mock test
    if (submission?.testType === 'mock') {
      const canPublish = await storage.canPublishResult(submissionId);
      if (!canPublish) {
        alert('Cannot publish result. Please ensure all section band scores (Listening, Reading, Writing, and Speaking) are entered.');
        return;
      }
    }

    const totalQs = submission?.totalQuestions || 40;
    const success = await storage.publishResult(submissionId);
    if (success) {
      // Optimistic update: Update local state immediately
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        const updatedSubmission = {
          ...selectedSubmission,
          resultPublished: true,
          publishedAt: new Date().toISOString()
        };
        setSelectedSubmission(updatedSubmission);

        // Also update in the submissions array
        setSubmissions(prevSubmissions =>
          prevSubmissions.map(s =>
            s.id === submissionId
              ? updatedSubmission
              : s
          )
        );
      }

      alert('Result published successfully!');
      // Real-time listener will sync from Firebase
    } else {
      const questionType = submission?.trackType === 'writing' && totalQs === 2 ? 'tasks' : 'questions';
      alert(`Please mark all ${totalQs} ${questionType} before publishing the result.`);
    }
  };

  // Handler for marking questions in mock test sections
  const handleMarkSectionQuestion = async (
    submissionId: string,
    section: 'listening' | 'reading' | 'writing',
    questionNumber: number | string,
    mark: 'correct' | 'incorrect' | null
  ) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission || !submission.sectionSubmissions || !submission.sectionSubmissions[section]) {
        console.error('Section submission not found');
        return;
      }

      const sectionData = submission.sectionSubmissions[section];
      const updatedMarks = {
        ...sectionData.marks,
        [questionNumber]: mark
      };

      const correctCount = Object.values(updatedMarks).filter(m => m === 'correct').length;

      const updatedSectionData = {
        ...sectionData,
        marks: updatedMarks,
        correctAnswers: correctCount
      };

      // Optimistic update: Update local state immediately
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        const updatedSubmission = {
          ...selectedSubmission,
          sectionSubmissions: {
            ...selectedSubmission.sectionSubmissions,
            [section]: updatedSectionData
          }
        };
        setSelectedSubmission(updatedSubmission);

        // Also update in the submissions array
        setSubmissions(prevSubmissions =>
          prevSubmissions.map(s =>
            s.id === submissionId
              ? updatedSubmission
              : s
          )
        );
      }

      await storage.updateSectionSubmission(submissionId, section, updatedSectionData);
      // Real-time listener will sync from Firebase
    } catch (error) {
      console.error('Error marking section question:', error);
    }
  };

  // Helper function to round band score to nearest 0.5 (valid IELTS band score)
  const roundToNearestHalf = (score: number): number => {
    return Math.round(score * 2) / 2;
  };

  // Handler for saving individual writing task band scores
  const handleSaveWritingTaskBandScore = async (
    submissionId: string,
    taskKey: string,
    bandScore: number
  ) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission || !submission.sectionSubmissions || !submission.sectionSubmissions.writing) {
        console.error('Writing section submission not found');
        return;
      }

      const writingSection = submission.sectionSubmissions.writing;

      // Update marks with the band score for this task
      // For writing, marks store band scores (numbers) instead of 'correct'/'incorrect'
      const updatedMarks = {
        ...writingSection.marks,
        [taskKey]: bandScore as any // Cast to any to allow number in marks field
      };

      // Get all task keys
      const taskKeys = Object.keys(writingSection.answers).filter(key => key.includes('task'));

      // Calculate average band score if both tasks are scored
      let averageBandScore: number | undefined;
      if (taskKeys.length === 2) {
        const task1Score = taskKeys[0] === taskKey ? bandScore : (updatedMarks[taskKeys[0]] as number);
        const task2Score = taskKeys[1] === taskKey ? bandScore : (updatedMarks[taskKeys[1]] as number);

        if (task1Score !== undefined && task2Score !== undefined && !isNaN(task1Score) && !isNaN(task2Score)) {
          // Calculate raw average and round to nearest 0.5 for valid IELTS band score
          const rawAverage = (task1Score + task2Score) / 2;
          averageBandScore = roundToNearestHalf(rawAverage);
        }
      }

      const updatedSectionData = {
        ...writingSection,
        marks: updatedMarks as any // Cast to any to allow number values
      };

      // Optimistic update
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        const updatedSubmission = {
          ...selectedSubmission,
          sectionSubmissions: {
            ...selectedSubmission.sectionSubmissions,
            writing: updatedSectionData
          },
          sectionScores: averageBandScore !== undefined ? {
            ...selectedSubmission.sectionScores,
            writing: averageBandScore
          } : selectedSubmission.sectionScores
        };
        setSelectedSubmission(updatedSubmission);

        setSubmissions(prevSubmissions =>
          prevSubmissions.map(s =>
            s.id === submissionId ? updatedSubmission : s
          )
        );
      }

      // Save to storage
      await storage.updateSectionSubmission(submissionId, 'writing', updatedSectionData);

      // If we have an average score, save it as the section band score
      if (averageBandScore !== undefined) {
        await storage.saveSectionBandScore(submissionId, 'writing', averageBandScore);
      }
    } catch (error) {
      console.error('Error saving writing task band score:', error);
    }
  };

  // Handler for saving section band scores
  const handleSaveSectionBandScore = async (
    submissionId: string,
    section: 'listening' | 'reading' | 'writing' | 'speaking',
    bandScore: number
  ) => {
    try {
      const success = await storage.saveSectionBandScore(submissionId, section, bandScore);

      if (success) {
        // Optimistic update: Update local state immediately
        if (selectedSubmission && selectedSubmission.id === submissionId) {
          const updatedSubmission = {
            ...selectedSubmission,
            sectionScores: {
              ...selectedSubmission.sectionScores,
              [section]: bandScore
            }
          };

          // Recalculate overall band if all sections are scored using official IELTS methodology
          const scores = updatedSubmission.sectionScores;
          if (scores?.listening && scores?.reading && scores?.writing && scores?.speaking) {
            updatedSubmission.overallBand = calculateOverallBand(
              scores.listening,
              scores.reading,
              scores.writing,
              scores.speaking
            );
          }

          setSelectedSubmission(updatedSubmission);

          // Also update in the submissions array
          setSubmissions(prevSubmissions =>
            prevSubmissions.map(s =>
              s.id === submissionId
                ? updatedSubmission
                : s
            )
          );
        }

        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} band score saved successfully!`);
        // Real-time listener will sync from Firebase
      } else {
        alert('Failed to save band score. Please try again.');
      }
    } catch (error) {
      console.error('Error saving band score:', error);
      alert('An error occurred while saving the band score.');
    }
  };

  const getAllQuestions = (submission: ExamSubmission) => {
    const allQuestions: { questionNumber: number | string; answer: string | null }[] = [];

    // Check if answers exist and is not empty
    if (!submission.answers || Object.keys(submission.answers).length === 0) {
      // Return empty array or default structure based on track type
      if (submission.trackType === 'writing' && submission.totalQuestions === 2) {
        allQuestions.push(
          { questionNumber: 'task1', answer: null },
          { questionNumber: 'task2', answer: null }
        );
      } else {
        const totalQs = submission.totalQuestions || 40;
        for (let i = 1; i <= totalQs; i++) {
          allQuestions.push({
            questionNumber: i,
            answer: null
          });
        }
      }
      return allQuestions;
    }

    if (submission.trackType === 'writing' && submission.totalQuestions === 2) {
      allQuestions.push(
        { questionNumber: 'task1', answer: submission.answers['task1'] || null },
        { questionNumber: 'task2', answer: submission.answers['task2'] || null }
      );
    } else {
      const totalQs = submission.totalQuestions || 40;
      for (let i = 1; i <= totalQs; i++) {
        allQuestions.push({
          questionNumber: i,
          answer: submission.answers[i] || null
        });
      }
    }

    return allQuestions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {role === 'teacher' ? 'My Submissions' : 'Exam Submissions'}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedSubmission
                    ? `Viewing: ${selectedSubmission.studentName} - ${selectedSubmission.trackName}`
                    : 'Select a submission from the tree to view details'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Export Dropdown */}
              {selectedSubmission && (
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                            <div className="font-medium text-gray-900">Export Current</div>
                            <div className="text-xs text-gray-500">Selected submission</div>
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
              )}

              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCwIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Split Layout */}
      <main className="max-w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[calc(100vh-180px)]">
          {/* Left Sidebar: File Tree (1/3 width) */}
          <div className="w-full lg:w-1/3 max-h-[400px] lg:max-h-[calc(100vh-180px)] overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4">
            <FileTree
              data={treeData}
              onNodeClick={handleNodeClick}
              onContextMenu={handleContextMenu}
              selectedNodeId={selectedNode?.id || null}
              className="sticky top-0"
            />
          </div>

          {/* Right Content Area: Submission Details (2/3 width) */}
          <div className="w-full lg:w-2/3 max-h-[calc(100vh-180px)] overflow-y-auto pb-8">
            {!selectedSubmission ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submission Selected</h3>
                <p className="text-gray-600">
                  Select a submission from the tree on the left to view its details
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                {/* Submission Header */}
                <div className="border-b border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedSubmission.studentName}
                      </h2>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Student ID:</span> {selectedSubmission.studentId}</p>
                        <p><span className="font-medium">Track:</span> {selectedSubmission.trackName}</p>
                        <p><span className="font-medium">Exam Code:</span> {selectedSubmission.examCode || 'N/A'}</p>
                        <p><span className="font-medium">Submitted:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                        <p><span className="font-medium">Time Spent:</span> {selectedSubmission.timeSpent}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {selectedSubmission.resultPublished ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                          <SendIcon className="w-4 h-4" />
                          <span className="font-medium">Published</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                          <span className="font-medium">Pending</span>
                        </div>
                      )}
                      <button
                        onClick={() => setPrintSubmission(selectedSubmission)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="text-sm font-medium">Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submission Content */}
                <div className="p-4 sm:p-6 pb-8">
                  {/* Mock Test Interface */}
                  {selectedSubmission.testType === 'mock' && selectedSubmission.sectionSubmissions && Object.keys(selectedSubmission.sectionSubmissions).length > 0 ? (
                    <div className="space-y-6">
                      {/* Overall Progress Indicator */}
                      {(() => {
                        const tracksMarked = [
                          selectedSubmission.sectionScores?.listening !== undefined,
                          selectedSubmission.sectionScores?.reading !== undefined,
                          selectedSubmission.sectionScores?.writing !== undefined,
                          selectedSubmission.sectionScores?.speaking !== undefined,
                        ].filter(Boolean).length;
                        const totalTracks = 4;
                        const allTracksMarked = tracksMarked === totalTracks;

                        return (
                          <div className={`p-4 rounded-lg border-2 ${allTracksMarked ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {allTracksMarked ? (
                                  <CheckIcon className="w-6 h-6 text-green-600" />
                                ) : (
                                  <AlertCircleIcon className="w-6 h-6 text-blue-600" />
                                )}
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {allTracksMarked ? 'All Tracks Marked!' : 'Marking Progress'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {tracksMarked} / {totalTracks} tracks completed
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {['listening', 'reading', 'writing', 'speaking'].map((track) => {
                                  const isMarked = selectedSubmission.sectionScores?.[track as keyof typeof selectedSubmission.sectionScores] !== undefined;
                                  return (
                                    <div
                                      key={track}
                                      className={`w-3 h-3 rounded-full ${isMarked ? 'bg-green-500' : 'bg-gray-300'}`}
                                      title={`${track.charAt(0).toUpperCase() + track.slice(1)}: ${isMarked ? 'Marked' : 'Not marked'}`}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Section Navigation Tabs */}
                      <div className="flex items-center gap-4 border-b border-gray-300 pb-2">
                        <button
                          onClick={() => setCurrentSectionSlide('listening')}
                          className={`px-6 py-3 font-medium transition-colors rounded-t-lg flex items-center gap-2 ${
                            currentSectionSlide === 'listening'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          🎧 Listening
                          {selectedSubmission.sectionScores?.listening !== undefined && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentSectionSlide('reading')}
                          className={`px-6 py-3 font-medium transition-colors rounded-t-lg flex items-center gap-2 ${
                            currentSectionSlide === 'reading'
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          📖 Reading
                          {selectedSubmission.sectionScores?.reading !== undefined && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentSectionSlide('writing')}
                          className={`px-6 py-3 font-medium transition-colors rounded-t-lg flex items-center gap-2 ${
                            currentSectionSlide === 'writing'
                              ? 'bg-orange-500 text-white'
                              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          ✍️ Writing
                          {selectedSubmission.sectionScores?.writing !== undefined && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Current Section Card */}
                      {selectedSubmission.sectionSubmissions[currentSectionSlide] ? (
                        <div className="mb-6">
                          <SectionSubmissionCard
                            section={currentSectionSlide}
                            sectionData={selectedSubmission.sectionSubmissions[currentSectionSlide]!}
                            onMarkQuestion={(qNum, mark) =>
                              handleMarkSectionQuestion(selectedSubmission.id, currentSectionSlide, qNum, mark)
                            }
                            onSaveBandScore={(band) =>
                              handleSaveSectionBandScore(selectedSubmission.id, currentSectionSlide, band)
                            }
                            currentBandScore={selectedSubmission.sectionScores?.[currentSectionSlide]}
                            isReadOnly={selectedSubmission.resultPublished}
                            onTaskClick={currentSectionSlide === 'writing' ? (taskKey, taskNumber) => {
                              const taskAnswer = selectedSubmission.sectionSubmissions!.writing!.answers[taskKey] || '';
                              const taskScore = selectedSubmission.sectionSubmissions!.writing!.marks?.[taskKey] as number | undefined;
                              setWritingTaskModal({
                                submissionId: selectedSubmission.id,
                                taskKey,
                                taskNumber,
                                taskAnswer,
                                currentBandScore: taskScore
                              });
                            } : undefined}
                            taskBandScores={currentSectionSlide === 'writing'
                              ? selectedSubmission.sectionSubmissions!.writing!.marks as Record<string, number> | undefined
                              : undefined
                            }
                          />
                        </div>
                      ) : (
                        <div className="mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
                          <AlertCircleIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No {currentSectionSlide.charAt(0).toUpperCase() + currentSectionSlide.slice(1)} Section Data
                          </h3>
                          <p className="text-gray-600">
                            This section was not completed or the submission data is incomplete.
                          </p>
                        </div>
                      )}

                      {/* Speaking Marks Input */}
                      <div className="mb-6">
                        <SpeakingMarksInput
                          currentScore={selectedSubmission.sectionScores?.speaking}
                          onSave={(score) => handleSaveSectionBandScore(selectedSubmission.id, 'speaking', score)}
                          isReadOnly={selectedSubmission.resultPublished}
                          isMandatory={!selectedSubmission.resultPublished}
                        />
                      </div>

                      {/* Overall Band Score Display */}
                      {selectedSubmission.overallBand !== undefined && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm opacity-90 mb-1">Overall IELTS Band Score</div>
                              <div className="text-6xl font-bold">{selectedSubmission.overallBand.toFixed(1)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm opacity-90 mb-2">Section Scores</div>
                              <div className="text-lg font-medium space-y-1">
                                <div>L: {selectedSubmission.sectionScores?.listening?.toFixed(1) || '--'}</div>
                                <div>R: {selectedSubmission.sectionScores?.reading?.toFixed(1) || '--'}</div>
                                <div>W: {selectedSubmission.sectionScores?.writing?.toFixed(1) || '--'}</div>
                                <div>S: {selectedSubmission.sectionScores?.speaking?.toFixed(1) || '--'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Publish Button */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-gray-600">
                          {(() => {
                            const missingTracks = [];
                            if (!selectedSubmission.sectionScores?.listening) missingTracks.push('Listening');
                            if (!selectedSubmission.sectionScores?.reading) missingTracks.push('Reading');
                            if (!selectedSubmission.sectionScores?.writing) missingTracks.push('Writing');
                            if (!selectedSubmission.sectionScores?.speaking) missingTracks.push('Speaking');

                            if (missingTracks.length > 0) {
                              return (
                                <span className="flex items-center gap-2 text-red-600">
                                  <AlertCircleIcon className="w-4 h-4" />
                                  Missing scores: {missingTracks.join(', ')}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {selectedSubmission.resultPublished ? (
                          <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
                              <SendIcon className="w-4 h-4" />
                              <span className="font-medium">Result Published</span>
                            </div>
                            {selectedSubmission.publishedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(selectedSubmission.publishedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePublishResult(selectedSubmission.id)}
                            disabled={
                              !selectedSubmission.sectionScores?.listening ||
                              !selectedSubmission.sectionScores?.reading ||
                              !selectedSubmission.sectionScores?.writing ||
                              !selectedSubmission.sectionScores?.speaking
                            }
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            Publish Result
                          </button>
                        )}
                      </div>
                    </div>
                  ) : selectedSubmission.testType === 'mock' ? (
                    /* Mock Test with No Section Data */
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                      <AlertCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Mock Test Submission Data Not Available
                      </h3>
                      <p className="text-gray-600 mb-4">
                        This mock test submission does not contain section-wise data.
                      </p>
                    </div>
                  ) : (
                    /* Partial Test Marking Interface */
                    <PartialTestMarkingInterface
                      submission={selectedSubmission}
                      onMarkQuestion={handleMarkQuestion}
                      onPublishResult={handlePublishResult}
                      getMarkingStats={getMarkingStats}
                      getAllQuestions={getAllQuestions}
                      isAllMarked={isAllMarked}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Print Preview Modal */}
      {printSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Print Preview</h3>
              <button
                onClick={() => setPrintSubmission(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <PrintableResult submission={printSubmission} onClose={() => setPrintSubmission(null)} />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setPrintSubmission(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={getContextMenuItems(contextMenu.node)}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Answer Key Upload Modal */}
      {answerKeyModal && (
        <AnswerKeyUploadModal
          examCode={answerKeyModal.examCode}
          trackType={answerKeyModal.trackType}
          totalQuestions={answerKeyModal.totalQuestions}
          existingAnswerKey={answerKeyModal.existingAnswerKey}
          onSubmit={handleAutoMark}
          onClose={() => setAnswerKeyModal(null)}
        />
      )}

      {/* Marking Status Modal */}
      {markingStatusModal && (
        <MarkingStatusModal
          examCode={markingStatusModal.examCode}
          stats={markingStatusModal.stats}
          onClose={() => setMarkingStatusModal(null)}
        />
      )}

      {/* Mock Test Answer Key Upload Modal */}
      {mockTestAnswerKeyModal && (
        <MockTestAnswerKeyModal
          examCode={mockTestAnswerKeyModal.examCode}
          existingListeningKey={mockTestAnswerKeyModal.existingListeningKey}
          existingReadingKey={mockTestAnswerKeyModal.existingReadingKey}
          onSubmit={handleMockTestAutoMark}
          onClose={() => setMockTestAnswerKeyModal(null)}
        />
      )}

      {/* Writing Task Marking Modal */}
      {writingTaskModal && (
        <WritingTaskMarkingModal
          taskNumber={writingTaskModal.taskNumber}
          taskAnswer={writingTaskModal.taskAnswer}
          taskKey={writingTaskModal.taskKey}
          currentBandScore={writingTaskModal.currentBandScore}
          onSaveBandScore={async (taskKey, bandScore) => {
            await handleSaveWritingTaskBandScore(writingTaskModal.submissionId, taskKey, bandScore);
          }}
          onClose={() => setWritingTaskModal(null)}
        />
      )}
    </div>
  );

  // Helper function to generate context menu items based on node
  function getContextMenuItems(node: FileNode): ContextMenuItem[] {
    const examCode = node.metadata?.examCode || '';
    const trackId = node.metadata?.trackId || '';
    const testType = node.metadata?.testType;

    // Get submissions for this session to determine track type
    const sessionSubmissions = submissions.filter(s => s.examCode === examCode);
    const trackType = sessionSubmissions.length > 0 ? sessionSubmissions[0].trackType : null;
    const isListeningOrReading = trackType === 'listening' || trackType === 'reading';

    const items: ContextMenuItem[] = [
      {
        label: 'Get Marking Status',
        icon: <BarChart3 className="w-4 h-4" />,
        onClick: () => handleGetMarkingStatus(examCode),
      },
    ];

    // Show Upload Answer Key for Listening/Reading partial tests OR mock tests
    if ((isListeningOrReading && testType === 'partial') || testType === 'mock') {
      items.push({
        label: 'Upload Answer Key & Auto-Mark',
        icon: <Upload className="w-4 h-4" />,
        onClick: () => handleUploadAnswerKey(examCode),
      });
    }

    items.push(
      { divider: true } as ContextMenuItem,
      {
        label: 'Delete All Submissions',
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => handleDeleteAllSubmissions(examCode, trackId),
        danger: true,
      }
    );

    return items;
  }
}

