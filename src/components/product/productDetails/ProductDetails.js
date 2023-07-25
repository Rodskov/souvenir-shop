import styles from "./ProductDetails.module.scss"
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import loaderImg from "../../../assets/loader.gif"
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY, DECREASE_CART, selectCartItems } from "../../../redux/slice/cartSlice";
import useFetchDocuments from "../../../customHooks/useFetchDocuments";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import Card from "../../card/Card";
import StarsRating from "react-star-rate";

const ProductDetails = () => {
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { document } = useFetchDocuments("products", id)
  const { data } = useFetchCollection("reviews")
  const filteredReviews = data.filter((review)=> review.productID === id)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const cart = cartItems.find((cart) => cart.id === id);
  const isCartAdded = cartItems.findIndex((cart) => {
    return cart.id === id
  })

  const colorRadio = (e) => {
    console.log(e.target.value)
    setSelectedColor(e.target.value)
  }

  const sizeRadio = (e) => {
    console.log(e.target.value)
    setSelectedSize(e.target.value)
  }

  useEffect(() => {
    setProduct(document)
  }, [document]);

  const addToCart = (product, selectedSize, selectedColor) => {
    dispatch(ADD_TO_CART({...product,
      size: selectedSize,
      color: selectedColor,
    }));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
  <section>
    <div className={`container ${styles.product}`}>
      <h2>Product Details</h2>
      <div>
        <Link to='/#products'>&larr; Back To Products</Link>
      </div>
      {product === null ? (
        <img 
        src={loaderImg} 
        alt="Loading" 
        style={{width: "50px"}} 
        className="--center-all"
        />
      ) : (
        <>
          <div className={styles.details}>
            <div className={styles.img}>
              <img src={product.imageURL} alt={product.name} />
            </div>
            <div className={styles.content}>
              <h3>{product.name}</h3>
              <p className={styles.price}>{`₱${product.price}`}</p>
              <p>{product.desc}</p>
              <p>
                <b>SKU</b> {product.id}
              </p>
              <p>
                <b>Colors</b> {product.color.map((data, i) => {
                  return(
                    <div key={i}>
                      <input type="radio" name="color" value={data} onChange={colorRadio}></input>
                      <label>{data}</label> 
                    </div>
                  )
                })}
              </p>
              <p>
                <b>Size</b> {product.size.map((data, i) => {
                  return(
                    <div key={i}>
                      {console.log(data)}
                      <input type="radio" name="size" value={data} onChange={sizeRadio}></input>
                      <label>{data}</label> 
                    </div>
                  )
                })}
                {product.brand}
              </p>


              <div className={styles.count}>
                {isCartAdded < 0 ? null : (
                  <>
                  <button className="--btn" onClick={() => decreaseCart(product)}>-</button>
                  <p>
                    <b>{cart.cartQuantity}</b>
                  </p>
                  <button className="--btn" onClick={() => addToCart(product, selectedSize, selectedColor)}>+</button>
                  </>
                )}
                
              </div>
              <button className="--btn --btn-danger" onClick={() => addToCart(product, selectedSize, selectedColor)}>ADD TO CART</button>
            </div>
          </div>
        </>
      )}
      <Card cardClass={styles.card}>
        <h3>Product Reviews</h3>
        <div>
          {filteredReviews.length === 0 ? (
            <p>There are no reviews for this product yet.</p>
          ):(
            <>
            {filteredReviews.map((reviewItem, index)=>{
              const {rate, review, reviewDate, userName} = reviewItem
              return(
                <div key={index} className={styles.review}>
                  <StarsRating value={rate}/>
                  <p>{review}</p>
                  <span>
                    <b>{reviewDate}</b>
                  </span>
                  <br/>
                  <span>
                    <b>By: {userName}</b>
                  </span>
                </div>
              )
            })}
            </>
          )}
        </div>
      </Card>
    </div>
  </section>
  );
};

export default ProductDetails;