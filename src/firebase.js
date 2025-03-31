// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcc1dwYH9MMpe5DB8jMYgi1yB2wmKzopM",
  authDomain: "buglyworld-e1f16.firebaseapp.com",
  projectId: "buglyworld-e1f16",
  storageBucket: "buglyworld-e1f16.firebasestorage.app",
  messagingSenderId: "1067153213586",
  appId: "1:1067153213586:web:17900efbf4420cd1babe4b",
  measurementId: "G-L8FDKYYGLM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
