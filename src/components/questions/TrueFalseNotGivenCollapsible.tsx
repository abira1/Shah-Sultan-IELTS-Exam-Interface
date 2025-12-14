import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TrueFalseNotGivenCollapsibleProps {
  instruction: string;
  boxInstruction?: string;
  statements: Array<{
    questionNumber: number;
    statement: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function TrueFalseNotGivenCollapsible({
  instruction,
  boxInstruction,
  statements,
  answers,
  onAnswerChange
}: TrueFalseNotGivenCollapsibleProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const options = [
    { value: 'TRUE', label: 'TRUE' },
    { value: 'FALSE', label: 'FALSE' },
    { value: 'NOT GIVEN', label: 'NOT GIVEN' }
  ];

  const toggleQuestion = (questionNumber: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionNumber)) {
      newExpanded.delete(questionNumber);
    } else {
      newExpanded.add(questionNumber);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleAnswerSelection = (questionNumber: number, value: string) => {
    onAnswerChange(questionNumber, value);
    // Keep the question expanded after selection for easy review
    // No scroll or layout changes
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
        <p className="text-sm text-gray-700 font-medium">{instruction}</p>
      </div>

      {boxInstruction && (
        <div className="bg-gray-100 border border-gray-300 p-3 rounded">
          <p className="text-xs text-gray-700 whitespace-pre-line">{boxInstruction}</p>
        </div>
      )}

      <div className="space-y-2">
        {statements.map((item) => {
          const isExpanded = expandedQuestions.has(item.questionNumber);
          const hasAnswer = answers[item.questionNumber];
          
          return (
            <div
              key={item.questionNumber}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Collapsed header - clickable to expand */}
              <button
                onClick={() => toggleQuestion(item.questionNumber)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="inline-block bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded text-sm">
                    ({item.questionNumber})
                  </span>
                  <p className="text-gray-900 text-sm">{item.statement}</p>
                </div>
                <div className="flex items-center gap-2">
                  {hasAnswer && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {hasAnswer}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Expanded options */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-3">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[item.questionNumber] === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${item.questionNumber}`}
                          value={option.value}
                          checked={answers[item.questionNumber] === option.value}
                          onChange={(e) => onAnswerChange(item.questionNumber, e.target.value)}
                          className="sr-only"
                          data-testid={`tfng-collapsible-${item.questionNumber}-${option.value}`}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
