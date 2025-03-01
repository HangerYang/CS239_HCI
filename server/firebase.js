import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle persistence setup with proper error handling
async function setupFirebase() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase persistence set successfully');
  } catch (error) {
    console.error('Firebase persistence error:', error);
  }
}

setupFirebase();

export { auth };