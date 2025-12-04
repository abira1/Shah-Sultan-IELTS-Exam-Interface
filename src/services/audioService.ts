import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { app } from "../firebase";

const storage = getStorage(app);
const database = getDatabase(app);

const AUDIO_DB_PATH = "exam/audio";

export const audioService = {
  // Upload audio file to Firebase Storage
  async uploadAudio(file: File): Promise<string> {
    try {
      const fileName = `exam-audio-${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `audio/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save URL to Realtime Database
      await set(dbRef(database, AUDIO_DB_PATH), {
        url: downloadURL,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        uploadType: 'file'
      });
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }
  },

  // Upload audio via URL (no storage upload needed)
  async uploadAudioByURL(audioURL: string): Promise<string> {
    try {
      // Extract filename from URL or use a default
      const urlParts = audioURL.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0] || 'external-audio';
      
      // Save URL to Realtime Database
      await set(dbRef(database, AUDIO_DB_PATH), {
        url: audioURL,
        fileName: fileName,
        uploadedAt: new Date().toISOString(),
        size: 0, // Unknown size for external URLs
        uploadType: 'url'
      });
      
      return audioURL;
    } catch (error) {
      console.error("Error uploading audio by URL:", error);
      throw error;
    }
  },

  // Get current audio URL from database
  async getAudioURL(): Promise<string | null> {
    try {
      const snapshot = await get(dbRef(database, AUDIO_DB_PATH));
      if (snapshot.exists()) {
        return snapshot.val().url;
      }
      return null;
    } catch (error) {
      console.error("Error fetching audio URL:", error);
      return null;
    }
  },

  // Delete audio from storage and database
  async deleteAudio(): Promise<void> {
    try {
      const snapshot = await get(dbRef(database, AUDIO_DB_PATH));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const audioURL = data.url;
        const uploadType = data.uploadType || 'file';
        
        // Only delete from storage if it was uploaded as a file
        if (uploadType === 'file') {
          // Extract file path from URL for deletion
          const fileNameMatch = audioURL.match(/audio%2F([^?]+)/);
          if (fileNameMatch) {
            const fileName = decodeURIComponent(fileNameMatch[1]);
            const storageRef = ref(storage, `audio/${fileName}`);
            try {
              await deleteObject(storageRef);
            } catch (storageError) {
              console.warn("Could not delete from storage:", storageError);
              // Continue with database deletion even if storage deletion fails
            }
          }
        }
        // For URL uploads, just delete from database (no storage cleanup needed)
        
        // Delete from database
        await set(dbRef(database, AUDIO_DB_PATH), null);
      }
    } catch (error) {
      console.error("Error deleting audio:", error);
      throw error;
    }
  },

  // Get audio metadata
  async getAudioMetadata(): Promise<{ fileName: string; uploadedAt: string; size: number; uploadType?: string } | null> {
    try {
      const snapshot = await get(dbRef(database, AUDIO_DB_PATH));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return {
          fileName: data.fileName || "Unknown",
          uploadedAt: data.uploadedAt || "",
          size: data.size || 0,
          uploadType: data.uploadType || "file"
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching audio metadata:", error);
      return null;
    }
  }
};
