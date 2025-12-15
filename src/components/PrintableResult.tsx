import React from 'react';
import { ExamSubmission } from '../utils/storage';
import { allTracks } from '../data/tracks';

interface PrintableResultProps {
  submission: ExamSubmission;
  onClose: () => void;
}

export const PrintableResult: React.FC<PrintableResultProps> = ({ submission, onClose }) => {
  const track = allTracks.find(t => t.id === submission.trackId);
  const isMockTest = submission.testType === 'mock' && submission.overallBand !== undefined;
  
  // Calculate section-wise scores
  const calculateSectionStats = () => {
    let section1 = 0, section2 = 0, section3 = 0, section4 = 0;
    let correct = 0;
    const totalQs = submission.totalQuestions || 40;
    const isWriting = submission.trackType === 'writing' && totalQs === 2;

    if (submission.marks) {
      if (isWriting) {
        // For writing tracks, count task marks
        if (submission.marks['task1'] === 'correct') correct++;
        if (submission.marks['task2'] === 'correct') correct++;
      } else {
        // For reading/listening tracks with numbered questions
        for (let i = 1; i <= totalQs; i++) {
          if (submission.marks[i] === 'correct') {
            correct++;
            if (i <= 10) section1++;
            else if (i <= 20) section2++;
            else if (i <= 30) section3++;
            else section4++;
          }
        }
      }
    }

    return { section1, section2, section3, section4, correct };
  };

  const stats = calculateSectionStats();
  const totalQs = submission.totalQuestions || 40;
  const percentage = submission.manualScore || Math.round((stats.correct / totalQs) * 100);

  // Helper function for band score interpretation
  const getBandInterpretation = (band: number): string => {
    if (band >= 8.5) return "Excellent! Very good command of English with effective handling of complex language.";
    if (band >= 7.5) return "Very Good! High level of operational command with occasional errors.";
    if (band >= 6.5) return "Good! Generally effective command of the language despite some inaccuracies.";
    if (band >= 5.5) return "Competent! Partial command of the language, handles overall meaning in most situations.";
    if (band >= 4.5) return "Basic! Limited ability with potential communication breakdowns.";
    return "Keep practicing! There's room for improvement in English language skills.";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Non-printable controls */}
        <div className="print:hidden bg-gray-100 p-4 flex justify-between items-center border-b sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-800">Print Preview</h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              🖨️ Print Result
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable content */}
        <div className="p-8 bg-white" id="printable-result">
          {/* Header with Logo */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b-4 border-blue-600">
            <div className="flex items-center gap-4">
              <img 
                src="/shah-sultan-academy-logo.png" 
                alt="Shah Sultan IELTS Academy" 
                className="h-20 w-20 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shah Sultan IELTS Academy</h1>
                <p className="text-lg text-gray-600">Student Performance Report</p>
                <p className="text-sm text-gray-500 mt-1">Official Exam Results</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Report Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Student Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Student ID:</span>
                  <span className="text-sm font-semibold text-gray-900">{submission.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-semibold text-gray-900">{submission.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Batch:</span>
                  <span className="text-sm font-semibold text-gray-900">{submission.batchId || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Exam Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Exam Code:</span>
                  <span className="text-sm font-semibold text-gray-900">{submission.examCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Track:</span>
                  <span className="text-sm font-semibold text-gray-900">{track?.name || submission.trackName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score - Mock Test vs Partial Test */}
          {isMockTest ? (
            <>
              {/* Mock Test Band Score Display */}
              <div className="bg-white p-8 rounded-lg border-4 border-gray-900 mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide">IELTS Mock Test Result</h3>
                  <div className="mb-2 py-6 border-y-2 border-gray-300">
                    <p className="text-sm text-gray-600 mb-3 uppercase tracking-wider">Overall Band Score</p>
                    <div className="text-9xl font-bold mb-2 text-gray-900">
                      {submission.overallBand!.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-700 italic">
                      {getBandInterpretation(submission.overallBand!)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Band Scores */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900 uppercase tracking-wide">
                  Section Band Scores
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white border-2 border-gray-900 rounded-lg p-5 text-center">
                    <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Listening</h4>
                    <div className="text-5xl font-bold text-gray-900 py-4">
                      {submission.sectionScores?.listening?.toFixed(1) || '--'}
                    </div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Band Score</p>
                  </div>
                  
                  <div className="bg-white border-2 border-gray-900 rounded-lg p-5 text-center">
                    <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Reading</h4>
                    <div className="text-5xl font-bold text-gray-900 py-4">
                      {submission.sectionScores?.reading?.toFixed(1) || '--'}
                    </div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Band Score</p>
                  </div>
                  
                  <div className="bg-white border-2 border-gray-900 rounded-lg p-5 text-center">
                    <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Writing</h4>
                    <div className="text-5xl font-bold text-gray-900 py-4">
                      {submission.sectionScores?.writing?.toFixed(1) || '--'}
                    </div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Band Score</p>
                  </div>
                  
                  <div className="bg-white border-2 border-gray-900 rounded-lg p-5 text-center">
                    <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Speaking</h4>
                    <div className="text-5xl font-bold text-gray-900 py-4">
                      {submission.sectionScores?.speaking?.toFixed(1) || '--'}
                    </div>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Band Score</p>
                  </div>
                </div>
              </div>

              {/* Performance Indicator - Simplified */}
              <div className="bg-gray-100 p-5 rounded-lg border-2 border-gray-400 mb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                  Performance Level
                </h4>
                <div className="bg-white rounded h-6 overflow-hidden border-2 border-gray-900">
                  <div 
                    className="h-full bg-gray-900"
                    style={{ width: `${(submission.overallBand! / 9) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-700 mt-3 font-semibold">
                  <span>0.0</span>
                  <span className="text-base">Band {submission.overallBand!.toFixed(1)}</span>
                  <span>9.0</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Partial Test Score Display */}
              <div className="bg-white p-6 rounded-lg border-4 border-gray-900 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Overall Score</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div>
                      <div className="text-6xl font-bold text-gray-900 mb-2">
                        {stats.correct}<span className="text-3xl text-gray-600">/{totalQs}</span>
                      </div>
                      <p className="text-sm text-gray-700 uppercase tracking-wider">{submission.trackType === 'writing' && totalQs === 2 ? 'Tasks Correct' : 'Questions Correct'}</p>
                    </div>
                    <div className="h-20 w-px bg-gray-400"></div>
                    <div>
                      <div className="text-6xl font-bold text-gray-900 mb-2">
                        {percentage}<span className="text-3xl text-gray-600">%</span>
                      </div>
                      <p className="text-sm text-gray-700 uppercase tracking-wider">Percentage</p>
                    </div>
                  </div>
                  
                  {/* Performance Band */}
                  <div className="mt-6">
                    <div className="bg-white rounded-full h-4 overflow-hidden border-2 border-gray-900">
                      <div 
                        className="h-full bg-gray-900"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-800 mt-3 font-semibold">
                      Performance: {
                        percentage >= 90 ? 'Excellent' :
                        percentage >= 75 ? 'Very Good' :
                        percentage >= 60 ? 'Good' :
                        percentage >= 50 ? 'Satisfactory' :
                        'Needs Improvement'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Section-wise Breakdown - Only for Partial Tests */}
          {!isMockTest && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900 uppercase tracking-wide">
                Section-wise Performance
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { title: 'Section 1', range: 'Q1-10', score: stats.section1 },
                  { title: 'Section 2', range: 'Q11-20', score: stats.section2 },
                  { title: 'Section 3', range: 'Q21-30', score: stats.section3 },
                  { title: 'Section 4', range: 'Q31-40', score: stats.section4 }
                ].map((section, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-900 rounded-lg p-4 text-center">
                    <h4 className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wider">{section.title}</h4>
                    <p className="text-xs text-gray-600 mb-3">{section.range}</p>
                    <div className="text-3xl font-bold text-gray-900">
                      {section.score}<span className="text-lg text-gray-600">/10</span>
                    </div>
                    <div className="mt-2 bg-white rounded-full h-2 overflow-hidden border border-gray-900">
                      <div 
                        className="bg-gray-900 h-full"
                        style={{ width: `${(section.score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 font-semibold">{(section.score / 10 * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Submission Details</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  Time Spent: <span className="font-semibold text-gray-900">{submission.timeSpent || 'N/A'}</span>
                </p>
                <p className="text-gray-600">
                  Status: <span className="font-semibold text-green-600">
                    {submission.resultPublished ? 'Published' : 'Pending'}
                  </span>
                </p>
                {submission.publishedAt && (
                  <p className="text-gray-600">
                    Published: <span className="font-semibold text-gray-900">
                      {new Date(submission.publishedAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Grading Information</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  Graded By: <span className="font-semibold text-gray-900">{submission.markedBy || 'N/A'}</span>
                </p>
                {isMockTest ? (
                  <>
                    <p className="text-gray-600">
                      Test Type: <span className="font-semibold text-gray-900">IELTS Mock Test</span>
                    </p>
                    <p className="text-gray-600">
                      Overall Band: <span className="font-semibold text-blue-600">{submission.overallBand?.toFixed(1)}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">
                      Total Questions: <span className="font-semibold text-gray-900">40</span>
                    </p>
                    <p className="text-gray-600">
                      Correct Answers: <span className="font-semibold text-green-600">{stats.correct}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="border-t-2 border-gray-400 pt-2 mt-12">
                  <p className="text-sm font-semibold text-gray-700">Teacher Signature</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {submission.markedBy || 'Examiner'}
                  </p>
                </div>
              </div>
              <div>
                <div className="border-t-2 border-gray-400 pt-2 mt-12">
                  <p className="text-sm font-semibold text-gray-700">Date</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <div className="border-t-2 border-gray-400 pt-2 mt-12">
                  <p className="text-sm font-semibold text-gray-700">Administrator</p>
                  <p className="text-xs text-gray-500 mt-1">Shah Sultan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
            <p className="mb-1">This is an official result document from Shah Sultan IELTS Academy</p>
            <p>Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-result,
          #printable-result * {
            visibility: visible;
          }
          #printable-result {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
};
