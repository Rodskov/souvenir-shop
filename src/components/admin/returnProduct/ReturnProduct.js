import React, { useEffect, useState } from 'react';
import styles from "./ReturnProduct.module.scss";
import useFetchCollection from '../../../customHooks/useFetchCollection';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../../redux/slice/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../loader/Loader';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import useFetchDocuments from '../../../customHooks/useFetchDocuments';
import { reRenderController, selectOrderHistory } from '../../../redux/slice/orderSlice';

const ReturnProduct = () => {
  const { data, isLoading } = useFetchCollection("returns");
  const userID = useSelector(selectUserID);
  const { id } = useParams();
  const [returns, setReturns] = useState(null);
  const [loading, setLoading] = useState(true);
  const orders = useSelector(selectOrderHistory)

  // const [order, setOrder] = useState(null);
  // const { document } = useFetchDocuments("orders", id)
  
  const navigate = useNavigate();
  const allowedOrderStatus = ["For Return", "Request Rejected", "Follow-up Required"];

  // useEffect(()=>{
  //     setOrder(document)
  //     setLoading(false);
  // }, [document])

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const documentRef = doc(db, 'returns', id);
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
  }, [id]);

  const handleClick = (id, productID) => {
    navigate(`/admin/return-product/${id}`);
  }
  return (
    <>
      <div className={`${styles.order}`}>
        <h2>Return Products</h2>
        <p>Open an order to <b>Return Product Status</b></p>
        <br/>

        <>
        {isLoading && <Loader/>}
        <div className={styles.table}>
          {data.length === 0 ? (
            <p>No Return Products Found</p>
          ) : (
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
                {orders
                .filter((order) => allowedOrderStatus.includes(order.orderStatus))
                .map((order, index) => {
                  const { id, orderDate, orderTime,shippingFee, orderAmount, orderStatus } = order;
                  return (
                    <tr key={id} onClick={() => handleClick(id)}>
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        </>
      </div>
    </>
  );
}

export default ReturnProduct;
