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
  
  // Phase 4: Auto-submission flag
  autoSubmitted?: boolean;  // True if exam was auto-submitted due to time expiry
  
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
      
      if (!submission) {
        console.log('Cannot publish: submission not found', { submissionId });
        return false;
      }

      // For mock tests, use different validation - only check section band scores
      if (submission.testType === 'mock') {
        // Mock tests don't need individual question marking validation
        // They are validated by section band scores (checked in canPublishResult)
        console.log('Publishing mock test result:', { submissionId });

        // Calculate overall band score from section scores using official IELTS methodology
        let overallBandScore = 0;
        if (submission.sectionScores) {
          const { listening, reading, writing, speaking } = submission.sectionScores;
          if (listening !== undefined && reading !== undefined && writing !== undefined && speaking !== undefined) {
            // Use the official calculateOverallBand function with proper rounding rules
            overallBandScore = calculateOverallBand(listening, reading, writing, speaking);
          }
        }

        const updates: Partial<ExamSubmission> = {
          resultPublished: true,
          publishedAt: new Date().toISOString(),
          overallBand: overallBandScore || undefined
        };

        await this.updateSubmission(submissionId, updates);
        console.log('Mock test result published successfully:', { submissionId, overallBandScore });
        return true;
      }

      // For partial tests (non-mock), validate individual question marking
      if (!submission.marks) {
        console.log('Cannot publish: marks not found', { submissionId, hasMarks: !!submission?.marks });
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
  },

  // ============================================
  // NEW: Mock Test IELTS Band Score Methods
  // ============================================

  /**
   * Update section submission data for mock tests
   * Used when student submits a section (Listening, Reading, or Writing)
   */
  async updateSectionSubmission(
    submissionId: string,
    section: 'listening' | 'reading' | 'writing',
    sectionData: SectionSubmission
  ): Promise<boolean> {
    try {
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        console.error('Submission not found:', submissionId);
        return false;
      }

      const updates = {
        [`sectionSubmissions/${section}`]: sectionData
      };

      if (isOnline() && submission.trackId && submission.examCode) {
        const submissionPath = getSubmissionPath(submission.trackId, submission.examCode, submissionId);
        await update(ref(db, submissionPath), updates);
      }

      // Update localStorage
      const updatedSubmission = {
        ...submission,
        sectionSubmissions: {
          ...submission.sectionSubmissions,
          [section]: sectionData
        }
      };
      
      localStorageHelper.update(submissionId, updatedSubmission);
      return true;
    } catch (error) {
      console.error('Error updating section submission:', error);
      return false;
    }
  },

  /**
   * Save band score for a specific section
   * Automatically triggers overall band calculation if all 4 sections have scores
   */
  async saveSectionBandScore(
    submissionId: string,
    section: 'listening' | 'reading' | 'writing' | 'speaking',
    bandScore: number
  ): Promise<boolean> {
    try {
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        console.error('Submission not found:', submissionId);
        return false;
      }

      // Validate band score (0-9, in 0.5 increments)
      if (bandScore < 0 || bandScore > 9 || !Number.isInteger(bandScore * 2)) {
        console.error('Invalid band score:', bandScore);
        return false;
      }

      const updates = {
        [`sectionScores/${section}`]: bandScore
      };

      if (isOnline() && submission.trackId && submission.examCode) {
        const submissionPath = getSubmissionPath(submission.trackId, submission.examCode, submissionId);
        await update(ref(db, submissionPath), updates);
      }

      // Update localStorage
      const updatedSubmission = {
        ...submission,
        sectionScores: {
          ...submission.sectionScores,
          [section]: bandScore
        }
      };
      
      localStorageHelper.update(submissionId, updatedSubmission);

      // Auto-calculate overall band if all 4 sections have scores
      await this.calculateAndSaveOverallBand(submissionId);
      
      return true;
    } catch (error) {
      console.error('Error saving section band score:', error);
      return false;
    }
  },

  /**
   * Calculate and save overall IELTS band score
   * Only calculates if all 4 sections (L, R, W, S) have band scores
   * Returns the calculated overall band or null if not all sections are scored
   */
  async calculateAndSaveOverallBand(submissionId: string): Promise<number | null> {
    try {
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission || !submission.sectionScores) {
        return null;
      }

      const { listening, reading, writing, speaking } = submission.sectionScores;

      // Check if all 4 sections have scores
      if (
        listening === undefined || 
        reading === undefined || 
        writing === undefined || 
        speaking === undefined
      ) {
        console.log('Not all sections have band scores yet');
        return null;
      }

      // Calculate overall band (average of 4, rounded to 0.5)
      const overallBand = calculateOverallBand(listening, reading, writing, speaking);

      const updates = {
        overallBand
      };

      if (isOnline() && submission.trackId && submission.examCode) {
        const submissionPath = getSubmissionPath(submission.trackId, submission.examCode, submissionId);
        await update(ref(db, submissionPath), updates);
      }

      // Update localStorage
      localStorageHelper.update(submissionId, { overallBand });

      console.log(`Overall band calculated for ${submissionId}:`, overallBand);
      return overallBand;
    } catch (error) {
      console.error('Error calculating overall band:', error);
      return null;
    }
  },

  /**
   * Check if a mock test submission can be published
   * Requirements:
   * - All 4 sections must have band scores (L, R, W, S)
   * - Speaking score is MANDATORY
   */
  async canPublishResult(submissionId: string): Promise<boolean> {
    try {
      const submissions = await this.getSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        return false;
      }

      // For partial tests, use existing logic
      if (submission.testType !== 'mock') {
        return true; // Use existing publish validation
      }

      // For mock tests, check all 4 band scores
      if (!submission.sectionScores) {
        console.log('No section scores found');
        return false;
      }

      const { listening, reading, writing, speaking } = submission.sectionScores;

      // All 4 must be present
      if (
        listening === undefined || 
        reading === undefined || 
        writing === undefined || 
        speaking === undefined
      ) {
        console.log('Missing section scores:', {
          listening: listening !== undefined,
          reading: reading !== undefined,
          writing: writing !== undefined,
          speaking: speaking !== undefined
        });
        return false;
      }

      // Speaking is mandatory
      if (speaking === undefined || speaking === null) {
        console.log('Speaking score is mandatory');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking publish eligibility:', error);
      return false;
    }
  },

  /**
   * Get section-wise statistics for a mock test submission
   */
  getSectionStats(submission: ExamSubmission): {
    listening?: { correct: number; total: number; bandScore?: number };
    reading?: { correct: number; total: number; bandScore?: number };
    writing?: { bandScore?: number };
    speaking?: { bandScore?: number };
  } {
    const stats: any = {};

    if (!submission.sectionSubmissions) {
      return stats;
    }

    // Listening stats
    if (submission.sectionSubmissions.listening) {
      const section = submission.sectionSubmissions.listening;
      const correct = section.correctAnswers || 0;
      stats.listening = {
        correct,
        total: 40,
        bandScore: submission.sectionScores?.listening
      };
    }

    // Reading stats
    if (submission.sectionSubmissions.reading) {
      const section = submission.sectionSubmissions.reading;
      const correct = section.correctAnswers || 0;
      stats.reading = {
        correct,
        total: 40,
        bandScore: submission.sectionScores?.reading
      };
    }

    // Writing stats
    if (submission.sectionSubmissions.writing) {
      stats.writing = {
        bandScore: submission.sectionScores?.writing
      };
    }

    // Speaking stats
    if (submission.sectionScores?.speaking !== undefined) {
      stats.speaking = {
        bandScore: submission.sectionScores.speaking
      };
    }

    return stats;
  },

  /**
   * Delete all submissions for a specific exam code
   * Used for bulk deletion of session submissions
   */
  async deleteSubmissionsByExamCode(examCode: string, trackId: string): Promise<boolean> {
    try {
      // Get all submissions for this exam code
      const submissions = await this.getSubmissions();
      const submissionsToDelete = submissions.filter(s => s.examCode === examCode);

      if (submissionsToDelete.length === 0) {
        console.log('No submissions found for exam code:', examCode);
        return true;
      }

      // Delete from localStorage
      const remainingSubmissions = submissions.filter(s => s.examCode !== examCode);
      localStorageHelper.saveAll(remainingSubmissions);

      // Delete from Firebase if online
      if (isOnline()) {
        for (const submission of submissionsToDelete) {
          if (submission.trackId && submission.examCode) {
            const path = getSubmissionPath(submission.trackId, submission.examCode, submission.id);
            await remove(ref(db, path));
          }
        }
      }

      console.log(`Deleted ${submissionsToDelete.length} submissions for exam code: ${examCode}`);
      return true;
    } catch (error) {
      console.error('Error deleting submissions by exam code:', error);
      return false;
    }
  },

  /**
   * Auto-mark submissions based on answer key
   * Only for Listening and Reading tracks
   */
  async autoMarkSubmissions(
    examCode: string,
    answerKey: Record<number, string>,
    trackType: 'listening' | 'reading',
    onProgress?: (current: number, total: number, studentName: string) => void
  ): Promise<{ success: boolean; markedCount: number; errors: string[] }> {
    try {
      const submissions = await this.getSubmissions();
      const sessionSubmissions = submissions.filter(
        s => s.examCode === examCode && s.trackType === trackType
      );

      if (sessionSubmissions.length === 0) {
        return { success: false, markedCount: 0, errors: ['No submissions found for this session'] };
      }

      let markedCount = 0;
      const errors: string[] = [];
      const totalSubmissions = sessionSubmissions.length;

      // Calculate delay per submission (minimum 3s, scales down for larger batches)
      // For 1-5 submissions: 3-4s each
      // For 6-10 submissions: 2-3s each
      // For 11-20 submissions: 1.5-2s each
      // For 21+ submissions: 1-1.5s each
      const calculateDelay = (total: number): number => {
        if (total <= 5) return 3000 + Math.random() * 1000; // 3-4s
        if (total <= 10) return 2000 + Math.random() * 1000; // 2-3s
        if (total <= 20) return 1500 + Math.random() * 500; // 1.5-2s
        return 1000 + Math.random() * 500; // 1-1.5s
      };

      const delayPerSubmission = calculateDelay(totalSubmissions);

      for (let index = 0; index < sessionSubmissions.length; index++) {
        const submission = sessionSubmissions[index];

        try {
          // Report progress before marking
          if (onProgress) {
            onProgress(index + 1, totalSubmissions, submission.studentName);
          }

          const marks: Record<number, 'correct' | 'incorrect' | null> = {};
          let correctCount = 0;
          const totalQuestions = submission.totalQuestions || 40;

          // Compare student answers with answer key
          for (let i = 1; i <= totalQuestions; i++) {
            const studentAnswer = submission.answers?.[i]?.trim().toLowerCase();
            const correctAnswerRaw = answerKey[i]?.trim() || '';

            if (!studentAnswer) {
              // Mark unanswered questions as incorrect (counts against score)
              marks[i] = 'incorrect';
            } else {
              // Split answer key by '/' to support multiple alternative answers
              const correctAnswers = correctAnswerRaw
                .split('/')
                .map(ans => ans.trim().toLowerCase())
                .filter(ans => ans.length > 0);

              // Debug logging
              console.log(`[Auto-Grading Debug] Question ${i}:`);
              console.log(`  Student Answer: "${studentAnswer}"`);
              console.log(`  Answer Key Raw: "${correctAnswerRaw}"`);
              console.log(`  Alternatives: [${correctAnswers.map(a => `"${a}"`).join(', ')}]`);

              // Check if student answer matches ANY of the alternative answers (case-insensitive)
              const isCorrect = correctAnswers.some(correctAns => studentAnswer === correctAns);

              console.log(`  Match Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);

              if (isCorrect) {
                marks[i] = 'correct';
                correctCount++;
              } else {
                marks[i] = 'incorrect';
              }
            }
          }

          // Calculate score (only correct answers count, unanswered = incorrect)
          const manualScore = Math.round((correctCount / totalQuestions) * 100);

          // Update submission with marks and score
          await this.updateSubmission(submission.id, {
            marks,
            manualScore
          });

          markedCount++;

          // Delay to make progress visible and satisfying
          // Slightly randomized to feel more natural
          const delay = delayPerSubmission + Math.random() * 200 - 100; // ±100ms variation
          await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
          errors.push(`Failed to mark submission ${submission.id}: ${error}`);
        }
      }

      return { success: true, markedCount, errors };
    } catch (error) {
      console.error('Error auto-marking submissions:', error);
      return { success: false, markedCount: 0, errors: [String(error)] };
    }
  },

  /**
   * Get marking statistics for a session
   * Returns counts of fully marked, partially marked, and unmarked submissions
   */
  async getSessionMarkingStats(examCode: string): Promise<{
    total: number;
    fullyMarked: number;
    partiallyMarked: number;
    unmarked: number;
    published: number;
    unpublished: number;
  }> {
    try {
      const submissions = await this.getSubmissions();
      const sessionSubmissions = submissions.filter(s => s.examCode === examCode);

      let fullyMarked = 0;
      let partiallyMarked = 0;
      let unmarked = 0;
      let published = 0;
      let unpublished = 0;

      for (const submission of sessionSubmissions) {
        // Check published status
        if (submission.resultPublished) {
          published++;
        } else {
          unpublished++;
        }

        // For mock tests, check section scores
        if (submission.testType === 'mock') {
          const scores = submission.sectionScores;
          if (!scores) {
            unmarked++;
          } else {
            const scoreCount = [
              scores.listening,
              scores.reading,
              scores.writing,
              scores.speaking
            ].filter(s => s !== undefined).length;

            if (scoreCount === 4) {
              fullyMarked++;
            } else if (scoreCount > 0) {
              partiallyMarked++;
            } else {
              unmarked++;
            }
          }
        } else {
          // For partial tests, check marks
          if (!submission.marks || Object.keys(submission.marks).length === 0) {
            unmarked++;
          } else {
            const totalQuestions = submission.totalQuestions || 40;
            const markedCount = Object.keys(submission.marks).filter(
              key => submission.marks![key] !== null && submission.marks![key] !== undefined
            ).length;

            if (markedCount === totalQuestions) {
              fullyMarked++;
            } else if (markedCount > 0) {
              partiallyMarked++;
            } else {
              unmarked++;
            }
          }
        }
      }

      return {
        total: sessionSubmissions.length,
        fullyMarked,
        partiallyMarked,
        unmarked,
        published,
        unpublished
      };
    } catch (error) {
      console.error('Error getting session marking stats:', error);
      return {
        total: 0,
        fullyMarked: 0,
        partiallyMarked: 0,
        unmarked: 0,
        published: 0,
        unpublished: 0
      };
    }
  },

  /**
   * Save answer key for a session
   * Stores the answer key in Firebase for future retrieval
   */
  async saveAnswerKey(
    examCode: string,
    trackType: 'listening' | 'reading',
    answerKey: Record<number, string>
  ): Promise<void> {
    try {
      const db = getDatabase(app);
      const answerKeyRef = ref(db, `answerKeys/${examCode}/${trackType}`);

      await set(answerKeyRef, {
        answerKey,
        trackType,
        examCode,
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`Answer key saved for ${examCode} - ${trackType}`);
    } catch (error) {
      console.error('Error saving answer key:', error);
      throw error;
    }
  },

  /**
   * Get saved answer key for a session
   * Returns the answer key if it exists, null otherwise
   */
  async getAnswerKey(
    examCode: string,
    trackType: 'listening' | 'reading'
  ): Promise<Record<number, string> | null> {
    try {
      const db = getDatabase(app);
      const answerKeyRef = ref(db, `answerKeys/${examCode}/${trackType}`);

      const snapshot = await get(answerKeyRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`Answer key retrieved for ${examCode} - ${trackType}`);
        return data.answerKey || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting answer key:', error);
      return null;
    }
  },

  /**
   * Delete answer key for a session
   * Removes the saved answer key from Firebase
   */
  async deleteAnswerKey(
    examCode: string,
    trackType: 'listening' | 'reading'
  ): Promise<void> {
    try {
      const db = getDatabase(app);
      const answerKeyRef = ref(db, `answerKeys/${examCode}/${trackType}`);

      await remove(answerKeyRef);
      console.log(`Answer key deleted for ${examCode} - ${trackType}`);
    } catch (error) {
      console.error('Error deleting answer key:', error);
      throw error;
    }
  }
};