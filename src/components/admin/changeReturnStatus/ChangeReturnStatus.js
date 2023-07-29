import React, { useState } from 'react'
import styles from "./ChangeReturnStatus.module.scss"
import Loader from '../../loader/Loader'
import Card from '../../card/Card'
import { Timestamp, setDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../../../firebase/config'
import { useNavigate } from 'react-router-dom'

const ChangeReturnStatus = ({order, id}) => {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
 
  const editOrder = (e, id) => {
    e.preventDefault()
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
      createdAt: order.createdAt,
      editedAt: Timestamp.now().toDate(),
    }

    try {
      setDoc(doc(db, "orders", id), orderConfig);
     
      toast.success("Order Status Changed");
      setIsLoading(false)
      navigate("/admin/orders")
      
    } catch(error) {
      setIsLoading(false);
      toast.error(error.message);
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
            <select value = {status} onChange={(e)=> setStatus(e.target.value)}>
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