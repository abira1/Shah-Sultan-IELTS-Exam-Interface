import React from 'react';

interface TableSelectionQuestionProps {
  instruction: string;
  headers: string[];
  rows: Array<{
    questionNumber: number;
    label: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function TableSelectionQuestion({
  instruction,
  headers,
  rows,
  answers,
  onAnswerChange
}: TableSelectionQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
        <p className="text-sm text-gray-700 font-medium">{instruction}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                {/* Empty header for row labels */}
              </th>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 min-w-[60px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.questionNumber} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-gray-900">
                  ({row.questionNumber}). {row.label}
                </td>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="border border-gray-300 px-4 py-3 text-center"
                  >
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        checked={answers[row.questionNumber] === header}
                        onChange={() => {
                          // Toggle: if already selected, deselect; otherwise select
                          onAnswerChange(
                            row.questionNumber,
                            answers[row.questionNumber] === header ? '' : header
                          );
                        }}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        data-testid={`table-select-${row.questionNumber}-${header}`}
                      />
                    </div>
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
