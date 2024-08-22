import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
import { getApps } from 'firebase/app';
// Optionally import the services that you want to use
// import {...} from "firebase/database";
// import {...} from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, "api key")
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "push-fe07a.firebaseapp.com",
    projectId: "push-fe07a",
    storageBucket: "push-fe07a.appspot.com",
    messagingSenderId: process.env.EXPO_PUBLIC_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// console.log(getApps(), "getApps")
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// export const FIRESTORE_STORAGE = getStorage(FIREBASE_APP, "gs://tour-guide-concept.appspot.com");
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, { persistence: getReactNativePersistence(AsyncStorage) });
// FIREBASE_AUTH.setPersistence(browserLocalPersistence)