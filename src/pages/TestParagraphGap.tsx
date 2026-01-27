import React, { useState } from 'react';
import { ParagraphGapQuestion } from '../components/ParagraphGapQuestion';

export function TestParagraphGap() {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (questionNumber: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: value
    }));
  };

  // Test data from Track 10M Reading Section 2 Questions 20-26
  const section2Paragraph = `(20) According to Dr Randolph, people get sick because of ……………………… – in other words, a failure to adjust to the modern environment.

(21) Vague, far-off concepts like global warming are made more urgent when ……………………… are studied together.

(22) Rising temperatures result in more widespread distribution of disease because some insects are able to ………………………

(23) Large-scale removal of trees forces wildlife from their habitat and brings them into contact with ………………………

(24) Uncontrollable ……………………… of zoonotic viruses are becoming more numerous.

(25) Collaboration between many disciplines is needed to confront the problems of urban development, pollution, ……………………… and new pathogens.

(26) Environmental medicine should receive more ……………………… to help it meet future demands.`;

  // Test data from Track 10M Reading Section 3 Questions 38-40
  const section3Paragraph = `Effect of television on individual sports

(38) Ice skating – viewers find 'figures' boring so they are replaced with a ………………………

(39) Back-passing banned in football.

        Tour de France great for TV, but wrestling initially dropped from Olympic Games due to ………………………

(40) Beach volleyball aimed at ………………………`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test: Paragraph Gap Questions</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Section 2: Questions 20-26</h2>
          <ParagraphGapQuestion
            instruction="Complete the sentences below. Choose NO MORE THAN THREE WORDS from the passage for each answer."
            paragraph={section2Paragraph}
            questionNumbers={[20, 21, 22, 23, 24, 25, 26]}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Section 3: Questions 38-40</h2>
          <ParagraphGapQuestion
            instruction="Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer."
            paragraph={section3Paragraph}
            questionNumbers={[38, 39, 40]}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Current Answers:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
