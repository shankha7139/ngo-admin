// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3PE7IYVEHbBEL5M_w6tDumdBVyGr3FQY",
  authDomain: "graduate-club.firebaseapp.com",
  projectId: "graduate-club",
  storageBucket: "graduate-club.appspot.com",
  messagingSenderId: "842413316690",
  appId: "1:842413316690:web:abca8b828f1c109cee9d8b",
  measurementId: "G-TMY5ESZQRT"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, analytics, storage, auth };
