// import React from 'react'
// import styles from "./ReturnProduct.module.scss"

// const ReturnProduct = () => {
//   return (
//     <div>ReturnProduct</div>
//   )
// }

// export default 

import React, { useEffect } from 'react'
import styles from "./ReturnProduct.module.scss"
import useFetchCollection from '../../../customHooks/useFetchCollection'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_ORDERS, selectOrderHistory } from '../../../redux/slice/orderSlice'
import { selectUserID } from '../../../redux/slice/authSlice'
import { useNavigate } from 'react-router-dom'
import Loader from '../../loader/Loader'


const ReturnProduct = () => {
  const {data, isLoading} = useFetchCollection("orders")
  const orders = useSelector(selectOrderHistory)
  const userID = useSelector(selectUserID)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    dispatch(STORE_ORDERS(data))
  }, [dispatch, data])

  const handleClick = (id) =>{
    navigate(`/admin/order-details/${id}`);
  }


  return (
    <>
      <div className={`${styles.order}`}>
        <h2>Return Products </h2>
        <p>Open an order to <b>Return Product Status</b></p>
        <br/>

        <>
        {isLoading && <Loader/>}
        <div className={styles.table}>
          {orders.length === 0 ?(
            <p>No Order Found</p>
          ):(
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index)=>{
                  const {id, orderDate, orderTime, orderAmount, orderStatus} = order
                  return(
                    <tr key ={id} onClick={() => handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>{orderDate} at {orderTime}</td>
                      <td>{id}</td>
                      <td>{"₱"}{orderAmount}</td>
                      <td>
                        <p className= {orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
                          {orderStatus}
                        </p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        </>
      </div>
    </>
  )
}

export default ReturnProduct