import React, { useEffect, useState } from 'react'
import styles from "./ReturnProduct.module.scss"
import { useSelector } from 'react-redux'
import { selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { Link, useParams } from 'react-router-dom'
import Card from '../card/Card'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import useFetchDocuments from '../../customHooks/useFetchDocuments'
import spinnerImg from "../../assets/spinner.jpg"

const ReturnProduct = () => {
  const [returns, setReturns] = useState("");
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderRef = doc(db, 'orders', id);
        const orderSnapshot = await getDoc(orderRef);
        if (orderSnapshot.exists()) {
          setOrder(orderSnapshot.data());
        } else {
          // Handle case where the order does not exist
          console.log("Order does not exist.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderData();
  }, [id]);

  useEffect(() => {
    // Assuming you have a 'returns' collection in Firestore and 'id' is the document ID
    const fetchReturnsData = async () => {
      try {
        const returnsRef = doc(db, 'returns', id);
        const returnsSnapshot = await getDoc(returnsRef);
        if (returnsSnapshot.exists()) {
          setReturns(returnsSnapshot.data().returns || "");
        } else {
          // Handle case where the returns document does not exist
          console.log("Returns document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching returns:", error);
      }
    };

    fetchReturnsData();
  }, [id]);

  const handleImages = async (e) => {
    const file = e.target.files
    console.log(file)
  }

  const returnProduct = async (e) => {
    e.preventDefault();
    const today = new Date();
    const date = today.toDateString();

    const returnConfig = {
      userID,
      userName,
      id: id,
      returns,
      returnDate: date,
      createdAt: Timestamp.now().toDate()
    };

  
    try {
      const newItemRef = doc(db, "returns", id);
      await setDoc(newItemRef, returnConfig, { merge: true });
      toast.success("Return Form Submitted");
      setReturns("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className={`container ${styles.review}`}>
      
        <h2>Product Return Form</h2>
        <Link to={`/order-details/${id}`}>
        &larr; Back to Order Details
      </Link>
        <Card cardClass={styles.card_img}>
        {order === null ? (
          <img src={spinnerImg} alt='Loading...' style={{width: "60px"}}/>
        ):(
          <>
            <p className={styles.prod_name}><b>Product Name: </b> {order.cartItems[0].name}</p>
          <img src={order.cartItems[0].imageURL} alt={order.cartItems[0].name} />
        </>
        )}
        </Card>
        
        <Card cardClass={styles.card}>
          <form onSubmit={(e)=> returnProduct(e)}>
            <label>Return Details:</label>
            <textarea value= {returns} required onChange= {(e)=> setReturns(e.target.value)}cols="30" rows="10"></textarea>
            <input type='file' onChange={(e) => handleImages(e)} accept='image/*, video/*' multiple/>
            <button type='submit' className='--btn --btn-primary'>Submit Request</button>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default ReturnProduct