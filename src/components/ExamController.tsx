import { useEffect, useState } from 'react';
import { Play, Square, AlertCircle, CheckCircle, Loader, Clock } from 'lucide-react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../firebase';

const EXAM_NAME = 'P-L-2 Application for membership';

export function ExamController() {
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentExamTimes, setCurrentExamTimes] = useState<{startTime?: string, endTime?: string}>({});

  const db = getDatabase(app);

  // Check exam status on mount
  useEffect(() => {
    checkExamStatus();
    const interval = setInterval(checkExamStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkExamStatus = async () => {
    try {
      const snapshot = await get(ref(db, 'exam/status'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsExamRunning(data.isStarted === true);
        if (data.startTime && data.endTime) {
          setCurrentExamTimes({ startTime: data.startTime, endTime: data.endTime });
        }
      }
    } catch (err) {
      console.error('Error checking exam status:', err);
    }
  };

  const startExam = async () => {
    // Validation
    if (!startTime || !endTime) {
      setError('Please select both start time and end time.');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      setError('End time must be after start time.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await set(ref(db, 'exam/status'), {
        isStarted: true,
        startedAt: new Date().toISOString(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        name: EXAM_NAME
      });
      setIsExamRunning(true);
      setCurrentExamTimes({ startTime: startDate.toISOString(), endTime: endDate.toISOString() });
      setSuccess('Exam scheduled successfully! Students can start at the specified time.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to start exam. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopExam = async () => {
    if (!confirm('Are you sure you want to stop the exam? Students will be unable to continue.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await set(ref(db, 'exam/status'), {
        isStarted: false,
        stoppedAt: new Date().toISOString(),
        name: EXAM_NAME
      });
      setIsExamRunning(false);
      setCurrentExamTimes({});
      setSuccess('Exam stopped successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to stop exam. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return '';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Control</h2>
        <p className="text-gray-600">Manage exam start/stop for all waiting students</p>
      </div>

      {/* Exam Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Exam</p>
            <p className="text-2xl font-bold text-gray-900">{EXAM_NAME}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isExamRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className="text-sm font-medium text-gray-700">
              Status: <span className={isExamRunning ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {isExamRunning ? 'RUNNING - Students taking exam' : 'NOT STARTED - Waiting for students'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-900 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-900 text-sm">{success}</p>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {!isExamRunning ? (
          <button
            onClick={startExam}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isLoading ? 'Starting...' : 'Start Exam for All Students'}
          </button>
        ) : (
          <button
            onClick={stopExam}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            {isLoading ? 'Stopping...' : 'Stop Exam'}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> When you start the exam, all waiting students will see a 3-2-1 countdown and the exam will begin with audio playing automatically.
        </p>
      </div>
    </div>
  );
}
