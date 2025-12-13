import React, { useState, useEffect } from 'react';
import { ClockIcon, UserIcon, Volume2, VolumeX } from 'lucide-react';

interface ExamHeaderProps {
  trackName: string;
  questionType: string;
  timeRemaining: string;
  studentName?: string;
  studentId?: string;
  isTimeWarning?: boolean;
  isTimeCritical?: boolean;
  audioURL?: string | null;
  autoPlayAudio?: boolean;
  trackType?: 'listening' | 'reading' | 'writing';
}

export function ExamHeader({
  trackName,
  questionType,
  timeRemaining,
  studentName,
  studentId,
  isTimeWarning = false,
  audioURL = null,
  autoPlayAudio = false,
  trackType
}: ExamHeaderProps) {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef && audioURL && autoPlayAudio) {
      // Auto-play the audio when exam starts
      audioRef.play().catch(err => console.log("Auto-play failed:", err));
    }
  }, [audioRef, audioURL, autoPlayAudio]);

  useEffect(() => {
    if (!audioRef) return;

    const handleTimeUpdate = () => setCurrentTime(audioRef.currentTime);
    const handleLoadedMetadata = () => setDuration(audioRef.duration);

    audioRef.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef) {
      audioRef.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef) return;
    if (isMuted) {
      audioRef.volume = volume || 0.5;
      setVolume(volume || 0.5);
      setIsMuted(false);
    } else {
      audioRef.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Row: Logo + Title + Timer + Audio on Desktop, wraps to 2 rows on Mobile */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/Shah-Sultan-Logo-2.png" 
              alt="Shah Sultan Logo" 
              className="h-10 w-auto sm:h-12 lg:h-14 object-contain"
            />
          </div>

          {/* Title/Track Name Section */}
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-tight">
              {trackName}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 mt-0.5">
              <p className="text-xs sm:text-sm text-gray-600">{questionType}</p>
              {studentName && studentId && (
                <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                  <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{studentName}</span>
                  <span className="text-gray-400">•</span>
                  <span>{studentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timer */}
          <div 
            className={`flex items-center gap-2 flex-shrink-0 px-3 py-1.5 rounded-lg border ${
              isTimeWarning 
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`} 
            data-testid="exam-timer"
          >
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono text-base sm:text-lg font-bold">{timeRemaining}</span>
          </div>

          {/* Audio Player Controls - Only show for listening tracks */}
          {audioURL && (!trackType || trackType === 'listening') && (
            <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 flex-shrink-0 w-full lg:flex-1 lg:min-w-[400px] xl:min-w-[500px]" data-testid="audio-player-bar">
              <audio ref={setAudioRef} src={audioURL} preload="metadata" />
              
              {/* Audio Icon */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Time Display */}
              <div className="text-xs font-mono text-gray-700 flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                <button
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  data-testid="audio-mute-button"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer volume-slider"
                  title="Volume"
                  data-testid="audio-volume-slider"
                />
                <span className="text-xs font-medium text-gray-600 w-8 flex-shrink-0">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* Playing Status Indicator - Hidden on small screens */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <div className="flex gap-0.5">
                  <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs font-medium text-blue-700">
                  Playing
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #2563eb;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #2563eb;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .volume-slider::-webkit-slider-runnable-track {
          background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #bfdbfe ${(isMuted ? 0 : volume) * 100}%, #bfdbfe 100%);
          height: 6px;
          border-radius: 3px;
        }
        .volume-slider::-moz-range-track {
          background: #bfdbfe;
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
    </header>
  );
}