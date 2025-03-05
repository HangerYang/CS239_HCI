import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID
};

// Add debugging to check if environment variables are loaded
console.log('Firebase Config Loading:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_APIKEY,
  hasAuthDomain: !!process.env.NEXT_PUBLIC_AUTHDOMAIN,
  hasProjectId: !!process.env.NEXT_PUBLIC_PROJECTID
});
export const auth = getAuth(app);
// Handle persistence setup with proper error handling
async function setupFirebase() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase persistence set successfully');
  } catch (error) {
    console.error('Firebase persistence error:', error);
  }
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

setupFirebase();