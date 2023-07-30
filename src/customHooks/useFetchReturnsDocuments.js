import { useState, useEffect } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const useFetchReturnsDocuments = (collectionName, docId) => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const documentRef = doc(db, collectionName, docId);
        const documentSnapshot = await getDocs(documentRef);
        if (documentSnapshot.exists()) {
          setDocumentData(documentSnapshot.data());
        } else {
          setError('Document not found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, docId]);

  return { document: documentData, loading, error };
};

export default useFetchReturnsDocuments
