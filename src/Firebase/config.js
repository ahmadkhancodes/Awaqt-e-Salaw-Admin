import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD0ryjcQY2hYUodMMdhZG7b0F4lJcB1hN4",
  authDomain: "awqat-e-salah-b3268.firebaseapp.com",
  databaseURL: "https://awqat-e-salah-b3268-default-rtdb.firebaseio.com",
  projectId: "awqat-e-salah-b3268",
  storageBucket: "awqat-e-salah-b3268.appspot.com",
  messagingSenderId: "277980344372",
  appId: "1:277980344372:web:37aab2754e8be75fda1a61",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
export { db, firebaseApp, storage };
