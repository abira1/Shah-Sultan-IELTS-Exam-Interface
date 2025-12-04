import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Music, CheckCircle, AlertCircle, Loader, Link } from 'lucide-react';
import { audioService } from '../services/audioService';

type UploadMethod = 'file' | 'url';

export function AudioManager() {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<{ fileName: string; uploadedAt: string; size: number; uploadType?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [urlInput, setUrlInput] = useState('');

  // Load audio on component mount
  useEffect(() => {
    loadAudio();
  }, []);

  const loadAudio = async () => {
    setIsLoading(true);
    try {
      const url = await audioService.getAudioURL();
      const metadata = await audioService.getAudioMetadata();
      setAudioURL(url);
      setAudioMetadata(metadata);
      setError(null);
    } catch (err) {
      setError("Failed to load audio data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError("Please select a valid audio file");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const url = await audioService.uploadAudio(file);
      setAudioURL(url);
      const metadata = await audioService.getAudioMetadata();
      setAudioMetadata(metadata);
      setSuccess("Audio uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to upload audio. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleURLUpload = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch (e) {
      setError("Please enter a valid URL format");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const url = await audioService.uploadAudioByURL(urlInput);
      setAudioURL(url);
      const metadata = await audioService.getAudioMetadata();
      setAudioMetadata(metadata);
      setSuccess("Audio URL saved successfully!");
      setUrlInput('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save audio URL. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the current audio?")) return;

    setIsLoading(true);
    setError(null);
    try {
      await audioService.deleteAudio();
      setAudioURL(null);
      setAudioMetadata(null);
      setSuccess("Audio deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete audio");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Audio Management</h2>
        </div>
        <p className="text-gray-600">Upload or change the audio that plays during the exam</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">{success}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading audio data...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upload Method Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              File Upload
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link className="w-4 h-4" />
              URL Upload
            </button>
          </div>

          {/* Upload Section */}
          {uploadMethod === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {isUploading ? "Uploading..." : "Click to upload audio file"}
                  </span>
                  <span className="text-xs text-gray-500">MP3, WAV, OGG or other audio formats (Max 50MB)</span>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              <div className="flex flex-col items-center gap-4">
                <Link className="w-8 h-8 text-gray-400" />
                <div className="w-full max-w-md space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Audio URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isUploading}
                  />
                  <button
                    onClick={handleURLUpload}
                    disabled={isUploading || !urlInput.trim()}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Saving..." : "Save Audio URL"}
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Provide a direct link to an audio file hosted online
                </span>
              </div>
            </div>
          )}

          {/* Current Audio Info */}
          {audioURL && audioMetadata && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                    {audioMetadata.uploadType === 'url' ? (
                      <Link className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Music className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Audio</h3>
                    <p className="text-sm text-gray-600 mt-1">{audioMetadata.fileName}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {audioMetadata.uploadType === 'url' ? 'URL Upload' : 'File Upload'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete audio"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                {audioMetadata.uploadType === 'file' && (
                  <p className="text-gray-600">
                    <span className="font-medium">Size:</span> {formatFileSize(audioMetadata.size)}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Uploaded:</span> {formatDate(audioMetadata.uploadedAt)}
                </p>
                {audioMetadata.uploadType === 'url' && (
                  <p className="text-gray-600 break-all">
                    <span className="font-medium">URL:</span>{' '}
                    <a href={audioURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {audioURL}
                    </a>
                  </p>
                )}
              </div>

              {/* Audio Player */}
              <div className="mt-4">
                <audio
                  controls
                  className="w-full"
                  src={audioURL}
                  style={{
                    outline: 'none',
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}

          {!audioURL && !isLoading && (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No audio uploaded yet</p>
              <p className="text-sm text-gray-400">Upload an audio file to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
