import React, { useState } from 'react';

interface DragDropTableQuestionProps {
  instruction: string;
  title: string;
  tableData: {
    headers: string[];
    rows: Array<{
      cells: Array<string | { value: string }>;
    }>;
  };
  items: Array<{
    questionNumber: number;
    label: string;
  }>;
  options: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function DragDropTableQuestion({
  instruction,
  title,
  tableData,
  items,
  options,
  answers,
  onAnswerChange
}: DragDropTableQuestionProps) {
  const [draggedOption, setDraggedOption] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, optionValue: string) => {
    setDraggedOption(optionValue);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', optionValue);
  };

  const handleDragOver = (e: React.DragEvent, questionNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredQuestion(questionNumber);
  };

  const handleDragLeave = () => {
    setHoveredQuestion(null);
  };

  const handleDrop = (e: React.DragEvent, questionNumber: number) => {
    e.preventDefault();
    const optionValue = e.dataTransfer.getData('text/plain');
    if (optionValue) {
      onAnswerChange(questionNumber, optionValue);
    }
    setDraggedOption(null);
    setHoveredQuestion(null);
  };

  const handleRemove = (questionNumber: number) => {
    onAnswerChange(questionNumber, '');
  };

  const isOptionUsed = (optionValue: string) => {
    const questionNumbers = items.map(item => item.questionNumber);
    return questionNumbers.some(qNum => answers[qNum] === optionValue);
  };

  const getOptionLabel = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      {/* Display the reference table with draggable letters */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                {tableData.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-900 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.cells.map((cell, cellIdx) => {
                    const cellValue = typeof cell === 'string' ? cell : cell.value;
                    // Check if this cell contains a letter that could be dragged (A-J)
                    const isDraggableLetter = /^[A-J]$/.test(cellValue);
                    
                    return (
                      <td
                        key={cellIdx}
                        className="border border-gray-400 px-4 py-3 text-sm text-gray-900 text-center"
                      >
                        {isDraggableLetter ? (
                          <span
                            draggable={!isOptionUsed(cellValue)}
                            onDragStart={(e) => handleDragStart(e, cellValue)}
                            className={`inline-block px-3 py-1 rounded font-bold transition-all ${
                              isOptionUsed(cellValue)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-800 cursor-move hover:bg-blue-200 hover:shadow-md'
                            } ${
                              draggedOption === cellValue ? 'opacity-50' : ''
                            }`}
                          >
                            {cellValue}
                          </span>
                        ) : (
                          cellValue
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drag and Drop Section */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Drag the letters from the table above to complete the questions below:</h3>
        
        {/* Question Placeholders */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.questionNumber}
              className="bg-white border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  ({item.questionNumber})
                </span>
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <div
                  onDragOver={(e) => handleDragOver(e, item.questionNumber)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.questionNumber)}
                  className={`flex-shrink-0 min-w-[200px] border-2 border-dashed rounded px-4 py-2 transition-all ${
                    hoveredQuestion === item.questionNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-400 bg-gray-50'
                  }`}
                  data-testid={`drag-drop-table-zone-${item.questionNumber}`}
                >
                  {answers[item.questionNumber] ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-700">
                        {answers[item.questionNumber]}. {getOptionLabel(answers[item.questionNumber])}
                      </span>
                      <button
                        onClick={() => handleRemove(item.questionNumber)}
                        className="text-red-600 hover:text-red-800 font-bold ml-2"
                        data-testid={`drag-drop-table-remove-${item.questionNumber}`}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Drop answer here</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
