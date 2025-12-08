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
  }, isLabel: boolean = false, rowIndex?: number) => {
    if (typeof content === 'object' && 'questionNumber' in content) {
      return <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">
            ({content.questionNumber})
          </span>
          <input type="text" value={answers[content.questionNumber] || ''} onChange={e => onAnswerChange(content.questionNumber, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Type your answer" data-testid={`table-gap-input-${content.questionNumber}`} />
        </div>;
    }

    // Check if the content is a string that contains "_______"
    if (typeof content === 'string' && content.includes('_______')) {
      const questionNumber = rowIndex !== undefined ? findQuestionNumberForRow(rowIndex) : null;
      
      if (questionNumber !== null) {
        // Split the text by "_______" and insert inline input fields
        const parts = content.split('_______');
        
        return (
          <span className={isLabel ? 'font-medium' : ''}>
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < parts.length - 1 && (
                  <input
                    type="text"
                    value={answers[questionNumber] || ''}
                    onChange={e => onAnswerChange(questionNumber, e.target.value)}
                    className="inline-block mx-1 px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[120px] max-w-[200px]"
                    placeholder=""
                    data-testid={`table-gap-inline-input-${questionNumber}`}
                    style={{ width: 'auto' }}
                  />
                )}
              </React.Fragment>
            ))}
          </span>
        );
      }
    }
    
    return <span className={isLabel ? 'font-medium' : ''}>{content}</span>;
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
                  {renderCell(row.label, true)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 w-1/2">
                  {renderCell(row.value)}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}