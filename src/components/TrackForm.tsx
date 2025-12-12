import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Link as LinkIcon, X, Music, Loader } from 'lucide-react';
import { Track } from '../data/track1';
import { audioService } from '../services/audioService';

interface TrackFormProps {
  track: Track | null;
  onSave: (track: Track) => void;
  onCancel: () => void;
}

export function TrackForm({ track, onSave, onCancel }: TrackFormProps) {
  const [formData, setFormData] = useState<Track>({
    id: track?.id || `track-${Date.now()}`,
    name: track?.name || '',
    shortName: track?.shortName || '',
    description: track?.description || '',
    duration: track?.duration || 60,
    totalQuestions: track?.totalQuestions || 40,
    audioURL: track?.audioURL || null,
    sections: track?.sections || []
  });

  const [audioUploadType, setAudioUploadType] = useState<'file' | 'url'>('file');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURLInput, setAudioURLInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (track?.audioURL) {
      setAudioURLInput(track.audioURL);
    }
  }, [track]);

  const handleInputChange = (field: keyof Track, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please select a valid audio file');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleAudioUpload = async () => {
    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const audioURL = await audioService.uploadAudio(audioFile, (progress) => {
        setUploadProgress(progress);
      });

      setFormData(prev => ({
        ...prev,
        audioURL
      }));

      alert('Audio uploaded successfully!');
      setAudioFile(null);
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAudioURLSave = () => {
    if (!audioURLInput.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      new URL(audioURLInput);
      setFormData(prev => ({
        ...prev,
        audioURL: audioURLInput
      }));
      alert('Audio URL saved!');
    } catch (error) {
      alert('Invalid URL format. Please enter a valid URL.');
    }
  };

  const handleRemoveAudio = () => {
    if (confirm('Remove audio from this track?')) {
      setFormData(prev => ({
        ...prev,
        audioURL: null
      }));
      setAudioURLInput('');
      setAudioFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a track name');
      return;
    }

    if (formData.duration <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    if (formData.sections.length === 0) {
      alert('Track must have at least one section with questions. For now, you can import questions from existing tracks.');
      // For MVP, we'll allow saving without sections for quick track creation
    }

    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {track ? 'Edit Track' : 'Create New Track'}
              </h2>
              <p className="text-gray-600 text-sm">
                {track ? 'Update track details and audio' : 'Add a new exam track with audio'}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            data-testid="save-track-button"
          >
            <Save className="w-5 h-5" />
            Save Track
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., IELTS Listening Test 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of this track..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalQuestions}
                onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Audio Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-600" />
              Audio Management
            </h3>
            {formData.audioURL && (
              <button
                type="button"
                onClick={handleRemoveAudio}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove Audio
              </button>
            )}
          </div>

          {formData.audioURL ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 mb-1">Audio Attached</p>
                  <p className="text-sm text-green-700 break-all">{formData.audioURL}</p>
                  <audio controls className="w-full mt-3" src={formData.audioURL}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Upload Type Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setAudioUploadType('file')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    audioUploadType === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setAudioUploadType('url')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    audioUploadType === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  URL Link
                </button>
              </div>

              {/* File Upload */}
              {audioUploadType === 'file' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="audio-file-input"
                    />
                    <label
                      htmlFor="audio-file-input"
                      className="cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to select audio file
                      </p>
                      <p className="text-xs text-gray-500">
                        MP3, WAV, OGG (Max 50MB)
                      </p>
                    </label>
                  </div>

                  {audioFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Music className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{audioFile.name}</p>
                            <p className="text-sm text-blue-700">
                              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAudioFile(null)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {isUploading && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {!isUploading && (
                        <button
                          type="button"
                          onClick={handleAudioUpload}
                          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Audio
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* URL Input */}
              {audioUploadType === 'url' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio File URL
                    </label>
                    <input
                      type="url"
                      value={audioURLInput}
                      onChange={(e) => setAudioURLInput(e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a direct link to an audio file hosted online
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAudioURLSave}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Audio URL
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Questions Section Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <span className="font-semibold">📝 Note:</span> This track uses {track ? 'existing' : 'default'} question structure. 
            Full question builder will be added in future updates. For now, questions from the original track structure will be used.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Track
          </button>
        </div>
      </form>
    </div>
  );
}
