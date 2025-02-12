// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmIMLhmj59Ri3ZleVcRcra2ntulk_TN3U",
  authDomain: "ecommerce-b7293.firebaseapp.com",
  projectId: "ecommerce-b7293",
  storageBucket: "ecommerce-b7293.firebasestorage.app",
  messagingSenderId: "164991345680",
  appId: "1:164991345680:web:752c105af75ed5f8ad9695",
  measurementId: "G-0YKHR5HLZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Only initialize analytics on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  // Dynamically import analytics only on client side
  import('firebase/analytics').then((module) => {
    analytics = module.getAnalytics(app);
  });
}

export { auth, db, analytics };
