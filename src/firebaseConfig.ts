// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA1zX9riiRZ7d_B936QP6FEf0QZfghhkK0',
  authDomain: 'social-sync-app.firebaseapp.com',
  projectId: 'social-sync-app',
  storageBucket: 'social-sync-app.appspot.com',
  messagingSenderId: '976030694975',
  appId: '1:976030694975:web:15e510e9294cb38721c28a',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
