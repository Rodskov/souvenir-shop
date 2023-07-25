import React, { useEffect, useState } from 'react';
import styles from "./ProductList.module.scss";
// import {BsFillGridFill} from "react-icons/bs";
// import {FaListAlt} from "react-icons/fa";
import Search from '../../search/Search';
import ProductItem from '../productItem/ProductItem';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_BY_SEARCH, selectFilteredProducts, SORT_PRODUCTS } from '../../../redux/slice/filterSlice';
import Pagination from '../../pagination/Pagination';


const ProductList = ({products}) => {
  console.log(products);
  // const [grid, setGrid] = useState(true);   *For grid and list*
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const filteredProducts = useSelector(selectFilteredProducts)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(2);
  // Get Current Products
  const indexofLastProduct = currentPage * productsPerPage;
  const indexofFirstProduct = indexofLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexofFirstProduct, indexofLastProduct)

  const dispatch = useDispatch();

  useEffect(() =>{
    dispatch(SORT_PRODUCTS({products, sort}))
  }, [dispatch, products, sort])

  useEffect(() =>{
    dispatch(FILTER_BY_SEARCH({products, search}))
  }, [dispatch, products, search])

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>

        {/* GRID & LIST */}
        {/* <div className={styles.icons}>
          <BsFillGridFill size={22} color='orangered'
          onClick={() => setGrid(true)}/>

          <FaListAlt size={24} color='#0066d4'
          onClick={() => setGrid(false)}/>

          <p>
            <b>{filteredProducts.length}</b> Products found
          </p>
        </div> */}

        {/* Search Icon */}
        <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        {/* Sort Products */}
        <div className={styles.sort}>
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <>
          {currentProducts.map((product) => {
            return (
              <div key={product.id}>
                <ProductItem {...product} grid={true} product={product} />
              </div>
            )
          })}
          </>
        )}
      </div>
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
    </div>
  );
};

export default ProductList;