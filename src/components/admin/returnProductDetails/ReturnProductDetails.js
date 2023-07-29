import React, { useEffect, useState } from 'react'
import styles from './ReturnProductDetails.module.scss'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import spinnerImg from "../../../assets/spinner.jpg"
import ChangeReturnStatus from '../changeReturnStatus/ChangeReturnStatus'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'

const fetchReturn = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "returns"));
        const returnData = querySnapshot.docs.map((doc) => doc.data());
        console.log(returnData);
        return returnData;
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    };

const ReturnProductDetails = () => {
  const [order, setOrder] = useState(null)
  const {id} = useParams()
  const { document } = useFetchDocuments("orders", id)
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState("")
  const [newReturn, setNewReturn] = useState("")

//   useEffect(()=>{
//       setOrder(document)
//   }, [document])

//   const addWishlist = (e) =>{
//     e.preventDefault()

//     const today = new Date();
//     const date =  today.toDateString();

//     const returnConfig = {
//         return: newReturn,
//         returnDate: date,
//         createdAt: Timestamp.now().toDate()
//       }
  
//     try {
//         addDoc(collection(db, "returns"), returnConfig);
//         toast.success("Return Request Submitted");
//         setNewReturn("");
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };
  
//     useEffect(() => {
//         fetchReturn().then((returnData) => {
//           setReturnData(returnData);
//           setLoading(false);
//         });
//       }, []);
        

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
              <b>Order Amount:</b> {order.orderAmount}
          </p>
          <p>
              <b>Order Status:</b> {order.orderStatus}
          </p>
          <p>
              <b>Shipping Address</b> 
              <br/> 
              Address: {order.shippingAddress.line1}, {order.shippingAddress.line2}, {order.shippingAddress.city}
              <br/> 
              State: {order.shippingAddress.state}
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
      <ChangeReturnStatus order={order} id={id}/>
      </div>

  </>
)
}

export default ReturnProductDetails