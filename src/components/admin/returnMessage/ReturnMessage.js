import React, { useEffect, useState } from 'react'
import styles from "./ReturnMessage.module.scss"
import Card from '../../card/Card'
import spinnerImg from "../../../assets/spinner.jpg"
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import { useParams } from 'react-router-dom'

const ReturnMessage = () => {
  const [returns, setReturns] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id} = useParams()
  const { document } = useFetchDocuments("returns", id)

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const returnsData = await document; // Assuming the useFetchDocuments hook returns a promise
        setReturns(returnsData);
        setLoading(false);
        console.log("Return Document:", returnsData);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReturnsData();
  }, [document]);

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
                  {document.review}
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