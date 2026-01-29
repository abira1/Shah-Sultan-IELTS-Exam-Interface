import { useEffect, useState } from 'react';
import { Clock, BookOpen, Loader } from 'lucide-react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

interface CountdownPopupProps {
  examCode: string;
  trackName: string;
  countdownStartTime: string;
  countdownSeconds: number;
  onComplete: () => void;
}

export function CountdownPopup({ 
  examCode, 
  trackName, 
  countdownStartTime, 
  countdownSeconds,
  onComplete 
}: CountdownPopupProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(countdownSeconds);
  const [isComplete, setIsComplete] = useState(false);
  const [isWaitingForExam, setIsWaitingForExam] = useState(false);

  useEffect(() => {
    // Calculate actual remaining time based on server start time
    const startTime = new Date(countdownStartTime).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = Math.max(0, countdownSeconds - elapsed);
    
    setTimeRemaining(remaining);

    // If already complete, wait for exam to be active
    if (remaining <= 0) {
      setIsComplete(true);
      setIsWaitingForExam(true);
      // Don't call onComplete yet - wait for exam status
      return;
    }

    // Update countdown every second
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newValue = prev - 1;
        
        if (newValue <= 0) {
          clearInterval(interval);
          setIsComplete(true);
          setIsWaitingForExam(true);
          // Don't call onComplete yet - will be triggered by exam status listener
          return 0;
        }
        
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownStartTime, countdownSeconds]);

  // NEW: Listen for exam status to become active before redirecting
  useEffect(() => {
    if (!isWaitingForExam) return;

    console.log('🔄 Countdown complete, waiting for exam to become active...');
    const db = getDatabase(app);
    
    let redirected = false;
    
    // Check both exam/status and examSessions/{examCode}/status
    const globalExamStatusRef = ref(db, 'exam/status');
    const sessionStatusRef = ref(db, `examSessions/${examCode}/status`);
    
    const handleRedirect = () => {
      if (redirected) return;
      redirected = true;
      console.log('✅ Exam is now active, redirecting...');
      setTimeout(() => {
        onComplete();
      }, 500);
    };
    
    // Listen to global exam status
    const unsubscribeGlobal = onValue(globalExamStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        console.log('📡 Global exam status update:', status);
        
        // Check if exam is started and matches our exam code
        if (status.isStarted && status.examCode === examCode) {
          handleRedirect();
        }
      }
    }, (error) => {
      console.error('❌ Error listening to global exam status:', error);
    });
    
    // Also listen to specific session status
    const unsubscribeSession = onValue(sessionStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        console.log('📡 Session status update:', status);
        
        // Check if session is active
        if (status === 'active') {
          handleRedirect();
        }
      }
    }, (error) => {
      console.error('❌ Error listening to session status:', error);
    });
    
    // Fallback: redirect anyway after 5 seconds if no status update
    const fallbackTimeout = setTimeout(() => {
      if (!redirected) {
        console.log('⚠️ Timeout waiting for exam status (5s), redirecting anyway...');
        handleRedirect();
      }
    }, 5000);

    // Cleanup listeners and timeout
    return () => {
      unsubscribeGlobal();
      unsubscribeSession();
      clearTimeout(fallbackTimeout);
    };
  }, [isWaitingForExam, examCode, onComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center z-[9999] p-4"
      data-testid="countdown-popup"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-2xl w-full">
        {/* Icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in px-2">
          {isComplete ? 'Starting Now!' : 'Your exam is starting in'}
        </h1>

        {/* Countdown Timer */}
        <div className="mb-6 sm:mb-8">
          <div className={`inline-block bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl px-8 py-6 sm:px-12 sm:py-8 border-2 border-white/20 shadow-2xl ${
            isComplete ? 'animate-bounce' : ''
          }`}>
            <div 
              className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white font-mono tracking-wider transition-all duration-300 ${
                timeRemaining <= 10 && !isComplete ? 'text-yellow-300 animate-pulse' : ''
              }`}
              data-testid="countdown-timer"
            >
              {isComplete ? '🚀' : formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white break-words">{trackName}</p>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 font-mono break-all">{examCode}</p>
        </div>

        {/* Message */}
        {!isComplete ? (
          <div className="space-y-2 animate-fade-in px-2">
            <p className="text-base sm:text-lg md:text-xl text-blue-100">
              Please wait. You will be redirected automatically.
            </p>
            <p className="text-xs sm:text-sm text-blue-300">
              Make sure you have a stable internet connection.
            </p>
          </div>
        ) : isWaitingForExam ? (
          <div className="space-y-3 animate-fade-in px-2">
            <div className="flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 text-green-300 animate-spin" />
              <p className="text-base sm:text-lg md:text-xl text-green-300 font-semibold">
                Starting exam, please wait...
              </p>
            </div>
            <p className="text-xs sm:text-sm text-blue-300">
              Preparing your exam interface...
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in px-2">
            <p className="text-base sm:text-lg md:text-xl text-green-300 font-semibold">
              ✨ Redirecting to exam interface...
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {!isComplete && (
          <div className="mt-6 sm:mt-8">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${((countdownSeconds - timeRemaining) / countdownSeconds) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-full h-24 sm:h-32 bg-gradient-to-b from-black/30 to-transparent"></div>
    </div>
  );
}
