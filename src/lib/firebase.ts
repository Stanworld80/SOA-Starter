import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnYCwOzwljjoC5UmsaeFF55Iawzvkdbf0",
  authDomain: "soa-starter-9b8ij.firebaseapp.com",
  projectId: "soa-starter-9b8ij",
  storageBucket: "soa-starter-9b8ij.firebasestorage.app",
  messagingSenderId: "1007074958915",
  appId: "1:1007074958915:web:3221692d194a844286fef6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
