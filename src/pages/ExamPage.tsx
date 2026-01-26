import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { app } from '../firebase';
import { ExamHeader } from '../components/ExamHeader';
import { TableGapQuestion } from '../components/TableGapQuestion';
import { MultiColumnTableQuestion } from '../components/MultiColumnTableQuestion';
import { MultipleChoiceQuestion } from '../components/MultipleChoiceQuestion';
import { MultipleChoiceMultiSelectQuestion } from '../components/MultipleChoiceMultiSelectQuestion';
import { SentenceCompletionQuestion } from '../components/SentenceCompletionQuestion';
import { DropdownQuestion } from '../components/DropdownQuestion';
import { DragAndDropQuestion } from '../components/DragAndDropQuestion';
import { FlowChartQuestion } from '../components/FlowChartQuestion';
import { MapLabelingQuestion } from '../components/MapLabelingQuestion';
import { DragDropTableQuestion } from '../components/DragDropTableQuestion';
import { MapTextInputQuestion } from '../components/MapTextInputQuestion';
import { ParagraphGapQuestion } from '../components/ParagraphGapQuestion';
import { WritingTaskInput } from '../components/WritingTaskInput';
import { WritingTaskWithImage } from '../components/WritingTaskWithImage';
import { WritingTaskTwoColumn } from '../components/WritingTaskTwoColumn';
import { TrueFalseNotGiven } from '../components/questions/TrueFalseNotGiven';
import { TrueFalseNotGivenCollapsible } from '../components/questions/TrueFalseNotGivenCollapsible';
import { TableSelectionQuestion } from '../components/questions/TableSelectionQuestion';
import { YesNoNotGiven } from '../components/questions/YesNoNotGiven';
import { MatchingHeadings } from '../components/questions/MatchingHeadings';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { audioService } from '../services/audioService';
import { getTrackById, Track } from '../data/tracks';
import { Section } from '../data/examData';
import { storage, ExamSubmission, SectionSubmission } from '../utils/storage';
import { Loader, Headphones, BookOpen, PenTool, ChevronRight, ChevronLeft, AlertCircle, CheckCircle, Highlighter, Eraser } from 'lucide-react';
import { ContextMenu, ContextMenuItem } from '../components/ui/context-menu';
import { ImportantNotice } from '../components/ImportantNotice';
import { ExamInstructions } from '../components/ExamInstructions';
import { LateEntryModal } from '../components/LateEntryModal';
import { ForceExitModal } from '../components/ForceExitModal';

interface ExamPageProps {
  studentId: string;
  studentName: string;
  studentBatchId?: string;
  examCode: string;
  onSubmit: () => void;
}

interface TrackData {
  track: Track;
  audioURL: string | null;
}

export function ExamPage({
  studentId,
  studentName,
  studentBatchId,
  examCode,
  onSubmit
}: ExamPageProps) {
  // Track-specific answer states for proper isolation in mock tests
  const [trackAnswers, setTrackAnswers] = useState<Record<number, Record<number, string>>>({});
  const [trackWritingAnswers, setTrackWritingAnswers] = useState<Record<number, Record<string, string>>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Current track's answers (derived from track-specific states)
  const answers = trackAnswers[currentTrackIndex] || {};
  const writingAnswers = trackWritingAnswers[currentTrackIndex] || {};
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [startTime] = useState(() => Date.now()); // Will be corrected after sync
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [isTimeCritical, setIsTimeCritical] = useState(false);
  
  // Phase 3: Server time synchronization
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0); // Difference between server and client time
  const [isTimeSynced, setIsTimeSynced] = useState(false);
  
  // Mock test: Individual track timers
  const [trackEndTimes, setTrackEndTimes] = useState<number[]>([]);
  const [currentTrackTimeRemaining, setCurrentTrackTimeRemaining] = useState('--:--');
  
  // Multi-track support
  const [testType, setTestType] = useState<'partial' | 'mock'>('partial');
  const [trackDataList, setTrackDataList] = useState<TrackData[]>([]);
  const [trackOrder, setTrackOrder] = useState<Array<'listening' | 'reading' | 'writing'>>([]);
  
  // Audio preloading state - runs in background without blocking exam
  const [preloadedAudio, setPreloadedAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLoadProgress, setAudioLoadProgress] = useState(0);
  const [audioLoadError, setAudioLoadError] = useState<string | null>(null);
  const audioPreloadStarted = useRef(false);
  
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [currentExamCode, setCurrentExamCode] = useState<string | null>(examCode);
  const [currentBatchId] = useState<string | null>(studentBatchId || null);
  
  // Text highlighting for reading passages
  const [highlights, setHighlights] = useState<Record<string, string[]>>({});
  
  // Context menu for text highlighting
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    selectedRange: Range | null;
    targetElement: HTMLElement | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    selectedRange: null,
    targetElement: null
  });
  
  // Phase 2: Section submission tracking for mock tests
  const [sectionSubmissions, setSectionSubmissions] = useState<{
    listening?: SectionSubmission;
    reading?: SectionSubmission;
    writing?: SectionSubmission;
  }>({});
  
  const [timeExpiredWarningShown, setTimeExpiredWarningShown] = useState<{
    [key: number]: boolean;
  }>({});
  
  // Notice and Instructions flow control
  const [showNotice, setShowNotice] = useState(true);
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsRead, setInstructionsRead] = useState<Record<number, boolean>>({});
  const [examStarted, setExamStarted] = useState(false);
  
  // Phase 2: Auto-submit state
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  
  // Phase 3: Late entry detection
  const [lateEntryInfo, setLateEntryInfo] = useState<{
    isLate: boolean;
    examName: string;
    examCode: string;
    startTime: string;
    originalDuration: number;
    remainingMinutes: number;
  } | null>(null);
  const [showLateEntryModal, setShowLateEntryModal] = useState(false);
  
  // Phase 4: Force exit and auto-submit
  const [showForceExitModal, setShowForceExitModal] = useState(false);
  const [forceExitReason, setForceExitReason] = useState<'time_expired' | 'admin_stopped' | 'exam_ended'>('time_expired');
  const hasAutoSubmittedRef = useRef(false); // Prevent double submission
  const isSubmittingRef = useRef(false); // Track submission in progress
  
  // Countdown fix: Auto-retry and wait state
  const [isWaitingForExamStart, setIsWaitingForExamStart] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current track data
  const currentTrackData = trackDataList[currentTrackIndex];
  const currentTrack = currentTrackData?.track;
  const currentAudioURL = currentTrackData?.audioURL;
  const examData = currentTrack?.sections;

  // Fetch exam tracks, times and audio from Firebase
  useEffect(() => {
    // Phase 3: Sync client time with Firebase server time
    const syncServerTime = async () => {
      try {
        const db = getDatabase(app);
        const serverTimeRef = ref(db, '.info/serverTimeOffset');
        
        const snapshot = await get(serverTimeRef);
        if (snapshot.exists()) {
          const offset = snapshot.val();
          setServerTimeOffset(offset);
          setIsTimeSynced(true);
          console.log('✓ Server time synced. Offset:', offset, 'ms');
        }
      } catch (error) {
        console.error('Failed to sync server time:', error);
        // Fallback: use client time with warning
        setIsTimeSynced(true);
        console.warn('⚠️ Using client time as fallback');
      }
    };
    
    const fetchExamData = async () => {
      const db = getDatabase(app);
      setIsLoadingTrack(true);
      setTrackError(null);
      
      try {
        // Sync server time first
        await syncServerTime();
        
        console.log('=== FETCHING EXAM DATA ===');
        console.log('Student ID:', studentId);
        console.log('Student Name:', studentName);
        console.log('Student Batch ID:', studentBatchId);
        console.log('Requested Exam Code:', examCode);
        
        // Step 1: Fetch the specific exam session
        const examSessionSnapshot = await get(ref(db, `examSessions/${examCode}`));
        
        if (!examSessionSnapshot.exists()) {
          console.log('❌ Exam session not found:', examCode);
          setTrackError('Exam session not found. Please check with admin.');
          setIsLoadingTrack(false);
          return;
        }
        
        const examSession = examSessionSnapshot.val();
        console.log('✓ Exam session found:', JSON.stringify(examSession, null, 2));
        
        // Step 2: Check if exam session is active
        if (examSession.status !== 'active') {
          console.log('❌ Exam session is not active. Status:', examSession.status);
          
          // Countdown fix: If exam has countdown enabled, it might be starting soon
          // Set up a listener and auto-retry instead of showing immediate error
          if (examSession.countdownEnabled && retryAttempt < 10) {
            console.log(`⏳ Exam starting soon (attempt ${retryAttempt + 1}/10). Setting up listener...`);
            setIsWaitingForExamStart(true);
            setIsLoadingTrack(false);
            
            // Set up real-time listener for exam session status
            const examSessionRef = ref(db, `examSessions/${examCode}/status`);
            const unsubscribe = onValue(examSessionRef, (snapshot) => {
              if (snapshot.exists() && snapshot.val() === 'active') {
                console.log('✅ Exam is now active! Reloading...');
                unsubscribe();
                setRetryAttempt(0);
                setIsWaitingForExamStart(false);
                // Retry loading exam data
                fetchExamData();
              }
            });
            
            // Fallback: retry after 2 seconds if listener doesn't trigger
            retryTimeoutRef.current = setTimeout(() => {
              console.log('⏱️ Retry timeout, attempting reload...');
              unsubscribe();
              setRetryAttempt(prev => prev + 1);
              setIsWaitingForExamStart(false);
              fetchExamData();
            }, 2000);
            
            return;
          }
          
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Exam session is active');
        
        // Step 3: Check if student's batch is allowed
        if (studentBatchId && examSession.allowedBatches) {
          const isBatchAllowed = examSession.allowedBatches.includes(studentBatchId);
          console.log('Student batch allowed:', isBatchAllowed);
          console.log('Allowed batches:', examSession.allowedBatches);
          
          if (!isBatchAllowed) {
            console.log('❌ Student batch not allowed for this exam');
            setTrackError('You are not enrolled in a batch that is allowed to take this exam.');
            setIsLoadingTrack(false);
            return;
          }
          
          console.log('✓ Student batch is allowed');
        }
        
        // Step 4: Check global exam status
        const globalStatusSnapshot = await get(ref(db, 'exam/status'));
        
        if (!globalStatusSnapshot.exists()) {
          console.log('❌ No global exam status found in Firebase');
          
          // Countdown fix: Retry with listener instead of immediate error
          if (retryAttempt < 10) {
            console.log(`⏳ Waiting for global exam status (attempt ${retryAttempt + 1}/10)...`);
            setIsWaitingForExamStart(true);
            setIsLoadingTrack(false);
            
            // Set up real-time listener for global exam status
            const globalStatusRef = ref(db, 'exam/status');
            const unsubscribe = onValue(globalStatusRef, (snapshot) => {
              if (snapshot.exists()) {
                const status = snapshot.val();
                if (status.isStarted && status.examCode === examCode) {
                  console.log('✅ Global exam status is now active! Reloading...');
                  unsubscribe();
                  setRetryAttempt(0);
                  setIsWaitingForExamStart(false);
                  fetchExamData();
                }
              }
            });
            
            // Fallback: retry after 2 seconds
            retryTimeoutRef.current = setTimeout(() => {
              console.log('⏱️ Retry timeout, attempting reload...');
              unsubscribe();
              setRetryAttempt(prev => prev + 1);
              setIsWaitingForExamStart(false);
              fetchExamData();
            }, 2000);
            
            return;
          }
          
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        const globalStatus = globalStatusSnapshot.val();
        console.log('Global exam status:', JSON.stringify(globalStatus, null, 2));
        
        if (!globalStatus.isStarted) {
          console.log('❌ Exam is not started globally');
          
          // Countdown fix: Retry with listener instead of immediate error
          if (retryAttempt < 10) {
            console.log(`⏳ Waiting for exam to start globally (attempt ${retryAttempt + 1}/10)...`);
            setIsWaitingForExamStart(true);
            setIsLoadingTrack(false);
            
            // Set up real-time listener for global exam status
            const globalStatusRef = ref(db, 'exam/status/isStarted');
            const unsubscribe = onValue(globalStatusRef, (snapshot) => {
              if (snapshot.exists() && snapshot.val() === true) {
                console.log('✅ Exam has started globally! Reloading...');
                unsubscribe();
                setRetryAttempt(0);
                setIsWaitingForExamStart(false);
                fetchExamData();
              }
            });
            
            // Fallback: retry after 2 seconds
            retryTimeoutRef.current = setTimeout(() => {
              console.log('⏱️ Retry timeout, attempting reload...');
              unsubscribe();
              setRetryAttempt(prev => prev + 1);
              setIsWaitingForExamStart(false);
              fetchExamData();
            }, 2000);
            
            return;
          }
          
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        if (globalStatus.examCode && globalStatus.examCode !== examCode) {
          console.log('❌ Global exam code mismatch');
          setTrackError('This exam is not currently active. A different exam is running.');
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Global exam status validated');
        
        // Step 5: Check if student has already submitted
        const existingSubmissions = await storage.getSubmissions();
        const hasSubmitted = existingSubmissions.some(
          sub => sub.studentId === studentId && sub.examCode === examCode
        );
        
        if (hasSubmitted) {
          console.log('❌ Student already submitted this exam');
          setTrackError('You have already submitted this exam. You cannot take the same exam twice.');
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Student has not submitted yet');
        
        // Step 6: Set exam code
        setCurrentExamCode(examCode);
        
        // Step 7: Determine test type and load tracks
        const examTestType = examSession.testType || 'partial';
        setTestType(examTestType);
        console.log('Test Type:', examTestType);
        
        const loadedTracks: TrackData[] = [];
        const order: Array<'listening' | 'reading' | 'writing'> = [];
        
        if (examTestType === 'mock' && examSession.selectedTracks) {
          // Mock Test: Load all three tracks in order
          console.log('Loading mock test tracks...');
          const { listening, reading, writing } = examSession.selectedTracks;
          
          // Load in standard order: Listening -> Reading -> Writing
          if (listening) {
            const track = getTrackById(listening);
            if (track) {
              const audioSnapshot = await get(ref(db, `tracks/${listening}/audioURL`));
              const audioURL = audioSnapshot.exists() ? audioSnapshot.val() : await audioService.getAudioURL();
              loadedTracks.push({ track, audioURL });
              order.push('listening');
              console.log('✓ Loaded listening track:', track.name);
            }
          }
          
          if (reading) {
            const track = getTrackById(reading);
            if (track) {
              loadedTracks.push({ track, audioURL: null });
              order.push('reading');
              console.log('✓ Loaded reading track:', track.name);
            }
          }
          
          if (writing) {
            const track = getTrackById(writing);
            if (track) {
              loadedTracks.push({ track, audioURL: null });
              order.push('writing');
              console.log('✓ Loaded writing track:', track.name);
            }
          }
          
        } else {
          // Partial Test: Load single track
          console.log('Loading partial test track...');
          const activeTrackId = examSession.trackId;
          
          if (!activeTrackId) {
            setTrackError('No active exam track. Please contact administrator.');
            setIsLoadingTrack(false);
            return;
          }

          const track = getTrackById(activeTrackId);
          
          if (!track) {
            setTrackError(`Invalid exam track ID: ${activeTrackId}. Please contact administrator.`);
            setIsLoadingTrack(false);
            return;
          }
          
          console.log('✓ Track loaded:', track.name);
          
          // Load audio for listening tracks
          let audioURL: string | null = null;
          if (track.trackType === 'listening') {
            const audioSnapshot = await get(ref(db, `tracks/${activeTrackId}/audioURL`));
            if (audioSnapshot.exists()) {
              audioURL = audioSnapshot.val();
            } else {
              audioURL = await audioService.getAudioURL();
            }
            console.log('✓ Audio loaded:', audioURL ? 'Yes' : 'No');
          }
          
          loadedTracks.push({ track, audioURL });
          order.push(track.trackType);
        }
        
        if (loadedTracks.length === 0) {
          setTrackError('No tracks loaded. Please contact administrator.');
          setIsLoadingTrack(false);
          return;
        }
        
        setTrackDataList(loadedTracks);
        setTrackOrder(order);
        console.log('✓ Loaded', loadedTracks.length, 'track(s)');

        // Set exam end time
        if (examTestType === 'mock' && examSession.trackDurations) {
          // Mock test: Set individual track end times
          // CRITICAL FIX: Use global exam start time (not current time) to ensure
          // all students have the same end times regardless of when they join
          
          // Phase 3: Use globalStartTime with fallback to startTime for backward compatibility
          const globalStartTimeStr = globalStatus.globalStartTime || globalStatus.startTime;
          if (!globalStartTimeStr) {
            console.error('❌ Global status missing startTime for mock test');
            setTrackError('Exam timing error. Please contact administrator.');
            setIsLoadingTrack(false);
            return;
          }
          
          // Calculate end times based on GLOBAL exam start time (set by admin)
          // NOT based on when this student enters
          const examStartTime = new Date(globalStartTimeStr).getTime();
          const endTimes: number[] = [];
          let cumulativeTime = examStartTime;
          
          console.log('Mock test - Global exam start time:', new Date(examStartTime).toLocaleString());
          console.log('Track durations:', examSession.trackDurations);
          
          if (order[0] === 'listening' && examSession.trackDurations.listening) {
            cumulativeTime += examSession.trackDurations.listening * 60000;
            endTimes.push(cumulativeTime);
            console.log(`  Listening end: ${new Date(cumulativeTime).toLocaleString()} (${examSession.trackDurations.listening} min)`);
          }
          if (order[1] === 'reading' && examSession.trackDurations.reading) {
            cumulativeTime += examSession.trackDurations.reading * 60000;
            endTimes.push(cumulativeTime);
            console.log(`  Reading end: ${new Date(cumulativeTime).toLocaleString()} (${examSession.trackDurations.reading} min)`);
          }
          if (order[2] === 'writing' && examSession.trackDurations.writing) {
            cumulativeTime += examSession.trackDurations.writing * 60000;
            endTimes.push(cumulativeTime);
            console.log(`  Writing end: ${new Date(cumulativeTime).toLocaleString()} (${examSession.trackDurations.writing} min)`);
          }
          
          setTrackEndTimes(endTimes);
          setExamEndTime(endTimes[endTimes.length - 1]); // Total exam end time
          
          // Verify student hasn't joined after exam ended
          const now = Date.now() + serverTimeOffset;
          const totalExamEndTime = endTimes[endTimes.length - 1];
          if (now >= totalExamEndTime) {
            console.log('⚠️ Student attempting to join after exam ended');
            setTrackError('This exam has already ended. You cannot join at this time.');
            setIsLoadingTrack(false);
            return;
          }
          
          console.log('✓ Track end times set for mock test (fixed to global start time)');
          console.log('  Current server time:', new Date(now).toLocaleString());
          console.log('  Time remaining:', Math.floor((totalExamEndTime - now) / 60000), 'minutes');
        } else {
          // Partial test: Use global end time
          // Phase 3: Use globalEndTime with fallback to endTime for backward compatibility
          const globalEndTimeStr = globalStatus.globalEndTime || globalStatus.endTime;
          if (!globalEndTimeStr) {
            console.error('❌ Global status missing endTime');
            setTrackError('Exam timing error. Please contact administrator.');
            setIsLoadingTrack(false);
            return;
          }
          
          const endTime = new Date(globalEndTimeStr).getTime();
          console.log('✓ Exam end time:', new Date(endTime).toLocaleString());
          
          // Verify student hasn't joined after exam ended
          const now = Date.now() + serverTimeOffset;
          if (now >= endTime) {
            console.log('⚠️ Student attempting to join after exam ended');
            setTrackError('This exam has already ended. You cannot join at this time.');
            setIsLoadingTrack(false);
            return;
          }
          
          setExamEndTime(endTime);
          console.log('  Current server time:', new Date(now).toLocaleString());
          console.log('  Time remaining:', Math.floor((endTime - now) / 60000), 'minutes');
        }
        
        console.log('=== EXAM DATA LOADED SUCCESSFULLY ===');
        
        // Phase 3: Check for late entry
        // Use globalStartTime with fallback to startTime for backward compatibility
        const globalStartTimeStr = globalStatus.globalStartTime || globalStatus.startTime;
        if (globalStartTimeStr) {
          const now = Date.now() + serverTimeOffset;
          const examStartTime = new Date(globalStartTimeStr).getTime();
          
          // Check if student is joining after exam has started
          if (now > examStartTime) {
            console.log('⚠️ LATE ENTRY DETECTED');
            
            // Calculate elapsed time and remaining time
            const elapsedMs = now - examStartTime;
            const elapsedMinutes = Math.floor(elapsedMs / 60000);
            
            let totalDuration = examSession.duration;
            let endTime: number;
            
            if (examTestType === 'mock' && trackEndTimes.length > 0) {
              // Mock test: Calculate total duration from all tracks
              endTime = trackEndTimes[trackEndTimes.length - 1];
              const totalDurationMs = endTime - examStartTime;
              totalDuration = Math.floor(totalDurationMs / 60000);
            } else {
              // Partial test: Use global end time
              const globalEndTimeStr = globalStatus.globalEndTime || globalStatus.endTime;
              if (globalEndTimeStr) {
                endTime = new Date(globalEndTimeStr).getTime();
              } else {
                endTime = examStartTime + (totalDuration * 60000);
              }
            }
            
            const remainingMs = endTime - now;
            const remainingMinutes = Math.floor(remainingMs / 60000);
            
            console.log(`  Elapsed: ${elapsedMinutes} minutes`);
            console.log(`  Remaining: ${remainingMinutes} minutes`);
            console.log(`  Original duration: ${totalDuration} minutes`);
            
            // Set late entry info
            setLateEntryInfo({
              isLate: true,
              examName: examSession.trackName || 'Exam',
              examCode: examCode,
              startTime: globalStartTimeStr,
              originalDuration: totalDuration,
              remainingMinutes: remainingMinutes
            });
            
            // Show late entry modal
            setShowLateEntryModal(true);
            console.log('✓ Late entry modal will be shown');
          } else {
            console.log('✓ Student joining on time');
            setLateEntryInfo(null);
            setShowLateEntryModal(false);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching exam data:', error);
        setTrackError(`Error loading exam: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh the page.`);
      } finally {
        setIsLoadingTrack(false);
      }
    };
    
    fetchExamData();
  }, [examCode, studentId, studentBatchId]);
  
  // Background audio preloading - runs independently without blocking exam
  useEffect(() => {
    // Only preload if we have audio URL and haven't started preloading yet
    if (!currentAudioURL || audioPreloadStarted.current || currentTrack?.trackType !== 'listening') {
      return;
    }
    
    audioPreloadStarted.current = true;
    
    const preloadAudio = async () => {
      try {
        console.log('🎵 Starting background audio preload...');
        setAudioLoadProgress(0);
        setAudioLoadError(null);
        
        const preloadedElement = await audioService.preloadAudioInBackground(
          currentAudioURL,
          (progress) => {
            setAudioLoadProgress(progress);
            if (progress === 100) {
              console.log('✅ Audio fully preloaded and ready');
            }
          }
        );
        
        setPreloadedAudio(preloadedElement);
        console.log('✅ Audio preloading complete');
      } catch (error) {
        console.error('⚠️ Audio preload failed (exam continues):', error);
        setAudioLoadError('Audio preload failed. Audio will load during playback.');
        // Don't block the exam - it can still proceed
      }
    };
    
    preloadAudio();
    
    // Cleanup on unmount
    return () => {
      if (preloadedAudio) {
        preloadedAudio.pause();
        preloadedAudio.src = '';
      }
    };
  }, [currentAudioURL, currentTrack]);
  
  // Phase 4: Real-time exam status listener - Force exit on admin stop or exam end
  useEffect(() => {
    if (!examStarted || !currentExamCode) return;
    
    const db = getDatabase(app);
    const examStatusRef = ref(db, 'exam/status');
    
    console.log('🔄 Phase 4: Setting up real-time exam status listener');
    
    const unsubscribe = onValue(examStatusRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log('⚠️ Exam status node deleted - forcing exit');
        handleForceExit('admin_stopped');
        return;
      }
      
      const status = snapshot.val();
      console.log('📡 Exam status update received:', status);
      
      // Check if exam was stopped (isStarted became false)
      if (!status.isStarted) {
        console.log('🛑 Exam stopped by admin - forcing exit');
        handleForceExit('admin_stopped');
        return;
      }
      
      // Check if exam code changed (different exam started)
      if (status.examCode && status.examCode !== currentExamCode) {
        console.log('🔄 Different exam started - forcing exit');
        handleForceExit('admin_stopped');
        return;
      }
      
      // Phase 4: Check if global end time passed (for edge cases)
      if (status.globalEndTime || status.endTime) {
        const now = getServerTime();
        const endTimeStr = status.globalEndTime || status.endTime;
        const endTime = new Date(endTimeStr).getTime();
        
        if (now >= endTime) {
          console.log('⏰ Global end time reached - forcing exit');
          handleForceExit('time_expired');
        }
      }
    }, (error) => {
      console.error('❌ Error in exam status listener:', error);
    });
    
    return () => {
      console.log('🔌 Cleaning up exam status listener');
      unsubscribe();
    };
  }, [examStarted, currentExamCode, serverTimeOffset, isTimeSynced]);
  
  // Phase 3: Get current time synchronized with server
  const getServerTime = () => {
    if (isTimeSynced) {
      return Date.now() + serverTimeOffset;
    }
    return Date.now(); // Fallback to client time
  };

  // Timer
  useEffect(() => {
    if (!examEndTime) return;

    const timer = setInterval(() => {
      const now = getServerTime(); // Phase 3: Use server time
      
      // For mock tests with individual track timers
      if (testType === 'mock' && trackEndTimes.length > 0) {
        const currentTrackEndTime = trackEndTimes[currentTrackIndex];
        const trackRemainingMs = currentTrackEndTime - now;
        
        // Check if current track time expired
        if (trackRemainingMs <= 0) {
          setCurrentTrackTimeRemaining('00:00');
          setIsTimeCritical(true);
          setIsTimeWarning(true);
          
          // AUTO-SUBMIT: If time expired and section not already submitted
          const currentSectionType = trackOrder[currentTrackIndex];
          const isAlreadySubmitted = sectionSubmissions[currentSectionType]?.locked;
          
          if (!isAlreadySubmitted && !hasAutoSubmitted) {
            console.log(`⏰ Time expired for ${currentSectionType} - Auto-submitting...`);
            setHasAutoSubmitted(true);
            
            // Trigger auto-submission after a brief delay (1 second) to show 00:00
            setTimeout(() => {
              handleSectionSubmit(currentSectionType);
            }, 1000);
          }
          
          // Update overall time remaining
          const totalRemainingMs = examEndTime - now;
          const totalSeconds = Math.floor(totalRemainingMs / 1000);
          const totalMins = Math.floor(totalSeconds / 60);
          const totalSecs = totalSeconds % 60;
          setTimeRemaining(`${String(totalMins).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`);
          return;
        }
        
        // Update current track timer display
        const trackTotalSeconds = Math.floor(trackRemainingMs / 1000);
        const trackMins = Math.floor(trackTotalSeconds / 60);
        const trackSecs = trackTotalSeconds % 60;
        
        // Warning states for current track
        if (trackTotalSeconds <= 120) {
          setIsTimeCritical(true);
          setIsTimeWarning(true);
        } else if (trackTotalSeconds <= 300) {
          setIsTimeWarning(true);
          setIsTimeCritical(false);
        } else {
          setIsTimeWarning(false);
          setIsTimeCritical(false);
        }
        
        setCurrentTrackTimeRemaining(`${String(trackMins).padStart(2, '0')}:${String(trackSecs).padStart(2, '0')}`);
        
        // Also update overall time remaining
        const totalRemainingMs = examEndTime - now;
        
        // Phase 4: Check if overall exam time expired (for mock tests)
        if (totalRemainingMs <= 0) {
          clearInterval(timer);
          setTimeRemaining('00:00');
          setCurrentTrackTimeRemaining('00:00');
          
          // Enhanced auto-submit with force exit for entire exam
          if (!hasAutoSubmittedRef.current && !isSubmittingRef.current) {
            console.log('⏰ Phase 4: Mock test time expired - triggering final auto-submit and force exit');
            hasAutoSubmittedRef.current = true;
            isSubmittingRef.current = true;
            
            // Submit the entire exam
            handleFinalSubmit().then(() => {
              // Show force exit modal
              setForceExitReason('time_expired');
              setShowForceExitModal(true);
            }).catch((error) => {
              console.error('❌ Error during mock test auto-submit:', error);
              // Still show force exit modal even if submission failed
              setForceExitReason('time_expired');
              setShowForceExitModal(true);
            });
          }
          return;
        }
        
        const totalSeconds = Math.floor(totalRemainingMs / 1000);
        const totalMins = Math.floor(totalSeconds / 60);
        const totalSecs = totalSeconds % 60;
        setTimeRemaining(`${String(totalMins).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`);
      } else {
        // Partial test: Original timer logic with Phase 4 enhancement
        const remainingMs = examEndTime - now;
        
        if (remainingMs <= 0) {
          clearInterval(timer);
          setTimeRemaining('00:00');
          
          // Phase 4: Enhanced auto-submit with force exit
          if (!hasAutoSubmittedRef.current && !isSubmittingRef.current) {
            console.log('⏰ Phase 4: Time expired - triggering auto-submit and force exit');
            hasAutoSubmittedRef.current = true;
            isSubmittingRef.current = true;
            
            // Submit the exam
            handleSubmit(true).then(() => {
              // Show force exit modal
              setForceExitReason('time_expired');
              setShowForceExitModal(true);
            }).catch((error) => {
              console.error('❌ Error during auto-submit:', error);
              // Still show force exit modal even if submission failed
              setForceExitReason('time_expired');
              setShowForceExitModal(true);
            });
          }
          return;
        }

        const totalSeconds = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        
        if (totalSeconds <= 120) {
          setIsTimeCritical(true);
          setIsTimeWarning(true);
        } else if (totalSeconds <= 300) {
          setIsTimeWarning(true);
          setIsTimeCritical(false);
        } else {
          setIsTimeWarning(false);
          setIsTimeCritical(false);
        }
        
        setTimeRemaining(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examEndTime, testType, trackEndTimes, currentTrackIndex, trackDataList.length, isTimeSynced, serverTimeOffset, sectionSubmissions, hasAutoSubmitted, trackOrder]);

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setTrackAnswers(prev => ({
      ...prev,
      [currentTrackIndex]: {
        ...(prev[currentTrackIndex] || {}),
        [questionNumber]: value
      }
    }));
  };

  const handleWritingAnswerChange = (taskKey: string, value: string) => {
    setTrackWritingAnswers(prev => ({
      ...prev,
      [currentTrackIndex]: {
        ...(prev[currentTrackIndex] || {}),
        [taskKey]: value
      }
    }));
  };

  const handleQuestionClick = (questionNumber: number, sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle context menu for text highlighting
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      // No text selected, don't show menu
      setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, selectedRange: null, targetElement: null });
      return;
    }

    // Don't show menu if selection is within input, textarea, select, or button
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'BUTTON' ||
      target.closest('input, textarea, select, button')
    ) {
      return;
    }

    // Store the range for later highlighting
    const range = selection.getRangeAt(0);
    
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      selectedRange: range.cloneRange(),
      targetElement: target
    });
  };

  // Highlight selected text
  const handleHighlight = () => {
    if (!contextMenu.selectedRange) return;

    try {
      const span = document.createElement('span');
      span.className = 'bg-yellow-200 exam-highlight';
      span.style.backgroundColor = '#fef08a';
      span.setAttribute('data-highlighted', 'true');
      
      contextMenu.selectedRange.surroundContents(span);
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
    } catch (err) {
      console.warn('Could not highlight text:', err);
    }
    
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, selectedRange: null, targetElement: null });
  };

  // Clear highlight from selected text or clicked highlight
  const handleClearHighlight = () => {
    const selection = window.getSelection();
    let clearedAny = false;

    if (selection && selection.toString().trim().length > 0) {
      // User has text selected - check if any highlighted spans are in selection
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const parent = container.nodeType === 3 ? container.parentElement : container as HTMLElement;
      
      if (parent) {
        // Find all highlighted spans within the selection
        const highlightedSpans = parent.querySelectorAll('span[data-highlighted="true"]');
        highlightedSpans.forEach(span => {
          // Replace span with its text content
          const textNode = document.createTextNode(span.textContent || '');
          span.parentNode?.replaceChild(textNode, span);
          clearedAny = true;
        });
        
        // Also check if parent itself is highlighted
        if (parent.hasAttribute('data-highlighted')) {
          const textNode = document.createTextNode(parent.textContent || '');
          parent.parentNode?.replaceChild(textNode, parent);
          clearedAny = true;
        }
      }
    } else if (contextMenu.targetElement) {
      // No selection, check if user right-clicked on a highlighted element
      const highlightedElement = contextMenu.targetElement.closest('span[data-highlighted="true"]');
      if (highlightedElement) {
        const textNode = document.createTextNode(highlightedElement.textContent || '');
        highlightedElement.parentNode?.replaceChild(textNode, highlightedElement);
        clearedAny = true;
      }
    }

    if (clearedAny) {
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
    
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, selectedRange: null, targetElement: null });
  };

  // Check if there's a highlight that can be cleared
  const canClearHighlight = () => {
    if (!contextMenu.targetElement) return false;
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const parent = container.nodeType === 3 ? container.parentElement : container as HTMLElement;
      
      if (parent) {
        const hasHighlight = parent.querySelector('span[data-highlighted="true"]') || parent.hasAttribute('data-highlighted');
        return !!hasHighlight;
      }
    }
    
    // Check if clicked element is highlighted
    const highlightedElement = contextMenu.targetElement.closest('span[data-highlighted="true"]');
    return !!highlightedElement;
  };

  const calculateTimeSpent = () => {
    const elapsed = getServerTime() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor(elapsed % 60000 / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Phase 2: Handle section submission for mock tests
  const handleSectionSubmit = async (sectionType: 'listening' | 'reading' | 'writing') => {
    setHasAutoSubmitted(false); // Reset for next section
    
    const currentTrackData = trackDataList[currentTrackIndex];
    
    console.log(`=== SUBMITTING ${sectionType.toUpperCase()} SECTION ===`);
    
    // Get the current track's answers
    const currentTrackAnswers = trackAnswers[currentTrackIndex] || {};
    const currentTrackWritingAnswers = trackWritingAnswers[currentTrackIndex] || {};
    
    // Prepare section submission data
    const sectionSubmission: SectionSubmission = {
      trackId: currentTrackData.track.id,
      trackName: currentTrackData.track.name,
      answers: sectionType === 'writing' ? currentTrackWritingAnswers : currentTrackAnswers,
      submittedAt: new Date(getServerTime()).toISOString(), // Phase 3: Use server time
      timeSpent: calculateTimeSpent(),
      locked: true
    };
    
    console.log('Section submission data:', sectionSubmission);
    
    // Update state
    setSectionSubmissions(prev => ({
      ...prev,
      [sectionType]: sectionSubmission
    }));
    
    // Move to next section if not last
    if (currentTrackIndex < trackDataList.length - 1) {
      console.log('Moving to next track...');
      // Show instructions for the next module
      setExamStarted(false);
      setShowInstructions(true);
      setCurrentTrackIndex(prev => prev + 1);
      setCurrentSection(0);
      setIsTimeWarning(false);
      setIsTimeCritical(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All sections submitted, proceed to final submission
      console.log('All sections submitted, proceeding to final submission...');
      await handleFinalSubmit(sectionType, sectionSubmission);
    }
  };

  // Phase 2: Final submission handler for mock tests
  const handleFinalSubmit = async (lastSectionType?: 'listening' | 'reading' | 'writing', lastSectionData?: SectionSubmission) => {
    console.log('=== FINAL SUBMISSION ===');
    
    // Build complete section submissions including the last one
    const completeSectionSubmissions = {
      ...sectionSubmissions,
      ...(lastSectionType && lastSectionData ? { [lastSectionType]: lastSectionData } : {})
    };
    
    console.log('Complete section submissions:', completeSectionSubmissions);
    
    const submission: ExamSubmission = {
      id: `${studentId}-${getServerTime()}`, // Phase 3: Use server time
      studentId,
      studentName,
      trackName: trackDataList.map(td => td.track.name).join(' + '),
      trackId: 'mock',
      testType: 'mock',
      examCode: currentExamCode || '',
      sectionSubmissions: completeSectionSubmissions,
      answers: {}, // Empty for mock tests
      submittedAt: new Date(getServerTime()).toISOString(), // Phase 3: Use server time
      timeSpent: calculateTimeSpent(),
      status: 'completed',
      resultPublished: false,
      trackIds: trackDataList.map(td => td.track.id)
    };
    
    if (currentBatchId) {
      submission.batchId = currentBatchId;
    }
    
    console.log('Final submission object:', JSON.stringify(submission, null, 2));
    
    try {
      const success = await storage.addSubmission(submission);
      
      if (success) {
        console.log('✓ Mock test submitted successfully');
        alert('✅ Mock Test submitted successfully!\n\nAll three sections (Listening, Reading, Writing) have been recorded.\n\nResults will be published after marking. You can check your dashboard for updates.');
        onSubmit();
      } else {
        console.log('⚠ Submission saved locally only');
        alert('⚠️ Submission saved locally but could not sync to server. Your submission is safe and will sync when online.');
        onSubmit();
      }
    } catch (error) {
      console.error('❌ Error submitting mock test:', error);
      alert('⚠️ Submission saved locally. Your submission is safe and will sync when online.');
      onSubmit();
    }
  };

  const handleSubmit = async (isAutoSubmit: boolean = false) => {
    if (trackDataList.length === 0) {
      alert('Error: No active exam track.');
      return;
    }

    // Phase 2: For mock tests, use section-based submission
    if (testType === 'mock') {
      console.log('Mock test - redirecting to handleFinalSubmit');
      await handleFinalSubmit();
      return;
    }

    console.log('=== SUBMITTING EXAM ===');
    console.log('Test Type:', testType);
    console.log('Auto-submit:', isAutoSubmit);
    console.log('Number of tracks:', trackDataList.length);

    // Calculate total questions across all tracks
    let totalQuestions = 0;
    let trackType: 'listening' | 'reading' | 'writing' | 'mock' = 'listening';
    
    if (testType === 'mock') {
      // For mock tests, sum up questions from all tracks
      totalQuestions = trackDataList.reduce((sum, td) => sum + td.track.totalQuestions, 0);
      trackType = 'mock';
    } else {
      // For partial tests, use the single track's question count
      totalQuestions = trackDataList[0].track.totalQuestions;
      trackType = trackDataList[0].track.trackType;
    }

    console.log('Total questions/tasks:', totalQuestions);
    console.log('Track type:', trackType);
    console.log('Writing answers:', writingAnswers);
    console.log('Regular answers:', answers);

    // Prepare answers based on track type
    let allAnswers: Record<number | string, string> = {};
    
    // Get answers for the current track (track 0 for partial tests)
    const currentAnswers = trackAnswers[0] || {};
    const currentWritingAnswers = trackWritingAnswers[0] || {};
    
    if (testType === 'partial' && trackType === 'writing') {
      // For writing tracks: ONLY use task-based answers from writingAnswers
      // Do NOT include numbered answers to avoid showing 40 "Not Answered" questions
      allAnswers = {
        ...Object.fromEntries(
          Object.entries(currentWritingAnswers).map(([key, value]) => [key, value])
        )
      };
      console.log('✓ Writing track: Using only task-based answers');
    } else {
      // For reading/listening tracks or mock tests: Combine all answers
      allAnswers = {
        ...currentAnswers,
        ...Object.fromEntries(
          Object.entries(currentWritingAnswers).map(([key, value]) => [key, value])
        )
      };
      console.log('✓ Reading/Listening/Mock: Using combined answers');
    }

    console.log('Final answers object:', allAnswers);

    const score = storage.calculateScore(allAnswers, totalQuestions);
    
    // Build track names for display
    const trackNames = trackDataList.map(td => td.track.name).join(' + ');
    const trackIds = trackDataList.map(td => td.track.id);

    // Base submission object (avoid undefined values for Firebase)
    const submission: ExamSubmission = {
      id: `${studentId}-${getServerTime()}`, // Phase 3: Use server time
      studentId,
      studentName,
      trackName: trackNames,
      trackId: testType === 'mock' ? 'mock' : trackDataList[0].track.id,
      answers: allAnswers,
      submittedAt: new Date(getServerTime()).toISOString(), // Phase 3: Use server time
      timeSpent: calculateTimeSpent(),
      status: 'completed',
      score,
      resultPublished: false,
      testType,
      totalQuestions,  // Explicitly set total questions (2 for writing, 40 for others)
      trackType,  // Explicitly set track type ('writing', 'reading', 'listening', or 'mock')
      autoSubmitted: isAutoSubmit  // Phase 4: Flag auto-submitted exams
    };

    // Add optional properties only if they have values (Firebase doesn't accept undefined)
    if (currentExamCode) {
      submission.examCode = currentExamCode;
    }
    if (currentBatchId) {
      submission.batchId = currentBatchId;
    }
    if (testType === 'mock') {
      submission.trackIds = trackIds;
    }
    
    console.log('Submission object:', JSON.stringify(submission, null, 2));
    
    try {
      const success = await storage.addSubmission(submission);
      
      if (success) {
        console.log('✓ Exam submitted successfully');
        // Phase 4: Don't show alert if auto-submitted (force exit modal will handle it)
        if (!isAutoSubmit) {
          alert('✅ Exam submitted successfully!\n\nThank you for completing the exam. Your submission has been recorded.\n\nResults will be published soon. You can check your dashboard for updates.');
          onSubmit();
        }
      } else {
        console.log('⚠ Submission saved locally only');
        if (!isAutoSubmit) {
          alert('⚠️ Submission saved locally but could not sync to server. Your submission is safe and will sync when online.');
          onSubmit();
        }
      }
    } catch (error) {
      console.error('❌ Error submitting exam:', error);
      if (!isAutoSubmit) {
        alert('⚠️ Submission saved locally. Your submission is safe and will sync when online.');
        onSubmit();
      }
    }
  };

  const goToPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setCurrentSection(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextTrack = () => {
    if (currentTrackIndex < trackDataList.length - 1) {
      // For mock tests, show instructions before next module
      if (testType === 'mock') {
        setExamStarted(false);
        setShowInstructions(true);
      }
      setCurrentTrackIndex(prev => prev + 1);
      setCurrentSection(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle accepting the important notice
  const handleAcceptNotice = () => {
    setShowNotice(false);
    setNoticeAccepted(true);
    setShowInstructions(true);
  };

  // Handle starting the exam after reading instructions
  const handleStartExam = () => {
    setShowInstructions(false);
    setInstructionsRead(prev => ({ ...prev, [currentTrackIndex]: true }));
    setExamStarted(true);
  };

  // Phase 3: Handle late entry modal actions
  const handleLateEntryGoBack = () => {
    console.log('Late entry - User chose to go back');
    onSubmit(); // Navigate back to dashboard
  };

  const handleLateEntryEnter = () => {
    console.log('Late entry - User chose to enter exam with reduced time');
    setShowLateEntryModal(false);
    // Continue with normal exam flow (notice -> instructions -> exam)
  };
  
  // Phase 4: Handle force exit (time expired or admin stopped)
  const handleForceExit = async (reason: 'time_expired' | 'admin_stopped' | 'exam_ended') => {
    console.log(`🚨 Phase 4: Force exit triggered - Reason: ${reason}`);
    
    // Prevent multiple force exits
    if (hasAutoSubmittedRef.current) {
      console.log('⚠️ Already force exited, skipping');
      return;
    }
    
    hasAutoSubmittedRef.current = true;
    
    // If not already submitting and reason is time_expired or admin_stopped, submit first
    if (!isSubmittingRef.current && (reason === 'time_expired' || reason === 'admin_stopped')) {
      isSubmittingRef.current = true;
      
      try {
        console.log('📝 Auto-submitting before force exit...');
        await handleSubmit(true);
        console.log('✓ Auto-submit completed');
      } catch (error) {
        console.error('❌ Error during force exit auto-submit:', error);
      }
    }
    
    // Show force exit modal
    setForceExitReason(reason);
    setShowForceExitModal(true);
  };
  
  // Phase 4: Handle force exit modal close (redirect to dashboard)
  const handleForceExitModalClose = () => {
    console.log('🔄 Redirecting to dashboard after force exit');
    onSubmit(); // This will navigate back to dashboard
  };

  const renderQuestion = (question: any, idx: number) => {
    // Phase 2: Check if current section is locked (view-only mode)
    const isLocked = testType === 'mock' && sectionSubmissions[trackOrder[currentTrackIndex]]?.locked;
    
    // Writing Task with Image (for Task 1 with chart)
    if (question.type === 'writing-task-with-image') {
      const taskKey = `${currentTrack.id}-task${question.taskNumber}`;
      return (
        <WritingTaskWithImage
          key={idx}
          taskNumber={question.taskNumber}
          title={question.title}
          instruction={question.instruction}
          chartDescription={question.chartDescription}
          chartImageURL={question.chartImageURL}
          prompt={question.prompt}
          minWords={question.minWords}
          timeRecommended={question.timeRecommended}
          value={writingAnswers[taskKey] || ''}
          onChange={(value) => !isLocked && handleWritingAnswerChange(taskKey, value)}
          disabled={isLocked}
        />
      );
    }

    // Writing Task with Two-Column Layout (for Task 2 with boxed prompt)
    if (question.type === 'writing-task' && question.topicIntro) {
      const taskKey = `${currentTrack.id}-task${question.taskNumber}`;
      return (
        <WritingTaskTwoColumn
          key={idx}
          taskNumber={question.taskNumber}
          title={question.title}
          instruction={question.instruction}
          topicIntro={question.topicIntro}
          prompt={question.prompt}
          closingInstruction={question.closingInstruction}
          minWords={question.minWords}
          timeRecommended={question.timeRecommended}
          value={writingAnswers[taskKey] || ''}
          onChange={(value) => !isLocked && handleWritingAnswerChange(taskKey, value)}
          disabled={isLocked}
        />
      );
    }

    // Standard Writing Task (fallback)
    if (question.type === 'writing-task') {
      const taskKey = `${currentTrack.id}-task${question.taskNumber}`;
      return (
        <WritingTaskInput
          key={idx}
          taskNumber={question.taskNumber}
          title={question.title}
          instruction={question.instruction}
          prompt={question.prompt}
          minWords={question.minWords}
          maxWords={question.maxWords}
          timeRecommended={question.timeRecommended}
          value={writingAnswers[taskKey] || ''}
          onChange={(value) => !isLocked && handleWritingAnswerChange(taskKey, value)}
          disabled={isLocked}
        />
      );
    }

    // Reading-specific question types
    if (question.type === 'true-false-not-given') {
      return (
        <TrueFalseNotGiven
          key={idx}
          instruction={question.instruction}
          statements={question.statements}
          answers={answers}
          onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)}
          disabled={isLocked}
        />
      );
    }

    if (question.type === 'true-false-not-given-collapsible') {
      return (
        <TrueFalseNotGivenCollapsible
          key={idx}
          instruction={question.instruction}
          boxInstruction={question.boxInstruction}
          statements={question.statements}
          answers={answers}
          onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)}
          disabled={isLocked}
        />
      );
    }

    if (question.type === 'table-selection') {
      return (
        <TableSelectionQuestion
          key={idx}
          instruction={question.instruction}
          imageUrl={question.imageUrl}
          imageTitle={question.imageTitle}
          headers={question.headers}
          rows={question.rows}
          optionsLegend={question.optionsLegend}
          answers={answers}
          onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)}
          disabled={isLocked}
        />
      );
    }

    if (question.type === 'yes-no-not-given') {
      return (
        <YesNoNotGiven
          key={idx}
          instruction={question.instruction}
          statements={question.statements}
          answers={answers}
          onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)}
          disabled={isLocked}
        />
      );
    }

    if (question.type === 'matching-headings') {
      return (
        <MatchingHeadings
          key={idx}
          instruction={question.instruction}
          paragraphs={question.paragraphs}
          headings={question.headings}
          answers={answers}
          onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)}
          disabled={isLocked}
        />
      );
    }

    // Existing question types (Listening-compatible)
    if (question.type === 'table-gap') {
      return <TableGapQuestion key={idx} instruction={question.instruction} title={question.title} rows={question.rows} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'multi-column-table') {
      return <MultiColumnTableQuestion key={idx} instruction={question.instruction} title={question.title} headers={question.headers} rows={question.rows} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'multiple-choice') {
      return <MultipleChoiceQuestion key={idx} questionNumber={question.questionNumber} question={question.question} options={question.options} selectedAnswer={answers[question.questionNumber] || ''} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'multiple-choice-multi-select') {
      return <MultipleChoiceMultiSelectQuestion key={idx} instruction={question.instruction} question={question.question} questionNumbers={question.questionNumbers} maxSelections={question.maxSelections} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'sentence-completion') {
      return <SentenceCompletionQuestion key={idx} instruction={question.instruction} items={question.items} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'dropdown') {
      return <DropdownQuestion key={idx} instruction={question.instruction} items={question.items} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'drag-and-drop') {
      return <DragAndDropQuestion key={idx} instruction={question.instruction} imageUrl={question.imageUrl} imageTitle={question.imageTitle} items={question.items} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'flowchart') {
      return <FlowChartQuestion key={idx} instruction={question.instruction} title={question.title} steps={question.steps} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'map-labeling') {
      return <MapLabelingQuestion key={idx} instruction={question.instruction} imageUrl={question.imageUrl} labels={question.labels} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'drag-drop-table') {
      return <DragDropTableQuestion key={idx} instruction={question.instruction} title={question.title} tableData={question.tableData} items={question.items} options={question.options} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'map-text-input') {
      return <MapTextInputQuestion key={idx} instruction={question.instruction} imageUrl={question.imageUrl} labels={question.labels} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    if (question.type === 'paragraph-gap') {
      return <ParagraphGapQuestion key={idx} instruction={question.instruction} paragraph={question.paragraph} questionNumbers={question.questionNumbers} answers={answers} onAnswerChange={(qNum, value) => !isLocked && handleAnswerChange(qNum, value)} disabled={isLocked} />;
    }
    return null;
  };

  // Get track type icon and color
  const getTrackIcon = (trackType: 'listening' | 'reading' | 'writing') => {
    switch (trackType) {
      case 'listening':
        return { Icon: Headphones, color: 'blue', label: 'Listening' };
      case 'reading':
        return { Icon: BookOpen, color: 'green', label: 'Reading' };
      case 'writing':
        return { Icon: PenTool, color: 'orange', label: 'Writing' };
    }
  };

  // Loading state
  if (isLoadingTrack) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (trackError || trackDataList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Exam Not Available</h2>
          <p className="text-gray-600 mb-4">
            {trackError || 'Unable to load exam data. Please contact your administrator.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Phase 3: Show Late Entry Modal if student is joining late
  if (showLateEntryModal && lateEntryInfo) {
    return (
      <LateEntryModal
        examName={lateEntryInfo.examName}
        examCode={lateEntryInfo.examCode}
        startTime={lateEntryInfo.startTime}
        originalDuration={lateEntryInfo.originalDuration}
        remainingMinutes={lateEntryInfo.remainingMinutes}
        onGoBack={handleLateEntryGoBack}
        onEnterExam={handleLateEntryEnter}
      />
    );
  }
  
  // Phase 4: Show Force Exit Modal when time expires or admin stops exam
  if (showForceExitModal) {
    return (
      <ForceExitModal
        reason={forceExitReason}
        onClose={handleForceExitModalClose}
        autoRedirectSeconds={3}
      />
    );
  }

  // Show Important Notice first (for both mock and partial tests)
  if (showNotice) {
    return <ImportantNotice onAccept={handleAcceptNotice} />;
  }

  // Show Instructions after notice is accepted
  if (showInstructions && !examStarted) {
    const currentExamType = trackOrder[currentTrackIndex];
    return <ExamInstructions examType={currentExamType} onStart={handleStartExam} />;
  }

  const trackInfo = getTrackIcon(currentTrack.trackType);

  return (
    <div className={`bg-gray-50 ${currentTrack.trackType === 'reading' ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen pb-16'}`}>
      <ExamHeader 
        trackName={`${currentTrack.name} | ${studentName} (${studentId})`} 
        questionType={trackInfo.label} 
        timeRemaining={testType === 'mock' ? currentTrackTimeRemaining : timeRemaining}
        isTimeWarning={isTimeWarning}
        isTimeCritical={isTimeCritical}
        audioURL={currentAudioURL}
        autoPlayAudio={true}
        trackType={currentTrack.trackType}
        preloadedAudio={preloadedAudio}
      />

      {/* Phase 3: Time sync indicator */}
      {!isTimeSynced && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mx-4 mt-4 text-sm">
          <p className="text-yellow-800">⏳ Synchronizing time with server...</p>
        </div>
      )}

      {/* Background Audio Loading Indicator (non-blocking, subtle) */}
      {currentAudioURL && currentTrack?.trackType === 'listening' && audioLoadProgress < 100 && audioLoadProgress > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mx-4 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <Loader className="w-3 h-3 text-blue-600 animate-spin flex-shrink-0" />
            <span className="text-blue-700">
              Audio loading in background... {audioLoadProgress}%
            </span>
          </div>
        </div>
      )}
      
      {/* Audio Load Error (non-blocking warning) */}
      {audioLoadError && currentTrack?.trackType === 'listening' && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-2 mx-4 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-orange-600 flex-shrink-0" />
            <span className="text-orange-700">
              {audioLoadError} Audio will stream during playback.
            </span>
          </div>
        </div>
      )}

      {/* Phase 2: Auto-Submit Notification Banner for Mock Tests */}
      {testType === 'mock' && 
       currentTrackTimeRemaining === '00:00' && 
       hasAutoSubmitted && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mx-4 mt-4" data-testid="auto-submit-notification">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-blue-900">⏰ Time Expired - Section Auto-Submitted</h3>
              <p className="text-blue-800">
                The allocated time for the {trackInfo.label} section has ended. Your answers have been automatically submitted. 
                {currentTrackIndex < trackDataList.length - 1 && ' The next section will load shortly.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Section Submitted - View Only Indicator */}
      {testType === 'mock' && sectionSubmissions[trackOrder[currentTrackIndex]]?.locked && (
        <div className="fixed top-20 right-4 bg-green-100 border-2 border-green-400 rounded-lg px-4 py-2 shadow-lg z-50" data-testid="section-locked-indicator">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              ✓ Section Submitted - View Only
            </span>
          </div>
        </div>
      )}

      <main className={`${currentTrack.trackType === 'reading' ? 'flex-1 flex flex-col overflow-hidden min-h-0' : currentTrack.trackType === 'writing' ? 'w-full px-4 py-4' : 'max-w-5xl mx-auto px-6 py-8'}`}>
        {/* Mock Test Track Progress Indicator (No manual navigation) */}
        {testType === 'mock' && trackDataList.length > 1 && (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${currentTrack.trackType === 'reading' ? 'mx-4 my-2' : 'mb-6'}`}>
            <div className="flex items-center justify-center gap-3">
              {trackOrder.map((type, idx) => {
                const info = getTrackIcon(type);
                const Icon = info.Icon;
                const isActive = idx === currentTrackIndex;
                const isCompleted = idx < currentTrackIndex;
                const isUpcoming = idx > currentTrackIndex;
                
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        isActive
                          ? `border-${info.color}-500 bg-${info.color}-50 shadow-md`
                          : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        isActive ? `text-${info.color}-600` :
                        isCompleted ? 'text-green-600' :
                        'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isActive ? `text-${info.color}-900` :
                        isCompleted ? 'text-green-900' :
                        'text-gray-500'
                      }`}>
                        {info.label}
                      </span>
                      {isActive && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-white rounded-full animate-pulse">
                          Active
                        </span>
                      )}
                      {isCompleted && (
                        <span className="ml-2 text-green-600 text-lg">✓</span>
                      )}
                      {isUpcoming && (
                        <span className="ml-2 text-gray-400 text-xs">Upcoming</span>
                      )}
                    </div>
                    {idx < trackOrder.length - 1 && (
                      <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {testType === 'mock' && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-600">
                  ⏱️ Complete all sections in order: Listening → Reading → Writing
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Submit Section" button at the end of each section to proceed
                </p>
              </div>
            )}
          </div>
        )}

        {/* Track Type Indicator */}
        <div className={`bg-gradient-to-r from-${trackInfo.color}-50 to-${trackInfo.color}-100 border-l-4 border-${trackInfo.color}-500 rounded-r-lg p-4 ${currentTrack.trackType === 'reading' ? 'mx-4 my-2' : 'mb-6'}`}>
          <div className="flex items-center gap-3">
            <trackInfo.Icon className={`w-6 h-6 text-${trackInfo.color}-600`} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentTrack.name}</h2>
              <p className="text-sm text-gray-700">{currentTrack.description}</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout for Reading Tracks */}
        {currentTrack.trackType === 'reading' && examData && examData[currentSection]?.passage ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mx-4 overflow-hidden mb-16 min-h-0 max-h-full">
            {/* Left Panel: Reading Passage with Text Highlighting */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full max-h-full overflow-hidden min-h-0"
            >
              <h3 className="text-xl font-bold text-gray-900 px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
                {examData[currentSection].passage.title}
              </h3>
              <div 
                className="flex-1 overflow-y-auto px-6 pb-6 min-h-0"
              >
                <div 
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed select-text pt-4"
                  onContextMenu={handleContextMenu}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                >
                  {examData[currentSection].passage.content.split('\n\n').map((para, idx) => (
                    <p key={idx} className="mb-4 whitespace-pre-line">{para}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Questions */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full max-h-full overflow-hidden min-h-0"
            >
              <div className="flex-1 overflow-y-auto px-6 min-h-0">
                <div 
                  className="space-y-6 pt-4 pb-24"
                  onContextMenu={handleContextMenu}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
                >
                  {examData && examData[currentSection] && (
                    <>
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {examData[currentSection].title}
                      </h2>

                      {examData[currentSection].questions.map((question, idx) => renderQuestion(question, idx))}
                      
                      {/* Navigation Buttons inside scrollable area */}
                      <div className="flex justify-between items-center pt-6 pb-6 border-t border-gray-200 mt-8">
                        {testType === 'mock' ? (
                          <>
                            <button
                              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                              disabled={currentSection === 0 || sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}
                              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Previous Section
                            </button>

                            {/* No manual submit button - auto-submission only when time expires */}
                            {currentSection < (examData?.length || 0) - 1 && (
                              <button
                                onClick={() => setCurrentSection(prev => prev + 1)}
                                disabled={sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Next Section
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                              disabled={currentSection === 0}
                              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Previous Section
                            </button>

                            {/* No manual submit button for partial tests - auto-submission only */}
                            {currentSection < (examData?.length || 0) - 1 && (
                              <button
                                onClick={() => setCurrentSection(prev => prev + 1)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                              >
                                Next Section
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : currentTrack.trackType !== 'reading' ? (
          /* Standard Layout for Non-Reading Tracks (Listening & Writing) */
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6"
            onContextMenu={(e) => {
              // Only enable highlighting for listening tracks
              if (currentTrack.trackType === 'listening') {
                handleContextMenu(e);
              }
            }}
            onCopy={(e) => {
              if (currentTrack.trackType === 'listening') {
                e.preventDefault();
              }
            }}
            onCut={(e) => {
              if (currentTrack.trackType === 'listening') {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              if (currentTrack.trackType === 'listening') {
                e.preventDefault();
              }
            }}
            style={currentTrack.trackType === 'listening' ? { userSelect: 'text', WebkitUserSelect: 'text' } : {}}
          >
            {examData && examData.length > 1 && (
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {examData.map((section, idx) => (
                  <button
                    key={section.sectionNumber}
                    onClick={() => setCurrentSection(idx)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      currentSection === idx
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Section {section.sectionNumber}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-8">
              {examData && examData[currentSection] && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {examData[currentSection].title}
                  </h2>

                  {examData[currentSection].questions.map((question, idx) => renderQuestion(question, idx))}
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Navigation Buttons for Non-Reading Tracks */}
        {currentTrack.trackType !== 'reading' && (
          <div className="flex justify-between items-center">
            {testType === 'mock' ? (
              // Mock test: Section navigation - auto-submission only
              <>
                <button
                  onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                  disabled={currentSection === 0 || sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Section
                </button>

                {/* No manual submit button - auto-submission only when time expires */}
                {currentSection < (examData?.length || 0) - 1 && (
                  <button
                    onClick={() => setCurrentSection(prev => prev + 1)}
                    disabled={sectionSubmissions[trackOrder[currentTrackIndex]]?.locked}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Section
                  </button>
                )}
              </>
            ) : (
              // Partial test: No manual submit - auto-submission only
              <>
                <button
                  onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Section
                </button>

                {/* No manual submit button for partial tests - auto-submission only */}
                {currentSection < (examData?.length || 0) - 1 && (
                  <button
                    onClick={() => setCurrentSection(prev => prev + 1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next Section
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {currentTrack.trackType !== 'writing' && currentTrack.trackType !== 'reading' && (
        <QuestionNavigator
          answers={answers}
          onQuestionClick={handleQuestionClick}
          currentSection={currentSection}
          examData={examData}
        />
      )}
      
      {currentTrack.trackType === 'reading' && (
        <div className="flex-shrink-0">
          <QuestionNavigator
            answers={answers}
            onQuestionClick={handleQuestionClick}
            currentSection={currentSection}
            examData={examData}
          />
        </div>
      )}

      {/* Context Menu for Text Highlighting */}
      {contextMenu.isOpen && (
        <ContextMenu
          items={[
            {
              label: 'Highlight',
              icon: <Highlighter className="w-4 h-4" />,
              onClick: handleHighlight,
              disabled: !contextMenu.selectedRange
            },
            {
              label: 'Clear Highlight',
              icon: <Eraser className="w-4 h-4" />,
              onClick: handleClearHighlight,
              disabled: !canClearHighlight(),
              danger: true
            }
          ]}
          position={contextMenu.position}
          onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, selectedRange: null, targetElement: null })}
        />
      )}
    </div>
  );
}
