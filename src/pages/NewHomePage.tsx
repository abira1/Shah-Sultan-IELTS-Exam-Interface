import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';

export function NewHomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/homepage-logo.png" 
              alt="Shah Sultan IELTS Academy" 
              className="h-32 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Shah Sultan IELTS Academy
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Examination System
          </h2>
          <p className="text-gray-600 text-lg">
            Select your login portal to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Student Portal */}
          <div 
            onClick={() => navigate('/student/login')}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer group hover:shadow-2xl"
            data-testid="student-portal-card"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Student Portal
              </h3>
              <p className="text-gray-600 mb-6">
                Access your dashboard, take exams, and view results
              </p>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                data-testid="student-login-button"
              >
                Student Login
              </button>
            </div>
          </div>

          {/* Staff Portal */}
          <div 
            onClick={() => navigate('/staff/login')}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-purple-500 transition-all cursor-pointer group hover:shadow-2xl"
            data-testid="staff-portal-card"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <ShieldCheck className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Staff Portal
              </h3>
              <p className="text-gray-600 mb-6">
                Admin & Teacher access for exam management
              </p>
              <button
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-lg"
                data-testid="staff-login-button"
              >
                Staff Login
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-semibold text-xs">i</span>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Need help?
              </p>
              <p className="text-gray-600">
                For support or account issues, please contact: <span className="font-semibold">support@school.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
