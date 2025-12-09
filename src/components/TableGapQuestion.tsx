import React from 'react';
interface TableRow {
  label: string | {
    questionNumber: number;
  };
  value: string | {
    questionNumber: number;
  };
}
interface TableGapQuestionProps {
  instruction: string;
  title: string;
  rows: TableRow[];
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}
export function TableGapQuestion({
  instruction,
  title,
  rows,
  answers,
  onAnswerChange
}: TableGapQuestionProps) {
  // Helper function to check if a row's label contains "_______"
  const rowLabelHasGap = (rowIndex: number): boolean => {
    const row = rows[rowIndex];
    return typeof row.label === 'string' && row.label.includes('_______');
  };

  // Helper function to find the question number in the value field for a given row
  const findQuestionNumberForRow = (rowIndex: number): number | null => {
    const row = rows[rowIndex];
    if (typeof row.value === 'object' && 'questionNumber' in row.value) {
      return row.value.questionNumber;
    }
    return null;
  };

  const renderCell = (content: string | {
    questionNumber: number;
  }, isLabel: boolean = false, rowIndex?: number, isValueCell: boolean = false) => {
    
    // Handle case where content itself is an object with questionNumber
    if (typeof content === 'object' && 'questionNumber' in content) {
      const questionNumber = content.questionNumber;
      return (
        <div className="inline-flex items-center gap-2">
          <span className="text-gray-500 font-medium">({questionNumber})</span>
          <input
            type="text"
            value={answers[questionNumber] || ''}
            onChange={e => onAnswerChange(questionNumber, e.target.value)}
            className="px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[120px] max-w-[200px]"
            placeholder=""
            data-testid={`table-gap-input-${questionNumber}`}
          />
        </div>
      );
    }
    
    // If this is a value cell and the row has a question number, don't render separate input
    if (isValueCell && rowIndex !== undefined) {
      const questionNumber = findQuestionNumberForRow(rowIndex);
      if (questionNumber !== null) {
        return null; // Hide the value column for all question rows
      }
    }

    // Handle value cells that are just strings (no question number)
    if (isValueCell && typeof content === 'string') {
      return <span>{content}</span>;
    }

    // Handle label cells
    if (isLabel && typeof content === 'string' && rowIndex !== undefined) {
      const questionNumber = findQuestionNumberForRow(rowIndex);
      
      // If this row has a question number, format it with inline input
      if (questionNumber !== null) {
        // Check if label contains "_______"
        if (content.includes('_______')) {
          // Split by "______" and insert question number + input
          const parts = content.split('_______');
          
          return (
            <span className="font-medium">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <>
                      <span className="text-gray-500 font-medium">({questionNumber})</span>
                      <input
                        type="text"
                        value={answers[questionNumber] || ''}
                        onChange={e => onAnswerChange(questionNumber, e.target.value)}
                        className="inline-block mx-1 px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[120px] max-w-[200px]"
                        placeholder=""
                        data-testid={`table-gap-inline-input-${questionNumber}`}
                      />
                    </>
                  )}
                </React.Fragment>
              ))}
            </span>
          );
        } else {
          // No "______" in label, add question number and input at the end
          return (
            <span className="font-medium">
              {content} <span className="text-gray-500 font-medium">({questionNumber})</span>
              <input
                type="text"
                value={answers[questionNumber] || ''}
                onChange={e => onAnswerChange(questionNumber, e.target.value)}
                className="inline-block mx-1 px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[120px] max-w-[200px]"
                placeholder=""
                data-testid={`table-gap-inline-input-${questionNumber}`}
              />
            </span>
          );
        }
      }
    }
    
    return <span className={isLabel ? 'font-medium' : ''}>{typeof content === 'string' ? content : ''}</span>;
  };
  return <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {rows.map((row, idx) => <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 border-b border-gray-200 w-1/2">
                  {renderCell(row.label, true, idx, false)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 w-1/2">
                  {renderCell(row.value, false, idx, true)}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}