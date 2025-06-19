// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC37V1uqBjG4kEyH81vzNQ-eGfTz5XZrc8",
  authDomain: "ahs-tool.firebaseapp.com",
  projectId: "ahs-tool",
  storageBucket: "ahs-tool.firebasestorage.app",
  messagingSenderId: "613725752549",
  appId: "1:613725752549:web:6fcdb627422efbc68b580c",
  measurementId: "G-X90TBYBYWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);