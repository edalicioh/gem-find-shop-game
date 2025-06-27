import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCVurrYeMJ6QBI7cJiWh7gR71LsTRQohGk",
    authDomain: "retrobdagame.firebaseapp.com",
    projectId: "retrobdagame",
    storageBucket: "retrobdagame.firebasestorage.app",
    messagingSenderId: "791931620238",
    appId: "1:791931620238:web:beb9ade1cb1e4ce8e2b2df",
    measurementId: "G-YCVD6J97LP"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;