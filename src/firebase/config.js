import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export const firebaseConfig = {
  apiKey: "AIzaSyBopD80NdafSAzhEZtsF-srORB57OzDl_M",
  authDomain: "pup-souvenir-shop.firebaseapp.com",
  projectId: "pup-souvenir-shop",
  storageBucket: "pup-souvenir-shop.appspot.com",
  messagingSenderId: "568131932661",
  appId: "1:568131932661:web:b3c19370c3ccfa874dd0bc"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app