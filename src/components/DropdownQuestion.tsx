import React from 'react';
interface DropdownItem {
  questionNumber: number;
  statement: string;
}
interface DropdownQuestionProps {
  instruction: string;
  items: DropdownItem[];
  options: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}
export function DropdownQuestion({
  instruction,
  items,
  options,
  answers,
  onAnswerChange
}: DropdownQuestionProps) {
  return <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Points made</h3>

      <div className="space-y-3">
        {items.map(item => <div key={item.questionNumber} className="flex items-center gap-3">
            <span className="text-gray-500 font-medium">
              ({item.questionNumber})
            </span>
            <span className="text-gray-900 flex-1">{item.statement}</span>
            <select value={answers[item.questionNumber] || ''} onChange={e => onAnswerChange(item.questionNumber, e.target.value)} className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]">
              <option value="">Select...</option>
              {options.map(option => <option key={option.value} value={option.value}>
                  {option.value}. {option.label}
                </option>)}
            </select>
          </div>)}
      </div>
    </div>;
}