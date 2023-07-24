import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState } from "react";


export function ExportData(){
  const [document, setDocument] = useState([])
  const dataBase = getFirestore();
  // Make collection Reference
  const collectionRef = doc(dataBase, "slideshow", "slideshow");


    function fetchDocument(e){
      e.preventDefault();
      getDoc(collectionRef).then((snapshot) => {
        setDocument(snapshot.data().data)
      })
  }
  fetchDocument()
  return document
}