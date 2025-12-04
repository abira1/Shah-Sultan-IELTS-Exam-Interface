import { useEffect, useState } from 'react';
import { Loader, Volume2 } from 'lucide-react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase';

interface WaitingInterfaceProps {
  studentName: string;
  studentId: string;
  examName: string;
  onCountdownComplete: () => void;
}

export function WaitingInterface({
  studentName,
  studentId,
  examName,
  onCountdownComplete
}: WaitingInterfaceProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [hasStartedCountdown, setHasStartedCountdown] = useState(false);
  const [waitMessage, setWaitMessage] = useState('Waiting for the instructor to start...');
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number | null>(null);

  // Listen for exam start signal from Firebase
  useEffect(() => {
    // Only check once if we haven't started counting down
    if (hasStartedCountdown) return;

    const db = getDatabase(app);
    const checkExamStart = setInterval(async () => {
      try {
        const snapshot = await get(ref(db, 'exam/status'));
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.isStarted === true) {
            const now = Date.now();

            // If a startTime is provided, respect it (may be in future)
            if (data.startTime) {
              const startTime = new Date(data.startTime).getTime();
              if (now < startTime) {
                // Too early - show waiting message with time and duration (if available)
                const startLabel = new Date(data.startTime).toLocaleTimeString();
                if (data.durationMinutes) setExamDurationMinutes(Number(data.durationMinutes));
                setWaitMessage(`Exam will start at ${startLabel}. Please wait...`);
                return;
              }
            }

            // If endTime provided, compute remaining seconds and duration
            if (data.endTime) {
              const endTime = new Date(data.endTime).getTime();
              setExamEndTime(endTime);
              const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
              setRemainingSeconds(remaining);
              if (data.durationMinutes) setExamDurationMinutes(Number(data.durationMinutes));
              else if (data.startTime) {
                const start = new Date(data.startTime).getTime();
                setExamDurationMinutes(Math.max(0, Math.round((endTime - start) / 60000)));
              }

              if (now >= endTime) {
                setWaitMessage('Exam has ended. You can no longer take this exam.');
                return;
              }
            }

            // Exam is ready to start immediately
            setIsWaiting(false);
            setHasStartedCountdown(true);
            setCountdown(3); // Start at 3
          }
        }
      } catch (error) {
        console.error('Error checking exam status:', error);
      }
    }, 500);

    return () => clearInterval(checkExamStart);
  }, [hasStartedCountdown]);

  // Handle countdown - separate from the exam start check
  useEffect(() => {
    if (countdown === null || !hasStartedCountdown) return;

    if (countdown === 0) {
      // Countdown complete, start exam
      onCountdownComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, hasStartedCountdown, onCountdownComplete]);

  // Tick remaining exam seconds while waiting / during countdown
  useEffect(() => {
    if (remainingSeconds === null) return;

    if (remainingSeconds <= 0) {
      setRemainingSeconds(0);
      setWaitMessage('Exam has ended. You can no longer take this exam.');
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {isWaiting ? (
            <>
              {/* Waiting State */}
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative w-24 h-24">
                    {/* Animated circles */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin"></div>
                    <div
                      className="absolute inset-2 border-4 border-transparent border-b-blue-300 rounded-full animate-spin"
                      style={{ animationDirection: 'reverse', animationDuration: '2s' }}
                    ></div>
                    {/* Center loader icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready for Exam?
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {waitMessage}
                  </p>
                </div>

                {/* Student Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-left space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Name: </span>
                      <span className="font-semibold text-gray-900">{studentName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">ID: </span>
                      <span className="font-semibold text-gray-900 font-mono">{studentId}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Exam: </span>
                      <span className="font-semibold text-gray-900">{examName}</span>
                    </div>
                  </div>
                </div>

                {/* Show duration if available while waiting */}
                {examDurationMinutes !== null && (
                  <div className="text-sm text-gray-600 mt-3">
                    <span className="font-medium">Exam Duration:</span> {examDurationMinutes} minute{examDurationMinutes > 1 ? 's' : ''}
                  </div>
                )}

                {/* Waiting Animation */}
                <div className="flex justify-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>

                <p className="text-sm text-gray-500">
                  Your exam details are being verified...
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Countdown State */}
              <div className="text-center space-y-6">
                <div className="text-6xl font-bold text-blue-600 animate-pulse">
                  {countdown}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Ready!
                  </h2>
                  <p className="text-gray-600">
                    Exam is starting in {countdown} second{countdown !== 1 ? 's' : ''}
                  </p>
                  {remainingSeconds !== null && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Time remaining:</span> {String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:{String(remainingSeconds % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Volume2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Audio will play automatically</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
