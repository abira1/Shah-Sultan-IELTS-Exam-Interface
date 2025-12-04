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
import { examData } from '../data/examData';
import { storage, ExamSubmission } from '../utils/storage';

const EXAM_NAME = 'P-L-2 Application for membership';

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
  // Fetch exam times and audio from Firebase
  useEffect(() => {
    const fetchExamData = async () => {
      const db = getDatabase(app);
      try {
        // Fetch exam times
        const snapshot = await get(ref(db, 'exam/status'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.endTime) {
            setExamEndTime(new Date(data.endTime).getTime());
          }
        }

        // Fetch audio URL
        const audio = await audioService.getAudioURL();
        if (audio) {
          setAudioURL(audio);
        }
      } catch (error) {
        console.error('Error fetching exam data:', error);
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
    const score = storage.calculateScore(answers);
    const submission: ExamSubmission = {
      id: `${studentId}-${Date.now()}`,
      studentId,
      studentName,
      trackName: EXAM_NAME,
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
  return <div className="min-h-screen bg-gray-50 pb-16">
      <ExamHeader 
        trackName={`${EXAM_NAME} | ${studentName} (${studentId})`} 
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