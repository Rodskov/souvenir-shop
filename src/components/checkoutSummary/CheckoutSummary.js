import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { shipFeeValue } from "../../pages/checkout/CheckoutDetails";
import { selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from "../../redux/slice/cartSlice";
import Card from "../card/Card";
import styles from "./CheckoutSummary.module.scss"

const CheckoutSummary = ({ shippingFee }) => {
    const cartItems = useSelector(selectCartItems);
    const cartTotalAmount = useSelector(selectCartTotalAmount);
    const cartTotalQuantity = useSelector(selectCartTotalQuantity);

    // Use the shippingFee prop directly
    // const [shippingFee, setShippingFee] = useState(0); // No need for local state

    useEffect(() => {
        // Update the shippingFee state with the dynamically calculated shipping fee
        // setShippingFee(shipFeeValue());
    }, [shippingFee]); // Use the prop as a dependency, so the effect runs when shippingFee changes

    // Rest of the component code

    
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
                        <h3>{cartTotalAmount.toFixed(2)}</h3>
                        <h3>+ {shippingFee  }</h3>
                    </div>
                    {cartItems.map((item, index) => {
                        const {id, name, price, cartQuantity} = item
                        return (
                            <Card key={id} cardClass={styles.card}>
                                <h4>Product: {name}</h4>
                                <p>Quantity: {cartQuantity}</p>
                                <p>Unit Price: {price}</p>
                                <p>Set Price: {price * cartQuantity}</p>
                                <p>Shipping Fee: {shippingFee}</p>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    </div>;
};

export default CheckoutSummary