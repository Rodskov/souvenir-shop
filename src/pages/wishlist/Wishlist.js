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
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const Wishlist = () => {
    
    const [wishlistData, setWishlistData] = useState("")
    const [newWishlist, setNewWishlist] = useState("")
    const [imageArray, setImageArray] = useState([])
    const [imageLinkArray, setImageLinkArray] = useState([])
    const [imageDownloadArray, setImageDownloadArray] = useState([])

    const isLoggedIn = useSelector(selectIsLoggedIn); 
    const userID = useSelector(selectUserID)
    const userName = useSelector(selectUserName)
    const [loading, setLoading] = useState(true);
  
    const  [eventChanger, setEventChanger] = useState(0);

    const storage = getStorage()

    const imageStyle = {
    //display: imageDisplay,
    height: "108px",
    width: "192px"
    }

    const linkFetcher = async () => {
      console.log("LinkFetcher called")
      try{
        const urls = await Promise.all(imageLinkArray.map((URLs) => {
          const imageRef = ref(storage, URLs);
          return getDownloadURL (imageRef);
        })
        );
          setImageDownloadArray(urls)
          console.log(imageDownloadArray)
      } catch(error) {
        console.error("error", error)
      }
    }

    const fileReceiver = async (e) => {
      console.log(e.target.files);
      const arrayImage = e.target.files
      setImageLinkArray([])
      setImageDownloadArray([])
      console.log(typeof arrayImage)
      console.log(arrayImage)
      const imageLinks = []
      setImageArray(e.target.files);
      for(var i=0; i < arrayImage.length; i++){
        const fileName = arrayImage[i].name
        console.log(fileName)
        imageLinks.push("gs://pup-souvenir-shop.appspot.com/wishlist/"+fileName)
        const imageRef = ref(storage, "wishlist/"+fileName)
        await uploadBytes(imageRef, arrayImage[i]).then((snapshot) => {
          console.log(fileName+" uploaded")
        })
      }
        setImageLinkArray(imageLinks)
        console.log(imageLinks)
        console.log(imageLinkArray)
        linkFetcher()
    };

    
  
  
    const addWishlist = (e) =>{
      e.preventDefault()
      const today = new Date();
      const date =  today.toDateString();
  
      const wishlistConfig = {
        userID,
        userName,
        wishlist: newWishlist,
        wishlistDate: date,
        images: "",
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
          <h5>Choose your image/s:</h5>
          <input type="file" onChange={fileReceiver} multiple/>
          <div>
            {imageDownloadArray.map((data, i) => {
              return(
                <img style={imageStyle} src={data}></img>
              )
            })}
          </div>
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