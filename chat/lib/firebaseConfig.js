import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDnADK-R8Fasv84pVwp5dhYABeNR6ICz6s",
  authDomain: "aneeshprojectchat.firebaseapp.com",
  projectId: "aneeshprojectchat",
  storageBucket: "aneeshprojectchat.firebasestorage.app",
  messagingSenderId: "297463469543",
  appId: "1:297463469543:web:4709925067f8bf8b361942",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
