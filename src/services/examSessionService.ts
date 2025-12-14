import { getDatabase, ref, get, set, remove, query, orderByChild, startAt, endAt } from 'firebase/database';
import { app } from '../firebase';
import { format } from 'date-fns';

export interface ExamSession {
  examCode: string;
  // For backward compatibility and partial tests
  trackId: string;
  trackName: string;
  // NEW: Multi-track support
  testType?: 'partial' | 'mock';
  selectedTracks?: {
    listening?: string;
    reading?: string;
    writing?: string;
  };
  // Individual track durations for mock tests
  trackDurations?: {
    listening?: number;
    reading?: number;
    writing?: number;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed';
  allowedBatches: string[];
  totalSubmissions: number;
  pendingResults: number;
  gradedResults: number;
  publishedResults: number;
  audioURL?: string;
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

const db = getDatabase(app);

// Helper to format date as YYYYMMDD
const formatDateForCode = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const examSessionService = {
  // Generate exam code
  async generateExamCode(
    trackId: string | null,
    trackShortName: string | null,
    date: Date,
    testType?: 'partial' | 'mock',
    selectedTracks?: { listening?: string; reading?: string; writing?: string }
  ): Promise<string> {
    try {
      const dateStr = formatDateForCode(date);
      let prefix = '';

      if (testType === 'mock') {
        // Mock test: Use "MOCK" prefix
        prefix = `MOCK-${dateStr}`;
      } else {
        // Partial test: Use track short name
        prefix = `${trackShortName}-${dateStr}`;
      }
      
      const snapshot = await get(ref(db, 'examSessions'));
      
      if (!snapshot.exists()) {
        return `${prefix}-001`;
      }

      const sessions = snapshot.val();
      const examCodes = Object.keys(sessions);
      
      // Filter codes with same prefix
      const sameDayCodes = examCodes.filter(code => code.startsWith(prefix));
      
      if (sameDayCodes.length === 0) {
        return `${prefix}-001`;
      }

      // Get the highest increment
      const increments = sameDayCodes.map(code => {
        const parts = code.split('-');
        return parseInt(parts[parts.length - 1], 10);
      });
      
      const maxIncrement = Math.max(...increments);
      const nextIncrement = maxIncrement + 1;
      
      return `${prefix}-${String(nextIncrement).padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating exam code:', error);
      throw error;
    }
  },

  // Create exam session
  async createExamSession(data: {
    examCode: string;
    trackId: string;
    trackName: string;
    testType?: 'partial' | 'mock';
    selectedTracks?: {
      listening?: string;
      reading?: string;
      writing?: string;
    };
    trackDurations?: {
      listening?: number;
      reading?: number;
      writing?: number;
    };
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: 'scheduled' | 'active' | 'completed';
    allowedBatches: string[];
    audioURL?: string;
    createdBy: string;
  }): Promise<{ success: boolean; examCode?: string; error?: string }> {
    try {
      console.log('Creating exam session:', data.examCode);
      
      const session: any = {
        examCode: data.examCode,
        trackId: data.trackId,
        trackName: data.trackName,
        testType: data.testType || 'partial',
        selectedTracks: data.selectedTracks,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        status: data.status,
        allowedBatches: data.allowedBatches,
        totalSubmissions: 0,
        pendingResults: 0,
        gradedResults: 0,
        publishedResults: 0,
        audioURL: data.audioURL,
        createdBy: data.createdBy,
        createdAt: new Date().toISOString()
      };

      // Only include trackDurations if it's provided (for mock tests)
      if (data.trackDurations) {
        session.trackDurations = data.trackDurations;
      }

      // Create exam session
      console.log('Saving exam session to Firebase...');
      await set(ref(db, `examSessions/${data.examCode}`), session);
      console.log('✓ Exam session saved successfully');

      // Auto-create submission folder in hierarchical structure
      // For mock tests, use 'mock' as trackId, for partial use actual trackId
      const submissionTrackId = data.testType === 'mock' ? 'mock' : data.trackId;
      const submissionFolderPath = `submissions/${submissionTrackId}/${data.examCode}`;
      console.log(`Creating submission folder at: ${submissionFolderPath}`);
      
      const metadata = {
        trackId: submissionTrackId,
        trackName: data.trackName,
        examCode: data.examCode,
        testType: data.testType || 'partial',
        selectedTracks: data.selectedTracks,
        createdAt: new Date().toISOString(),
        createdBy: data.createdBy,
        totalSubmissions: 0
      };
      
      await set(ref(db, `${submissionFolderPath}/_metadata`), metadata);
      console.log('✓ Submission folder created successfully with metadata:', metadata);

      return { success: true, examCode: data.examCode };
    } catch (error) {
      console.error('❌ Error creating exam session:', error);
      return { success: false, error: `Failed to create exam session: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  },

  // Get all exam sessions
  async getAllExamSessions(): Promise<ExamSession[]> {
    try {
      const snapshot = await get(ref(db, 'examSessions'));
      
      if (!snapshot.exists()) {
        return [];
      }

      const sessionsObj = snapshot.val();
      return Object.values(sessionsObj);
    } catch (error) {
      console.error('Error getting exam sessions:', error);
      return [];
    }
  },

  // Get exam session by code
  async getExamSessionByCode(examCode: string): Promise<ExamSession | null> {
    try {
      const snapshot = await get(ref(db, `examSessions/${examCode}`));
      
      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val();
    } catch (error) {
      console.error('Error getting exam session:', error);
      return null;
    }
  },

  // Update exam session
  async updateExamSession(examCode: string, updates: Partial<ExamSession>): Promise<boolean> {
    try {
      const session = await this.getExamSessionByCode(examCode);
      
      if (!session) {
        return false;
      }

      const updatedSession = {
        ...session,
        ...updates
      };

      await set(ref(db, `examSessions/${examCode}`), updatedSession);
      return true;
    } catch (error) {
      console.error('Error updating exam session:', error);
      return false;
    }
  },

  // Start exam
  async startExam(examCode: string): Promise<boolean> {
    try {
      console.log('Starting exam:', examCode);
      
      const session = await this.getExamSessionByCode(examCode);
      if (!session) {
        console.error('Exam session not found:', examCode);
        return false;
      }

      console.log('Found exam session:', session);

      // Ensure submission folder exists (in case it wasn't created during scheduling)
      const submissionTrackId = session.testType === 'mock' ? 'mock' : session.trackId;
      const submissionFolderPath = `submissions/${submissionTrackId}/${examCode}`;
      const metadataRef = ref(db, `${submissionFolderPath}/_metadata`);
      const metadataSnapshot = await get(metadataRef);
      
      if (!metadataSnapshot.exists()) {
        console.log('Submission folder does not exist. Creating now...');
        await set(metadataRef, {
          trackId: submissionTrackId,
          trackName: session.trackName,
          examCode: examCode,
          testType: session.testType || 'partial',
          selectedTracks: session.selectedTracks,
          createdAt: new Date().toISOString(),
          createdBy: session.createdBy,
          totalSubmissions: 0
        });
        console.log('✓ Submission folder created');
      } else {
        console.log('✓ Submission folder already exists');
      }

      // Update exam session
      await this.updateExamSession(examCode, {
        status: 'active',
        startedAt: new Date().toISOString()
      });
      console.log('✓ Exam session updated to active');

      // Update global exam status to include examCode
      const examStatus = {
        isStarted: true,
        activeTrackId: session.trackId,
        trackName: session.trackName,
        testType: session.testType || 'partial',
        selectedTracks: session.selectedTracks,
        trackDurations: session.trackDurations,
        examCode: examCode,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + session.duration * 60000).toISOString(),
        duration: session.duration,
        startedBy: session.createdBy
      };
      
      await set(ref(db, 'exam/status'), examStatus);
      console.log('✓ Global exam status updated:', examStatus);

      return true;
    } catch (error) {
      console.error('❌ Error starting exam:', error);
      return false;
    }
  },

  // Stop exam
  async stopExam(examCode: string): Promise<boolean> {
    try {
      await this.updateExamSession(examCode, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });

      // Clear global exam status
      await set(ref(db, 'exam/status'), {
        isStarted: false,
        activeTrackId: null,
        trackName: null,
        examCode: null,
        testType: null,
        selectedTracks: null
      });

      return true;
    } catch (error) {
      console.error('Error stopping exam:', error);
      return false;
    }
  },

  // Delete exam session
  async deleteExamSession(examCode: string): Promise<boolean> {
    try {
      await remove(ref(db, `examSessions/${examCode}`));
      return true;
    } catch (error) {
      console.error('Error deleting exam session:', error);
      return false;
    }
  },

  // Get sessions by track
  async getSessionsByTrack(trackId: string): Promise<ExamSession[]> {
    try {
      const allSessions = await this.getAllExamSessions();
      return allSessions.filter(session => session.trackId === trackId);
    } catch (error) {
      console.error('Error getting sessions by track:', error);
      return [];
    }
  },

  // Get active exams
  async getActiveExams(): Promise<ExamSession[]> {
    try {
      const allSessions = await this.getAllExamSessions();
      return allSessions.filter(session => session.status === 'active');
    } catch (error) {
      console.error('Error getting active exams:', error);
      return [];
    }
  },

  // Get scheduled exams
  async getScheduledExams(): Promise<ExamSession[]> {
    try {
      const allSessions = await this.getAllExamSessions();
      return allSessions.filter(session => session.status === 'scheduled');
    } catch (error) {
      console.error('Error getting scheduled exams:', error);
      return [];
    }
  }
};
