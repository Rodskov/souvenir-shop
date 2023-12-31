import React, { useEffect, useRef, useState } from 'react'
import styles from "./ChangeReturnStatus.module.scss"
import Loader from '../../loader/Loader'
import Card from '../../card/Card'
import { Timestamp, setDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../../../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { storeReturnConfig } from '../../../redux/slice/orderSlice'
import { current } from '@reduxjs/toolkit'

const ChangeReturnStatus = ({order, id}) => {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const returnConfig = useSelector(storeReturnConfig)
  const selectionRef = useRef(null)

  useEffect(() => {
    setStatus("")
  }, [])

  if(selectionRef.current){
    console.log(selectionRef.current.value)
  }
  
  const editOrder = (e, id) => {
    e.preventDefault()
    if(selectionRef.current.value !== ""){
      setIsLoading(true)

      const orderConfig = {
        userID: order.userID,
        userEmail: order.userEmail,
        orderDate: order.orderDate,
        orderTime: order.orderTime,
        orderAmount: order.orderAmount,
        orderStatus: status,
        cartItems: order.cartItems,
        shippingAddress: order.shippingAddress,
        shippingFee: order.shippingFee,
        createdAt: order.createdAt,
        editedAt: Timestamp.now().toDate(),
      }
  
      try {
        
        setDoc(doc(db, "orders", id), orderConfig);
        navigate("/admin/orders");
        setDoc(doc(db, "returns", id), returnConfig, { merge:true });
  
        toast.success("Return Status Changed");
        setIsLoading(false);
  
        setTimeout(() => {navigate("/admin/return-product")}, 100);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
    else{
      toast.error("Please select a Return Status")
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.status}>
      <Card cardClass={styles.card}>
        <h4>Update Return Status</h4>
        <form onSubmit={(e)=> editOrder(e, id)}>
          <span>
            <select ref={selectionRef} value = {status} onChange={(e)=> setStatus(e.target.value)}>
              <option value= "" disabled>--Choose Status--</option>
              <option value= "For Return">For Return</option>
              <option value= "Request Rejected">Request Rejected</option>
              <option value= "Follow-up Required">Follow-up Required</option>
            </select>
          </span>
          <span>
            <button type='submit' className='--btn --btn-primary'>Update Status</button>
          </span>
        </form>
      </Card>
    </div>
    </>
  )
}

export default ChangeReturnStatus