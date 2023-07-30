import React, { useEffect, useState } from 'react'
import styles from './ReturnProductDetails.module.scss'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import spinnerImg from "../../../assets/spinner.jpg"
import ChangeReturnStatus from '../changeReturnStatus/ChangeReturnStatus'
import ReturnMessage from '../returnMessage/ReturnMessage'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'

const fetchReturn = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "returns"));
        const returnData = querySnapshot.docs.map((doc) => doc.data());
        // console.log(returnData);
        return returnData;
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    };

const ReturnProductDetails = () => {
  const [order, setOrder] = useState(null)
  const {id} = useParams()
  const { document: ordersDocument } = useFetchDocuments("orders", id)
  
  const [loading, setLoading] = useState(true);
  const [returnData, setReturnData] = useState("")
  const [newReturn, setNewReturn] = useState("")

  useEffect(()=>{
    // console.log("Order Document:", ordersDocument);
      setOrder(ordersDocument)
      setLoading(false);
  }, [ordersDocument])

  // const { document: returnsDocument } = useFetchDocuments("returns", id)

  // useEffect(() => {
  //   // console.log("Return Document:", returnsDocument);
  //   setOrder(returnsDocument);
  //   setLoading(false);
  // }, [returnsDocument]);

  const addWishlist = (e) =>{
    e.preventDefault()

    const today = new Date();
    const date =  today.toDateString();

    const returnConfig = {
        return: newReturn,
        returnDate: date,
        createdAt: Timestamp.now().toDate()
      }
  
      console.log(returnConfig);

    setNewReturn("");
  };
  
    useEffect(() => {
        fetchReturn().then((returnData) => {
          setReturnData(returnData);
          setLoading(false);
        });
      }, []);
        

return (
  <>
      <div className={`${styles.table}`}>
          <h2>Return Order Details</h2>
          <div>
              <Link to ="/admin/return-product">&larr; Back To Orders</Link>
          </div>
      
      <br />
      {loading ? ( // Display a loading spinner while data is being fetched
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : order === null ? ( // Check if order is still null after loading
          <p>No order data found.</p>
        ) : (
          <>
          <p>
              <b>Order ID:</b> {order.id}
          </p>
          <p>
              <b>Order Amount:</b> ₱{order.orderAmount+order.shippingFee}
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
                              <td>₱{price}</td>
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
      <ReturnMessage order={order} id={id}/>
      <ChangeReturnStatus order={order} id={id}/>
      </div>

  </>
)
}

export default ReturnProductDetails