import React from 'react';
interface MultipleChoiceQuestionProps {
  questionNumber: number;
  question: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  selectedAnswer: string;
  onAnswerChange: (questionNumber: number, value: string) => void;
}
export function MultipleChoiceQuestion({
  questionNumber,
  question,
  options,
  selectedAnswer,
  onAnswerChange
}: MultipleChoiceQuestionProps) {
  return <div className="space-y-4">
      <div className="flex gap-3">
        <span className="font-semibold text-gray-900">({questionNumber})</span>
        <p className="text-gray-900">{question}</p>
      </div>

      <div className="space-y-3 ml-8">
        {options.map(option => <label key={option.value} className="flex items-start gap-3 cursor-pointer group">
            <input type="radio" name={`question-${questionNumber}`} value={option.value} checked={selectedAnswer === option.value} onChange={e => onAnswerChange(questionNumber, e.target.value)} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500" />
            <span className="text-gray-700 group-hover:text-gray-900">
              <strong>{option.value}.</strong> {option.label}
            </span>
          </label>)}
      </div>
    </div>;
}