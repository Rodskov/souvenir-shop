import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss"
import Card from "../card/Card";
import loaderImg from "../../assets/loader.gif"
import CheckoutSummary from '../../components/checkoutSummary/CheckoutSummary';
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_CART, selectCartItems, selectCartTotalAmount } from "../../redux/slice/cartSlice";
import { selectEmail, selectUserID } from "../../redux/slice/authSlice";
import { selectShippingAddress, shippingFeeAmount } from "../../redux/slice/checkoutSlice";


const CheckoutForm = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shipFee = useSelector(shippingFeeAmount)

  const userID = useSelector(selectUserID)
  const userEmail= useSelector(selectEmail)
  const cartItems = useSelector(selectCartItems)
  const cartTotalAmount = useSelector(selectCartTotalAmount)
  const shippingAddress = useSelector(selectShippingAddress)
  

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
 
  }, [stripe]);

  const saveOrder = () => {
    const today = new Date();
    const date =  today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = {
      userID,
      userEmail,
      orderDate: date,
      orderTime: time,
      shippingFee: shipFee,
      orderAmount: cartTotalAmount,
      orderStatus: "Order Placed...",
      cartItems,
      shippingAddress,
      createdAt: Timestamp.now().toDate()
    }

    try {
      addDoc(collection(db, "orders"), orderConfig);
      dispatch(CLEAR_CART())
      toast.success("Order Saved");
      navigate("/checkout-success")
      // Navigate("/admin/all-products")
    } catch(error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null)

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPayment = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout-success",
      },
      redirect: "if_required"
    })
    .then((result) => {
        if (result.error) {
            toast.error(result.error.message)
            setMessage(result.error.message)
            return;
        }
        if (result.paymentIntent) {
            if (result.paymentIntent.status === "succeeded") {
                setIsLoading(false)
                toast.success("Payment Successful!")
                saveOrder()
            }
        }
    });

    setIsLoading(false)
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <section>
        <div className={`container ${styles.checkout}`}>
            <h2>Checkout</h2>
            <form className={styles.checkoutForm} onSubmit={handleSubmit}>
                <div>
                    <Card cardClass={styles.card}>
                        <CheckoutSummary/>
                    </Card>
                </div>
                <div>
                    <Card cardClass={`${styles.card} ${styles.pay}`}>
                        <h3>Stripe Checkout</h3>
                        <PaymentElement id={styles["payment-element"]} options={paymentElementOptions} />
                        <button disabled={isLoading || !stripe || !elements} id="submit" className={styles.button}>
                            <span id="button-text">
                            {isLoading ? (<img src={loaderImg} alt='Loading' style={{width: "20px"}} />) : "Pay now"}
                            </span>
                        </button>
                        {/* Show any error or success messages */}
                        {message && <div id={styles["payment-message"]}>{message}</div>}
                    </Card>
                </div>
            </form>
        </div>
    </section>
  );
}

export default CheckoutForm