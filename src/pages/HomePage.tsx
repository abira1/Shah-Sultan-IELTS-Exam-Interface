import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase';
import { ExamPage } from './ExamPage';
import { WaitingInterface } from '../components/WaitingInterface';
import { storage } from '../utils/storage';

const EXAM_NAME = 'P-L-2 Application for membership';

export function HomePage() {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isCheckingExamStatus, setIsCheckingExamStatus] = useState(true);

  // Check if exam is already running when component mounts
  useEffect(() => {
    const checkIfExamRunning = async () => {
      try {
        const db = getDatabase(app);
        const snapshot = await get(ref(db, 'exam/status'));
        if (snapshot.exists() && snapshot.val().isStarted === true) {
          // Exam is already running, skip waiting
          setIsExamStarted(true);
          setIsWaiting(false);
        }
      } catch (error) {
        console.error('Error checking exam status:', error);
      } finally {
        setIsCheckingExamStatus(false);
      }
    };

    checkIfExamRunning();
  }, []);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim() && studentName.trim()) {
      storage.setCurrentStudentId(studentId.trim());
      storage.setCurrentStudentName(studentName.trim());
      
      // Check if exam is already running
      try {
        const db = getDatabase(app);
        const snapshot = await get(ref(db, 'exam/status'));
        if (snapshot.exists() && snapshot.val().isStarted === true) {
          // Exam already running, go directly to exam
          setIsExamStarted(true);
          setIsWaiting(false);
        } else {
          // Exam not started yet, show waiting interface
          setIsWaiting(true);
        }
      } catch (error) {
        console.error('Error checking exam status:', error);
        setIsWaiting(true);
      }
    }
  };

  const handleWaitingComplete = () => {
    setIsWaiting(false);
    setIsExamStarted(true);
  };

  const handleExamSubmit = () => {
    storage.clearCurrentStudent();
    setIsExamStarted(false);
    setIsWaiting(false);
    setStudentId('');
    setStudentName('');
  };

  if (isExamStarted) {
    return <ExamPage studentId={studentId} studentName={studentName} onSubmit={handleExamSubmit} />;
  }

  if (isWaiting) {
    return (
      <WaitingInterface
        studentName={studentName}
        studentId={studentId}
        examName={EXAM_NAME}
        onCountdownComplete={handleWaitingComplete}
      />
    );
  }

  if (isCheckingExamStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            IELTS Listening Exam
          </h1>
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            {EXAM_NAME}
          </h2>
          <p className="text-gray-600">
            Enter your details to begin the examination
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleStudentLogin} className="space-y-6">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="e.g., John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g., STU001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Your unique ID was provided by your instructor
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              Start Exam
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">i</span>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  Before you start:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Ensure stable internet connection</li>
                  <li>• You have 60 minutes to complete</li>
                  <li>• All answers are auto-saved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}