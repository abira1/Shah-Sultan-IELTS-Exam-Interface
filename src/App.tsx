import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { initializeDatabase } from './utils/initializeDatabase';
import { initializeAuthorizedUsers } from './utils/initializeAuthorizedUsers';

// Pages
import { NewHomePage } from './pages/NewHomePage';
import { StudentLogin } from './components/StudentLogin';
import { StaffLogin } from './components/StaffLogin';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ResultDetailPage } from './pages/student/ResultDetailPage';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExamPage } from './pages/ExamPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { StudentProfilePage } from './pages/admin/StudentProfilePage';
import { BatchesPage } from './pages/admin/BatchesPage';
import { SubmissionsPage } from './pages/admin/SubmissionsPage';

export function App() {
  useEffect(() => {
    // Initialize database with default admin on app load
    initializeDatabase();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<NewHomePage />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />

          {/* Student Routes (Protected) */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/exam/:examCode"
            element={
              <ProtectedRoute role="student">
                <ExamPageWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results/:submissionId"
            element={
              <ProtectedRoute role="student">
                <ResultDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute role="admin">
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:studentId"
            element={
              <ProtectedRoute role="admin">
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/batches"
            element={
              <ProtectedRoute role="admin">
                <BatchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute role="admin">
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes (Protected) */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/submissions"
            element={
              <ProtectedRoute role="teacher">
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy admin route redirect */}
          <Route path="/admin" element={<Navigate to="/staff/login" replace />} />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Wrapper for ExamPage to pass props from auth context
function ExamPageWrapper() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.studentId) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = () => {
    navigate('/student/dashboard');
  };

  return (
    <ExamPage
      studentId={user.studentId}
      studentName={user.name}
      onSubmit={handleSubmit}
    />
  );
}
