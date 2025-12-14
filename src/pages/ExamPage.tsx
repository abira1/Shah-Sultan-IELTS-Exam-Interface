import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
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
import { TrueFalseNotGiven } from '../components/questions/TrueFalseNotGiven';
import { TrueFalseNotGivenCollapsible } from '../components/questions/TrueFalseNotGivenCollapsible';
import { TableSelectionQuestion } from '../components/questions/TableSelectionQuestion';
import { YesNoNotGiven } from '../components/questions/YesNoNotGiven';
import { MatchingHeadings } from '../components/questions/MatchingHeadings';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { audioService } from '../services/audioService';
import { getTrackById, Track } from '../data/tracks';
import { Section } from '../data/examData';
import { storage, ExamSubmission } from '../utils/storage';
import { Loader, Headphones, BookOpen, PenTool, ChevronRight, ChevronLeft } from 'lucide-react';

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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [startTime] = useState(Date.now());
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [isTimeCritical, setIsTimeCritical] = useState(false);
  
  // Mock test: Individual track timers
  const [trackEndTimes, setTrackEndTimes] = useState<number[]>([]);
  const [currentTrackTimeRemaining, setCurrentTrackTimeRemaining] = useState('--:--');
  
  // Multi-track support
  const [testType, setTestType] = useState<'partial' | 'mock'>('partial');
  const [trackDataList, setTrackDataList] = useState<TrackData[]>([]);
  const [trackOrder, setTrackOrder] = useState<Array<'listening' | 'reading' | 'writing'>>([]);
  
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [currentExamCode, setCurrentExamCode] = useState<string | null>(examCode);
  const [currentBatchId] = useState<string | null>(studentBatchId || null);
  
  // Text highlighting for reading passages
  const [highlights, setHighlights] = useState<Record<string, string[]>>({});
  
  // Get current track data
  const currentTrackData = trackDataList[currentTrackIndex];
  const currentTrack = currentTrackData?.track;
  const currentAudioURL = currentTrackData?.audioURL;
  const examData = currentTrack?.sections;

  // Fetch exam tracks, times and audio from Firebase
  useEffect(() => {
    const fetchExamData = async () => {
      const db = getDatabase(app);
      setIsLoadingTrack(true);
      setTrackError(null);
      
      try {
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
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        const globalStatus = globalStatusSnapshot.val();
        console.log('Global exam status:', JSON.stringify(globalStatus, null, 2));
        
        if (!globalStatus.isStarted) {
          console.log('❌ Exam is not started globally');
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
          const now = Date.now();
          const endTimes: number[] = [];
          let cumulativeTime = now;
          
          if (order[0] === 'listening' && examSession.trackDurations.listening) {
            cumulativeTime += examSession.trackDurations.listening * 60000;
            endTimes.push(cumulativeTime);
          }
          if (order[1] === 'reading' && examSession.trackDurations.reading) {
            cumulativeTime += examSession.trackDurations.reading * 60000;
            endTimes.push(cumulativeTime);
          }
          if (order[2] === 'writing' && examSession.trackDurations.writing) {
            cumulativeTime += examSession.trackDurations.writing * 60000;
            endTimes.push(cumulativeTime);
          }
          
          setTrackEndTimes(endTimes);
          setExamEndTime(endTimes[endTimes.length - 1]); // Total exam end time
          console.log('✓ Track end times set for mock test:', endTimes.map(t => new Date(t).toLocaleString()));
        } else if (globalStatus.endTime) {
          // Partial test: Use global end time
          const endTime = new Date(globalStatus.endTime).getTime();
          console.log('✓ Exam end time:', new Date(endTime).toLocaleString());
          setExamEndTime(endTime);
        }
        
        console.log('=== EXAM DATA LOADED SUCCESSFULLY ===');
      } catch (error) {
        console.error('❌ Error fetching exam data:', error);
        setTrackError(`Error loading exam: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh the page.`);
      } finally {
        setIsLoadingTrack(false);
      }
    };
    
    fetchExamData();
  }, [examCode, studentId, studentBatchId]);

  // Timer
  useEffect(() => {
    if (!examEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      
      // For mock tests with individual track timers
      if (testType === 'mock' && trackEndTimes.length > 0) {
        const currentTrackEndTime = trackEndTimes[currentTrackIndex];
        const trackRemainingMs = currentTrackEndTime - now;
        
        // Check if current track time expired
        if (trackRemainingMs <= 0) {
          // Auto-advance to next track
          if (currentTrackIndex < trackDataList.length - 1) {
            console.log('⏰ Track time expired, auto-advancing to next track');
            setCurrentTrackIndex(prev => prev + 1);
            setCurrentSection(0);
            setIsTimeWarning(false);
            setIsTimeCritical(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Last track completed, auto-submit
            console.log('⏰ All tracks completed, auto-submitting');
            clearInterval(timer);
            handleSubmit();
          }
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
        const totalSeconds = Math.floor(totalRemainingMs / 1000);
        const totalMins = Math.floor(totalSeconds / 60);
        const totalSecs = totalSeconds % 60;
        setTimeRemaining(`${String(totalMins).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`);
      } else {
        // Partial test: Original timer logic
        const remainingMs = examEndTime - now;
        
        if (remainingMs <= 0) {
          clearInterval(timer);
          setTimeRemaining('00:00');
          handleSubmit();
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
  }, [examEndTime, testType, trackEndTimes, currentTrackIndex, trackDataList.length]);

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  const handleWritingAnswerChange = (taskKey: string, value: string) => {
    setWritingAnswers(prev => ({
      ...prev,
      [taskKey]: value
    }));
  };

  const handleQuestionClick = (questionNumber: number, sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const calculateTimeSpent = () => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor(elapsed % 60000 / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSubmit = async () => {
    if (trackDataList.length === 0) {
      alert('Error: No active exam track.');
      return;
    }

    console.log('=== SUBMITTING EXAM ===');
    console.log('Test Type:', testType);
    console.log('Number of tracks:', trackDataList.length);

    const score = storage.calculateScore(answers);
    
    // Build track names for display
    const trackNames = trackDataList.map(td => td.track.name).join(' + ');
    const trackIds = trackDataList.map(td => td.track.id);

    const submission: ExamSubmission = {
      id: `${studentId}-${Date.now()}`,
      studentId,
      studentName,
      trackName: trackNames,
      trackId: testType === 'mock' ? 'mock' : trackDataList[0].track.id,
      examCode: currentExamCode || undefined,
      batchId: currentBatchId || undefined,
      answers: {
        ...answers,
        ...Object.fromEntries(
          Object.entries(writingAnswers).map(([key, value]) => [key, value])
        )
      },
      submittedAt: new Date().toISOString(),
      timeSpent: calculateTimeSpent(),
      status: 'completed',
      score,
      resultPublished: false,
      // Additional metadata for mock tests
      testType,
      trackIds: testType === 'mock' ? trackIds : undefined
    };
    
    console.log('Submission object:', JSON.stringify(submission, null, 2));
    
    try {
      const success = await storage.addSubmission(submission);
      
      if (success) {
        console.log('✓ Exam submitted successfully');
        alert('✅ Exam submitted successfully!\n\nThank you for completing the exam. Your submission has been recorded.\n\nResults will be published soon. You can check your dashboard for updates.');
        onSubmit();
      } else {
        console.log('⚠ Submission saved locally only');
        alert('⚠️ Submission saved locally but could not sync to server. Your submission is safe and will sync when online.');
        onSubmit();
      }
    } catch (error) {
      console.error('❌ Error submitting exam:', error);
      alert('⚠️ Submission saved locally. Your submission is safe and will sync when online.');
      onSubmit();
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
      setCurrentTrackIndex(prev => prev + 1);
      setCurrentSection(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderQuestion = (question: any, idx: number) => {
    // Writing Task
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
          onChange={(value) => handleWritingAnswerChange(taskKey, value)}
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
          onAnswerChange={handleAnswerChange}
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
          onAnswerChange={handleAnswerChange}
        />
      );
    }

    if (question.type === 'table-selection') {
      return (
        <TableSelectionQuestion
          key={idx}
          instruction={question.instruction}
          headers={question.headers}
          rows={question.rows}
          optionsLegend={question.optionsLegend}
          answers={answers}
          onAnswerChange={handleAnswerChange}
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
          onAnswerChange={handleAnswerChange}
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
          onAnswerChange={handleAnswerChange}
        />
      );
    }

    // Existing question types (Listening-compatible)
    if (question.type === 'table-gap') {
      return <TableGapQuestion key={idx} instruction={question.instruction} title={question.title} rows={question.rows} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'multi-column-table') {
      return <MultiColumnTableQuestion key={idx} instruction={question.instruction} title={question.title} headers={question.headers} rows={question.rows} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'multiple-choice') {
      return <MultipleChoiceQuestion key={idx} questionNumber={question.questionNumber} question={question.question} options={question.options} selectedAnswer={answers[question.questionNumber] || ''} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'multiple-choice-multi-select') {
      return <MultipleChoiceMultiSelectQuestion key={idx} instruction={question.instruction} question={question.question} questionNumbers={question.questionNumbers} maxSelections={question.maxSelections} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'sentence-completion') {
      return <SentenceCompletionQuestion key={idx} instruction={question.instruction} items={question.items} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'dropdown') {
      return <DropdownQuestion key={idx} instruction={question.instruction} items={question.items} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'drag-and-drop') {
      return <DragAndDropQuestion key={idx} instruction={question.instruction} items={question.items} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'flowchart') {
      return <FlowChartQuestion key={idx} instruction={question.instruction} title={question.title} steps={question.steps} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'map-labeling') {
      return <MapLabelingQuestion key={idx} instruction={question.instruction} imageUrl={question.imageUrl} labels={question.labels} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'drag-drop-table') {
      return <DragDropTableQuestion key={idx} instruction={question.instruction} title={question.title} tableData={question.tableData} items={question.items} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'map-text-input') {
      return <MapTextInputQuestion key={idx} instruction={question.instruction} imageUrl={question.imageUrl} labels={question.labels} answers={answers} onAnswerChange={handleAnswerChange} />;
    }
    if (question.type === 'paragraph-gap') {
      return <ParagraphGapQuestion key={idx} instruction={question.instruction} paragraph={question.paragraph} questionNumbers={question.questionNumbers} answers={answers} onAnswerChange={handleAnswerChange} />;
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
      />

      <main className={`${currentTrack.trackType === 'reading' ? 'flex-1 flex flex-col overflow-hidden' : 'max-w-5xl mx-auto px-6 py-8'}`}>
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
                  ⏱️ Section will automatically advance when timer ends
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
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mx-4 overflow-hidden mb-16 min-h-0">
            {/* Left Panel: Reading Passage with Text Highlighting */}
            <div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden min-h-0"
            >
              <h3 className="text-xl font-bold text-gray-900 px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
                {examData[currentSection].passage.title}
              </h3>
              <div 
                className="flex-1 overflow-y-auto px-6 pb-6"
              >
                <div 
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed select-text pt-4"
                  onMouseUp={(e) => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim().length > 0) {
                      e.preventDefault();
                      const range = selection.getRangeAt(0);
                      const span = document.createElement('span');
                      span.className = 'bg-yellow-200';
                      span.style.backgroundColor = '#fef08a';
                      try {
                        range.surroundContents(span);
                        selection.removeAllRanges();
                      } catch (err) {
                        // If surroundContents fails, do nothing
                      }
                    }
                  }}
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-6 pt-4 pb-24">
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
                              disabled={currentSection === 0}
                              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Previous Section
                            </button>

                            {currentSection === (examData?.length || 0) - 1 ? (
                              <div className="text-center flex-1 mx-4">
                                <p className="text-sm text-gray-600">
                                  ⏱️ Next track will start automatically when timer ends
                                </p>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCurrentSection(prev => prev + 1)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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

                            {currentSection === (examData?.length || 0) - 1 ? (
                              <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                              >
                                Submit Exam
                              </button>
                            ) : (
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
          /* Standard Layout for Non-Reading Tracks */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
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
              // Mock test: Only section navigation within current track
              <>
                <button
                  onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Section
                </button>

                {currentSection === (examData?.length || 0) - 1 ? (
                  <div className="text-center flex-1 mx-4">
                    <p className="text-sm text-gray-600">
                      ⏱️ Next track will start automatically when timer ends
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setCurrentSection(prev => prev + 1)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next Section
                  </button>
                )}
              </>
            ) : (
              // Partial test: Keep original navigation with manual submit
              <>
                <button
                  onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                  disabled={currentSection === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous Section
                </button>

                {currentSection === (examData?.length || 0) - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Exam
                  </button>
                ) : (
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
    </div>
  );
}
