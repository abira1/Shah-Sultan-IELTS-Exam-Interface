import React, { useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { convertListeningToBand, convertReadingToBand } from '../utils/bandScoreConversion';
import { SectionSubmission } from '../utils/storage';

interface SectionSubmissionCardProps {
  section: 'listening' | 'reading' | 'writing';
  sectionData: SectionSubmission;
  onMarkQuestion: (questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => void;
  onSaveBandScore: (bandScore: number) => void;
  currentBandScore?: number;
  isReadOnly?: boolean;
}

export function SectionSubmissionCard({
  section,
  sectionData,
  onMarkQuestion,
  onSaveBandScore,
  currentBandScore,
  isReadOnly
}: SectionSubmissionCardProps) {
  const [localMarks, setLocalMarks] = useState(sectionData.marks || {});
  const [manualBandScore, setManualBandScore] = useState<string>(
    currentBandScore?.toString() || ''
  );

  // Get section icon and color
  const getSectionStyle = () => {
    switch (section) {
      case 'listening':
        return { icon: '🎧', color: 'blue', label: 'Listening' };
      case 'reading':
        return { icon: '📖', color: 'green', label: 'Reading' };
      case 'writing':
        return { icon: '✍️', color: 'orange', label: 'Writing' };
    }
  };

  const style = getSectionStyle();

  // Calculate correct answers
  const correctCount = Object.values(localMarks).filter(m => m === 'correct').length;
  const totalQuestions = section === 'writing' ? 2 : 40;

  // Auto-calculate band score for L & R
  const autoCalculatedBand = section === 'listening' 
    ? convertListeningToBand(correctCount)
    : section === 'reading'
    ? convertReadingToBand(correctCount)
    : null;

  // Display band score
  const displayBandScore = section === 'writing'
    ? parseFloat(manualBandScore) || null
    : autoCalculatedBand;

  const handleMarkChange = (questionNumber: number | string, mark: 'correct' | 'incorrect' | null) => {
    if (isReadOnly) return;
    
    const newMarks = { ...localMarks, [questionNumber]: mark };
    setLocalMarks(newMarks);
    onMarkQuestion(questionNumber, mark);
  };

  const handleSaveBand = () => {
    if (section === 'writing') {
      const band = parseFloat(manualBandScore);
      if (!isNaN(band) && band >= 0 && band <= 9) {
        onSaveBandScore(band);
      }
    } else if (autoCalculatedBand !== null) {
      onSaveBandScore(autoCalculatedBand);
    }
  };

  // Get all questions/tasks
  const questions = section === 'writing'
    ? Object.keys(sectionData.answers).filter(key => key.includes('task'))
    : Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className={`bg-${style.color}-500 text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{style.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{style.label} Section</h2>
              <p className="text-sm opacity-90">{sectionData.trackName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Band Score</div>
            <div className="text-5xl font-bold">
              {displayBandScore !== null ? displayBandScore.toFixed(1) : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Marking Stats */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-600">Total {section === 'writing' ? 'Tasks' : 'Questions'}</div>
            <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Correct</div>
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Submitted</div>
            <div className="text-sm text-gray-900">
              {new Date(sectionData.submittedAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Time Spent</div>
            <div className="text-sm text-gray-900">{sectionData.timeSpent}</div>
          </div>
        </div>
      </div>

      {/* Questions/Tasks */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {questions.map((q) => {
            const answer = sectionData.answers[q];
            const mark = localMarks[q];
            
            return (
              <div key={q} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {section === 'writing' ? `Task ${q}` : `Question ${q}`}
                    </div>
                    <div className="text-gray-900 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                      {answer || <span className="text-gray-400 italic">Not answered</span>}
                    </div>
                  </div>
                  
                  {!isReadOnly && section !== 'writing' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleMarkChange(q, mark === 'correct' ? null : 'correct')}
                        className={`p-2 rounded-lg transition-colors ${
                          mark === 'correct'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                        }`}
                        data-testid={`mark-correct-${q}`}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleMarkChange(q, mark === 'incorrect' ? null : 'incorrect')}
                        className={`p-2 rounded-lg transition-colors ${
                          mark === 'incorrect'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                        }`}
                        data-testid={`mark-incorrect-${q}`}
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Band Score Input (for Writing) or Auto-calculated Display */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        {section === 'writing' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Writing Band Score (0-9, with .5)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="9"
                step="0.5"
                value={manualBandScore}
                onChange={(e) => setManualBandScore(e.target.value)}
                disabled={isReadOnly}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg text-lg font-bold disabled:bg-gray-100"
                placeholder="0.0"
                data-testid="writing-band-input"
              />
              <button
                onClick={handleSaveBand}
                disabled={isReadOnly || !manualBandScore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="save-writing-band-button"
              >
                Save Band Score
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Assessment Criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Auto-calculated Band Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {autoCalculatedBand !== null ? autoCalculatedBand.toFixed(1) : '--'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on {correctCount} correct answers out of 40
              </div>
            </div>
            <button
              onClick={handleSaveBand}
              disabled={isReadOnly || autoCalculatedBand === null}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="save-band-button"
            >
              Save Band Score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}