import { useState, useEffect } from 'react';
import { Music, FileText, Clock, List as ListIcon, Link, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebase';
import { Track } from '../data/track1';
import { allTracks } from '../data/tracks';

interface TrackWithAudio extends Track {
  loadedAudioURL?: string | null;
}

export function TrackManagement() {
  const [tracks, setTracks] = useState<TrackWithAudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [audioURLInputs, setAudioURLInputs] = useState<Record<string, string>>({});
  const [savingTrackId, setSavingTrackId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const db = getDatabase(app);

  useEffect(() => {
    loadTracksWithAudio();
    checkActiveTrack();
  }, []);

  const loadTracksWithAudio = async () => {
    try {
      setIsLoading(true);
      // Load hardcoded tracks
      const tracksWithAudio: TrackWithAudio[] = [];
      
      // Load audio URLs from Firebase for each track
      for (const track of allTracks) {
        const snapshot = await get(ref(db, `tracks/${track.id}/audioURL`));
        const audioURL = snapshot.exists() ? snapshot.val() : null;
        
        tracksWithAudio.push({
          ...track,
          loadedAudioURL: audioURL
        });
      }
      
      setTracks(tracksWithAudio);
    } catch (error) {
      console.error('Error loading tracks with audio:', error);
      setErrorMessage('Failed to load track audio URLs');
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
          <p className="text-gray-600 mt-1">Create and manage exam tracks with questions and audio</p>
        </div>
        <button
          onClick={handleCreateTrack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="create-track-button"
        >
          <Plus className="w-5 h-5" />
          Create New Track
        </button>
      </div>

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
                {tracks.filter(t => t.audioURL).length}
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
      {tracks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tracks yet</h3>
          <p className="text-gray-600 mb-4">Create your first exam track to get started</p>
          <button
            onClick={handleCreateTrack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Track
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                track.id === activeTrackId
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              data-testid={`track-card-${track.id}`}
            >
              {/* Track Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {track.name}
                  </h3>
                  {track.id === activeTrackId && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                      ● Active
                    </span>
                  )}
                </div>
              </div>

              {/* Track Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {track.description}
              </p>

              {/* Track Details */}
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
                  <Music className={`w-4 h-4 ${track.audioURL ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>{track.audioURL ? 'Has Audio' : 'No Audio'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditTrack(track)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  data-testid={`edit-track-${track.id}`}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTrack(track.id)}
                  disabled={track.id === activeTrackId}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid={`delete-track-${track.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Each track can have its own questions, duration, and audio file. 
          You can select any track to run in the Exam Control tab. The active track cannot be deleted.
        </p>
      </div>
    </div>
  );
}
