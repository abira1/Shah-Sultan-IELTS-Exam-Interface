import React, { useState } from 'react';
import { Mic, AlertCircle } from 'lucide-react';
import { SPEAKING_CRITERIA } from '../utils/bandScoreConversion';

interface SpeakingMarksInputProps {
  currentScore?: number;
  onSave: (score: number) => void;
  isReadOnly?: boolean;
  isMandatory?: boolean;
}

export function SpeakingMarksInput({
  currentScore,
  onSave,
  isReadOnly,
  isMandatory
}: SpeakingMarksInputProps) {
  const [speakingScore, setSpeakingScore] = useState<string>(
    currentScore?.toString() || ''
  );
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    const score = parseFloat(speakingScore);
    
    if (isNaN(score) || score < 0 || score > 9) {
      setError('Please enter a valid band score between 0 and 9');
      return;
    }
    
    // Check if it's in 0.5 increments
    if ((score * 2) % 1 !== 0) {
      setError('Band score must be in 0.5 increments (e.g., 6.0, 6.5, 7.0)');
      return;
    }
    
    setError('');
    onSave(score);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-purple-200 shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Mic className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">Speaking Band Score</h3>
          {isMandatory && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Required before publishing results
            </p>
          )}
        </div>
      </div>

      {/* Assessment Criteria */}
      <div className="bg-purple-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment Criteria:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {SPEAKING_CRITERIA.map((criterion, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              {criterion}
            </li>
          ))}
        </ul>
      </div>

      {/* Band Score Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Band Score (0-9, with .5 increments)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            max="9"
            step="0.5"
            value={speakingScore}
            onChange={(e) => {
              setSpeakingScore(e.target.value);
              setError('');
            }}
            disabled={isReadOnly}
            className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl font-bold text-center focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
            placeholder="0.0"
            data-testid="speaking-score-input"
          />
          <button
            onClick={handleSave}
            disabled={isReadOnly || !speakingScore}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            data-testid="save-speaking-score-button"
          >
            Save Speaking Score
          </button>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {currentScore !== undefined && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <span className="font-semibold">Saved:</span> Band {currentScore.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
}