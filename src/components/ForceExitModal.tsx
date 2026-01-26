import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, XCircle } from 'lucide-react';

interface ForceExitModalProps {
  reason: 'time_expired' | 'admin_stopped' | 'exam_ended';
  onClose?: () => void;
  autoRedirectSeconds?: number;
}

export function ForceExitModal({ 
  reason, 
  onClose,
  autoRedirectSeconds = 3 
}: ForceExitModalProps) {
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onClose) onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const getContent = () => {
    switch (reason) {
      case 'time_expired':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-600" />,
          title: '✅ Submission Successful',
          message: 'Your exam time has ended. Your answers have been recorded and submitted successfully.',
          bgColor: 'from-green-500 to-emerald-600',
          iconBg: 'bg-green-100'
        };
      case 'admin_stopped':
        return {
          icon: <XCircle className="w-16 h-16 text-red-600" />,
          title: '🛑 Exam Stopped',
          message: 'The exam has been stopped by the administrator. Your answers have been automatically submitted.',
          bgColor: 'from-red-500 to-red-600',
          iconBg: 'bg-red-100'
        };
      case 'exam_ended':
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-600" />,
          title: '⏱️ Exam Ended',
          message: 'This exam has already ended. You cannot enter at this time.',
          bgColor: 'from-gray-500 to-gray-600',
          iconBg: 'bg-gray-100'
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-600" />,
          title: 'Exam Ended',
          message: 'This exam session has ended.',
          bgColor: 'from-gray-500 to-gray-600',
          iconBg: 'bg-gray-100'
        };
    }
  };

  const content = getContent();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
      data-testid="force-exit-modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${content.bgColor} px-6 py-8 text-white text-center`}>
          <div className={`w-20 h-20 ${content.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {content.icon}
          </div>
          <h2 className="text-2xl font-bold">{content.title}</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {content.message}
          </p>

          {reason !== 'exam_ended' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
              <p className="text-blue-800 text-sm font-medium">
                ✓ Your submission has been recorded
              </p>
              <p className="text-blue-700 text-sm mt-1">
                You can check your results in the dashboard once they are published.
              </p>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-gray-600 text-sm mb-2">
              Returning to dashboard in
            </p>
            <div className="text-4xl font-bold text-gray-800" data-testid="redirect-countdown">
              {countdown}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              seconds
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Redirecting automatically...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
