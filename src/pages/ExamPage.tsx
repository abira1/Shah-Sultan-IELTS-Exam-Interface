import { useEffect, useState } from 'react';
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
import { QuestionNavigator } from '../components/QuestionNavigator';
import { audioService } from '../services/audioService';
import { getTrackById, Track } from '../data/tracks';
import { Section } from '../data/examData';
import { storage, ExamSubmission } from '../utils/storage';
import { Loader } from 'lucide-react';

interface ExamPageProps {
  studentId: string;
  studentName: string;
  studentBatchId?: string;
  examCode: string;
  onSubmit: () => void;
}
export function ExamPage({
  studentId,
  studentName,
  studentBatchId,
  examCode,
  onSubmit
}: ExamPageProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [startTime] = useState(Date.now());
  const [examEndTime, setExamEndTime] = useState<number | null>(null);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [examData, setExamData] = useState<Section[] | null>(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [currentExamCode, setCurrentExamCode] = useState<string | null>(examCode);
  const [currentBatchId] = useState<string | null>(studentBatchId || null);
  
  // Fetch exam track, times and audio from Firebase
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
        
        // Step 4: Fetch global exam status to verify it matches
        const globalStatusSnapshot = await get(ref(db, 'exam/status'));
        
        if (!globalStatusSnapshot.exists()) {
          console.log('❌ No global exam status found in Firebase');
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        const globalStatus = globalStatusSnapshot.val();
        console.log('Global exam status:', JSON.stringify(globalStatus, null, 2));
        
        // Check if exam is started globally
        if (!globalStatus.isStarted) {
          console.log('❌ Exam is not started globally (isStarted = false)');
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
          setIsLoadingTrack(false);
          return;
        }
        
        // Check if the global exam code matches the requested exam code
        if (globalStatus.examCode && globalStatus.examCode !== examCode) {
          console.log('❌ Global exam code mismatch. Global:', globalStatus.examCode, 'Requested:', examCode);
          setTrackError('This exam is not currently active. A different exam is running.');
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Global exam status validated');
        
        // Step 5: Check if student has already submitted for this exam
        console.log('Checking if student already submitted...');
        const existingSubmissions = await storage.getSubmissions();
        console.log('Total existing submissions:', existingSubmissions.length);
        
        const hasSubmitted = existingSubmissions.some(
          sub => sub.studentId === studentId && sub.examCode === examCode
        );
        
        console.log('Student has already submitted:', hasSubmitted);
        
        if (hasSubmitted) {
          console.log('❌ Student already submitted this exam');
          setTrackError('You have already submitted this exam. You cannot take the same exam twice.');
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Student has not submitted yet');
        
        // Step 6: Set exam code
        setCurrentExamCode(examCode);
        
        // Step 7: Get active track ID from exam session
        const activeTrackId = examSession.trackId;
        console.log('Active Track ID:', activeTrackId);
        
        if (!activeTrackId) {
          console.log('❌ No active track ID in exam session');
          setTrackError('No active exam track. Please contact administrator.');
          setIsLoadingTrack(false);
          return;
        }

        // Load track data from hardcoded tracks
        console.log('Loading track data for:', activeTrackId);
        const track = getTrackById(activeTrackId);
        
        if (!track) {
          console.log('❌ Invalid track ID');
          setTrackError(`Invalid exam track ID: ${activeTrackId}. Please contact administrator.`);
          setIsLoadingTrack(false);
          return;
        }
        
        console.log('✓ Track loaded:', track.name);
        console.log('✓ Track has', track.sections.length, 'sections');

        setCurrentTrack(track);
        setExamData(track.sections);

        // Load audio URL from Firebase (per-track audio URL)
        console.log('Loading audio URL...');
        const audioSnapshot = await get(ref(db, `tracks/${activeTrackId}/audioURL`));
        if (audioSnapshot.exists()) {
          const audioURL = audioSnapshot.val();
          console.log('✓ Track audio URL found:', audioURL);
          setAudioURL(audioURL);
        } else {
          console.log('No track-specific audio, checking global audio...');
          // Fallback: Check if admin uploaded global audio
          const audio = await audioService.getAudioURL();
          if (audio) {
            console.log('✓ Global audio URL found:', audio);
            setAudioURL(audio);
          } else {
            console.log('⚠ No audio URL found');
          }
        }

        // Set exam end time from global status
        if (globalStatus.endTime) {
          const endTime = new Date(globalStatus.endTime).getTime();
          console.log('✓ Exam end time:', new Date(endTime).toLocaleString());
          setExamEndTime(endTime);
        } else {
          console.log('⚠ No exam end time set');
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

  // Timer that calculates remaining time based on end time
  useEffect(() => {
    if (!examEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
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
      
      // Check if less than or equal to 5 minutes (300 seconds)
      if (totalSeconds <= 300) {
        setIsTimeWarning(true);
      } else {
        setIsTimeWarning(false);
      }
      
      setTimeRemaining(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [examEndTime]);
  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
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
    if (!currentTrack) {
      alert('Error: No active exam track.');
      return;
    }

    console.log('=== SUBMITTING EXAM ===');
    console.log('Student ID:', studentId);
    console.log('Student Name:', studentName);
    console.log('Track ID:', currentTrack.id);
    console.log('Track Name:', currentTrack.name);
    console.log('Exam Code:', currentExamCode);
    console.log('Batch ID:', currentBatchId);
    console.log('Answers count:', Object.keys(answers).length);

    const score = storage.calculateScore(answers);
    const submission: ExamSubmission = {
      id: `${studentId}-${Date.now()}`,
      studentId,
      studentName,
      trackName: currentTrack.name,
      trackId: currentTrack.id,
      examCode: currentExamCode || undefined,
      batchId: currentBatchId || undefined,
      answers,
      submittedAt: new Date().toISOString(),
      timeSpent: calculateTimeSpent(),
      status: 'completed',
      score,
      resultPublished: false // Set as not published initially
    };
    
    console.log('Submission object:', JSON.stringify(submission, null, 2));
    
    try {
      console.log('Calling storage.addSubmission...');
      const success = await storage.addSubmission(submission);
      console.log('Submission result:', success);
      
      if (success) {
        console.log('✓ Exam submitted successfully');
        // Show success message
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
  if (trackError || !examData || !currentTrack) {
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

  return <div className="min-h-screen bg-gray-50 pb-16">
      <ExamHeader 
        trackName={`${currentTrack.name} | ${studentName} (${studentId})`} 
        questionType="Listening" 
        timeRemaining={timeRemaining}
        isTimeWarning={isTimeWarning}
        audioURL={audioURL}
        autoPlayAudio={true}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {examData.map((section, idx) => <button key={section.sectionNumber} onClick={() => setCurrentSection(idx)} className={`px-4 py-2 font-medium transition-colors ${currentSection === idx ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                Section {section.sectionNumber}
              </button>)}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              SECTION {examData[currentSection].sectionNumber}
            </h2>
            <p className="text-gray-700 font-medium mb-6">
              {examData[currentSection].title}
            </p>

            {examData[currentSection].questions.map((question, idx) => {
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
            return null;
          })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))} disabled={currentSection === 0} className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Previous Section
          </button>

          {currentSection === examData.length - 1 ? <button onClick={handleSubmit} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Submit Exam
            </button> : <button onClick={() => setCurrentSection(prev => Math.min(examData.length - 1, prev + 1))} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Next Section
            </button>}
        </div>
      </main>

      <QuestionNavigator answers={answers} onQuestionClick={handleQuestionClick} currentSection={currentSection} />
    </div>;
}