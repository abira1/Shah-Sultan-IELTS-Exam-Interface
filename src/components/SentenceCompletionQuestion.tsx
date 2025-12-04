import React from 'react';
interface SentenceCompletionItem {
  questionNumber: number;
  text: string;
}
interface SentenceCompletionQuestionProps {
  instruction: string;
  items: SentenceCompletionItem[];
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}
export function SentenceCompletionQuestion({
  instruction,
  items,
  answers,
  onAnswerChange
}: SentenceCompletionQuestionProps) {
  return <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Archaeology Course
        </h3>

        {items.map(item => <div key={item.questionNumber} className="flex items-start gap-3">
            <span className="text-gray-500 font-medium whitespace-nowrap">
              ({item.questionNumber})
            </span>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <span className="text-gray-900">{item.text}</span>
              <input type="text" value={answers[item.questionNumber] || ''} onChange={e => onAnswerChange(item.questionNumber, e.target.value)} className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]" placeholder="Type your answer" />
            </div>
          </div>)}
      </div>
    </div>;
}