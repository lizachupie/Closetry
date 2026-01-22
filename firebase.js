import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyALfVbFGOFPXOM_EUJcbdACKojDa0l-xoM",
  authDomain: "wardrobe-3a33f.firebaseapp.com",
  projectId: "wardrobe-3a33f",
  storageBucket: "wardrobe-3a33f.firebasestorage.app",
  messagingSenderId: "617616002714",
  appId: "1:617616002714:web:b5d7c3639e54781ce21923",
  measurementId: "G-64KRNEQW9D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
