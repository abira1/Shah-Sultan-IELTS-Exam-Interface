import React, { useState, useEffect } from 'react';
import { PenTool, FileText, AlertCircle } from 'lucide-react';

interface WritingTaskInputProps {
  taskNumber: 1 | 2;
  title: string;
  instruction: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  timeRecommended: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function WritingTaskInput({
  taskNumber,
  title,
  instruction,
  prompt,
  minWords,
  maxWords,
  timeRecommended,
  value,
  onChange,
  disabled = false
}: WritingTaskInputProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Count words (split by whitespace and filter empty strings)
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(value.length);
  }, [value]);

  const getWordCountStatus = () => {
    if (wordCount === 0) return 'neutral';
    if (wordCount < minWords) return 'warning';
    if (maxWords && wordCount > maxWords) return 'warning';
    return 'success';
  };

  const status = getWordCountStatus();

  return (
    <div className="space-y-6" data-testid={`writing-task-${taskNumber}`}>
      {/* Task Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-700 mb-1">{instruction}</p>
            <p className="text-xs text-gray-600">Recommended time: {timeRecommended} minutes</p>
          </div>
        </div>
      </div>

      {/* Task Prompt */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Task Prompt</h4>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 text-xl font-semibold whitespace-pre-wrap leading-relaxed">{prompt}</p>
        </div>
      </div>

      {/* Word Count Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Word Count Requirements:</p>
            <p>
              Write <span className="font-bold">at least {minWords} words</span>
              {maxWords && (
                <span> (recommended maximum: {maxWords} words)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Text Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Your Answer:
          </label>
          
          {/* Real-time Word Counter */}
          <div className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-medium ${
            status === 'success' ? 'bg-green-100 text-green-800' :
            status === 'warning' ? 'bg-amber-100 text-amber-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wide">Words:</span>
              <span className="text-lg font-bold" data-testid={`word-count-task-${taskNumber}`}>
                {wordCount}
              </span>
              <span className="text-xs">/ {minWords}</span>
            </div>
            <div className="h-4 w-px bg-current opacity-30"></div>
            <div className="text-xs">
              {charCount} characters
            </div>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-96 p-4 border-2 rounded-lg resize-y font-mono text-sm leading-relaxed ${
            disabled 
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
              : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
          placeholder="Type your answer here..."
          data-testid={`writing-textarea-task-${taskNumber}`}
        />

        {/* Status Message */}
        {wordCount > 0 && (
          <div className="text-sm">
            {wordCount < minWords && (
              <p className="text-amber-600">
                ⚠️ You need {minWords - wordCount} more word{minWords - wordCount !== 1 ? 's' : ''} to meet the minimum requirement.
              </p>
            )}
            {wordCount >= minWords && (!maxWords || wordCount <= maxWords) && (
              <p className="text-green-600">
                ✓ Word count requirement met!
              </p>
            )}
            {maxWords && wordCount > maxWords && (
              <p className="text-amber-600">
                ⚠️ You have exceeded the recommended maximum by {wordCount - maxWords} word{wordCount - maxWords !== 1 ? 's' : ''}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
