import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB1ULPVu3Ah3q-bS9gjkEAqKn5B1XSxePY",
    authDomain: "nudge-8fcf6.firebaseapp.com",
    projectId: "nudge-8fcf6",
    storageBucket: "nudge-8fcf6.firebasestorage.app",
    messagingSenderId: "969445302570",
    appId: "1:969445302570:web:1fa2b51e0582aa3612fe53"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp( firebaseConfig ) : getApp();

// 2. Auth with Phone Storage persistence
const auth = initializeAuth( app, {
  persistence: getReactNativePersistence( AsyncStorage ),
} );

// 3. Database instance
const db = getFirestore(app);

export { app, auth, db };