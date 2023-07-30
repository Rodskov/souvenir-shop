import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_BY_CATEGORY, FILTER_BY_PRICE} from '../../../redux/slice/filterSlice';
import { selectMaxPrice, selectMinPrice, selectProducts } from '../../../redux/slice/productSlice';
import styles from "./ProductFilter.module.scss"

const ProductFilter = () => {
  const [category, setCategory] = useState("All")
  const [price, setPrice] = useState(3000)
  const products = useSelector(selectProducts)
  const minPrice = useSelector(selectMinPrice)
  const maxPrice = useSelector(selectMaxPrice)

  const dispatch = useDispatch()

  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ]


  useEffect(() => {
    dispatch(FILTER_BY_PRICE({products, price}))
  }, [dispatch, products, price])

  const filterProducts = (cat) => {
    setCategory(cat)
    dispatch(FILTER_BY_CATEGORY({products, category: cat}
    ));
  };

  

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button 
            key={index} 
            type="button" 
            className={`${category}` === cat ? `${styles.active}` : null}
            onClick={() => filterProducts(cat)}
            >
              &#8250; {cat}
            </button>
          )
        })}
      </div>
      
      <h4>Price</h4>
      <p>{`₱${price}`}</p>
      <div className={styles.price}>
        <input 
        type="range" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        min={minPrice} 
        max={maxPrice}/>
      </div>
      <br/>
     
    </div>
  );
};

export default ProductFilter;