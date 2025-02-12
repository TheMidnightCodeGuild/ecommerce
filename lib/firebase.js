// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgOO9uMKUWlf8y17tBS6BxlyhmEk3WUSM",
    authDomain: "ecommerce-fafab.firebaseapp.com",
    projectId: "ecommerce-fafab",
    storageBucket: "ecommerce-fafab.firebasestorage.app",
    messagingSenderId: "333659897378",
    appId: "1:333659897378:web:7b460c1e682e2f9d7d547b",
    measurementId: "G-2LPC5C4CQG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  // Dynamically import analytics only on client side
  import('firebase/analytics').then((module) => {
    analytics = module.getAnalytics(app);
  });
}

export { auth, db, analytics, storage };
