import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebase';
import bcrypt from 'bcryptjs';

export interface User {
  userId: string;
  username?: string;
  studentId?: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  email: string;
  status: 'active' | 'inactive';
  permissions?: {
    manageStudents?: boolean;
    manageBatches?: boolean;
    manageTracks?: boolean;
    manageAudio?: boolean;
    createExamSessions?: boolean;
    viewAllSubmissions?: boolean;
    gradeSubmissions?: boolean;
    publishResults?: boolean;
    exportResults?: boolean;
    manageUsers?: boolean;
  };
  assignedTracks?: string[];
  batch?: string;
  batchId?: string;
  enrollmentDate?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const db = getDatabase(app);

export const authService = {
  // Student Login
  async loginStudent(studentId: string, password: string): Promise<AuthResponse> {
    try {
      const snapshot = await get(ref(db, `students/${studentId}`));
      
      if (!snapshot.exists()) {
        return { success: false, error: 'Invalid Student ID or password' };
      }

      const student = snapshot.val();

      if (student.status !== 'active') {
        return { success: false, error: 'Your account is inactive. Please contact administrator.' };
      }

      const isPasswordValid = await bcrypt.compare(password, student.password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid Student ID or password' };
      }

      // Update last login
      await set(ref(db, `students/${studentId}/lastLoginAt`), new Date().toISOString());

      const user: User = {
        userId: studentId,
        studentId: studentId,
        role: 'student',
        name: student.name,
        email: student.email,
        status: student.status,
        batch: student.batch,
        batchId: student.batchId,
        password: '' // Don't send password back
      };

      return { success: true, user };
    } catch (error) {
      console.error('Student login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  // Staff (Admin/Teacher) Login
  async loginStaff(username: string, password: string): Promise<AuthResponse> {
    try {
      // Get all users
      const snapshot = await get(ref(db, 'users'));
      
      if (!snapshot.exists()) {
        return { success: false, error: 'Invalid username or password' };
      }

      const users = snapshot.val();
      let foundUser: any = null;
      let userId: string = '';

      // Find user by username
      for (const [id, user] of Object.entries(users)) {
        if ((user as any).username === username) {
          foundUser = user;
          userId = id;
          break;
        }
      }

      if (!foundUser) {
        return { success: false, error: 'Invalid username or password' };
      }

      if (foundUser.status !== 'active') {
        return { success: false, error: 'Your account is inactive. Please contact administrator.' };
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Update last login
      await set(ref(db, `users/${userId}/lastLoginAt`), new Date().toISOString());

      const user: User = {
        userId: userId,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
        email: foundUser.email,
        status: foundUser.status,
        permissions: foundUser.permissions,
        assignedTracks: foundUser.assignedTracks || [],
        password: '' // Don't send password back
      };

      return { success: true, user };
    } catch (error) {
      console.error('Staff login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  // Verify token (check if user exists in sessionStorage)
  verifyToken(): User | null {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Save user to session
  saveUserSession(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  },

  // Logout
  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('adminAuth');
  }
};
