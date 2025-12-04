import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/audioService';

interface AudioPlayerProps {
  autoPlay?: boolean;
}

export function ExamAudioPlayer({ autoPlay = true }: AudioPlayerProps) {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioRef, setAudioRef] = React.useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadAudio();
  }, []);

  const loadAudio = async () => {
    try {
      const url = await audioService.getAudioURL();
      setAudioURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load exam audio:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioRef && autoPlay && audioURL && !isMuted) {
      audioRef.play().catch(err => console.log("Auto-play failed:", err));
    }
  }, [audioRef, audioURL, autoPlay, isMuted]);

  const handleToggleMute = () => {
    if (audioRef) {
      if (isMuted) {
        audioRef.muted = false;
        audioRef.play().catch(err => console.log("Play failed:", err));
      } else {
        audioRef.muted = true;
        audioRef.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!audioURL) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase">Exam Audio</p>
            <p className="text-sm font-semibold text-gray-900 truncate">Listening Track</p>
          </div>
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              isMuted
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        
        <audio
          ref={setAudioRef}
          src={audioURL}
          controls
          className="w-full mt-3"
          style={{
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}
