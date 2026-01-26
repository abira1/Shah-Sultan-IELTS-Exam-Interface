import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ImportantNoticeProps {
  onAccept: () => void;
}

export function ImportantNotice({ onAccept }: ImportantNoticeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="max-w-full sm:max-w-2xl md:max-w-3xl w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Important Notice</h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-1">Please read carefully before continuing</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 space-y-4 sm:space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 sm:p-6">
            <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
              This is a <span className="font-semibold text-amber-700">simulated IELTS practice test</span> and not an official IELTS examination.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 sm:p-6">
            <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
              The band score provided at the end of this test is an <span className="font-semibold text-blue-700">estimated score only</span> and does not guarantee the same result in the official IELTS exam.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              By continuing, you acknowledge and accept these conditions.
            </p>
          </div>

          {/* Accept Button */}
          <div className="pt-4 sm:pt-6">
            <button
              onClick={onAccept}
              data-testid="accept-continue-button"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base sm:text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3"
            >
              <span>Accept & Continue</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 md:px-8 border-t border-gray-200">
          <p className="text-center text-xs sm:text-sm text-gray-600">
            Shah Sultan IELTS Academy - Practice Test Platform
          </p>
        </div>
      </div>
    </div>
  );
}
