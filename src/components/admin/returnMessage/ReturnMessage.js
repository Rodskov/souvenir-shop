import React, { useEffect, useState } from 'react'
import styles from "./ReturnMessage.module.scss"
import Card from '../../card/Card'
import spinnerImg from "../../../assets/spinner.jpg"
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import { useParams } from 'react-router-dom'
import { doc, documentId, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import useFetchCollection from '../../../customHooks/useFetchCollection'

const ReturnMessage = () => {
  const [returns, setReturns] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id, productID} = useParams()
  const { data } = useFetchCollection('returns')

  const imageStyleHardCoded = {
    height: 108,
    width: 192
  }

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const documentRef = doc(db, 'returns', id);
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

  useEffect(() => {
    console.log(returns?.productID);
  }, [returns]);
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
                  {returns.returns}
                  {returns.productID}
                  </p>
                  {returns.videoURLs !=0 ? (
                    returns.videoURLs.map((links, i) => {
                      return(
                        <div key={i}>
                          <video src={links} style={imageStyleHardCoded} autoPlay controls/>
                        </div>
                      )
                    })
                  ) : (
                    console.log("Return has no media files")
                  )}
                  {returns.imageURLs != 0 ? (
                    returns.imageURLs.map((links, i) => {
                      return (
                        <div key={i} style={{display: 'inline'}}>
                          <img src={links} style={imageStyleHardCoded}/>
                        </div>
                      )
                    })
                  ) : (
                    console.log("Return has no media files")
                  )
                  }
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