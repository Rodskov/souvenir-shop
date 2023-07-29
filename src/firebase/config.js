import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export const firebaseConfig = {
  apiKey: "AIzaSyBcKBibUJM9oL6i0f-q9KaHpxyDrOjnEEQ",
  authDomain: "pup-tanglaw-clothing.firebaseapp.com",
  projectId: "pup-tanglaw-clothing",
  storageBucket: "pup-tanglaw-clothing.appspot.com",
  messagingSenderId: "515117858356",
  appId: "1:515117858356:web:408cc2533321bb99a95461"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app