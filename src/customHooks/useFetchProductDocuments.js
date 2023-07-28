import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { toast } from "react-toastify";


const useFetchProductDocuments = (productID) => {
  const [productDocument, setProductDocument] = useState(null);

  const getProductDocument = async () => {
    try {
      const docRef = doc(db, "products", productID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProductDocument({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        toast.error("Product Document not found!");
      }
    } catch (error) {
      toast.error("Error fetching product document!");
    }
  };

  useEffect(() => {
    getProductDocument();
  }, []);

  return { productDocument };
};

export default useFetchProductDocuments;
