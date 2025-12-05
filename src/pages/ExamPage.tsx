import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase';
import { ExamHeader } from '../components/ExamHeader';
import { TableGapQuestion } from '../components/TableGapQuestion';
import { MultipleChoiceQuestion } from '../components/MultipleChoiceQuestion';
import { SentenceCompletionQuestion } from '../components/SentenceCompletionQuestion';
import { DropdownQuestion } from '../components/DropdownQuestion';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { audioService } from '../services/audioService';
import { getTrackById, Track } from '../data/tracks';
import { Section } from '../data/examData';
import { storage, ExamSubmission } from '../utils/storage';
import { Loader } from 'lucide-react';

interface ExamPageProps {
  studentId: string;
  studentName: string;
  onSubmit: () => void;
}
export function ExamPage({
  studentId,
  studentName,
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
  // Fetch exam track, times and audio from Firebase
  useEffect(() => {
    const fetchExamData = async () => {
      const db = getDatabase(app);
      setIsLoadingTrack(true);
      setTrackError(null);
      
      try {
        // Fetch exam status to get active track
        const snapshot = await get(ref(db, 'exam/status'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Get active track ID
          const activeTrackId = data.activeTrackId;
          if (!activeTrackId) {
            setTrackError('No active exam track. Please wait for admin to start the exam.');
            setIsLoadingTrack(false);
            return;
          }

          // Load track data from hardcoded tracks
          const track = getTrackById(activeTrackId);

          if (!track) {
            setTrackError('Invalid exam track. Please contact administrator.');
            setIsLoadingTrack(false);
            return;
          }

          setCurrentTrack(track);
          setExamData(track.sections);

          // Load audio URL from Firebase (per-track audio URL)
          const audioSnapshot = await get(ref(db, `tracks/${activeTrackId}/audioURL`));
          if (audioSnapshot.exists()) {
            setAudioURL(audioSnapshot.val());
          } else {
            // Fallback: Check if admin uploaded global audio
            const audio = await audioService.getAudioURL();
            if (audio) {
              setAudioURL(audio);
            }
          }

          // Set exam end time
          if (data.endTime) {
            setExamEndTime(new Date(data.endTime).getTime());
          }
        } else {
          setTrackError('Exam not started yet. Please wait for admin to start the exam.');
        }
      } catch (error) {
        console.error('Error fetching exam data:', error);
        setTrackError('Error loading exam. Please refresh the page.');
      } finally {
        setIsLoadingTrack(false);
      }
    };
    
    fetchExamData();
  }, []);

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
  const handleSubmit = () => {
    if (!currentTrack) {
      alert('Error: No active exam track.');
      return;
    }

    const score = storage.calculateScore(answers);
    const submission: ExamSubmission = {
      id: `${studentId}-${Date.now()}`,
      studentId,
      studentName,
      trackName: currentTrack.name,
      answers,
      submittedAt: new Date().toISOString(),
      timeSpent: calculateTimeSpent(),
      status: 'completed',
      score
    };
    storage.addSubmission(submission);
    alert('Exam submitted successfully!');
    onSubmit();
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
            if (question.type === 'multiple-choice') {
              return <MultipleChoiceQuestion key={idx} questionNumber={question.questionNumber} question={question.question} options={question.options} selectedAnswer={answers[question.questionNumber] || ''} onAnswerChange={handleAnswerChange} />;
            }
            if (question.type === 'sentence-completion') {
              return <SentenceCompletionQuestion key={idx} instruction={question.instruction} items={question.items} answers={answers} onAnswerChange={handleAnswerChange} />;
            }
            if (question.type === 'dropdown') {
              return <DropdownQuestion key={idx} instruction={question.instruction} items={question.items} options={question.options} answers={answers} onAnswerChange={handleAnswerChange} />;
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