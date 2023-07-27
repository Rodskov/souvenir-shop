import React from 'react';
import Card from "../../card/Card"
import { Link } from 'react-router-dom';
import styles from "./ProductItem.module.scss";
import { useDispatch } from 'react-redux';
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY } from '../../../redux/slice/cartSlice';
import { FaShoppingCart } from "react-icons/fa";

const ProductItem = ({product, id, name, price, desc, imageURL}) => {
  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...")
      return shortenedText;
    }
    return text
  };

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
  <Card cardClass={styles.grid}>
    <Link to={`/product-details/${id}`}>
    <div className={styles.img}>
      <img src={imageURL} alt={name} />
    </div>

    </Link>
    <div className={styles.content}>
      <div className={styles.details}>    
        <h4>{shortenText(name, 42)}</h4>
        <p>{`₱${price}`}</p>
      </div>
      {/* <p className={styles.desc}>{shortenText(desc, 200)}</p> */}

      {/* <button className={styles.cartIcon} onClick={() => addToCart(product)}>
          <FaShoppingCart size={20} />
      </button> */}
      {/* {grid ? (
        <button className={styles.cartIcon} onClick={() => addToCart(product)}>
          <FaShoppingCart size={20} />
        </button>
      ) : (
        <div className={styles.cartButton} onClick={() => addToCart(product)}>
          Add to cart
        </div>
      )} */}
    </div>
  </Card>
  );
};

export default ProductItem;