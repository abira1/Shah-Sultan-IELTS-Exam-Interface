// Track Registry - All available exam tracks
import { track1, Track } from './track1';
import { track4 } from './track4';
import { track5 } from './track5';
import { track6 } from './track6';
import { track1MReading } from './track-1m-reading';
import { trackWriting1 } from './track-writing-1';
import { track1MWriting } from './track-1m-writing';
import { track2MWriting } from './track-2m-writing';

// Export all tracks as an array
export const allTracks: Track[] = [
  // Listening Tracks
  track1, 
  track4, 
  track5, 
  track6,
  // Reading Tracks
  track1MReading,
  // Writing Tracks
  trackWriting1,
  track1MWriting
];

// Helper function to get track by ID
export const getTrackById = (trackId: string): Track | undefined => {
  return allTracks.find(track => track.id === trackId);
};

// Helper function to get tracks by type
export const getTracksByType = (type: 'listening' | 'reading' | 'writing'): Track[] => {
  return allTracks.filter(track => track.trackType === type);
};

// Helper function to get all tracks grouped by type
export const getAllTracksByType = () => {
  return {
    listening: getTracksByType('listening'),
    reading: getTracksByType('reading'),
    writing: getTracksByType('writing')
  };
};

// Helper function to get track names for dropdown
export const getTrackOptions = () => {
  return allTracks.map(track => ({
    id: track.id,
    name: track.name,
    duration: track.duration,
    totalQuestions: track.totalQuestions,
    trackType: track.trackType
  }));
};

// Helper function to get track options grouped by type
export const getTrackOptionsGrouped = () => {
  const grouped = getAllTracksByType();
  return {
    listening: grouped.listening.map(track => ({
      id: track.id,
      name: track.name,
      duration: track.duration,
      totalQuestions: track.totalQuestions
    })),
    reading: grouped.reading.map(track => ({
      id: track.id,
      name: track.name,
      duration: track.duration,
      totalQuestions: track.totalQuestions
    })),
    writing: grouped.writing.map(track => ({
      id: track.id,
      name: track.name,
      duration: track.duration,
      totalQuestions: track.totalQuestions
    }))
  };
};

// Export Track type for use in other files
export type { Track };
