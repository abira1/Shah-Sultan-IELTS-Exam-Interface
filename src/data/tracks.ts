// Track Registry - All available exam tracks
import { track1, Track } from './track1';
import { track2 } from './track2';
import { track3 } from './track3';
import { track4 } from './track4';
import { track5 } from './track5';
import { track6 } from './track6';

// Export all tracks as an array
export const allTracks: Track[] = [track1, track2, track3, track4, track5, track6];

// Helper function to get track by ID
export const getTrackById = (trackId: string): Track | undefined => {
  return allTracks.find(track => track.id === trackId);
};

// Helper function to get track names for dropdown
export const getTrackOptions = () => {
  return allTracks.map(track => ({
    id: track.id,
    name: track.name,
    duration: track.duration,
    totalQuestions: track.totalQuestions
  }));
};

// Export Track type for use in other files
export type { Track };
