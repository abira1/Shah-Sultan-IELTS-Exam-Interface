import { getDatabase, ref, get, set, update, remove, onValue, Unsubscribe } from 'firebase/database';
import { app } from '../firebase';
import { calculateOverallBand } from './bandScoreConversion';

/**
 * Section-wise submission data for mock tests
 * Each section (Listening, Reading, Writing) has its own submission data
 */
export interface SectionSubmission {
  trackId: string;
  trackName: string;
  answers: Record<number | string, string>;
  marks?: Record<number | string, 'correct' | 'incorrect' | null>;
  submittedAt: string;
  timeSpent: string;
  locked: boolean;           // View-only after submission
  correctAnswers?: number;   // Count of correct answers (for L & R)
  bandScore?: number;        // Calculated or manually input band score
}

/**
 * Main exam submission interface
 * Supports both partial tests (single track) and mock tests (multiple sections)
 */
export interface ExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  trackName: string;
  trackId: string;
  examCode?: string;
  batchId?: string;
  
  // Legacy fields for partial tests
  answers: Record<number | string, string>;
  submittedAt: string;
  timeSpent: string;
  status: 'completed';
  score?: number;
  marks?: Record<number | string, 'correct' | 'incorrect' | null>;
  manualScore?: number;
  
  // Multi-track support
  testType?: 'partial' | 'mock';
  trackIds?: string[];  // Array of track IDs for mock tests
  totalQuestions?: number;
  trackType?: 'listening' | 'reading' | 'writing' | 'mock';
  
  // NEW: Mock test section-wise data
  sectionSubmissions?: {
    listening?: SectionSubmission;
    reading?: SectionSubmission;
    writing?: SectionSubmission;
  };
  
  // NEW: IELTS band scores for mock tests
  sectionScores?: {
    listening?: number;      // Band score 0-9
    reading?: number;        // Band score 0-9
    writing?: number;        // Band score 0-9
    speaking?: number;       // Band score 0-9 (mandatory)
  };
  
  // NEW: Overall IELTS band score (average of 4 sections, rounded to 0.5)
  overallBand?: number;
  
  // Publishing
  resultPublished?: boolean;
  publishedAt?: string;
  markedBy?: string;
}

const db = getDatabase(app);

// Helper to check if online
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Helper to get hierarchical Firebase path
const getSubmissionPath = (trackId: string, examCode: string, submissionId: string): string => {
  return `submissions/${trackId}/${examCode}/${submissionId}`;
};

// Helper to get all submissions for a track
const getTrackPath = (trackId: string): string => {
  return `submissions/${trackId}`;
};

// Helper to get all submissions for an exam
const getExamPath = (trackId: string, examCode: string): string => {
  return `submissions/${trackId}/${examCode}`;
};

// LocalStorage fallback methods
const localStorageHelper = {
  getAll(): ExamSubmission[] {
    try {
      const data = localStorage.getItem('examSubmissions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },
  
  saveAll(submissions: ExamSubmission[]): void {
    try {
      localStorage.setItem('examSubmissions', JSON.stringify(submissions));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  add(submission: ExamSubmission): void {
    const submissions = this.getAll();
    submissions.push(submission);
    this.saveAll(submissions);
  },
  
  update(submissionId: string, updates: Partial<ExamSubmission>): void {
    const submissions = this.getAll();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      this.saveAll(submissions);
    }
  }
};

export const storage = {
  // Migration utility: Move localStorage data to Firebase
  async migrateLocalStorageToFirebase(): Promise<{ success: boolean; migrated: number; errors: number }> {
    try {
      console.log('Starting migration from localStorage to Firebase...');
      const localSubmissions = localStorageHelper.getAll();
      
      if (localSubmissions.length === 0) {
        console.log('No submissions found in localStorage to migrate.');
        return { success: true, migrated: 0, errors: 0 };
      }

      let migrated = 0;
      let errors = 0;

      for (const submission of localSubmissions) {
        try {
          // Ensure trackId and examCode exist
          if (!submission.trackId || !submission.examCode) {
            console.warn(`Skipping submission ${submission.id}: Missing trackId or examCode`);
            errors++;
            continue;
          }

          const path = getSubmissionPath(submission.trackId, submission.examCode, submission.id);
          await set(ref(db, path), submission);
          migrated++;
          console.log(`Migrated submission: ${submission.id}`);
        } catch (error) {
          console.error(`Error migrating submission ${submission.id}:`, error);
          errors++;
        }
      }

      console.log(`Migration complete: ${migrated} migrated, ${errors} errors`);
      
      // Optionally backup localStorage data with timestamp
      localStorage.setItem('examSubmissions_backup_' + Date.now(), JSON.stringify(localSubmissions));
      
      return { success: true, migrated, errors };
    } catch (error) {
      console.error('Migration failed:', error);
      return { success: false, migrated: 0, errors: 0 };
    }
  },

  // Get all submissions (from Firebase with localStorage fallback)
  async getSubmissions(): Promise<ExamSubmission[]> {
    try {
      if (!isOnline()) {
        console.log('Offline: Using localStorage');
        return localStorageHelper.getAll();
      }

      const snapshot = await get(ref(db, 'submissions'));
      
      if (!snapshot.exists()) {
        // Fallback to localStorage
        return localStorageHelper.getAll();
      }

      const data = snapshot.val();
      const submissions: ExamSubmission[] = [];

      // Parse hierarchical structure: submissions/{trackId}/{examCode}/{submissionId}
      Object.keys(data).forEach(trackId => {
        const trackData = data[trackId];
        Object.keys(trackData).forEach(examCode => {
          const examData = trackData[examCode];
          Object.keys(examData).forEach(submissionId => {
            // Skip metadata entries
            if (submissionId === '_metadata') return;
            submissions.push(examData[submissionId]);
          });
        });
      });

      // Sync to localStorage for offline access
      localStorageHelper.saveAll(submissions);
      
      return submissions;
    } catch (error) {
      console.error('Error getting submissions from Firebase:', error);
      // Fallback to localStorage
      return localStorageHelper.getAll();
    }
  },

  // Add submission (to Firebase with localStorage fallback)
  async addSubmission(submission: ExamSubmission): Promise<boolean> {
    try {
      console.log('=== ADDING SUBMISSION ===');
      console.log('Submission ID:', submission.id);
      console.log('Track ID:', submission.trackId);
      console.log('Exam Code:', submission.examCode);
      
      // Always save to localStorage first (offline support)
      console.log('Saving to localStorage...');
      localStorageHelper.add(submission);
      console.log('✓ Saved to localStorage');

      if (!isOnline()) {
        console.log('⚠ Offline: Submission saved to localStorage only');
        return true;
      }

      // Validate required fields
      if (!submission.trackId || !submission.examCode) {
        console.error('❌ Cannot save to Firebase: Missing trackId or examCode');
        console.error('Track ID:', submission.trackId);
        console.error('Exam Code:', submission.examCode);
        return false;
      }

      // Save to Firebase hierarchical structure
      const path = getSubmissionPath(submission.trackId, submission.examCode, submission.id);
      console.log('Firebase path:', path);
      console.log('Saving to Firebase...');
      
      await set(ref(db, path), submission);
      
      console.log('✓ Submission saved to Firebase:', submission.id);
      console.log('✓ Full path:', path);
      return true;
    } catch (error) {
      console.error('❌ Error adding submission to Firebase:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Already saved to localStorage, so return true
      return true;
    }
  },

  // Update submission
  async updateSubmission(submissionId: string, updates: Partial<ExamSubmission>): Promise<boolean> {
    try {
      // Update localStorage first
      localStorageHelper.update(submissionId, updates);

      if (!isOnline()) {
        console.log('Offline: Update saved to localStorage only');
        return true;
      }

      // Find the submission to get trackId and examCode
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission || !submission.trackId || !submission.examCode) {
        console.error('Cannot update Firebase: Submission not found or missing trackId/examCode');
        return false;
      }

      // Update in Firebase
      const path = getSubmissionPath(submission.trackId, submission.examCode, submissionId);
      await update(ref(db, path), updates);
      
      console.log('Submission updated in Firebase:', submissionId);
      return true;
    } catch (error) {
      console.error('Error updating submission in Firebase:', error);
      return true; // Already saved to localStorage
    }
  },

  // Update mark for a question or writing task
  async updateMark(submissionId: string, questionKey: number | string, mark: 'correct' | 'incorrect' | null): Promise<boolean> {
    try {
      // Update localStorage first
      const submissions = localStorageHelper.getAll();
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        if (!submission.marks) {
          submission.marks = {};
        }
        submission.marks[questionKey] = mark;
        console.log('Mark updated in localStorage:', { submissionId, questionKey, mark, allMarks: submission.marks });
        localStorageHelper.saveAll(submissions);
      }

      if (!isOnline()) {
        console.log('Offline: Mark updated in localStorage only');
        return true;
      }

      // Update in Firebase
      if (submission && submission.trackId && submission.examCode) {
        const path = `${getSubmissionPath(submission.trackId, submission.examCode, submissionId)}/marks/${questionKey}`;
        if (mark === null) {
          await remove(ref(db, path));
        } else {
          await set(ref(db, path), mark);
        }
        console.log('Mark updated in Firebase:', { submissionId, questionKey, mark });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating mark in Firebase:', error);
      return true; // Already saved to localStorage
    }
  },

  // Publish result
  async publishResult(submissionId: string): Promise<boolean> {
    try {
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission || !submission.marks) {
        console.log('Cannot publish: submission or marks not found', { submissionId, hasSubmission: !!submission, hasMarks: !!submission?.marks });
        return false;
      }

      // Determine expected question count based on track type
      const expectedCount = submission.totalQuestions || 40; // Default to 40 for backward compatibility
      const isWriting = submission.trackType === 'writing' && expectedCount === 2;
      
      // Check if all questions/tasks are marked
      let markedCount = 0;
      let correctCount = 0;
      
      if (isWriting) {
        // For writing tracks, dynamically get task keys from answers
        let taskKeys = submission.answers 
          ? Object.keys(submission.answers).filter(key => key.includes('task'))
          : [];
        
        // Fallback to default task keys if none found
        if (taskKeys.length === 0) {
          taskKeys = ['task1', 'task2'];
        }
        
        console.log('Writing track publish check:', { 
          submissionId, 
          taskKeys,
          marks: submission.marks,
          answers: submission.answers ? Object.keys(submission.answers) : []
        });
        
        taskKeys.forEach(taskKey => {
          const mark = submission.marks![taskKey];
          if (mark !== null && mark !== undefined) {
            markedCount++;
            if (mark === 'correct') {
              correctCount++;
            }
          }
        });
      } else {
        // For reading/listening tracks, check numbered questions
        for (let i = 1; i <= expectedCount; i++) {
          const mark = submission.marks![i];
          if (mark !== null && mark !== undefined) {
            markedCount++;
            if (mark === 'correct') {
              correctCount++;
            }
          }
        }
      }
      
      if (markedCount !== expectedCount) {
        console.log(`Marking incomplete: ${markedCount}/${expectedCount} marked`);
        return false;
      }
      
      const updates: Partial<ExamSubmission> = {
        manualScore: Math.round((correctCount / expectedCount) * 100),
        resultPublished: true,
        publishedAt: new Date().toISOString()
      };

      await this.updateSubmission(submissionId, updates);
      console.log('Result published successfully:', { submissionId, manualScore: updates.manualScore });
      return true;
    } catch (error) {
      console.error('Error publishing result:', error);
      return false;
    }
  },

  // Calculate manual score
  calculateManualScore(marks: Record<number | string, 'correct' | 'incorrect' | null>, totalQuestions: number = 40): number {
    const correctCount = Object.keys(marks).filter(
      key => marks[key] === 'correct'
    ).length;
    return Math.round((correctCount / totalQuestions) * 100);
  },

  // Student session methods (still use localStorage for quick access)
  getCurrentStudentId(): string | null {
    return localStorage.getItem('currentStudentId');
  },

  setCurrentStudentId(id: string): void {
    localStorage.setItem('currentStudentId', id);
  },

  getCurrentStudentName(): string | null {
    return localStorage.getItem('currentStudentName');
  },

  setCurrentStudentName(name: string): void {
    localStorage.setItem('currentStudentName', name);
  },

  clearCurrentStudent(): void {
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('currentStudentName');
  },

  // Calculate score
  calculateScore(answers: Record<number | string, string>, totalQuestions: number = 40): number {
    const answeredCount = Object.keys(answers).filter(key => {
      const answer = answers[key];
      return answer && answer.trim() !== '';
    }).length;
    return Math.round(answeredCount / totalQuestions * 100);
  },

  // Get submissions by exam code
  async getSubmissionsByExamCode(examCode: string): Promise<ExamSubmission[]> {
    const allSubmissions = await this.getSubmissions();
    return allSubmissions.filter(s => s.examCode === examCode);
  },

  // Get submissions by track ID
  async getSubmissionsByTrackId(trackId: string): Promise<ExamSubmission[]> {
    const allSubmissions = await this.getSubmissions();
    return allSubmissions.filter(s => s.trackId === trackId);
  },

  // Get submissions grouped by track
  async getSubmissionsGroupedByTrack(): Promise<Record<string, ExamSubmission[]>> {
    const allSubmissions = await this.getSubmissions();
    const grouped: Record<string, ExamSubmission[]> = {};
    
    allSubmissions.forEach(submission => {
      const trackId = submission.trackId || 'unknown';
      if (!grouped[trackId]) {
        grouped[trackId] = [];
      }
      grouped[trackId].push(submission);
    });
    
    return grouped;
  },

  // Get submission stats by exam code
  async getSubmissionStatsByExamCode(examCode: string): Promise<{
    total: number;
    graded: number;
    published: number;
    pending: number;
  }> {
    const submissions = await this.getSubmissionsByExamCode(examCode);
    return {
      total: submissions.length,
      graded: submissions.filter(s => s.marks && Object.keys(s.marks).length > 0).length,
      published: submissions.filter(s => s.resultPublished).length,
      pending: submissions.filter(s => !s.marks || Object.keys(s.marks).length === 0).length
    };
  },

  // Real-time listener for submissions
  subscribeToSubmissions(callback: (submissions: ExamSubmission[]) => void): Unsubscribe {
    const submissionsRef = ref(db, 'submissions');
    
    return onValue(submissionsRef, (snapshot) => {
      const submissions: ExamSubmission[] = [];
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Parse hierarchical structure
        Object.keys(data).forEach(trackId => {
          const trackData = data[trackId];
          Object.keys(trackData).forEach(examCode => {
            const examData = trackData[examCode];
            Object.keys(examData).forEach(submissionId => {
              // Skip metadata entries
              if (submissionId === '_metadata') return;
              submissions.push(examData[submissionId]);
            });
          });
        });
      }
      
      // Update localStorage cache
      localStorageHelper.saveAll(submissions);
      
      callback(submissions);
    }, (error) => {
      console.error('Error in real-time listener:', error);
      // Fallback to localStorage on error
      callback(localStorageHelper.getAll());
    });
  },

  // Real-time listener for specific track
  subscribeToTrackSubmissions(trackId: string, callback: (submissions: ExamSubmission[]) => void): Unsubscribe {
    const trackRef = ref(db, getTrackPath(trackId));
    
    return onValue(trackRef, (snapshot) => {
      const submissions: ExamSubmission[] = [];
      
      if (snapshot.exists()) {
        const trackData = snapshot.val();
        
        Object.keys(trackData).forEach(examCode => {
          const examData = trackData[examCode];
          Object.keys(examData).forEach(submissionId => {
            // Skip metadata entries
            if (submissionId === '_metadata') return;
            submissions.push(examData[submissionId]);
          });
        });
      }
      
      callback(submissions);
    });
  },

  // Real-time listener for specific exam
  subscribeToExamSubmissions(trackId: string, examCode: string, callback: (submissions: ExamSubmission[]) => void): Unsubscribe {
    const examRef = ref(db, getExamPath(trackId, examCode));
    
    return onValue(examRef, (snapshot) => {
      const submissions: ExamSubmission[] = [];
      
      if (snapshot.exists()) {
        const examData = snapshot.val();
        
        Object.keys(examData).forEach(submissionId => {
          // Skip metadata entries
          if (submissionId === '_metadata') return;
          submissions.push(examData[submissionId]);
        });
      }
      
      callback(submissions);
    });
  }
};