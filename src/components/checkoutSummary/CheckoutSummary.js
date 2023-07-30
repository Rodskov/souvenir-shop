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
        <h3>Checkout Summary</h3>
        <div>
            {cartItems.length === 0 ? (
                <>
                <p>No item in your cart.</p>
                <button className="--btn">
                    <Link to="/#products">Back To Shop</Link>
                </button>
                </>
            ) : (
                <div>
                    <p>
                        <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
                    </p>
                    <div className={styles.text}>
                        <h4>Subtotal: </h4>
                        <h3>{totalAmount.toFixed(2)}</h3>
                        <div></div>
                        <p>Shipping Fee: { shipFee }</p>
                    </div>
                    {cartItems.map((item, index) => {
                        const {id, name, price, cartQuantity} = item
                        return (
                            <Card key={id} cardClass={styles.card}>
                                <h4>Product: {name}</h4>
                                <p>Quantity: {cartQuantity}</p>
                                <p>Unit Price: {price}</p>
                                <p>Set Price: {price * cartQuantity}</p>
                                
                                {/* <p>Selected Province: {selectedProvince}</p> */}
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    </div>;
};

export default CheckoutSummary;