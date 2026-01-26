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
  // PHASE 1: Countdown fields
  countdownEnabled?: boolean;
  countdownSeconds?: number;
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
    // PHASE 1: Countdown parameters
    countdownEnabled?: boolean;
    countdownSeconds?: number;
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

      // PHASE 1: Include countdown settings if provided
      if (data.countdownEnabled && data.countdownSeconds) {
        session.countdownEnabled = data.countdownEnabled;
        session.countdownSeconds = data.countdownSeconds;
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
      const examStatus: any = {
        isStarted: true,
        activeTrackId: session.trackId,
        trackName: session.trackName,
        testType: session.testType || 'partial',
        selectedTracks: session.selectedTracks,
        examCode: examCode,
        globalStartTime: new Date().toISOString(),  // Phase 3: Renamed from startTime
        globalEndTime: new Date(Date.now() + session.duration * 60000).toISOString(),  // Phase 3: Renamed from endTime
        startTime: new Date().toISOString(),  // Keep for backward compatibility
        endTime: new Date(Date.now() + session.duration * 60000).toISOString(),  // Keep for backward compatibility
        duration: session.duration,
        startedBy: session.createdBy
      };

      // Only include trackDurations if it exists (for mock tests)
      if (session.trackDurations) {
        examStatus.trackDurations = session.trackDurations;
      }
      
      await set(ref(db, 'exam/status'), examStatus);
      console.log('✓ Global exam status updated:', examStatus);

      return true;
    } catch (error) {
      console.error('❌ Error starting exam:', error);
      return false;
    }
  },

  // Stop exam - Phase 4: Enhanced to trigger force exit for all students
  async stopExam(examCode: string): Promise<boolean> {
    try {
      console.log('🛑 Phase 4: Stopping exam:', examCode);
      
      // Update exam session status
      await this.updateExamSession(examCode, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      console.log('✓ Exam session marked as completed');

      // Clear global exam status - THIS TRIGGERS FORCE EXIT FOR ALL STUDENTS
      // The real-time listener in ExamPage.tsx will detect this change
      // and force all active students to exit the exam
      await set(ref(db, 'exam/status'), {
        isStarted: false,
        activeTrackId: null,
        trackName: null,
        examCode: null,
        testType: null,
        selectedTracks: null,
        globalStartTime: null,
        globalEndTime: null,
        startTime: null,
        endTime: null
      });
      console.log('✓ Global exam status cleared - all students will be forced to exit');

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
  },

  // PHASE 2: Trigger countdown
  async triggerCountdown(examCode: string): Promise<boolean> {
    try {
      console.log('🕐 Triggering countdown for exam:', examCode);
      
      const session = await this.getExamSessionByCode(examCode);
      if (!session) {
        console.error('Exam session not found:', examCode);
        return false;
      }

      if (!session.countdownEnabled || !session.countdownSeconds) {
        console.error('Countdown not enabled for this exam');
        return false;
      }

      const countdownStartTime = new Date().toISOString();
      const examStartTime = new Date(Date.now() + session.countdownSeconds * 1000).toISOString();

      const countdownData = {
        isActive: true,
        examCode: examCode,
        countdownStartTime: countdownStartTime,
        countdownSeconds: session.countdownSeconds,
        examStartTime: examStartTime,
        trackName: session.trackName,
        testType: session.testType || 'partial',
        selectedTracks: session.selectedTracks,
        allowedBatches: session.allowedBatches
      };

      await set(ref(db, 'exam/countdown'), countdownData);
      console.log('✓ Countdown triggered successfully:', countdownData);

      return true;
    } catch (error) {
      console.error('❌ Error triggering countdown:', error);
      return false;
    }
  },

  // PHASE 2: Clear countdown
  async clearCountdown(): Promise<boolean> {
    try {
      await set(ref(db, 'exam/countdown'), {
        isActive: false,
        examCode: null,
        countdownStartTime: null,
        countdownSeconds: 0,
        examStartTime: null,
        trackName: null,
        testType: null,
        selectedTracks: null,
        allowedBatches: []
      });
      console.log('✓ Countdown cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing countdown:', error);
      return false;
    }
  },

  // PHASE 2: Start exam with countdown flow
  async startExamWithCountdown(examCode: string): Promise<boolean> {
    try {
      console.log('🚀 Starting exam with countdown flow:', examCode);
      
      // Step 1: Trigger countdown
      const countdownTriggered = await this.triggerCountdown(examCode);
      if (!countdownTriggered) {
        console.error('Failed to trigger countdown');
        return false;
      }

      const session = await this.getExamSessionByCode(examCode);
      if (!session) {
        return false;
      }

      // Step 2: Wait for countdown duration
      console.log(`⏳ Waiting for ${session.countdownSeconds} seconds...`);
      await new Promise(resolve => setTimeout(resolve, session.countdownSeconds! * 1000));

      // Step 3: Start exam normally
      console.log('▶️ Countdown complete, starting exam...');
      const examStarted = await this.startExam(examCode);
      
      if (examStarted) {
        // Step 4: Clear countdown
        await this.clearCountdown();
        console.log('✅ Exam started successfully after countdown');
      }

      return examStarted;
    } catch (error) {
      console.error('❌ Error in countdown flow:', error);
      return false;
    }
  },

  // Auto-stop expired exams
  async autoStopExpiredExams(): Promise<void> {
    try {
      const activeExams = await this.getActiveExams();
      
      if (activeExams.length === 0) {
        return;
      }

      const now = new Date();

      for (const exam of activeExams) {
        // Use startedAt if available, otherwise fall back to createdAt
        const startTime = exam.startedAt || exam.createdAt;
        const examStartDate = new Date(startTime);
        const durationMs = exam.duration * 60 * 1000; // Convert minutes to milliseconds
        const examEndDate = new Date(examStartDate.getTime() + durationMs);

        // Check if exam has expired
        if (now >= examEndDate) {
          console.log(`⏰ Auto-stopping expired exam: ${exam.examCode} (ended at ${examEndDate.toISOString()})`);
          
          const success = await this.stopExam(exam.examCode);
          
          if (success) {
            console.log(`✅ Successfully auto-stopped exam: ${exam.examCode}`);
          } else {
            console.error(`❌ Failed to auto-stop exam: ${exam.examCode}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in autoStopExpiredExams:', error);
    }
  }
};
