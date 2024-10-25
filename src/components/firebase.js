// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIiYrPW2-O-11V3j3cOHzteA-OaF5f814",
  authDomain: "save-now-74b99.firebaseapp.com",
  projectId: "save-now-74b99",
  storageBucket: "save-now-74b99.appspot.com",
  messagingSenderId: "61005798740",
  appId: "1:61005798740:web:d8031d19aac96d8fa3bcc1",
  measurementId: "G-PH6BD44RWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db=getFirestore(app);
export default app;