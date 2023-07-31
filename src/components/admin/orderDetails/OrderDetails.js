import React, { useEffect, useState } from 'react'
import styles from './OrderDetails.module.scss'
import { Link, useParams } from 'react-router-dom'
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import spinnerImg from "../../../assets/spinner.jpg"
import ChangeOrderStatus from '../changeOrderStatus/ChangeOrderStatus'

const OrderDetails = () => {
  const [order, setOrder] = useState(null)
  const {id} = useParams()
  const { document } = useFetchDocuments("orders", id)
  useEffect(()=>{
      setOrder(document)
  }, [document])

  const isOrderStatusRestricted = () => {
    const restrictedStatuses = ["For Return", "Request Rejected", "Follow-up Required"];
    return restrictedStatuses.includes(order?.orderStatus);
  };

return (
  <>
      <div className={`${styles.table}`}>
          <h2>Customer Order Details</h2>
          <div>
              <Link to ="/admin/orders">&larr; Back To Orders</Link>
          </div>
      
      <br />
      {order === null ? (
          <img src={spinnerImg} alt='Loading...' style={{width: "50px"}} />
      ): (
          <>
          <p>
              <b>Order ID:</b> {order.id}
          </p>
          <p>
              <b>Order Amount:</b> {order.orderAmount + order.shippingFee}
          </p>
          <p>
              <b>Order Status:</b> {order.orderStatus}
          </p>
          <p>
              {/* <b>Shipping Address</b> 
              <br/>  */}
              <b>Address: </b>{order.shippingAddress.line1}, {order.shippingAddress.line2}, {order.shippingAddress.city}
              {/* <br/>  */}
              {/* <b>State: </b>{order.shippingAddress.state} */}
          </p>
          <br/>
          <table>
              <thead>
                  <tr>
                      <th>S/N</th>
                      <th>Product</th>
                      <th>Variation</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      
                  </tr>
              </thead>
              <tbody>
                  {order.cartItems.map((cart, index)=>{
                      const{id, name, price, imageURL, cartQuantity, size, color} = cart
                      return(
                          <tr key ={id}>
                              <td>
                                  <b>{index + 1}</b>
                              </td>
                              <td>
                                  <p>
                                      <b>{name}</b>
                                  </p>
                                  <img src = {imageURL} alt={name} style={{width: "100px"}} />
                              </td>
                              <td>{size}-{color}</td>
                              <td>{price}</td>
                              <td>{cartQuantity}</td>
                              <td>
                                  {(price * cartQuantity).toFixed(2)}
                              </td>
                          </tr>
                      )
                  })}
              </tbody>
          </table>
          </>
      )}
      {isOrderStatusRestricted() ? (
              <p className={styles.orderReturnStatus}>This product is in the process of return.</p>
            ) : (
              <ChangeOrderStatus order={order} id={id} />
        )}
      </div>

  </>
)
}

export default OrderDetails