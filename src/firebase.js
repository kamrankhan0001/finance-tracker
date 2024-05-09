// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB48YpaEbBDtEbEaf9drrZq_iOYLqn6cAA",
  authDomain: "personal-finance-tracker-d34c3.firebaseapp.com",
  projectId: "personal-finance-tracker-d34c3",
  storageBucket: "personal-finance-tracker-d34c3.appspot.com",
  messagingSenderId: "980150142795",
  appId: "1:980150142795:web:3d153c692a39a53c20cace",
  measurementId: "G-E9DZ9DLS4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc};