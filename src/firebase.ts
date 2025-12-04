// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACqLW0zlrEByDJo1cqg_qPCZInHpS2gnI",
  authDomain: "shah-sultan-s-ielts-academy.firebaseapp.com",
  databaseURL: "https://shah-sultan-s-ielts-academy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shah-sultan-s-ielts-academy",
  storageBucket: "shah-sultan-s-ielts-academy.firebasestorage.app",
  messagingSenderId: "321911668194",
  appId: "1:321911668194:web:bfa5aa4afbc53a57da4dbb",
  measurementId: "G-Q4S9V2GSW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, analytics, storage, database };
