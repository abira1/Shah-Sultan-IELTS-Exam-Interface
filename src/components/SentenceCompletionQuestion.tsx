interface SentenceCompletionItem {
  questionNumber: number;
  text: string;
}

interface SentenceCompletionQuestionProps {
  instruction: string;
  items: SentenceCompletionItem[];
  answers: Record<number, string>;
  onAnswerChange: (questionNumber: number, value: string) => void;
  disabled?: boolean;
}

export function SentenceCompletionQuestion({
  instruction,
  items,
  answers,
  onAnswerChange,
  disabled = false
}: SentenceCompletionQuestionProps) {
  
  // Parse text and replace dots with inline input fields
  const renderTextWithInlineInput = (item: SentenceCompletionItem) => {
    const { questionNumber, text } = item;
    
    // Pattern to match various dot patterns (multiple dots, periods with spaces, etc.)
    // Matches patterns like: ……………………, ........., ....., etc.
    const dotPattern = /(\.{3,}|…{3,})/;
    
    const parts = text.split(dotPattern);
    const hasDots = dotPattern.test(text);
    
    return (
      <div className="space-y-2" key={questionNumber}>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-gray-600 font-medium whitespace-nowrap">
            ({questionNumber}).
          </span>
          {parts.map((part, index) => {
            // Check if this part matches the dot pattern
            if (dotPattern.test(part)) {
              return (
                <input
                  key={index}
                  type="text"
                  value={answers[questionNumber] || ''}
                  onChange={(e) => onAnswerChange(questionNumber, e.target.value)}
                  disabled={disabled}
                  className="px-2 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-purple-500 min-w-[120px] max-w-[200px] bg-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
                  placeholder="Type answer"
                  data-testid={`inline-input-${questionNumber}`}
                />
              );
            }
            // Regular text - preserve line breaks
            return (
              <span key={index} className="text-gray-900 whitespace-pre-wrap inline-block">
                {part}
              </span>
            );
          })}
          {/* If no dots found in text, add input box after the question */}
          {!hasDots && (
            <input
              type="text"
              value={answers[questionNumber] || ''}
              onChange={(e) => onAnswerChange(questionNumber, e.target.value)}
              disabled={disabled}
              className="px-2 py-1 border-b-2 border-gray-400 focus:outline-none focus:border-purple-500 min-w-[120px] max-w-[200px] bg-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed inline-block"
              placeholder="Type answer"
              data-testid={`sentence-input-${questionNumber}`}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
        <p className="text-sm text-gray-700 font-medium">{instruction}</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => renderTextWithInlineInput(item))}
      </div>
    </div>
  );
}
