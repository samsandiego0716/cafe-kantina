import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7bmnIxV6Q36JPm76lpRfQfKDLXm9wKPo",
    authDomain: "cafe-kantina.firebaseapp.com",
    projectId: "cafe-kantina",
    storageBucket: "cafe-kantina.firebasestorage.app",
    messagingSenderId: "218154108868",
    appId: "1:218154108868:web:bbd222ee9edc60fa178691",
    measurementId: "G-RSFTNZJ5B4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
