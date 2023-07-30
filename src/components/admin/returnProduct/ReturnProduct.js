import React, { useEffect, useState } from 'react'
import styles from "./ReturnProduct.module.scss"
import useFetchCollection from '../../../customHooks/useFetchCollection'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_ORDERS, selectOrderHistory } from '../../../redux/slice/orderSlice'
import { selectUserID } from '../../../redux/slice/authSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../loader/Loader'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import useFetchReturnsDocuments from '../../../customHooks/useFetchReturnsDocuments'

const ReturnProduct = () => {
  const {data, isLoading} = useFetchCollection("orders")
  const orders = useSelector(selectOrderHistory)
  const userID = useSelector(selectUserID)
  const {id} = useParams()
  const [productID, setProductID] = useState(null)
  const [returns, setReturns] = useState(null);
  const [loading, setLoading] = useState(true)
  const { document } = useFetchReturnsDocuments('returns', productID)


  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const documentRef = doc(db, 'returns', productID);
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
  }, [productID]);

  console.log(`This is ${productID}`)
  console.log(`This is ${id}`)

  useEffect(()=>{
    dispatch(STORE_ORDERS(data))
  }, [dispatch, data])

  const handleClick = (id, productID) =>{
    navigate(`/admin/return-product/${id}`);
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
                  const {id, orderDate, orderTime, orderAmount, shippingFee, orderStatus} = order
                  return(
                    <tr key ={id} onClick={() => handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>{orderDate} at {orderTime}</td>
                      <td>{id}</td>
                      <td>{"₱"}{orderAmount+shippingFee}</td>
                      <td>
                      <p className={
                        orderStatus === "For Return" ? styles.return :
                        orderStatus === "Request Rejected" ? styles['request-rejected'] :
                        orderStatus === "Follow-up Required" ? styles['follow-up-required'] : ''
                      }>
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