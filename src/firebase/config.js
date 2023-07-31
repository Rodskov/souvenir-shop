import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAY3CTYagqEtjv7moN03330wViqRSqfk6k",
  authDomain: "pup-tanglaw-clothing-shop.firebaseapp.com",
  projectId: "pup-tanglaw-clothing-shop",
  storageBucket: "pup-tanglaw-clothing-shop.appspot.com",
  messagingSenderId: "453504706083",
  appId: "1:453504706083:web:e0e1b34b977356dcbdb396"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export const configImagesLinks = "gs://"+firebaseConfig.storageBucket+"/"
export default app