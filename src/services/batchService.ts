import { getDatabase, ref, get, set, remove } from 'firebase/database';
import { app } from '../firebase';

export interface Batch {
  batchId: string;
  batchName: string;
  startDate: string;
  endDate: string;
  schedule?: string;
  totalStudents: number;
  assignedTracks: string[];
  status: 'active' | 'completed' | 'upcoming';
  createdAt: string;
  createdBy: string;
}

const db = getDatabase(app);

export const batchService = {
  // Generate next batch ID
  async generateBatchId(): Promise<string> {
    try {
      const snapshot = await get(ref(db, 'batches'));
      const year = new Date().getFullYear();
      
      if (!snapshot.exists()) {
        return `BATCH${year}0001`;
      }

      const batches = snapshot.val();
      const batchIds = Object.keys(batches);
      
      // Filter IDs for current year
      const currentYearIds = batchIds.filter(id => id.startsWith(`BATCH${year}`));
      
      if (currentYearIds.length === 0) {
        return `BATCH${year}0001`;
      }

      // Get the highest number
      const numbers = currentYearIds.map(id => {
        const numPart = id.replace(`BATCH${year}`, '');
        return parseInt(numPart, 10);
      });
      
      const maxNum = Math.max(...numbers);
      const nextNum = maxNum + 1;
      
      return `BATCH${year}${String(nextNum).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating batch ID:', error);
      throw error;
    }
  },

  // Create batch
  async createBatch(data: {
    batchName: string;
    startDate: string;
    endDate: string;
    schedule?: string;
    assignedTracks: string[];
    status: 'active' | 'completed' | 'upcoming';
    createdBy: string;
  }): Promise<{ success: boolean; batchId?: string; error?: string }> {
    try {
      const batchId = await this.generateBatchId();

      const batch: Batch = {
        batchId,
        batchName: data.batchName,
        startDate: data.startDate,
        endDate: data.endDate,
        schedule: data.schedule,
        totalStudents: 0,
        assignedTracks: data.assignedTracks,
        status: data.status,
        createdAt: new Date().toISOString(),
        createdBy: data.createdBy
      };

      await set(ref(db, `batches/${batchId}`), batch);

      return { success: true, batchId };
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: 'Failed to create batch' };
    }
  },

  // Get all batches
  async getAllBatches(): Promise<Batch[]> {
    try {
      const snapshot = await get(ref(db, 'batches'));
      
      if (!snapshot.exists()) {
        return [];
      }

      const batchesObj = snapshot.val();
      return Object.values(batchesObj);
    } catch (error) {
      console.error('Error getting batches:', error);
      return [];
    }
  },

  // Get batch by ID
  async getBatchById(batchId: string): Promise<Batch | null> {
    try {
      const snapshot = await get(ref(db, `batches/${batchId}`));
      
      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val();
    } catch (error) {
      console.error('Error getting batch:', error);
      return null;
    }
  },

  // Update batch
  async updateBatch(batchId: string, updates: Partial<Batch>): Promise<boolean> {
    try {
      const batch = await this.getBatchById(batchId);
      
      if (!batch) {
        return false;
      }

      const updatedBatch = {
        ...batch,
        ...updates
      };

      await set(ref(db, `batches/${batchId}`), updatedBatch);
      return true;
    } catch (error) {
      console.error('Error updating batch:', error);
      return false;
    }
  },

  // Delete batch
  async deleteBatch(batchId: string): Promise<boolean> {
    try {
      await remove(ref(db, `batches/${batchId}`));
      return true;
    } catch (error) {
      console.error('Error deleting batch:', error);
      return false;
    }
  },

  // Update student count
  async updateStudentCount(batchId: string): Promise<boolean> {
    try {
      // Count students in this batch
      const studentsSnapshot = await get(ref(db, 'students'));
      
      if (!studentsSnapshot.exists()) {
        await set(ref(db, `batches/${batchId}/totalStudents`), 0);
        return true;
      }

      const students = studentsSnapshot.val();
      const count = Object.values(students).filter(
        (s: any) => s.batchId === batchId
      ).length;

      await set(ref(db, `batches/${batchId}/totalStudents`), count);
      return true;
    } catch (error) {
      console.error('Error updating student count:', error);
      return false;
    }
  }
};
