import { getDatabase, ref, get, set, remove, query, orderByChild, startAt, endAt } from 'firebase/database';
import { app } from '../firebase';
import { format } from 'date-fns';

export interface ExamSession {
  examCode: string;
  trackId: string;
  trackName: string;
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
  async generateExamCode(trackId: string, trackShortName: string, date: Date): Promise<string> {
    try {
      const dateStr = formatDateForCode(date);
      const prefix = `${trackShortName}-${dateStr}`;
      
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
      const session: ExamSession = {
        examCode: data.examCode,
        trackId: data.trackId,
        trackName: data.trackName,
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

      await set(ref(db, `examSessions/${data.examCode}`), session);

      return { success: true, examCode: data.examCode };
    } catch (error) {
      console.error('Error creating exam session:', error);
      return { success: false, error: 'Failed to create exam session' };
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
      await this.updateExamSession(examCode, {
        status: 'active',
        startedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error starting exam:', error);
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
