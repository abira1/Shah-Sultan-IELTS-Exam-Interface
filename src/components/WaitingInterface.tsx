import { useEffect, useState } from 'react';
import { Loader, Volume2, BookOpen, FileText, CheckSquare, Edit3, Clock } from 'lucide-react';
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
  const [currentExamName, setCurrentExamName] = useState<string>(examName);

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
          console.log('WaitingInterface - Firebase exam status:', data);
          
          // Update exam name if available
          if (data.trackName) {
            setCurrentExamName(data.trackName);
          }
          
          if (data.isStarted === true) {
            console.log('WaitingInterface - Exam started detected!');
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
            setCountdown(5); // Start at 5
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Books */}
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}>
          <BookOpen className="w-16 h-16 text-blue-200 opacity-30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}>
          <FileText className="w-20 h-20 text-indigo-200 opacity-20" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }}>
          <Edit3 className="w-14 h-14 text-purple-200 opacity-25" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}>
          <CheckSquare className="w-12 h-12 text-blue-200 opacity-30" />
        </div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-200/50">
          {isWaiting ? (
            <>
              {/* Waiting State with Enhanced Animations */}
              <div className="text-center space-y-8">
                {/* Animated Illustration Area */}
                <div className="flex justify-center relative">
                  <div className="relative w-48 h-48">
                    {/* Outer rotating circle */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div
                      className="absolute inset-3 border-4 border-transparent border-b-indigo-400 border-l-indigo-300 rounded-full animate-spin"
                      style={{ animationDirection: 'reverse', animationDuration: '4s' }}
                    ></div>
                    <div
                      className="absolute inset-6 border-4 border-transparent border-t-purple-300 border-r-purple-200 rounded-full animate-spin"
                      style={{ animationDuration: '5s' }}
                    ></div>
                    
                    {/* Center animated illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Pulsing background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full animate-pulse blur-xl"></div>
                        {/* Main icon */}
                        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg transform hover:scale-110 transition-transform">
                          <FileText className="w-16 h-16 text-white animate-pulse" />
                        </div>
                        {/* Floating mini icons */}
                        <div className="absolute -top-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                          <CheckSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 bg-yellow-500 p-2 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                          <Edit3 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-sm font-semibold text-blue-900">Please Wait</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3">
                    Ready for Your Exam?
                  </h1>
                  
                  <p className="text-gray-700 text-lg font-medium mb-2">
                    {waitMessage}
                  </p>
                </div>

                {/* Student Info Card with Enhanced Design */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200/50 shadow-lg">
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">👤</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">Student Name</div>
                        <div className="font-bold text-gray-900 text-lg">{studentName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🎫</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">Student ID</div>
                        <div className="font-bold text-gray-900 font-mono text-lg">{studentId}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-1">Exam</div>
                        <div className="font-bold text-gray-900 text-lg">{currentExamName}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show duration if available */}
                {examDurationMinutes !== null && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-gray-700">
                      <span className="font-bold text-amber-900">Duration:</span> {examDurationMinutes} minute{examDurationMinutes > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Enhanced Waiting Animation */}
                <div className="flex justify-center items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-900 font-medium flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Verifying your exam details...
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Countdown State */}
              <div className="text-center space-y-8">
                {/* Countdown Circle Animation */}
                <div className="flex justify-center">
                  <div className="relative w-56 h-56">
                    {/* Animated rings */}
                    <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
                    <div 
                      className="absolute inset-0 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" 
                      style={{ animationDuration: '1s' }}
                    ></div>
                    <div 
                      className="absolute inset-4 border-8 border-transparent border-t-indigo-500 rounded-full animate-spin" 
                      style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    ></div>
                    
                    {/* Countdown number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animate-pulse drop-shadow-2xl">
                          {countdown}
                        </div>
                        <div className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-wider">
                          seconds
                        </div>
                      </div>
                    </div>

                    {/* Pulsing outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-ping" style={{ animationDuration: '1s' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg animate-pulse">
                    <CheckSquare className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">Get Ready!</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Exam Starting Soon!
                  </h2>
                  
                  <p className="text-gray-600 text-lg">
                    Your exam begins in <span className="font-bold text-blue-600">{countdown}</span> second{countdown !== 1 ? 's' : ''}
                  </p>
                  
                  {remainingSeconds !== null && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">Total Time:</span> {String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:{String(remainingSeconds % 60).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Audio notification */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-900">
                      Audio will play automatically when exam starts
                    </span>
                  </div>
                </div>

                {/* Motivational message */}
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <span className="text-2xl">📝</span>
                  <span className="text-sm font-medium">Stay focused and do your best!</span>
                  <span className="text-2xl">💪</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
