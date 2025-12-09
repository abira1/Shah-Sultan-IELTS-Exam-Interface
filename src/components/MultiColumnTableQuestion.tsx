import React from 'react';

interface TableCell {
  content: string | { questionNumber: number };
  colspan?: number;
}

interface TableRow {
  cells: TableCell[];
}

interface MultiColumnTableQuestionProps {
  instruction: string;
  title: string;
  headers: string[];
  rows: TableRow[];
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function MultiColumnTableQuestion({
  instruction,
  title,
  headers,
  rows,
  answers,
  onAnswerChange
}: MultiColumnTableQuestionProps) {
  
  const renderCellContent = (cell: TableCell) => {
    const { content } = cell;
    
    if (typeof content === 'object' && 'questionNumber' in content) {
      const questionNumber = content.questionNumber;
      return (
        <div className="inline-flex items-center gap-1">
          <span className="text-gray-500 font-medium">({questionNumber})</span>
          <input
            type="text"
            value={answers[questionNumber] || ''}
            onChange={e => onAnswerChange(questionNumber, e.target.value)}
            className="inline-block px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[100px]"
            placeholder="............"
            data-testid={`multi-table-input-${questionNumber}`}
          />
        </div>
      );
    }
    
    // Handle text with embedded question number pattern like "text (31)........ more text"
    if (typeof content === 'string') {
      // Check if content contains question number patterns
      const pattern = /\((\d+)\)[\s.]*\.+/g;
      const parts: (string | number)[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        // Add question number
        parts.push(parseInt(match[1]));
        lastIndex = pattern.lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }
      
      // If we found patterns, render with inputs
      if (parts.length > 1) {
        return (
          <div className="inline-flex items-center gap-1 flex-wrap">
            {parts.map((part, index) => {
              if (typeof part === 'number') {
                return (
                  <React.Fragment key={index}>
                    <span className="text-gray-500 font-medium">({part})</span>
                    <input
                      type="text"
                      value={answers[part] || ''}
                      onChange={e => onAnswerChange(part, e.target.value)}
                      className="inline-block px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[80px]"
                      placeholder="............"
                      data-testid={`multi-table-input-${part}`}
                    />
                  </React.Fragment>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        );
      }
      
      // No patterns found, return as-is
      return <span>{content}</span>;
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <h3 className="text-xl font-bold text-gray-900 text-center bg-gray-100 py-3 px-4 rounded-lg border-2 border-gray-300">
        {title}
      </h3>

      <div className="border border-gray-300 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-4 py-3 text-left font-bold text-gray-900 border-r border-gray-300 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className={`border-b border-gray-300 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {row.cells.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx}
                    colSpan={cell.colspan || 1}
                    className="px-4 py-3 border-r border-gray-300 last:border-r-0 align-top"
                  >
                    {renderCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
