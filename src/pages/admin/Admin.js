import React from 'react';
import styles from "./Admin.module.scss";
import Navbar from '../../components/admin/navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from '../../components/admin/home/Home';
import ViewProducts from '../../components/admin/viewProducts/ViewProducts';
import AddProduct from '../../components/admin/addProduct/AddProduct';
import ReturnProduct from '../../components/admin/returnProduct/ReturnProduct';
import Orders from '../../components/admin/orders/Orders';
import OrderDetails from '../../components/admin/orderDetails/OrderDetails';
import Slideshow from '../../components/admin/slideshow/Slideshow';


const Admin = () => {
  return <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar/>
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<Home/>}/>
          <Route path="all-products" element=
          {<ViewProducts/>} />
          <Route path="add-product/:id" element=
          {<AddProduct />} />
          <Route path="orders" element=
          {<ReturnProduct />} />
          <Route path="return-product" element=
          {<Orders />} />
          <Route path="order-details/:id" element=
          {<OrderDetails />} />
          <Route path="slideshow/" element=
          {<Slideshow />}/>
        </Routes>
      </div>
    </div>;
};

export default Admin;