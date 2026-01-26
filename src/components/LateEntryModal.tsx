import React from 'react';
import { AlertCircle, ArrowLeft, LogIn, Clock, Calendar } from 'lucide-react';

interface LateEntryModalProps {
  examName: string;
  examCode: string;
  startTime: string;
  originalDuration: number;
  remainingMinutes: number;
  onGoBack: () => void;
  onEnterExam: () => void;
}

export function LateEntryModal({
  examName,
  examCode,
  startTime,
  originalDuration,
  remainingMinutes,
  onGoBack,
  onEnterExam
}: LateEntryModalProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timePercentage = Math.max(0, (remainingMinutes / originalDuration) * 100);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-[10000] flex items-center justify-center p-3 sm:p-4 md:p-6"
      data-testid="late-entry-modal"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-full sm:max-w-xl md:max-w-2xl w-full overflow-hidden animate-fadeIn max-h-[95vh] overflow-y-auto">
        {/* Header with Warning */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white rounded-full p-2 sm:p-3 flex-shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <div className="text-white">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">⚠️ Exam In Progress</h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">This exam has already started</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Exam Information */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{examName}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Exam Code: <span className="font-mono font-semibold">{examCode}</span></p>
          </div>

          {/* Time Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Started At */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-blue-900">Started At</h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">{formatDate(startTime)}</p>
              <p className="text-base sm:text-lg font-bold text-blue-900">{formatTime(startTime)}</p>
            </div>

            {/* Duration Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h4 className="text-xs sm:text-sm font-semibold text-purple-900">Duration</h4>
              </div>
              <p className="text-base sm:text-lg font-bold text-purple-900">
                {originalDuration} minutes
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Original Duration</p>
            </div>
          </div>

          {/* Remaining Time Warning */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="text-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Time Remaining
              </h3>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                {remainingMinutes} minutes
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                ({Math.floor(timePercentage)}% of original time)
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  timePercentage > 50
                    ? 'bg-green-500'
                    : timePercentage > 25
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${timePercentage}%` }}
              />
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-yellow-800">
                <p className="font-semibold mb-1">⚠️ Important Notice:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>You will only receive the <strong>remaining {remainingMinutes} minutes</strong> for this exam</li>
                  <li>All students must finish at the same time</li>
                  <li>Your answers will be auto-submitted when time expires</li>
                  <li>You cannot pause or extend your time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onGoBack}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-all duration-200"
              data-testid="late-entry-go-back-button"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Go Back to Dashboard</span>
              <span className="sm:hidden">Go Back</span>
            </button>

            <button
              onClick={onEnterExam}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              data-testid="late-entry-enter-exam-button"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Enter Exam ({remainingMinutes}m remaining)
            </button>
          </div>

          {/* Bottom Note */}
          <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
            By clicking "Enter Exam", you acknowledge that you understand the time limitations.
          </p>
        </div>
      </div>
    </div>
  );
}
