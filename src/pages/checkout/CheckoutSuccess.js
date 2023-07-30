import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./CheckoutDetails.module.scss";

const CheckoutSuccess = () => {
  return (
    <section>
      <div className='container'>
        <h2>Checkout Successful</h2>
        <p>Thank you for your purchase!</p>
        <br />
        
          <button className='--btn2'><Link className='--btn-primary5' to="/order-history">View Order Status</Link></button>
        
      </div>

    </section>
  )
}

export default CheckoutSuccess