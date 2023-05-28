import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAzXxlQj7zRRwTHP3IX2gG3qW9fCawNhIg",
  authDomain: "chat-fd605.firebaseapp.com",
  projectId: "chat-fd605",
  storageBucket: "chat-fd605.appspot.com",
  messagingSenderId: "89754306419",
  appId: "1:89754306419:web:b83b392ce5c40d89362706"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const storage=getStorage(app)
export const db=getFirestore(app)