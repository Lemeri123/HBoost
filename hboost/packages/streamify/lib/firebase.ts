// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyr_r36XO7hVSETqf2zRX65robHIztekw",
  authDomain: "streamify-78adc.firebaseapp.com",
  projectId: "streamify-78adc",
  storageBucket: "streamify-78adc.firebasestorage.app",
  messagingSenderId: "204301734769",
  appId: "1:204301734769:web:a5f9f5ae02e29930e71cd0",
  measurementId: "G-X8KNR9NTX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;

