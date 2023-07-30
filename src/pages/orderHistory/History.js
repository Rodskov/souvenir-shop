import React, { useEffect } from 'react'
import useFetchCollection from "../../customHooks/useFetchCollection"
import styles from "./History.module.scss"
import { useDispatch, useSelector } from 'react-redux'
import { STORE_ORDERS, selectOrderHistory, selectTotalOrderAmount } from '../../redux/slice/orderSlice'
import { selectUserID } from '../../redux/slice/authSlice'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'


const History = () => {
  const {data, isLoading} = useFetchCollection("orders")
  const orders = useSelector(selectOrderHistory)
  const userID = useSelector(selectUserID)
  const totalAmount = useSelector(selectTotalOrderAmount)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    dispatch(STORE_ORDERS(data))
  }, [dispatch, data])

  const handleClick = (id) =>{
    navigate(`/order-details/${id}`);
  }

  const filteredOrders = orders.filter((order) => order.userID ===  userID)

  return (

    <section>
      <div className={`container ${styles.order}`}>
        <h2>Order History</h2>
        <p>Open an order to do a <b>Product Review</b> or <b>Return Process</b></p>
        <br/>

        <>
        {isLoading && <Loader/>}
        <div className={styles.table}>
          {filteredOrders.length === 0 ?(
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
                {filteredOrders.map((order, index)=>{
                  const {id, orderDate, orderTime, orderAmount, shippingFee, orderStatus} = order
                  return(
                    <tr key ={id} onClick={() => handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>{orderDate} at {orderTime}</td>
                      <td>{id}</td>
                      <td>{"₱"}{orderAmount+shippingFee}</td>
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
    </section>
  )
}

export default History