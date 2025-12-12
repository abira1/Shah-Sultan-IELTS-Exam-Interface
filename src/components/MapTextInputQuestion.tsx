import React from 'react';

interface MapTextInputQuestionProps {
  instruction: string;
  imageUrl: string;
  labels: Array<{
    questionNumber: number;
    position: { x: number; y: number }; // percentage positions
    text?: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
}

export function MapTextInputQuestion({
  instruction,
  imageUrl,
  labels,
  answers,
  onAnswerChange
}: MapTextInputQuestionProps) {
  const handleInputChange = (questionNumber: number, value: string) => {
    onAnswerChange(questionNumber, value);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagram</h3>
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
          <img 
            src={imageUrl} 
            alt="Map for text input" 
            className="w-full h-auto max-h-[800px] object-contain"
            data-testid="map-text-input-image"
          />
          
          {/* Text input boxes positioned on the image */}
          {labels.map((label) => (
            <div
              key={label.questionNumber}
              style={{
                position: 'absolute',
                left: `${label.position.x}%`,
                top: `${label.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="min-w-[200px] max-w-[350px]"
              data-testid={`map-text-input-container-${label.questionNumber}`}
            >
              <div className="bg-white bg-opacity-95 border-2 border-gray-800 rounded-lg p-3 shadow-md">
                {label.text && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-900 leading-relaxed">
                      {label.text}
                    </p>
                  </div>
                )}
                {!label.text && (
                  <div className="text-center mb-1">
                    <span className="text-xs font-bold text-gray-900">({label.questionNumber})</span>
                  </div>
                )}
                <input
                  type="text"
                  value={answers[label.questionNumber] || ''}
                  onChange={(e) => handleInputChange(label.questionNumber, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type answer here"
                  data-testid={`map-text-input-${label.questionNumber}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
