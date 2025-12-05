import { useEffect, useState } from 'react';
import { Play, Square, AlertCircle, CheckCircle, Loader, Clock, List } from 'lucide-react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../firebase';

interface TrackOption {
  id: string;
  name: string;
  duration: number;
  totalQuestions: number;
}

export function ExamController() {
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<string>('60');
  const [currentExamTimes, setCurrentExamTimes] = useState<{startTime?: string, endTime?: string, trackName?: string}>({});
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-1');
  const [availableTracks, setAvailableTracks] = useState<TrackOption[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);

  const db = getDatabase(app);

  // Load tracks from Firebase
  useEffect(() => {
    loadTracksFromFirebase();
  }, []);

  // Check exam status on mount
  useEffect(() => {
    checkExamStatus();
    const interval = setInterval(checkExamStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadTracksFromFirebase = async () => {
    try {
      setIsLoadingTracks(true);
      const snapshot = await get(ref(db, 'tracks'));
      
      if (snapshot.exists()) {
        const tracksData = snapshot.val();
        const tracksList: TrackOption[] = Object.keys(tracksData).map(key => ({
          id: tracksData[key].id,
          name: tracksData[key].name,
          duration: tracksData[key].duration,
          totalQuestions: tracksData[key].totalQuestions
        }));
        setAvailableTracks(tracksList);
        if (tracksList.length > 0 && !selectedTrackId) {
          setSelectedTrackId(tracksList[0].id);
        }
      } else {
        // Fallback to hardcoded tracks
        const { getTrackOptions } = await import('../data/tracks');
        setAvailableTracks(getTrackOptions());
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      // Fallback to hardcoded tracks
      try {
        const { getTrackOptions } = await import('../data/tracks');
        setAvailableTracks(getTrackOptions());
      } catch (e) {
        setError('Failed to load tracks');
      }
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const checkExamStatus = async () => {
    try {
      const snapshot = await get(ref(db, 'exam/status'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsExamRunning(data.isStarted === true);
        if (data.startTime && data.endTime) {
          setCurrentExamTimes({ 
            startTime: data.startTime, 
            endTime: data.endTime,
            trackName: data.trackName || 'Unknown Exam'
          });
        }
      }
    } catch (err) {
      console.error('Error checking exam status:', err);
    }
  };

  const startExam = async () => {
    // Validation
    if (!selectedTrackId) {
      setError('Please select an exam track.');
      return;
    }

    const minutes = Number(durationMinutes);
    if (!minutes || isNaN(minutes) || minutes <= 0) {
      setError('Please enter a valid duration in minutes.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const selectedTrack = availableTracks.find(t => t.id === selectedTrackId);
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + minutes * 60000);

      await set(ref(db, 'exam/status'), {
        isStarted: true,
        activeTrackId: selectedTrackId,
        trackName: selectedTrack?.name || 'Unknown Exam',
        startedAt: startDate.toISOString(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        durationMinutes: minutes
      });
      setIsExamRunning(true);
      setCurrentExamTimes({ 
        startTime: startDate.toISOString(), 
        endTime: endDate.toISOString(),
        trackName: selectedTrack?.name
      });
      setSuccess(`Exam "${selectedTrack?.name}" started for ${minutes} minute${minutes > 1 ? 's' : ''}. Students can begin now.`);
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
        activeTrackId: null,
        trackName: null
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
    // Prefer explicit duration value set by admin before starting
    const mins = Number(durationMinutes);
    if (mins && !isNaN(mins) && mins > 0) {
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    }

    // Fallback to computing from current exam times
    if (!currentExamTimes.startTime || !currentExamTimes.endTime) return '';
    const start = new Date(currentExamTimes.startTime);
    const end = new Date(currentExamTimes.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minsRemaining = diffMins % 60;
    if (hours > 0) {
      return `${hours}h ${minsRemaining}m`;
    }
    return `${diffMins} minutes`;
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
            <p className="text-sm text-gray-600 mb-1">
              {isExamRunning ? 'Currently Running Exam' : 'Exam Status'}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {isExamRunning && currentExamTimes.trackName 
                ? currentExamTimes.trackName 
                : 'No exam running'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isExamRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className="text-sm font-medium text-gray-700">
              Status: <span className={isExamRunning ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                {isExamRunning ? 'RUNNING - Students taking exam' : 'NOT STARTED - Select and start exam'}
              </span>
            </p>
          </div>
          {isExamRunning && currentExamTimes.startTime && currentExamTimes.endTime && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Start Time</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(currentExamTimes.startTime)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">End Time</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(currentExamTimes.endTime)}</p>
                </div>
              </div>
            </div>
          )}
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

      {/* Track Selection and Duration */}
      {!isExamRunning && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6 space-y-6">
          {/* Track Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <List className="w-5 h-5 text-blue-600" />
              Select Exam Track
            </h3>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose which exam students will take
            </label>
            <select
              value={selectedTrackId}
              onChange={(e) => {
                setSelectedTrackId(e.target.value);
                const track = availableTracks.find(t => t.id === e.target.value);
                if (track) {
                  setDurationMinutes(String(track.duration));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              data-testid="track-selector"
            >
              {availableTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name} ({track.duration} mins, {track.totalQuestions} questions)
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Set Exam Duration
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <div className="flex gap-2 mb-3">
                {[30, 40, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(String(m))}
                    className={`px-3 py-1 rounded-md text-sm font-medium border ${String(m) === durationMinutes ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="exam-duration-input"
                />
                <div className="text-sm text-gray-600">minutes</div>
              </div>
            </div>

            {durationMinutes && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Exam Duration:</span> {calculateDuration()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {!isExamRunning ? (
          <button
            onClick={startExam}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            data-testid="start-exam-button"
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
            data-testid="stop-exam-button"
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
          <span className="font-semibold">💡 Tip:</span> Students can only start the exam at or after the scheduled start time. The exam will automatically end at the specified end time. In the last 5 minutes, the countdown timer will turn red.
        </p>
      </div>
    </div>
  );
}
