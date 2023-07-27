import React, { useEffect, useState } from 'react'
import styles from "./Wishlist.module.scss"
import { useSelector } from 'react-redux'
import { selectProducts } from '../../redux/slice/productSlice'
import { selectIsLoggedIn, selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { useParams } from 'react-router-dom'

import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

import spinnerImg from "../../assets/spinner.jpg"
import Card from '../../components/card/Card'

const Wishlist = () => {
    
    const [wishlistData, setWishlistData] = useState("")
    const [newWishlist, setNewWishlist] = useState("")

    const isLoggedIn = useSelector(selectIsLoggedIn); 
    const userID = useSelector(selectUserID)
    const userName = useSelector(selectUserName)
    const [loading, setLoading] = useState(true);
  
    const  [eventChanger, setEventChanger] = useState(0);
    
  
    const addWishlist = (e) =>{
      e.preventDefault()
      const today = new Date();
      const date =  today.toDateString();
  
      const wishlistConfig = {
        userID,
        userName,
        wishlist: newWishlist,
        wishlistDate: date,
        createdAt: Timestamp.now().toDate()
      }
      if (!isLoggedIn) {
        toast.error("Please log in to make a wishlist.");
        return;
    }

      try {
        addDoc(collection(db, "wishlist"), wishlistConfig);
        toast.success("Wishlist Submitted");
        setNewWishlist("")
      } catch(error) {
        toast.error(error.message);
      }
      setEventChanger(Math.random())
    }
    
    useEffect(() => {
        const fetchWishlist = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "wishlist"));
            const wishlistData = querySnapshot.docs.map((doc) => doc.data());
            setWishlistData(wishlistData);
            setLoading(false);
          } catch (error) {
            toast.error(error.message);
            setLoading(false);
          }
        };
        fetchWishlist();
      }, [eventChanger]);
           
  return (
    <section>
    <div className={`container ${styles.wishlist}`}>
      <Card cardClass={styles.card}>
        <form onSubmit={addWishlist}>
          <label>Type your Wishlist:</label>
          <textarea
            value={newWishlist}
            required
            onChange={(e) => setNewWishlist(e.target.value)}
            cols='30'
            rows='10'
          ></textarea>
          <button type='submit' className='--btn --btn-primary3'>
            Submit Wishlist
          </button>
        </form>
      </Card>
      
      
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          wishlistData.length > 0 ? (
            wishlistData.map((item, index) => (
           <div className={styles.card}>
              <div key={index}>
                <p><b>Username:</b> {item.userName}</p>
                <p><b>Date:</b> {item.wishlistDate}</p>
                <p> {item.wishlist}</p>
              </div>
            </div>
             
            ))
          ) : (
            <p>No wishlist data available.</p>
          )
        )}
      
    </div>
  </section>
  )
}

export default Wishlist