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
  const renderParagraphWithGaps = () => {
    // Split the paragraph into lines
    const lines = paragraph.split('\n');
    let currentQuestionNum: number | null = null;
    
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <br key={`line-${lineIdx}`} />;
      }

      // Check if line starts with a question number like (20) or (21)
      const questionNumMatch = line.match(/^\((\d+)\)/);
      
      if (questionNumMatch) {
        // Update the current question number if we find one
        currentQuestionNum = parseInt(questionNumMatch[1]);
      }

      // Split the line by dots/ellipsis patterns
      // Match sequences of dots (.) or ellipsis (…) characters
      const parts = line.split(/([.…]{3,})/);
      
      const renderedParts = parts.map((part, partIdx) => {
        // Check if this part is a sequence of dots/ellipsis
        if (/^[.…]{3,}$/.test(part)) {
          // Only render input if we have a valid question number and it's in the questionNumbers array
          if (currentQuestionNum && questionNumbers.includes(currentQuestionNum)) {
            const questionForThisBlank = currentQuestionNum;
            return (
              <span key={`${lineIdx}-${partIdx}`} className="inline-flex items-baseline mx-1">
                <input
                  type="text"
                  value={answers[questionForThisBlank] || ''}
                  onChange={(e) => onAnswerChange(questionForThisBlank, e.target.value)}
                  className="mx-1 px-2 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                  style={{ minWidth: '150px', maxWidth: '250px' }}
                  placeholder="Type your answer"
                  disabled={disabled}
                  data-testid={`paragraph-gap-${questionForThisBlank}`}
                />
              </span>
            );
          }
          // If not a valid question, just show the dots
          return <span key={`${lineIdx}-${partIdx}`}>{part}</span>;
        }
        
        return <span key={`${lineIdx}-${partIdx}`}>{part}</span>;
      });

      return (
        <div key={`line-${lineIdx}`} className="mb-2">
          {renderedParts}
        </div>
      );
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
