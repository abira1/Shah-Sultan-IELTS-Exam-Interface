import React from 'react';

interface MatchingHeadingsProps {
  instruction: string;
  paragraphs: Array<{
    questionNumber: number;
    paragraphLabel: string;
    content: string;
  }>;
  headings: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
  disabled?: boolean;
}

export function MatchingHeadings({
  instruction,
  paragraphs,
  headings,
  answers,
  onAnswerChange,
  disabled = false
}: MatchingHeadingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
        <p className="text-sm text-gray-700 font-medium">{instruction}</p>
      </div>

      {/* List of Available Headings */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">List of Headings:</h4>
        <div className="space-y-2">
          {headings.map((heading) => (
            <div key={heading.value} className="bg-white rounded-lg p-3 border border-gray-200">
              <span className="text-gray-800">{heading.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Paragraphs with Dropdown Selection */}
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <div key={paragraph.questionNumber} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded text-sm mb-2">
                  Question {paragraph.questionNumber}
                </span>
                <p className="font-medium text-gray-900">{paragraph.paragraphLabel}</p>
              </div>
              
              <div className="min-w-[200px]">
                <select
                  value={answers[paragraph.questionNumber] || ''}
                  onChange={(e) => onAnswerChange(paragraph.questionNumber, e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 font-medium"
                  data-testid={`heading-select-${paragraph.questionNumber}`}
                >
                  <option value="">Select heading...</option>
                  {headings.map((heading) => (
                    <option key={heading.value} value={heading.value}>
                      {heading.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 italic">{paragraph.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
