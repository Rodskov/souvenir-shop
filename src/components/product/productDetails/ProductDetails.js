import styles from "./ProductDetails.module.scss"
import { async } from '@firebase/util';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {db} from "../../../firebase/config"
import loaderImg from "../../../assets/loader.gif"


const ProductDetails = () => {
  const {id} = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    getProduct()
  }, [])

  const getProduct = async () => {

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const obj = {
        id: id,
        ...docSnap.data()
      }
      setProduct(obj)
    } else {
      toast.error("Product not found!")
    }
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
                <b>Brand</b> {product.brand}
              </p>

              <div className={styles.count}>
                <button className="--btn">-</button>
                <p>
                  <b>1</b>
                </p>
                <button className="--btn">+</button>
              </div>
              <button className="--btn --btn-danger">ADD TO CART</button>
            </div>
          </div>
        </>
      )}
    </div>
  </section>
  );
};

export default ProductDetails;