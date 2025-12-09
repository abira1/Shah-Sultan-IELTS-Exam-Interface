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
  const renderInput = (questionNumber: number) => {
    return (
      <>
        <span className="text-gray-500 font-medium">({questionNumber})</span>
        <input
          type="text"
          value={answers[questionNumber] || ''}
          onChange={e => onAnswerChange(questionNumber, e.target.value)}
          className="inline-block mx-1 px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors min-w-[120px] max-w-[200px]"
          placeholder=""
          data-testid={`table-gap-input-${questionNumber}`}
        />
      </>
    );
  };

  const renderCell = (content: string | { questionNumber: number }, isLabel: boolean, rowIndex?: number) => {
    if (rowIndex === undefined) {
      return typeof content === 'string' ? <span className={isLabel ? 'font-medium' : ''}>{content}</span> : null;
    }

    const row = rows[rowIndex];
    const labelIsObject = typeof row.label === 'object' && 'questionNumber' in row.label;
    const valueIsObject = typeof row.value === 'object' && 'questionNumber' in row.value;
    
    // RENDERING LABEL CELL
    if (isLabel) {
      // Label is object with questionNumber - render input here
      if (typeof content === 'object' && 'questionNumber' in content) {
        return <div className="inline-flex items-center gap-2">{renderInput(content.questionNumber)}</div>;
      }
      
      // Label is string, but value has questionNumber - render input in label
      if (typeof content === 'string' && valueIsObject && typeof row.value === 'object' && 'questionNumber' in row.value) {
        const qNum = row.value.questionNumber;
        
        if (content.includes('_______')) {
          const parts = content.split('_______');
          return (
            <span className="font-medium">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < parts.length - 1 && renderInput(qNum)}
                </React.Fragment>
              ))}
            </span>
          );
        } else {
          return <span className="font-medium">{content} {renderInput(qNum)}</span>;
        }
      }
      
      // Just a regular string label
      return <span className="font-medium">{typeof content === 'string' ? content : ''}</span>;
    }
    
    // RENDERING VALUE CELL
    if (!isLabel) {
      // Value is object with questionNumber
      if (typeof content === 'object' && 'questionNumber' in content) {
        // If label is also an object, render input here
        if (labelIsObject) {
          return <div className="inline-flex items-center gap-2">{renderInput(content.questionNumber)}</div>;
        }
        // If label is string, input already rendered in label cell - don't duplicate
        return null;
      }
      
      // Just a regular string value
      return <span>{typeof content === 'string' ? content : ''}</span>;
    }
    
    return null;
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
                  {renderCell(row.label, true, idx)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 w-1/2">
                  {renderCell(row.value, false, idx)}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}