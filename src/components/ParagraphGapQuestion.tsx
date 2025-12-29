import React from 'react';

interface ParagraphGapQuestionProps {
  instruction: string;
  paragraph: string;
  questionNumbers: number[];
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
  disabled?: boolean;
}

export function ParagraphGapQuestion({
  instruction,
  paragraph,
  questionNumbers,
  answers,
  onAnswerChange,
  disabled = false
}: ParagraphGapQuestionProps) {
  // Split paragraph by question number patterns like (6).......... or (6)……………………
  const renderParagraphWithGaps = () => {
    const parts = paragraph.split(/(\(\d+\)[.…]+)/);
    
    return parts.map((part, idx) => {
      // Check if this part matches the pattern (number).... or (number)……………………
      const match = part.match(/\((\d+)\)([.…]+)/);
      
      if (match) {
        const questionNumber = parseInt(match[1]);
        const dots = match[2];
        
        return (
          <span key={idx} className="inline-flex items-baseline mx-1">
            <span className="text-gray-600 font-medium">({questionNumber})</span>
            <input
              type="text"
              value={answers[questionNumber] || ''}
              onChange={(e) => onAnswerChange(questionNumber, e.target.value)}
              className="mx-1 px-2 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
              style={{ minWidth: `${Math.max(dots.length * 8, 100)}px`, maxWidth: '200px' }}
              placeholder="Type your answer"
              disabled={disabled}
              data-testid={`paragraph-gap-${questionNumber}`}
            />
          </span>
        );
      }
      
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-gray-900 text-base leading-relaxed">
          {renderParagraphWithGaps()}
        </div>
      </div>
    </div>
  );
}
