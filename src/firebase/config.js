import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export const firebaseConfig = {
  apiKey: "AIzaSyCVN-I3h5ZdM811HPKTAMEVmccD2lU9ui0",
  authDomain: "pup-souvenir-shop-2.firebaseapp.com",
  projectId: "pup-souvenir-shop-2",
  storageBucket: "pup-souvenir-shop-2.appspot.com",
  messagingSenderId: "755916704087",
  appId: "1:755916704087:web:80ad626a2025bb4f749612"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app