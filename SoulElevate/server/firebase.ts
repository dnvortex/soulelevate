import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaQpkchm52f-PCvXg4ekShu3yhol2jao4",
  authDomain: "dn-vortex-ai-agency.firebaseapp.com",
  projectId: "dn-vortex-ai-agency",
  storageBucket: "dn-vortex-ai-agency.appspot.com",
  messagingSenderId: "994308971143",
  appId: "1:994308971143:web:561b1ea8dfd9df3b667622",
  measurementId: "G-655L349BHQ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firestore database instance
export const db = getFirestore(app);

// Get Firebase Storage instance
export const storage = getStorage(app);

// For server-side code, we'll just use the client SDK
console.log("Firebase initialized with project:", firebaseConfig.projectId);

export default app;