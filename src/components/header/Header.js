import { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { mainLogo } from '../../assets'
import {FaShoppingCart, FaTimes, FaUserCircle} from "react-icons/fa"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { auth } from '../../firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '../../redux/slice/authSlice'
import ShowOnLogin, { ShowOnLogout } from '../hiddenLink/hiddenLink'
import AdminOnlyRoute, { AdminOnlyLink } from '../adminOnlyRoute/AdminOnlyRoute'
import { CALCULATE_TOTAL_QUANTITY, selectCartTotalQuantity } from '../../redux/slice/cartSlice'


const logo =(
        <div className={styles.logo}>
          <Link to = '/'>
            <img src={mainLogo} className='headerImage' alt='headerImage'></img>
            
          </Link>
        </div>
)



const activeLink = ({isActive})=> (isActive? `${styles.active}`: "")
const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [displayName, setdisplayName] = useState("")
  const [scrollPage, setScrollPage] = useState(false)
  const [isMediaScreen, setIsMediaScreen] = useState(false); // Add this state variable
  const cartTotalQuantity = useSelector(selectCartTotalQuantity)

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY())
  }, [])

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  //Monitor currently sign in user
  useEffect(() =>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        
        if(user.displayName == null){
          //Remove after the @ symbol
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          //Uppercase first letter
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1)
          setdisplayName(uName)

        } else{
          setdisplayName(user.displayName)
        }
        
    

        dispatch(SET_ACTIVE_USER({
          email: user.email, 
          username: user.displayName ? user.displayName : displayName,
          userID: user.uid,
        }))
      } else {
        setdisplayName("")
        dispatch(REMOVE_ACTIVE_USER())
      }
    });
  }, [dispatch, displayName])

  const toggleMenu = () =>{
    setShowMenu (!showMenu)
    setIsMediaScreen(!isMediaScreen); // Toggle the state for media screen
  };

  const hideMenu = () =>{
    setShowMenu(false)
    setIsMediaScreen(false);
  };

  const logoutUser = () =>{
    signOut(auth).then(() => {
      toast.success("Logout Successfully")
      navigate('/')
    }).catch((error) => {
      toast.error(error.message)
    });
  }

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart
        <FaShoppingCart size={15}/>
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  )

  return (
    <>
    <ToastContainer position='top-left'
            autoClose= {2000}
            hideProgressBar= {false}
            newestOnTop= {false}
            closeOnClick = {false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme= "dark"
            toastClassName={styles["toast-message"]}/>
    <header className={scrollPage ? `${styles.fixed}` : null}>
        <div className={styles.header}>
          {logo}
          {/* {isMediaScreen && (
            <AdminOnlyLink className={styles.adminbtn_sidebar}>
              <Link to="/admin/home">
                <button className={"--btn --btn-primary2"}>Admin</button>
              </Link>
            </AdminOnlyLink>
          )} */}
            <nav className={showMenu ? `${styles["show-nav"]}`:`${styles['hide-nav']}`}>

              <div className={showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` :
               `${styles["nav-wrapper"]}`} onClick={hideMenu}
               ></div>
            
              <ul onClick={hideMenu}>
                <li className={styles["logo-mobile"]}>
                  <Link to= "/">{logo}</Link>
                  {isMediaScreen && (
                    <AdminOnlyLink className={styles.adminbtn_sidebar}>
                      <Link to="/admin/home">
                        <button className={"--btn --btn-primary2"}>Admin</button>
                      </Link>
                    </AdminOnlyLink>
                  )}
                  <FaTimes size={25} color='#fff' onClick={hideMenu} />
                </li>

                <li className={styles.adminbtn}>
                  <AdminOnlyLink>
                    <Link to="/admin/home">
                    <button className={'--btn --btn-primary2'}>Admin</button>
                    </Link>
                  </AdminOnlyLink>
                </li>

                <li>
                  <NavLink to= "/" className={activeLink}>Home</NavLink>
                </li>

                <li>
                  <NavLink to= "/contact" className={activeLink}>Contact Us</NavLink>
                </li>
                <li>
                  <NavLink to= "/wishlist" className={activeLink}>Wishlist</NavLink>
                </li>
              </ul> 
              
              {/* <div className={styles["header-right"]} onClick={hideMenu}> */}
              <div className={styles["header-right"]} onClick={hideMenu}>
                  <span className={styles.links}>
                    <ShowOnLogout><NavLink to='/login' className={activeLink}>Login</NavLink></ShowOnLogout>
                    <ShowOnLogin><a href='#home' className={styles.user} style={{color: "#fdca0f"}}>
                      <FaUserCircle size={16}/>
                      Hi, {displayName}
                    </a></ShowOnLogin>
                    <ShowOnLogin><NavLink to='/order-history' className={activeLink}>My Orders</NavLink></ShowOnLogin>
                    <ShowOnLogin><NavLink to='/' onClick={logoutUser}>LogOut</NavLink></ShowOnLogin>
                    
                  </span>
                  {cart}
                  
              </div>
              

              {/* For Side Navbar */}
              {isMediaScreen && ( 
                <div className={styles.displayNameWrapperMediaScreen}>
                  <ShowOnLogin>
                    <a className={styles.user_sidebar} href="#home" style={{ color: "#fdca0f" }}>
                      <FaUserCircle size={16} />
                      Hi, {displayName}
                    </a>
                  </ShowOnLogin>
                </div>
              )}



            </nav>
            
            <div className={styles["menu-icon"]}>
              {cart}<HiOutlineMenuAlt3 size={28} onClick = {toggleMenu}/>
            </div>
            
          </div>
          
    </header>
    </>
  )
}

export default Header