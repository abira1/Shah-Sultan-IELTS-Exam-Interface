import { useState, useEffect } from 'react';
import { Music, FileText, Clock, List as ListIcon, Link, Save, CheckCircle, AlertCircle, Loader, Headphones, BookOpen, PenTool } from 'lucide-react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebase';
import { Track } from '../data/track1';
import { allTracks, getTracksByType } from '../data/tracks';

interface TrackWithAudio extends Track {
  loadedAudioURL?: string | null;
}

type TrackTypeTab = 'listening' | 'reading' | 'writing';

export function TrackManagement() {
  const [tracks, setTracks] = useState<TrackWithAudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [audioURLInputs, setAudioURLInputs] = useState<Record<string, string>>({});
  const [savingTrackId, setSavingTrackId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TrackTypeTab>('listening');

  const db = getDatabase(app);

  useEffect(() => {
    // Initialize tracks immediately from hardcoded data
    const initialTracks: TrackWithAudio[] = allTracks.map(track => ({
      ...track,
      loadedAudioURL: null
    }));
    setTracks(initialTracks);
    
    // Then load audio URLs asynchronously
    loadTracksWithAudio();
    checkActiveTrack();
  }, []);

  const loadTracksWithAudio = async () => {
    try {
      // Don't show loading state since tracks are already initialized
      
      // Load audio URLs from Firebase for each track
      const tracksWithAudio: TrackWithAudio[] = [];
      
      for (const track of allTracks) {
        try {
          const snapshot = await get(ref(db, `tracks/${track.id}/audioURL`));
          const audioURL = snapshot.exists() ? snapshot.val() : null;
          
          tracksWithAudio.push({
            ...track,
            loadedAudioURL: audioURL
          });
        } catch (trackError) {
          console.warn(`Could not load audio for track ${track.id}:`, trackError);
          // Still add track without audio URL
          tracksWithAudio.push({
            ...track,
            loadedAudioURL: null
          });
        }
      }
      
      setTracks(tracksWithAudio);
    } catch (error) {
      console.error('Error loading tracks with audio:', error);
      // Tracks are already initialized, so just log the error
      // Don't show error message to user as tracks are still usable
    } finally {
      setIsLoading(false);
    }
  };

  const checkActiveTrack = async () => {
    try {
      const snapshot = await get(ref(db, 'exam/status'));
      if (snapshot.exists()) {
        const status = snapshot.val();
        if (status.isStarted && status.activeTrackId) {
          setActiveTrackId(status.activeTrackId);
        }
      }
    } catch (error) {
      console.error('Error checking active track:', error);
    }
  };

  const handleAudioURLChange = (trackId: string, value: string) => {
    setAudioURLInputs(prev => ({
      ...prev,
      [trackId]: value
    }));
  };

  const handleSaveAudioURL = async (trackId: string) => {
    const audioURL = audioURLInputs[trackId]?.trim();
    
    if (!audioURL) {
      setErrorMessage('Please enter a valid audio URL');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Basic URL validation
    try {
      new URL(audioURL);
    } catch (e) {
      setErrorMessage('Please enter a valid URL format');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setSavingTrackId(trackId);
    setErrorMessage(null);

    try {
      // Save audio URL to Firebase
      await set(ref(db, `tracks/${trackId}/audioURL`), audioURL);
      
      // Update local state
      setTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, loadedAudioURL: audioURL }
          : track
      ));
      
      // Clear input
      setAudioURLInputs(prev => ({
        ...prev,
        [trackId]: ''
      }));
      
      setSuccessMessage(`Audio URL saved for ${tracks.find(t => t.id === trackId)?.name}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving audio URL:', error);
      setErrorMessage('Failed to save audio URL. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setSavingTrackId(null);
    }
  };

  const handleDeleteAudioURL = async (trackId: string) => {
    if (!confirm('Are you sure you want to remove the audio URL for this track?')) {
      return;
    }

    setSavingTrackId(trackId);
    try {
      await set(ref(db, `tracks/${trackId}/audioURL`), null);
      
      setTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, loadedAudioURL: null }
          : track
      ));
      
      setSuccessMessage('Audio URL removed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting audio URL:', error);
      setErrorMessage('Failed to remove audio URL');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setSavingTrackId(null);
    }
  };

  // Filter tracks by active tab
  const filteredTracks = tracks.filter(track => track.trackType === activeTab);
  
  // Get tab info
  const getTabInfo = (type: TrackTypeTab) => {
    switch (type) {
      case 'listening':
        return { icon: Headphones, color: 'blue', label: 'Listening' };
      case 'reading':
        return { icon: BookOpen, color: 'green', label: 'Reading' };
      case 'writing':
        return { icon: PenTool, color: 'orange', label: 'Writing' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Track Management</h2>
          <p className="text-gray-600 mt-1">Manage tracks across three exam types</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Track types">
          {(['listening', 'reading', 'writing'] as TrackTypeTab[]).map((type) => {
            const tabInfo = getTabInfo(type);
            const Icon = tabInfo.icon;
            const isActive = activeTab === type;
            const colorClasses = {
              listening: {
                active: 'border-blue-600 text-blue-600',
                inactive: 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
              },
              reading: {
                active: 'border-green-600 text-green-600',
                inactive: 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
              },
              writing: {
                active: 'border-orange-600 text-orange-600',
                inactive: 'border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300'
              }
            };
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive ? colorClasses[type].active : colorClasses[type].inactive
                }`}
                data-testid={`tab-${type}`}
              >
                <Icon className="w-5 h-5" />
                {tabInfo.label}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive 
                    ? `bg-${tabInfo.color}-100 text-${tabInfo.color}-700` 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tracks.filter(t => t.trackType === type).length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-green-900 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-900 text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ListIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Tracks</div>
              <div className="text-2xl font-bold text-gray-900">{tracks.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">With Audio</div>
              <div className="text-2xl font-bold text-gray-900">
                {tracks.filter(t => t.loadedAudioURL).length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Track</div>
              <div className="text-sm font-semibold text-gray-900">
                {activeTrackId ? tracks.find(t => t.id === activeTrackId)?.name.substring(0, 20) + '...' : 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="grid grid-cols-1 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`bg-white rounded-lg border-2 p-6 transition-all ${
              track.id === activeTrackId
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
            data-testid={`track-card-${track.id}`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Track Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {track.name}
                    </h3>
                    {track.id === activeTrackId && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                        ● Active
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {track.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{track.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{track.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Music className={`w-4 h-4 ${track.loadedAudioURL ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>{track.loadedAudioURL ? 'Has Audio' : 'No Audio'}</span>
                  </div>
                </div>
              </div>

              {/* Right: Audio Management */}
              <div className="border-l border-gray-200 pl-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Link className="w-4 h-4 text-blue-600" />
                  Audio Upload by URL
                </h4>

                {/* Current Audio Display */}
                {track.loadedAudioURL ? (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-2">Current Audio URL:</p>
                    <p className="text-xs text-blue-700 break-all mb-3 font-mono">
                      {track.loadedAudioURL}
                    </p>
                    <audio
                      controls
                      className="w-full mb-3"
                      src={track.loadedAudioURL}
                      style={{ height: '40px' }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      onClick={() => handleDeleteAudioURL(track.id)}
                      disabled={savingTrackId === track.id}
                      className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {savingTrackId === track.id ? 'Removing...' : 'Remove Audio'}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3 italic">No audio uploaded yet</p>
                )}

                {/* Audio URL Input */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {track.loadedAudioURL ? 'Update Audio URL' : 'Enter Audio URL'}
                    </label>
                    <input
                      type="url"
                      value={audioURLInputs[track.id] || ''}
                      onChange={(e) => handleAudioURLChange(track.id, e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={savingTrackId === track.id}
                    />
                  </div>
                  <button
                    onClick={() => handleSaveAudioURL(track.id)}
                    disabled={savingTrackId === track.id || !audioURLInputs[track.id]?.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingTrackId === track.id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {track.loadedAudioURL ? 'Update Audio URL' : 'Save Audio URL'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Info:</span> These tracks are hardcoded with predefined questions. 
          You can only manage audio URLs for each track. Upload audio by providing a direct URL to the audio file.
        </p>
      </div>
    </div>
  );
}
