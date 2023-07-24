import { useEffect, useState } from 'react';
import styles from "./ViewProducts.module.scss";
import { toast } from 'react-toastify';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, storage } from '../../../firebase/config';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from '../../loader/Loader';
import { deleteObject, ref } from 'firebase/storage';
import Notiflix from 'notiflix';
import { useDispatch, useSelector } from 'react-redux';
import { STORE_PRODUCTS, selectProducts } from '../../../redux/slice/productSlice';
import useFetchCollection from '../../../customHooks/useFetchCollection';
import { FILTER_BY_SEARCH, selectFilteredProducts } from '../../../redux/slice/filterSlice';
import Search from '../../search/Search';
import Pagination from '../../pagination/Pagination';


const ViewProducts = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useFetchCollection("products");
  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3);
  // Get Current Products
  const indexofLastProduct = currentPage * productsPerPage;
  const indexofFirstProduct = indexofLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexofFirstProduct, indexofLastProduct)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
  }, [dispatch, data]);

  useEffect(() =>{
    dispatch(FILTER_BY_SEARCH({products, search}))
  }, [dispatch, products, search])

  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      'Delete Product?',
      'You are about to delete this product',
      'Delete',
      'Cancel',
      function okCb() {
        deleteProduct(id, imageURL)
      },
      function cancelCb() {
        console.log("Delete Cancelled.")
      },
      {
        width: '320px',
        borderRadius: '8px',
        titleColor: 'orangered',
        okButtonBackground: 'orangered',
        cssAnimationStyle:'zoom'
        // You can adjust design here
      },
    );
  };

  const deleteProduct = async(id, imageURL) => {
    try {
      await deleteDoc(doc(db, "products", id));

      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success("Product deleted successfully.");

    } catch(error) {
      toast.error(error.message);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
    <div className={styles.table}>
      <h2>All Products</h2>
      <div className={styles.search}>
        <p>
          <b>{filteredProducts.length}</b> products found
        </p>
        <Search value={search} onChange={(e)=> setSearch(e.target.value)}/>
      </div>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentProducts.map((product, index) => {
            const {id, name, price, imageURL, category} = product;
            return (
              
              <tr key={id}>
                <td>
                  {index + 1}
                </td>
                <td>
                  <img src={imageURL} alt={name} style={{width: "100px"}}/>
                </td>
                <td>
                  {name}
                </td>
                <td>
                  {category}
                </td>
                <td>
                  {`₱${price}`}
                </td>
                <td className={styles.icons}>
                  <Link to={`/admin/add-product/${id}`}>
                  <FaEdit size={20} color='green'/>
                  </Link>
                  &nbsp;
                  <FaTrashAlt size={18} color='red'
                  onClick={() => confirmDelete(id, imageURL)}/>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      )}
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
    </div>
      
    </>
  );
};

export default ViewProducts;