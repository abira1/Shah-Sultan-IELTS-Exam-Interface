import React from 'react';

interface TrueFalseNotGivenProps {
  instruction: string;
  statements: Array<{
    questionNumber: number;
    statement: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
  disabled?: boolean;
}

export function TrueFalseNotGiven({
  instruction,
  statements,
  answers,
  onAnswerChange,
  disabled = false
}: TrueFalseNotGivenProps) {
  const options = [
    { value: 'TRUE', label: 'TRUE' },
    { value: 'FALSE', label: 'FALSE' },
    { value: 'NOT GIVEN', label: 'NOT GIVEN' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
        <p className="text-sm text-gray-700 font-medium">{instruction}</p>
      </div>

      <div className="space-y-4">
        {statements.map((item) => (
          <div key={item.questionNumber} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <span className="inline-block bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded text-sm">
                Question {item.questionNumber}
              </span>
            </div>
            <p className="text-gray-900 mb-4 leading-relaxed">{item.statement}</p>
            
            <div className="flex gap-3">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                    answers[item.questionNumber] === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <input
                    type="radio"
                    name={`question-${item.questionNumber}`}
                    value={option.value}
                    checked={answers[item.questionNumber] === option.value}
                    onChange={(e) => onAnswerChange(item.questionNumber, e.target.value)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
