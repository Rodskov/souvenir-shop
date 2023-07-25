import React, { useEffect, useState } from 'react'
import styles from "./ReturnProduct.module.scss"
import { useSelector } from 'react-redux'
import { selectProducts } from '../../redux/slice/productSlice'
import { selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { useParams } from 'react-router-dom'
import Card from '../card/Card'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/config'
import useFetchDocuments from '../../customHooks/useFetchDocuments'
import spinnerImg from "../../assets/spinner.jpg"


const ReturnProduct = () => {
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState("")
  const [product, setProduct] = useState(null)
  const {id} = useParams()
  const { document } = useFetchDocuments("products", id)
  const products = useSelector(selectProducts)
  const userID = useSelector(selectUserID)
  const userName = useSelector(selectUserName)

  useEffect(() => {
    setProduct(document)
  }, [document])
  

  const submitReview = (e) =>{
    e.preventDefault()
    const today = new Date();
    const date =  today.toDateString();

    const reviewConfig = {
      userID,
      userName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate()
    }

    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Return Form Submitted");
      setRate(0)
      setReview("")
    } catch(error) {
      toast.error(error.message);
    }
  }

  return (
    <section>
      <div className={`container ${styles.review}`}>
        <h2>Product Return Form</h2>
        {product === null ? (
          <img src={spinnerImg} alt='Loading...' style={{width: "60px"}}/>
        ):(
          <>
            <p><b>Product Name </b> {product.name}</p>
          <img src={product.imageURL} alt={product.name} style={{width:"250px"}} />
        </>
        )}
        
        <Card cardClass={styles.card}>
          <form onSubmit={(e)=> submitReview(e)}>
            <label>Return Details:</label>
            <textarea value= {review} required onChange= {(e)=> setReview(e.target.value)}cols="30" rows="10"></textarea>
            <button type='submit' className='--btn --btn-primary'>Submit Request</button>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default ReturnProduct