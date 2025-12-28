// Track Registry - All available exam tracks
import { Track } from './track1';
import { track5 } from './track5'; // 1-M Listening
import { track6 } from './track6'; // 2-M Listening
import { track3MListening } from './track-3m-listening';
import { track4 } from './track4'; // 4-M Listening
import { track5MListening } from './track-5m-listening';
import { track6MListening } from './track-6m-listening';
import { track7MListening } from './track-7m-listening';
import { track9MListening } from './track-9m-listening';
import { track10MListening } from './track-10m-listening';
import { track1MReading } from './track-1m-reading';
import { track2MReading } from './track-2m-reading';
import { track3MReading } from './track-3m-reading';
import { track4MReading } from './track-4m-reading';
import { track5MReading } from './track-5m-reading';
import { track1MWriting } from './track-1m-writing';
import { track2MWriting } from './track-2m-writing';
import { track3MWriting } from './track-3m-writing';
import { track4MWriting } from './track-4m-writing';
import { track5MWriting } from './track-5m-writing';

// Export all tracks as an array
export const allTracks: Track[] = [
  // Listening Tracks (organized by number: 1-M, 2-M, 3-M, 4-M, 5-M, 6-M, 7-M, 9-M, 10-M)
  track5,           // 1-M Listening
  track6,           // 2-M Listening
  track3MListening, // 3-M Listening
  track4,           // 4-M Listening
  track5MListening, // 5-M Listening
  track6MListening, // 6-M Listening
  track7MListening, // 7-M Listening
  track9MListening, // 9-M Listening
  track10MListening,// 10-M Listening
  // Reading Tracks
  track1MReading,
  track2MReading,
  track3MReading,
  track4MReading,
  track5MReading,
  // Writing Tracks
  track1MWriting,
  track2MWriting,
  track3MWriting,
  track4MWriting,
  track5MWriting
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
