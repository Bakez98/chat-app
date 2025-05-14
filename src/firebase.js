// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage


const firebaseConfig = {
  apiKey: "AIzaSyADfypWGCdlzYYcJpzRvWXOOiJmHYf7c_M",
  authDomain: "chat-app-f3102.firebaseapp.com",
  projectId: "chat-app-f3102",
  storageBucket: "chat-app-f3102.firebasestorage.app",
  messagingSenderId: "68573559850",
  appId: "1:68573559850:web:93b5a11c84a42b93e6d753",
  measurementId: "G-JDZFJY7RZZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // <-- ADD THIS
export const storage = getStorage(app); // <-- ADD THIS
