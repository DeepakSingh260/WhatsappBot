// Import the functions you need from the SDKs you need
const { initializeApp } = require( "firebase/app");
const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACZ5ZIIMFR8i29HWuANknutzWbNQ0ow9Y",
  authDomain: "whatsappbankbot.firebaseapp.com",
  projectId: "whatsappbankbot",
  storageBucket: "whatsappbankbot.appspot.com",
  messagingSenderId: "896436288781",
  appId: "1:896436288781:web:ad2938fe6bf31fa2554444",
  measurementId: "G-WGC6HK7REK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

module.exports = app;