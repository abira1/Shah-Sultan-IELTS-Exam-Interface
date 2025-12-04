import React from 'react';
interface QuestionNavigatorProps {
  answers: Record<number, string>;
  onQuestionClick: (questionNumber: number, sectionIndex: number) => void;
  currentSection: number;
}
const sectionQuestions = [{
  section: 1,
  questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}, {
  section: 2,
  questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
}, {
  section: 3,
  questions: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
}, {
  section: 4,
  questions: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
}];
export function QuestionNavigator({
  answers,
  onQuestionClick,
  currentSection
}: QuestionNavigatorProps) {
  const isAnswered = (questionNumber: number) => {
    return answers[questionNumber] && answers[questionNumber].trim() !== '';
  };
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="w-full px-4 py-2">
        <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto flex-wrap">
          {sectionQuestions.map((section, sectionIdx) => <div key={section.section} className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-600 text-xs whitespace-nowrap">
                S{section.section}
              </span>
              <div className="flex gap-0.5">
                {section.questions.map(qNum => <button key={qNum} onClick={() => onQuestionClick(qNum, sectionIdx)} className={`
                      w-6 h-6 rounded text-[9px] font-medium transition-all
                      ${currentSection === sectionIdx ? 'ring-1 ring-blue-500' : ''}
                      ${isAnswered(qNum) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'}
                    `} title={`Question ${qNum}${isAnswered(qNum) ? ' (answered)' : ''}`}>
                    {qNum}
                  </button>)}
              </div>
            </div>)}
        </div>
      </div>
    </nav>;
}