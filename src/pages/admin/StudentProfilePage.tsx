import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService, Student } from '../../services/studentService';
import { storage, ExamSubmission } from '../../utils/storage';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Key,
  UserX,
  Trash2,
  Copy,
  Check,
  BarChart3
} from 'lucide-react';

export function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    if (!studentId) return;

    setIsLoading(true);
    try {
      const studentData = await studentService.getStudentById(studentId);
      if (studentData) {
        setStudent(studentData);
        // Load submissions for this student
        const allSubmissions = storage.getSubmissions();
        const studentSubmissions = allSubmissions.filter(
          s => s.studentId === studentId
        );
        setSubmissions(studentSubmissions);
      } else {
        alert('Student not found');
        navigate('/admin/students');
      }
    } catch (error) {
      console.error('Error loading student:', error);
      alert('Failed to load student data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!studentId) return;
    if (!confirm('Are you sure you want to reset the password for this student?'))
      return;

    const result = await studentService.resetPassword(studentId);

    if (result.success && result.password) {
      setNewPassword(result.password);
      alert('Password reset successfully!');
    } else {
      alert(result.error || 'Failed to reset password');
    }
  };

  const handleDeactivate = async () => {
    if (!studentId) return;
    if (!confirm('Are you sure you want to deactivate this student?')) return;

    const success = await studentService.updateStudent(studentId, {
      status: 'inactive'
    });

    if (success) {
      alert('Student deactivated successfully');
      loadStudentData();
    } else {
      alert('Failed to deactivate student');
    }
  };

  const handleActivate = async () => {
    if (!studentId) return;

    const success = await studentService.updateStudent(studentId, {
      status: 'active'
    });

    if (success) {
      alert('Student activated successfully');
      loadStudentData();
    } else {
      alert('Failed to activate student');
    }
  };

  const handleDelete = async () => {
    if (!studentId) return;
    if (
      !confirm(
        'Are you sure you want to delete this student? This action cannot be undone.'
      )
    )
      return;

    const success = await studentService.deleteStudent(studentId);

    if (success) {
      alert('Student deleted successfully');
      navigate('/admin/students');
    } else {
      alert('Failed to delete student');
    }
  };

  const handleCopyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateAverageScore = (): number => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((acc, s) => acc + (s.score || 0), 0);
    return Math.round(total / submissions.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student not found</p>
          <button
            onClick={() => navigate('/admin/students')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/students')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-sm text-gray-600">{student.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/students`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Student ID</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-semibold text-gray-900">
                    {student.studentId}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Full Name</div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-lg text-gray-900">{student.name}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-lg text-gray-900">{student.email}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Mobile</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-lg text-gray-900">{student.mobile}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Batch</div>
                <div className="text-lg text-gray-900">{student.batch}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                {student.status === 'active' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Inactive
                  </span>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Enrollment Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-lg text-gray-900">
                    {formatDate(student.enrollmentDate)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Password</div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  <span className="text-lg text-gray-900">
                    {showPassword ? '********' : '********'}
                  </span>
                  {newPassword && (
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm font-mono font-semibold text-green-600">
                        New: {newPassword}
                      </span>
                      <button
                        onClick={handleCopyPassword}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy password"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleResetPassword}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Key className="w-4 h-4" />
              Reset Password
            </button>
            {student.status === 'active' ? (
              <button
                onClick={handleDeactivate}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <UserX className="w-4 h-4" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Activate
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div className="text-sm text-gray-600">Exams Taken</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {submissions.length}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {calculateAverageScore()}%
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div className="text-sm text-gray-600">Published Results</div>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {submissions.filter(s => s.resultPublished).length}
            </div>
          </div>
        </div>

        {/* Submission History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Submission History</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No submissions yet</p>
              <p className="text-sm text-gray-400 mt-2">
                This student hasn't completed any exams
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Track
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map(submission => (
                    <tr
                      key={submission.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatDate(submission.submittedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {submission.trackName || 'Unknown Track'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-blue-600">
                          {submission.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {submission.timeSpent}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.resultPublished ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
