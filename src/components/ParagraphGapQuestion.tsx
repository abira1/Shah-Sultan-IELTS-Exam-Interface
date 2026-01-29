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
    // Process the entire paragraph to find and replace gaps with input fields
    // Pattern: (number)......... where the dots/ellipsis should become input fields
    // Handles both regular dots (.) and Unicode ellipsis (…)
    const regex = /\((\d+)\)([.…]{3,})/g;
    
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    
    // Find all matches of (number)...
    while ((match = regex.exec(paragraph)) !== null) {
      const questionNum = parseInt(match[1]);
      const beforeMatch = paragraph.substring(lastIndex, match.index);
      
      // Add the text before the match
      if (beforeMatch) {
        parts.push(beforeMatch);
      }
      
      // Add the question number in parentheses
      parts.push(`(${questionNum})`);
      
      // Add input field if this question number is in our list
      if (questionNumbers.includes(questionNum)) {
        parts.push(
          <span key={`input-${questionNum}`} className="inline-flex items-baseline mx-1">
            <input
              type="text"
              value={answers[questionNum] || ''}
              onChange={(e) => onAnswerChange(questionNum, e.target.value)}
              className="mx-1 px-2 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
              style={{ minWidth: '150px', maxWidth: '250px' }}
              placeholder="Type your answer"
              disabled={disabled}
              data-testid={`paragraph-gap-${questionNum}`}
            />
          </span>
        );
      } else {
        // If not in our question numbers, just show the dots
        parts.push(match[2]);
      }
      
      lastIndex = regex.lastIndex;
    }
    
    // Add any remaining text after the last match
    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }
    
    // Split the result into lines for proper rendering
    const resultElements: JSX.Element[] = [];
    let currentLine: (string | JSX.Element)[] = [];
    
    parts.forEach((part, idx) => {
      if (typeof part === 'string') {
        const lines = part.split('\n');
        lines.forEach((line, lineIdx) => {
          if (lineIdx > 0) {
            // Push the current line and start a new one
            resultElements.push(
              <div key={`line-${resultElements.length}`} className="mb-2">
                {currentLine}
              </div>
            );
            currentLine = [];
          }
          if (line || lineIdx === 0) {
            currentLine.push(<span key={`text-${idx}-${lineIdx}`}>{line}</span>);
          }
        });
      } else {
        currentLine.push(part);
      }
    });
    
    // Push the last line
    if (currentLine.length > 0) {
      resultElements.push(
        <div key={`line-${resultElements.length}`} className="mb-2">
          {currentLine}
        </div>
      );
    }
    
    return resultElements;
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
