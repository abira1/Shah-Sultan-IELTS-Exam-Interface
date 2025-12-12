import React, { useState } from 'react';

interface MapLabelingQuestionProps {
  instruction: string;
  imageUrl: string;
  labels: Array<{
    questionNumber: number;
    position: { x: number; y: number }; // percentage positions
  }>;
  options: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function MapLabelingQuestion({
  instruction,
  imageUrl,
  labels,
  options,
  answers,
  onAnswerChange
}: MapLabelingQuestionProps) {
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
    // Only check if option is used within THIS map's question numbers
    const mapQuestionNumbers = labels.map(label => label.questionNumber);
    return mapQuestionNumbers.some(qNum => answers[qNum] === optionValue);
  };

  const getOptionLabel = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side - Map with labels (3 columns width - larger) */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Map</h3>
          <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
            <img 
              src={imageUrl} 
              alt="Map for labeling" 
              className="w-full h-auto max-h-[800px] object-contain"
              data-testid="map-image"
            />
            
            {/* Label drop zones positioned on the image */}
            {labels.map((label) => (
              <div
                key={label.questionNumber}
                style={{
                  position: 'absolute',
                  left: `${label.position.x}%`,
                  top: `${label.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onDragOver={(e) => handleDragOver(e, label.questionNumber)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, label.questionNumber)}
                className={`min-w-[100px] transition-all ${
                  hoveredQuestion === label.questionNumber
                    ? 'scale-110 z-10'
                    : ''
                }`}
                data-testid={`map-drop-zone-${label.questionNumber}`}
              >
                <div
                  className={`border-2 border-dashed rounded-lg p-2 transition-all shadow-md ${
                    hoveredQuestion === label.questionNumber
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-800 bg-white bg-opacity-95'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-900">({label.questionNumber})</span>
                  </div>
                  {answers[label.questionNumber] ? (
                    <div className="flex items-center justify-between bg-blue-200 rounded px-2 py-1 mt-1">
                      <span className="text-xs font-bold text-gray-900">
                        {answers[label.questionNumber]}
                      </span>
                      <button
                        onClick={() => handleRemove(label.questionNumber)}
                        className="text-red-600 hover:text-red-800 font-bold text-sm ml-1"
                        data-testid={`map-remove-${label.questionNumber}`}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs text-center mt-1">Drop</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Options (1 column width - smaller and responsive) */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Options</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {options.map((option) => (
              <div
                key={option.value}
                draggable={!isOptionUsed(option.value)}
                onDragStart={(e) => handleDragStart(e, option.value)}
                className={`p-3 rounded border-2 transition-all text-sm ${
                  isOptionUsed(option.value)
                    ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-300 cursor-move hover:border-blue-500 hover:bg-blue-50 hover:shadow-md'
                } ${
                  draggedOption === option.value ? 'opacity-50' : ''
                }`}
                data-testid={`map-draggable-${option.value}`}
              >
                <span className="text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}