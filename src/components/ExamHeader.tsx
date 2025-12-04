import React, { useState, useEffect } from 'react';
import { ClockIcon, UserIcon, Volume2, VolumeX } from 'lucide-react';

interface ExamHeaderProps {
  trackName: string;
  questionType: string;
  timeRemaining: string;
  studentName?: string;
  studentId?: string;
  isTimeWarning?: boolean;
  audioURL?: string | null;
  autoPlayAudio?: boolean;
}

export function ExamHeader({
  trackName,
  questionType,
  timeRemaining,
  studentName,
  studentId,
  isTimeWarning = false,
  audioURL = null,
  autoPlayAudio = false
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
      <div className="max-w-5xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{trackName}</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-gray-600">{questionType}</p>
              {studentName && studentId && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">{studentName}</span>
                  <span className="text-gray-400">•</span>
                  <span>{studentId}</span>
                </div>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-2 ${isTimeWarning ? 'text-red-600 animate-pulse' : 'text-gray-700'}`} data-testid="exam-timer">
            <ClockIcon className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">{timeRemaining}</span>
          </div>
        </div>

        {/* Audio Player Bar */}
        {audioURL && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-4" data-testid="audio-player-bar">
            <audio ref={setAudioRef} src={audioURL} preload="metadata" />
            
            {/* Audio Icon */}
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full flex-shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>

            {/* Time Display */}
            <div className="text-xs font-mono text-gray-700 flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[250px]">
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

            {/* Playing Status Indicator */}
            <div className="flex items-center gap-2 flex-shrink-0">
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