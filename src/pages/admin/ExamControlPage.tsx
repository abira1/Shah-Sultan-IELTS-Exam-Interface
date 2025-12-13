import { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
  Edit,
  Trash2,
  Eye,
  Headphones,
  BookOpen,
  PenTool
} from 'lucide-react';
import { examSessionService, ExamSession } from '../../services/examSessionService';
import { batchService } from '../../services/batchService';
import { allTracks, getTracksByType } from '../../data/tracks';
import { format } from 'date-fns';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';

type TestType = 'partial' | 'mock';
type TrackType = 'listening' | 'reading' | 'writing';

export function ExamControlPage() {
  const navigate = useNavigate();
  
  // NEW: Test type and track selection states
  const [testType, setTestType] = useState<TestType>('partial');
  const [partialTrackType, setPartialTrackType] = useState<TrackType>('listening');
  const [partialSelectedTrack, setPartialSelectedTrack] = useState<string>('');
  const [mockTracks, setMockTracks] = useState<{
    listening: string;
    reading: string;
    writing: string;
  }>({
    listening: '',
    reading: '',
    writing: ''
  });
  
  // Legacy state for backward compatibility
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [examDate, setExamDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState<string>('10:00');
  const [duration, setDuration] = useState<number>(60);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [generatedExamCode, setGeneratedExamCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sessions state
  const [activeExams, setActiveExams] = useState<ExamSession[]>([]);
  const [scheduledExams, setScheduledExams] = useState<ExamSession[]>([]);
  const [completedExams, setCompletedExams] = useState<ExamSession[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    loadBatches();
    loadExamSessions();

    // Refresh sessions every 10 seconds
    const interval = setInterval(loadExamSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate exam code when relevant fields change
    if (testType === 'partial' && partialSelectedTrack) {
      generateExamCode();
    } else if (testType === 'mock' && mockTracks.listening && mockTracks.reading && mockTracks.writing) {
      generateExamCode();
    }
  }, [testType, partialSelectedTrack, mockTracks, examDate]);

  const loadBatches = async () => {
    const allBatches = await batchService.getAllBatches();
    setBatches(allBatches);
  };

  const loadExamSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const [active, scheduled] = await Promise.all([
        examSessionService.getActiveExams(),
        examSessionService.getScheduledExams()
      ]);

      setActiveExams(active);
      setScheduledExams(scheduled);

      // Get last 10 completed exams
      const allSessions = await examSessionService.getAllExamSessions();
      const completed = allSessions
        .filter(s => s.status === 'completed')
        .sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())
        .slice(0, 10);
      setCompletedExams(completed);
    } catch (err) {
      console.error('Error loading exam sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const generateExamCode = async () => {
    setIsGenerating(true);
    try {
      if (testType === 'partial') {
        if (!partialSelectedTrack) return;
        
        const track = allTracks.find(t => t.id === partialSelectedTrack);
        if (!track) return;

        const code = await examSessionService.generateExamCode(
          partialSelectedTrack,
          track.shortName,
          new Date(examDate),
          'partial'
        );
        setGeneratedExamCode(code);
        setDuration(track.duration); // Set duration from track
      } else {
        // Mock test
        if (!mockTracks.listening || !mockTracks.reading || !mockTracks.writing) return;

        const code = await examSessionService.generateExamCode(
          null,
          null,
          new Date(examDate),
          'mock',
          mockTracks
        );
        setGeneratedExamCode(code);
        
        // Calculate total duration for mock test
        const listeningTrack = allTracks.find(t => t.id === mockTracks.listening);
        const readingTrack = allTracks.find(t => t.id === mockTracks.reading);
        const writingTrack = allTracks.find(t => t.id === mockTracks.writing);
        
        const totalDuration = (listeningTrack?.duration || 0) + 
                             (readingTrack?.duration || 0) + 
                             (writingTrack?.duration || 0);
        setDuration(totalDuration);
      }
    } catch (err) {
      console.error('Error generating exam code:', err);
      setError('Failed to generate exam code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateSession = async (startImmediately: boolean = false) => {
    // Validation
    if (testType === 'partial') {
      if (!partialSelectedTrack) {
        setError('Please select a track');
        return;
      }
    } else {
      // Mock test validation
      if (!mockTracks.listening || !mockTracks.reading || !mockTracks.writing) {
        setError('Please select one track from each type (Listening, Reading, Writing)');
        return;
      }
    }

    if (selectedBatches.length === 0) {
      setError('Please select at least one batch');
      return;
    }

    if (!duration || duration <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    // Check if there's already an active exam
    if (startImmediately && activeExams.length > 0) {
      setError('Cannot start new exam. Another exam is currently active. Please stop it first.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      let trackId = '';
      let trackName = '';
      let audioURL: string | null = null;
      let selectedTracks = {};

      if (testType === 'partial') {
        const track = allTracks.find(t => t.id === partialSelectedTrack);
        if (!track) {
          setError('Selected track not found');
          return;
        }
        trackId = track.id;
        trackName = track.name;
        audioURL = track.audioURL || null;
        
        // Store in selectedTracks for consistency
        selectedTracks = {
          [partialTrackType]: partialSelectedTrack
        };
      } else {
        // Mock test
        trackId = 'mock'; // Use 'mock' as trackId for mock tests
        trackName = 'Mock Test (Listening + Reading + Writing)';
        
        // Get audio URL from listening track
        const listeningTrack = allTracks.find(t => t.id === mockTracks.listening);
        audioURL = listeningTrack?.audioURL || null;
        
        selectedTracks = {
          listening: mockTracks.listening,
          reading: mockTracks.reading,
          writing: mockTracks.writing
        };
      }

      // Calculate start and end times
      const sessionDate = new Date(`${examDate}T${startTime}`);
      const endDate = new Date(sessionDate.getTime() + duration * 60000);

      const result = await examSessionService.createExamSession({
        examCode: generatedExamCode,
        trackId: trackId,
        trackName: trackName,
        testType: testType,
        selectedTracks: selectedTracks,
        date: examDate,
        startTime: startTime,
        endTime: format(endDate, 'HH:mm'),
        duration: duration,
        status: startImmediately ? 'active' : 'scheduled',
        allowedBatches: selectedBatches,
        audioURL: audioURL,
        createdBy: 'admin' // TODO: Get from auth context
      });

      if (result.success) {
        // If starting immediately, update global exam status
        if (startImmediately && result.examCode) {
          const db = getDatabase(app);
          // Calculate end time from NOW when starting immediately
          const now = new Date();
          const immediateEndDate = new Date(now.getTime() + duration * 60000);
          
          await set(ref(db, 'exam/status'), {
            isStarted: true,
            activeTrackId: trackId,
            trackName: trackName,
            testType: testType,
            selectedTracks: selectedTracks,
            examCode: result.examCode,
            startTime: now.toISOString(),
            endTime: immediateEndDate.toISOString(),
            duration: duration,
            startedBy: 'admin'
          });
        }

        setSuccess(
          startImmediately
            ? `Exam ${result.examCode} started successfully!`
            : `Exam ${result.examCode} scheduled successfully!`
        );

        // Reset form
        setPartialSelectedTrack('');
        setMockTracks({ listening: '', reading: '', writing: '' });
        setSelectedBatches([]);
        setGeneratedExamCode('');

        // Reload sessions
        await loadExamSessions();

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to create exam session');
      }
    } catch (err) {
      console.error('Error creating exam session:', err);
      setError('Failed to create exam session');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartExam = async (examCode: string) => {
    // Check if another exam is active
    if (activeExams.length > 0) {
      setError('Cannot start exam. Another exam is currently active.');
      return;
    }

    try {
      const success = await examSessionService.startExam(examCode);
      if (success) {
        setSuccess(`Exam ${examCode} started!`);
        await loadExamSessions();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to start exam');
      }
    } catch (err) {
      console.error('Error starting exam:', err);
      setError('Failed to start exam');
    }
  };

  const handleStopExam = async (examCode: string) => {
    if (!confirm('Are you sure you want to stop this exam? Students will no longer be able to submit.')) {
      return;
    }

    try {
      const success = await examSessionService.stopExam(examCode);
      if (success) {
        setSuccess(`Exam ${examCode} stopped!`);
        await loadExamSessions();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to stop exam');
      }
    } catch (err) {
      console.error('Error stopping exam:', err);
      setError('Failed to stop exam');
    }
  };

  const handleDeleteSession = async (examCode: string) => {
    if (!confirm(`Are you sure you want to delete exam ${examCode}? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await examSessionService.deleteExamSession(examCode);
      if (success) {
        setSuccess(`Exam ${examCode} deleted!`);
        await loadExamSessions();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete exam');
      }
    } catch (err) {
      console.error('Error deleting exam:', err);
      setError('Failed to delete exam');
    }
  };

  const toggleBatchSelection = (batchId: string) => {
    setSelectedBatches(prev =>
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-900 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-900 text-sm">{success}</p>
        </div>
      )}

      {/* Create New Exam Session */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📝 Create New Exam Session</h2>

        <div className="space-y-6">
          {/* Test Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Test Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="testType"
                  value="partial"
                  checked={testType === 'partial'}
                  onChange={(e) => {
                    setTestType('partial');
                    setGeneratedExamCode('');
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Partial Test (Single Track)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="testType"
                  value="mock"
                  checked={testType === 'mock'}
                  onChange={(e) => {
                    setTestType('mock');
                    setGeneratedExamCode('');
                  }}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mock Test (Full Test)</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {testType === 'partial' 
                ? 'Select one track from any type (Listening, Reading, or Writing)'
                : 'Select one track from each type (Listening + Reading + Writing)'}
            </p>
          </div>

          {/* Partial Test: Track Type Selection + Track Dropdown */}
          {testType === 'partial' && (
            <div className="space-y-4">
              {/* Track Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Track Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPartialTrackType('listening');
                      setPartialSelectedTrack('');
                      setGeneratedExamCode('');
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      partialTrackType === 'listening'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <Headphones className="w-5 h-5" />
                    <span className="font-medium">Listening</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartialTrackType('reading');
                      setPartialSelectedTrack('');
                      setGeneratedExamCode('');
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      partialTrackType === 'reading'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Reading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartialTrackType('writing');
                      setPartialSelectedTrack('');
                      setGeneratedExamCode('');
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      partialTrackType === 'writing'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    <PenTool className="w-5 h-5" />
                    <span className="font-medium">Writing</span>
                  </button>
                </div>
              </div>

              {/* Track Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {partialTrackType.charAt(0).toUpperCase() + partialTrackType.slice(1)} Track <span className="text-red-500">*</span>
                </label>
                <select
                  value={partialSelectedTrack}
                  onChange={(e) => setPartialSelectedTrack(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="partial-track-selector"
                >
                  <option value="">-- Select a track --</option>
                  {getTracksByType(partialTrackType).map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.duration} mins, {track.totalQuestions} {track.trackType === 'writing' ? 'tasks' : 'questions'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Mock Test: Three Separate Dropdowns */}
          {testType === 'mock' && (
            <div className="space-y-4">
              {/* Listening Track */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-blue-600" />
                  Listening Track <span className="text-red-500">*</span>
                </label>
                <select
                  value={mockTracks.listening}
                  onChange={(e) => setMockTracks(prev => ({ ...prev, listening: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="mock-listening-selector"
                >
                  <option value="">-- Select listening track --</option>
                  {getTracksByType('listening').map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.duration} mins, {track.totalQuestions} questions)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reading Track */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  Reading Track <span className="text-red-500">*</span>
                </label>
                <select
                  value={mockTracks.reading}
                  onChange={(e) => setMockTracks(prev => ({ ...prev, reading: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  data-testid="mock-reading-selector"
                >
                  <option value="">-- Select reading track --</option>
                  {getTracksByType('reading').map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.duration} mins, {track.totalQuestions} questions)
                    </option>
                  ))}
                </select>
              </div>

              {/* Writing Track */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-orange-600" />
                  Writing Track <span className="text-red-500">*</span>
                </label>
                <select
                  value={mockTracks.writing}
                  onChange={(e) => setMockTracks(prev => ({ ...prev, writing: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="mock-writing-selector"
                >
                  <option value="">-- Select writing track --</option>
                  {getTracksByType('writing').map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.duration} mins, {track.totalQuestions} tasks)
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Info for Mock Test */}
              {mockTracks.listening && mockTracks.reading && mockTracks.writing && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Total Duration:</strong> {duration} minutes
                    <span className="text-xs text-blue-600 ml-2">
                      (Listening + Reading + Writing combined)
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Exam Code Display */}
          {generatedExamCode && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Generated Exam Code</p>
                  <p className="text-xl font-bold text-blue-600">{generatedExamCode}</p>
                </div>
                <button
                  onClick={generateExamCode}
                  disabled={isGenerating}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            {testType === 'mock' ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">
                  Duration is automatically calculated based on selected tracks
                </p>
                <p className="text-2xl font-bold text-gray-900">{duration} minutes</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  {[30, 45, 60, 90].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDuration(m)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        duration === m
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </>
            )}
          </div>

          {/* Allowed Batches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Allowed Batches <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {batches.length === 0 ? (
                <p className="text-sm text-gray-500">No batches available</p>
              ) : (
                batches.map((batch) => (
                  <label key={batch.batchId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch.batchId)}
                      onChange={() => toggleBatchSelection(batch.batchId)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {batch.batchName} ({batch.totalStudents || 0} students)
                    </span>
                  </label>
                ))
              )}
            </div>
            {selectedBatches.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedBatches.length} batch{selectedBatches.length > 1 ? 'es' : ''} selected
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => handleCreateSession(false)}
              disabled={isCreating || !selectedTrackId || selectedBatches.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="create-schedule-button"
            >
              {isCreating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Create & Schedule
                </>
              )}
            </button>

            <button
              onClick={() => handleCreateSession(true)}
              disabled={isCreating || !selectedTrackId || selectedBatches.length === 0 || activeExams.length > 0}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="create-start-button"
            >
              {isCreating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Create & Start Now
                </>
              )}
            </button>
          </div>

          {activeExams.length > 0 && (
            <p className="text-sm text-orange-600">
              ⚠️ Cannot start new exam - another exam is currently active
            </p>
          )}
        </div>
      </div>

      {/* Active Exam Sessions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          🟢 Active Exam Sessions
        </h2>

        {isLoadingSessions ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : activeExams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No active exams</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeExams.map((exam) => (
              <div
                key={exam.examCode}
                className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-green-700">{exam.examCode}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">ACTIVE</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {exam.trackName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Started: {format(new Date(exam.startedAt || exam.createdAt), 'MMM d, h:mm a')} • {exam.duration} mins
                  </p>
                  <p className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    Batches: {exam.allowedBatches.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => handleStopExam(exam.examCode)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Exam
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled Exams */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📅 Scheduled Exams
        </h2>

        {isLoadingSessions ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : scheduledExams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No scheduled exams</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Track</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batches</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {scheduledExams.map((exam) => (
                  <tr key={exam.examCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-gray-900">{exam.examCode}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.trackName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(new Date(exam.date), 'MMM d, yyyy')} • {exam.startTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.allowedBatches.length} batch{exam.allowedBatches.length > 1 ? 'es' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartExam(exam.examCode)}
                          disabled={activeExams.length > 0}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
                          title={activeExams.length > 0 ? 'Another exam is active' : 'Start exam'}
                        >
                          Start
                        </button>
                        <button
                          onClick={() => handleDeleteSession(exam.examCode)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                          title="Delete exam"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed Exams */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          ✅ Recently Completed Exams
        </h2>

        {isLoadingSessions ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : completedExams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed exams</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Track</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submissions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {completedExams.map((exam) => (
                  <tr key={exam.examCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-gray-900">{exam.examCode}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{exam.trackName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(new Date(exam.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exam.totalSubmissions} total • {exam.gradedResults} graded
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          navigate(`/admin/submissions?examCode=${exam.examCode}`);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-1"
                        data-testid={`view-submissions-${exam.examCode}`}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
