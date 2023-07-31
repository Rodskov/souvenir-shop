import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from "../../redux/slice/cartSlice";
import Card from "../card/Card";
import { shipFeeValue } from "../../pages/checkout/CheckoutDetails";
import styles from "./CheckoutSummary.module.scss"
import { toast } from "react-toastify";
import { shippingFeeAmount } from "../../redux/slice/checkoutSlice";


const CheckoutSummary = ( ) => {
    const cartItems = useSelector(selectCartItems);
    const shipFee = useSelector(shippingFeeAmount)
    const cartTotalAmount = useSelector(selectCartTotalAmount);
    const cartTotalQuantity = useSelector(selectCartTotalQuantity);

    const [totalAmount, setTotalAmount] = useState(0)

    
    console.log(shipFee)
    useEffect(() => {
        setTotalAmount(cartTotalAmount+shipFee)
    }, [shipFee])
    
    return <div>
        <h3 className={styles.title}>Checkout Summary</h3>
            {cartItems.map((item, index) => {
                const {id, name, price, cartQuantity, size, color } = item
                return (
                    <div key={id} className={styles.checkout_prodList}>
                        <h4>Product: <b className={styles.title}>{name}</b></h4>
                        <p><b>Variation: </b>{size}-{color}</p>
                        <p><b>Quantity: </b>{cartQuantity}</p>
                        <p><b>Unit Price: </b>{price}</p>
                        <p><b>Set Price: </b>{price * cartQuantity}</p>
                        
                        {/* <p>Selected Province: {selectedProvince}</p> */}
                    </div>
                )
            })}
                
            <Card cardClass={styles.card}>
            <div>
                {cartItems.length === 0 ? (
                    <>
                    <p>No item in your cart.</p>
                    <button className="--btn">
                        <Link to="/#products">Back To Shop</Link>
                    </button>
                    </>
                ) : (
                    <div className={styles.subtotal}>
                        <p className={styles.ship}><b>Shipping Fee: </b>{ shipFee }</p>
                        <p className={styles.cartItems}>
                            <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
                        </p>
                        <div className={styles.text}>
                            <h4 className={styles.subtotal1}>Total: </h4>
                            <h3><b>{totalAmount.toFixed(2)}</b></h3>
                            <div></div>
                            
                        </div>
                    </div>
                )}
            </div>
            </Card>
    </div>;
};

export default CheckoutSummary;