import { useState, useEffect } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const useFetchReturnsDocuments = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
  
      // Map through the query snapshot to get the document data and document IDs
      const documents = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });
  
      return documents;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

export default useFetchReturnsDocuments;
