import { getDatabase, ref, get, set, push, remove } from 'firebase/database';
import { app } from '../firebase';
import bcrypt from 'bcryptjs';

export interface Student {
  studentId: string;
  password: string;
  name: string;
  email: string;
  mobile: string;
  batch: string;
  batchId: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const db = getDatabase(app);

export const studentService = {
  // Generate next student ID
  async generateStudentId(): Promise<string> {
    try {
      const snapshot = await get(ref(db, 'students'));
      const year = new Date().getFullYear();
      
      if (!snapshot.exists()) {
        return `STU${year}00001`;
      }

      const students = snapshot.val();
      const studentIds = Object.keys(students);
      
      // Filter IDs for current year
      const currentYearIds = studentIds.filter(id => id.startsWith(`STU${year}`));
      
      if (currentYearIds.length === 0) {
        return `STU${year}00001`;
      }

      // Get the highest number
      const numbers = currentYearIds.map(id => {
        const numPart = id.replace(`STU${year}`, '');
        return parseInt(numPart, 10);
      });
      
      const maxNum = Math.max(...numbers);
      const nextNum = maxNum + 1;
      
      return `STU${year}${String(nextNum).padStart(5, '0')}`;
    } catch (error) {
      console.error('Error generating student ID:', error);
      throw error;
    }
  },

  // Generate random password
  generatePassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  // Create new student
  async createStudent(data: {
    name: string;
    email: string;
    mobile: string;
    batch: string;
    batchId: string;
    status: 'active' | 'inactive';
    createdBy: string;
  }): Promise<{ success: boolean; studentId?: string; password?: string; error?: string }> {
    try {
      const studentId = await this.generateStudentId();
      const plainPassword = this.generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const student: Student = {
        studentId,
        password: hashedPassword,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        batch: data.batch,
        batchId: data.batchId,
        enrollmentDate: new Date().toISOString(),
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: data.createdBy
      };

      await set(ref(db, `students/${studentId}`), student);

      return {
        success: true,
        studentId,
        password: plainPassword // Return plain password for display
      };
    } catch (error) {
      console.error('Error creating student:', error);
      return { success: false, error: 'Failed to create student' };
    }
  },

  // Get all students
  async getAllStudents(): Promise<Student[]> {
    try {
      const snapshot = await get(ref(db, 'students'));
      
      if (!snapshot.exists()) {
        return [];
      }

      const studentsObj = snapshot.val();
      return Object.values(studentsObj);
    } catch (error) {
      console.error('Error getting students:', error);
      return [];
    }
  },

  // Get student by ID
  async getStudentById(studentId: string): Promise<Student | null> {
    try {
      const snapshot = await get(ref(db, `students/${studentId}`));
      
      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val();
    } catch (error) {
      console.error('Error getting student:', error);
      return null;
    }
  },

  // Update student
  async updateStudent(studentId: string, updates: Partial<Student>): Promise<boolean> {
    try {
      const student = await this.getStudentById(studentId);
      
      if (!student) {
        return false;
      }

      const updatedStudent = {
        ...student,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await set(ref(db, `students/${studentId}`), updatedStudent);
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  },

  // Delete student
  async deleteStudent(studentId: string): Promise<boolean> {
    try {
      await remove(ref(db, `students/${studentId}`));
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  },

  // Reset password
  async resetPassword(studentId: string): Promise<{ success: boolean; password?: string; error?: string }> {
    try {
      const student = await this.getStudentById(studentId);
      
      if (!student) {
        return { success: false, error: 'Student not found' };
      }

      const plainPassword = this.generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await set(ref(db, `students/${studentId}/password`), hashedPassword);
      await set(ref(db, `students/${studentId}/updatedAt`), new Date().toISOString());

      return { success: true, password: plainPassword };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }
};
