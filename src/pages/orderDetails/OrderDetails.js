import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetchDocuments from '../../customHooks/useFetchDocuments'
import styles from "./OrderDetails.module.scss"
import spinnerImg from "../../assets/spinner.jpg"

const OrderDetails = () => {
    const [order, setOrder] = useState(null)
    const {id} = useParams()
    const { document } = useFetchDocuments("orders", id)
    useEffect(()=>{
        setOrder(document)
    }, [document])


  return (
    <section>
        <div className={`container ${styles.table}`}>
            <h2>Order Details</h2>
            <div>
                <Link to ="/order-history">&larr; Back To Orders</Link>
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
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {order.cartItems.map((cart, index)=>{
                        const{id, name, price, imageURL, cartQuantity} = cart
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
                                <td>{price}</td>
                                <td>{cartQuantity}</td>
                                <td>
                                    {(price * cartQuantity).toFixed(2)}
                                </td>
                                <td className={styles.icons}> 
                                    <div className={styles.actionButtons}>
                                        <button className={`${styles.reviewButton} --btn --btn-primary`}>
                                            <Link to={`/review-product/${order.id}`}>Review Product</Link>
                                        </button>
                                        <button className={`${styles.returnButton} --btn --btn-danger`}>
                                            <Link to={`/return-product/${order.id}`}>Return Product</Link>
                                        </button>
                                        <button className={`${styles.trackButton} --btn --btn-primary`}>
                                        <a
                                            href="http://www.jtexpress.ph/index/query/gzquery.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Track Order
                                        </a>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </>
        )}
        </div>

    </section>
  )
}

export default OrderDetails