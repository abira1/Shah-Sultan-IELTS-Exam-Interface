import React, { useState } from 'react';

interface DragAndDropItem {
  questionNumber: number;
  label: string;
}

interface DragAndDropQuestionProps {
  instruction: string;
  imageUrl?: string;
  imageTitle?: string;
  items: DragAndDropItem[];
  options: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function DragAndDropQuestion({
  instruction,
  imageUrl,
  imageTitle,
  items,
  options,
  answers,
  onAnswerChange
}: DragAndDropQuestionProps) {
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
    // Only check if option is used within THIS drag-and-drop question's items
    const dragAndDropQuestionNumbers = items.map(item => item.questionNumber);
    return dragAndDropQuestionNumbers.some(qNum => answers[qNum] === optionValue);
  };

  const getOptionLabel = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? `${option.value}. ${option.label}` : '';
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Items to match */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items to Match</h3>
          {items.map((item) => (
            <div
              key={item.questionNumber}
              className="flex items-start gap-3"
            >
              <span className="text-gray-500 font-medium whitespace-nowrap">
                ({item.questionNumber})
              </span>
              <div className="flex-1">
                <p className="text-gray-900 mb-2">{item.label}</p>
                <div
                  onDragOver={(e) => handleDragOver(e, item.questionNumber)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.questionNumber)}
                  className={`min-h-[50px] border-2 border-dashed rounded-lg p-3 transition-all ${
                    hoveredQuestion === item.questionNumber
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  data-testid={`drop-zone-${item.questionNumber}`}
                >
                  {answers[item.questionNumber] ? (
                    <div className="flex items-center justify-between bg-blue-100 border border-blue-300 rounded px-3 py-2">
                      <span className="text-sm text-gray-900">
                        {getOptionLabel(answers[item.questionNumber])}
                      </span>
                      <button
                        onClick={() => handleRemove(item.questionNumber)}
                        className="text-red-600 hover:text-red-800 font-bold text-lg"
                        data-testid={`remove-answer-${item.questionNumber}`}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center">Drag an option here</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Options */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.value}
                draggable={!isOptionUsed(option.value)}
                onDragStart={(e) => handleDragStart(e, option.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isOptionUsed(option.value)
                    ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-300 cursor-move hover:border-blue-500 hover:bg-blue-50'
                } ${
                  draggedOption === option.value ? 'opacity-50' : ''
                }`}
                data-testid={`draggable-option-${option.value}`}
              >
                <span className="text-gray-900 font-medium">
                  {option.value}.
                </span>{' '}
                <span className="text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}