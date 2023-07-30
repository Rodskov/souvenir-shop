import React from 'react';
import styles from "./Navbar.module.scss";
import { useSelector } from 'react-redux';
import { selectUserName } from '../../../redux/slice/authSlice';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { BiSolidObjectsHorizontalLeft, BiSolidBox } from "react-icons/bi";
import { BsFillBox2Fill, BsInboxesFill } from "react-icons/bs";
import { RiBarChartBoxFill, RiSlideshow2Line } from "react-icons/ri";
import { TbTruckReturn } from "react-icons/tb";
import { FaClipboardList } from "react-icons/fa";

const activeLink = ({isActive})=> (isActive? `${styles.active}`: "")

const Navbar = () => {
  const userName = useSelector(selectUserName)
  return (
  <div className={styles.navbar}>
      <div className={styles.user}>
        <FaUserCircle size={40} color="#000000"/>
        <h4>{userName}</h4>
      </div>
    <nav>
      <ul>
        <li>
          <NavLink to="/admin/home" className=
            {activeLink}>
            <RiBarChartBoxFill/> DashBoard
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/all-products" className=
            {activeLink}>
            <BiSolidBox/> All Products
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/add-product/ADD" className=
            {activeLink}>
            <BsInboxesFill/> Add Product
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/return-product" className=
            {activeLink}>
            <TbTruckReturn/> Return Product
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/orders" className=
            {activeLink}>
            <FaClipboardList/> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/slideshow" className=
          {activeLink}>
            <RiSlideshow2Line/> Slideshow
          </NavLink>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Navbar;