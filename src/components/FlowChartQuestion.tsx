import React, { useState } from 'react';

interface FlowChartStep {
  questionNumber?: number; // Optional, for plain text steps
  text: string;
  isPlainText?: boolean; // Flag for non-question steps
}

interface FlowChartQuestionProps {
  instruction: string;
  title?: string;
  steps: FlowChartStep[];
  options: Array<{
    label: string;
    value: string;
  }>;
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
  disabled?: boolean;
}

export function FlowChartQuestion({
  instruction,
  title,
  steps,
  options,
  answers,
  onAnswerChange,
  disabled = false
}: FlowChartQuestionProps) {
  const [draggedOption, setDraggedOption] = useState<string | null>(null);
  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);

  // Check if this is a text input flowchart (no options provided)
  const isTextInputMode = !options || options.length === 0;

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
    // Only check if option is used within THIS flowchart's question numbers
    const flowchartQuestionNumbers = steps
      .filter(step => step.questionNumber !== undefined)
      .map(step => step.questionNumber!);
    return flowchartQuestionNumbers.some(qNum => answers[qNum] === optionValue);
  };

  const getOptionLabel = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const handleTextInputChange = (questionNumber: number, value: string) => {
    onAnswerChange(questionNumber, value);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <p className="text-sm text-gray-700 italic">{instruction}</p>
      </div>

      {title && (
        <h3 className="text-xl font-bold text-gray-900 text-center bg-gray-100 border border-gray-300 py-3 rounded">
          {title}
        </h3>
      )}

      <div className={isTextInputMode ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Flow chart */}
        <div className={isTextInputMode ? "w-full" : "lg:col-span-2 space-y-3"}>
          {!isTextInputMode && <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Chart</h3>}
          
          {/* Main flowchart container with proper shape */}
          <div className="max-w-3xl mx-auto space-y-3">
            {steps.map((step, index) => {
              const isFirstStep = index === 0;
              const isLastStep = index === steps.length - 1;
              const isPlainTextStep = step.isPlainText || !step.text.includes('(');
              
              return (
                <div key={step.questionNumber || `plain-${index}`} className="flex flex-col items-center">
                  {/* Arrow down connector */}
                  {index > 0 && (
                    <div className="flex justify-center py-2">
                      <div className="text-gray-500 text-3xl font-bold">↓</div>
                    </div>
                  )}
                  
                  {/* Flow chart box - preserves actual shape */}
                  {isPlainTextStep && !step.text.includes('(') ? (
                    // Plain text box (like "Rehearse") - smaller, centered
                    <div className="border-2 border-gray-700 bg-white shadow-sm rounded-lg px-8 py-4">
                      <div className="text-gray-900 text-base font-medium text-center">
                        {step.text}
                      </div>
                    </div>
                  ) : (
                    // Question box - full width with sharp corners
                    <div className="w-full border-2 border-gray-700 bg-white shadow-sm" 
                         style={{ 
                           borderRadius: isFirstStep ? '8px' : '2px',
                           padding: '14px 20px'
                         }}>
                      {/* Text with inline placeholder for gaps */}
                      <div className="text-gray-900 text-base leading-relaxed">
                        {step.text.split(/(\(\d+\)\.+)/).map((part, idx) => {
                          // Check if this part matches pattern like (21).....
                          const match = part.match(/\((\d+)\)(\.+)/);
                          if (match) {
                            const questionNumber = parseInt(match[1]);
                            const dots = match[2];
                            
                            // Text input mode - render text input instead of drop zone
                            if (isTextInputMode) {
                              return (
                                <span key={idx} className="inline-block mx-1">
                                  <span className="inline-flex items-center">
                                    <span className="text-gray-600 text-sm font-medium">({questionNumber})</span>
                                    <input
                                      type="text"
                                      value={answers[questionNumber] || ''}
                                      onChange={(e) => handleTextInputChange(questionNumber, e.target.value)}
                                      disabled={disabled}
                                      className="ml-2 px-3 py-1 border-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                      style={{ minWidth: `${Math.max(dots.length * 8, 140)}px` }}
                                      placeholder="Type answer here"
                                      data-testid={`flowchart-input-${questionNumber}`}
                                    />
                                  </span>
                                </span>
                              );
                            }
                            
                            // Drag and drop mode - render drop zone
                            return (
                              <span key={idx} className="inline-block mx-1">
                                <span 
                                  onDragOver={(e) => handleDragOver(e, questionNumber)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, questionNumber)}
                                  className={`inline-flex items-center border-2 border-dashed rounded px-2 py-1 transition-all ${
                                    hoveredQuestion === questionNumber
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-400 bg-gray-50'
                                  }`}
                                  data-testid={`flowchart-drop-zone-${questionNumber}`}
                                  style={{ minWidth: `${Math.max(dots.length * 8, 140)}px` }}
                                >
                                  <span className="text-gray-600 text-sm font-medium">({questionNumber})</span>
                                  {answers[questionNumber] ? (
                                    <>
                                      <span className="ml-2 text-blue-700 font-semibold text-sm">
                                        {answers[questionNumber]}. {getOptionLabel(answers[questionNumber])}
                                      </span>
                                      <button
                                        onClick={() => handleRemove(questionNumber)}
                                        className="ml-2 text-red-600 hover:text-red-800 font-bold"
                                        data-testid={`flowchart-remove-${questionNumber}`}
                                      >
                                        ×
                                      </button>
                                    </>
                                  ) : (
                                    <span className="ml-2 text-gray-400 text-xs italic">drop here</span>
                                  )}
                                </span>
                              </span>
                            );
                          }
                          return <span key={idx}>{part}</span>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - Options (only show if not in text input mode) */}
        {!isTextInputMode && (
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Options</h3>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <p className="text-xs text-gray-700 leading-relaxed">
                {options.map((opt, idx) => (
                  <span key={opt.value}>
                    <span className="font-semibold">{opt.value}.</span> {opt.label}
                    {idx < options.length - 1 && ' • '}
                  </span>
                ))}
              </p>
            </div>
            <div className="space-y-2">
              {options.map((option) => (
                <div
                  key={option.value}
                  draggable={!isOptionUsed(option.value)}
                  onDragStart={(e) => handleDragStart(e, option.value)}
                  className={`p-2 rounded border-2 transition-all text-sm ${
                    isOptionUsed(option.value)
                      ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                      : 'bg-white border-gray-300 cursor-move hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm'
                  } ${
                    draggedOption === option.value ? 'opacity-50' : ''
                  }`}
                  data-testid={`flowchart-draggable-${option.value}`}
                >
                  <span className="text-gray-900 font-semibold">
                    {option.value}.
                  </span>{' '}
                  <span className="text-gray-700">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}