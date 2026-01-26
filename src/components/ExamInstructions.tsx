import React from 'react';
import { Headphones, BookOpen, PenTool, Clock, FileText, CheckSquare } from 'lucide-react';

interface ExamInstructionsProps {
  examType: 'listening' | 'reading' | 'writing';
  onStart: () => void;
}

export function ExamInstructions({ examType, onStart }: ExamInstructionsProps) {
  const getIcon = () => {
    switch (examType) {
      case 'listening':
        return <Headphones className="w-10 h-10 text-white" />;
      case 'reading':
        return <BookOpen className="w-10 h-10 text-white" />;
      case 'writing':
        return <PenTool className="w-10 h-10 text-white" />;
    }
  };

  const getTitle = () => {
    switch (examType) {
      case 'listening':
        return 'Listening';
      case 'reading':
        return 'Reading';
      case 'writing':
        return 'Writing';
    }
  };

  const getDuration = () => {
    switch (examType) {
      case 'listening':
        return '40 minutes';
      case 'reading':
        return '1 hour';
      case 'writing':
        return '1 hour';
    }
  };

  const getGradient = () => {
    switch (examType) {
      case 'listening':
        return 'from-purple-500 to-indigo-600';
      case 'reading':
        return 'from-green-500 to-teal-600';
      case 'writing':
        return 'from-orange-500 to-red-600';
    }
  };

  const renderListeningInstructions = () => (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          Official Instructions to Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Do not open this question paper until you are told to do so.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Write your name and candidate number in the spaces at the top of this page.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Listen carefully to the instructions for each part of the test.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Answer all the questions.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>While you are listening, write your answers on the question paper.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>You will have 10 minutes at the end of the test to transfer your answers to the answer sheet.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Use a pencil.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>At the end of the test, hand in this question paper.</span>
          </li>
        </ul>
      </div>

      <div className="bg-purple-50 rounded-xl shadow-md p-6 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-purple-600" />
          Information for Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>The test consists of four parts.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>You will hear each part once only.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>There are 40 questions in total.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Each question carries one mark.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>Before each part, you will have time to read the questions.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold mt-1">•</span>
            <span>After each part, you will have time to check your answers.</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 italic">
          <span className="font-semibold">Instruction Source:</span> British Council Listening Test Format
        </p>
      </div>
    </>
  );

  const renderReadingInstructions = () => (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" />
          Official Instructions to Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Do not open this question paper until you are told to do so.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Write your name and candidate number in the spaces at the top of this page.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Read the instructions for each section carefully.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Answer all the questions.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Write your answers on the answer sheet.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Use a pencil.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>You must complete the test within the given time limit.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>At the end of the test, hand in both the question paper and the answer sheet.</span>
          </li>
        </ul>
      </div>

      <div className="bg-green-50 rounded-xl shadow-md p-6 border border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-green-600" />
          Information for Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>There are 40 questions in total.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>Each question carries one mark.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>You must fill in the answer sheet.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold mt-1">•</span>
            <span>To view the answer sheet, click <span className="font-semibold bg-green-100 px-2 py-1 rounded">VIEW ANSWER SHEET</span> at the bottom of the screen.</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 italic">
          <span className="font-semibold">Instruction Source:</span> British Council Reading Test Format
        </p>
      </div>
    </>
  );

  const renderWritingInstructions = () => (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-600" />
          Official Instructions to Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Do not open this question paper until you are told to do so.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Write your name and candidate number in the spaces at the top of this page.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Read the instructions for each task carefully.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Answer both tasks.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Write at least 150 words for Task 1.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Write at least 250 words for Task 2.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Write your answers in the answer booklet.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Write clearly using pen or pencil.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>You may make corrections, but ensure your writing remains clear and readable.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>At the end of the test, hand in both the question paper and the answer booklet.</span>
          </li>
        </ul>
      </div>

      <div className="bg-orange-50 rounded-xl shadow-md p-6 border border-orange-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-orange-600" />
          Information for Candidates
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>There are two tasks on this paper.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Task 2 contributes twice as much to the Writing score as Task 1.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-600 font-bold mt-1">•</span>
            <span>Click <span className="font-semibold bg-orange-100 px-2 py-1 rounded">SUBMIT ESSAYS</span> after completing both tasks.</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 italic">
          <span className="font-semibold">Instruction Source:</span> British Council Writing Test Format
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getGradient()} rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8`}>
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 truncate">{getTitle()}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg font-medium">Time: {getDuration()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Content */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {examType === 'listening' && renderListeningInstructions()}
          {examType === 'reading' && renderReadingInstructions()}
          {examType === 'writing' && renderWritingInstructions()}
        </div>

        {/* Start Button */}
        <div className="sticky bottom-4 sm:bottom-6">
          <button
            onClick={onStart}
            data-testid={`start-${examType}-test-button`}
            className={`w-full bg-gradient-to-r ${getGradient()} hover:shadow-2xl text-white font-bold text-base sm:text-lg md:text-xl py-4 px-6 sm:py-5 sm:px-8 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3`}
          >
            <span>Start {getTitle()} Test</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
