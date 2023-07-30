import React, { useEffect, useState } from 'react'
import styles from "./ReturnMessage.module.scss"
import Card from '../../card/Card'
import spinnerImg from "../../../assets/spinner.jpg"
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import { useParams } from 'react-router-dom'
import { doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import useFetchCollection from '../../../customHooks/useFetchCollection'

const ReturnMessage = () => {
  const [returns, setReturns] = useState()
  const [order, setOrder] = useState()
  const [loading, setLoading] = useState()
  const {id} = useParams()
  const { data } = useFetchCollection("returns")
  const { document } = useFetchDocuments('order', id);

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const documentRef = doc(db, "returns", "xovdwMAXSCiqkJNCYQL8");
        const snapshot = await getDoc(documentRef);
        console.log(snapshot.data());
        setReturns(snapshot.data());
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReturnsData();
  }, []);

//   useEffect(() => {
//       console.log(returns)
//     const fetchReturnsData = async () => {
//       try {
//         const returnsData = await document; // Assuming the useFetchDocuments hook returns a promise
//         console.log(returnsData)
//         setReturns(returnsData);
//         setLoading(false);
//         console.log("Return Document:", returnsData);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchReturnsData();
//   }, [returns]);

//   const { document: ordersDocument } = useFetchDocuments("orders", id)
  
//   useEffect(()=>{
//     console.log("Order Document:", ordersDocument);
//       setOrder(ordersDocument)
//       setLoading(false);
//   }, [ordersDocument])

//   const { document: returnsDocument } = useFetchDocuments("returns", id)

//   useEffect(() => {
//     console.log("Return Document:", returnsDocument);
//     setOrder(returnsDocument);
//     setLoading(false);
//   }, [returnsDocument]);

    return (
        <>
          {loading ? (
            <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
          ) : returns === null ? (
            <p>No order data found.</p>
          ) : (
            <div className={styles.status}>
              {returns ? (
                <Card cardClass={styles.card}>
                  <h4>Reason for Return Request:</h4>
                  <p>
                  {returns.review}
                  </p>
                </Card>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          )}
        </>
      )
    }

export default ReturnMessage