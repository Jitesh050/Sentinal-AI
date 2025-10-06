import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkim0VTux7JiFOl5bI64cPJawiZ4TBY7Y",
  authDomain: "sentinelai-4aa22.firebaseapp.com",
  projectId: "sentinelai-4aa22",
  storageBucket: "sentinelai-4aa22.firebasestorage.app",
  messagingSenderId: "627648662253",
  appId: "1:627648662253:web:e143323f6f39d889e09ae4",
  measurementId: "G-9BXB7HYWJ2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
