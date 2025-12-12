import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebase';
import bcrypt from 'bcryptjs';

const db = getDatabase(app);

export const initializeDatabase = async () => {
  try {
    // Check if admin already exists
    const usersSnapshot = await get(ref(db, 'users'));
    let adminExists = false;
    
    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val();
      adminExists = Object.values(users).some(
        (user: any) => user.username === 'admin' && user.role === 'admin'
      );
    }

    // Create default admin account if doesn't exist
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const defaultAdmin = {
        userId: 'admin-default',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'System Administrator',
        email: 'admin@system.com',
        status: 'active',
        permissions: {
          manageStudents: true,
          manageBatches: true,
          manageTracks: true,
          manageAudio: true,
          createExamSessions: true,
          viewAllSubmissions: true,
          gradeSubmissions: true,
          publishResults: true,
          exportResults: true,
          manageUsers: true
        },
        assignedTracks: [],
        createdAt: new Date().toISOString(),
        lastLoginAt: null
      };

      await set(ref(db, 'users/admin-default'), defaultAdmin);
      console.log('✅ Default admin account created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
    }

    // Check if default batch exists
    const batchesSnapshot = await get(ref(db, 'batches'));
    let defaultBatchExists = false;
    
    if (batchesSnapshot.exists()) {
      const batches = batchesSnapshot.val();
      defaultBatchExists = Object.values(batches).some(
        (batch: any) => batch.batchId === 'BATCH20250001'
      );
    }

    // Create default batch if doesn't exist
    if (!defaultBatchExists) {
      const defaultBatch = {
        batchId: 'BATCH20250001',
        batchName: 'Morning Batch A',
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        schedule: 'Mon-Fri 9AM-12PM',
        totalStudents: 0,
        assignedTracks: ['track-1', 'track-4'],
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'admin-default'
      };

      await set(ref(db, 'batches/BATCH20250001'), defaultBatch);
      console.log('✅ Default batch created successfully');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
