import React, { useEffect, useState } from 'react'
import styles from "./Wishlist.module.scss"
import { useSelector } from 'react-redux'
import { selectProducts } from '../../redux/slice/productSlice'
import { selectIsLoggedIn, selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { useParams } from 'react-router-dom'

import { IoIosImage } from 'react-icons/io';
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
    const [authenticator, setAuthenticator] = useState(false)

    const [numOfFiles, setNumOfFiles] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState(0)

    const [uploadState, setUploadState] = useState("none")

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

    const textStyle = {
      display: uploadState,
    }

    var imageLinks = [];
    var imageDownloadArray = [];

    useEffect(() => {
      console.log("Updated imageArray:", imageArray);
    }, [imageArray]);

    useEffect(() => {
      console.log("numOfFiles updated:", numOfFiles);
      // Perform any actions you need after numOfFiles is updated
    }, [numOfFiles]);

    useEffect(() => {
      console.log(authenticator)
    }, [authenticator])

    useEffect(() => {
      console.log(numOfFiles)
    }, [numOfFiles])
    
    const linkFetcher = async () => {
      console.log("LinkFetcher called")
      try{
        const urls = await Promise.all(imageLinks.map((URLs) => {
          const imageRef = ref(storage, URLs);
          return getDownloadURL(imageRef);
        })
        );
          imageDownloadArray = urls
          console.log(imageDownloadArray)
          setImageArray(urls)
          console.log(imageArray)
      } catch(error) {
        console.error("error", error)
      }
    }

    const fileReceiver = async (e) => {
      if(e.target.files.length != 0){
        setUploadState("block")
        setNumOfFiles(e.target.files.length)
        console.log(e.target.files);
        const arrayImage = e.target.files
        console.log(typeof arrayImage)
        console.log(arrayImage)
        var uploaded = 0
        imageDownloadArray = []
        imageLinks = []
        for(var i=0; i < arrayImage.length; i++){
          const fileName = arrayImage[i].name
          console.log(fileName)
          imageLinks.push("gs://pup-tanglaw-clothing.appspot.com/wishlist/"+fileName)
          const imageRef = ref(storage, "wishlist/"+fileName)
          await uploadBytes(imageRef, arrayImage[i]).then((snapshot) => {
            uploaded++
            console.log(numOfFiles)
            console.log(uploaded)
            console.log(uploaded+"/"+numOfFiles+": uploaded")
          })
        }
          setUploadedFiles(uploaded)
          console.log(uploadedFiles)
          console.log(numOfFiles)
          console.log(imageLinks)
          setAuthenticator(true)
          linkFetcher()
      }
      else{
        setNumOfFiles(e.target.files.length)
        setAuthenticator(false)
        setUploadState("none")
      }
    };

    
  
  
    const addWishlist = (e) =>{
      e.preventDefault()
      if(authenticator != false){
        const today = new Date();
        const date =  today.toDateString();
    
        const wishlistConfig = {
          userID,
          userName,
          wishlist: newWishlist,
          wishlistDate: date,
          images: imageArray,
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
        //setEventChanger(Math.random())
        setTimeout(() => {
          window.location.reload()
        }, 1000 )
      }
      else if (numOfFiles === 0){
        const today = new Date();
        const date =  today.toDateString();
    
        const wishlistConfig = {
          userID,
          userName,
          wishlist: newWishlist,
          wishlistDate: date,
          images: imageArray,
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
        //setEventChanger(Math.random())
        setTimeout(() => {
          window.location.reload()
        }, 1000 )
      }
      else{
        toast.error("Images are still uploading.")
      }
    }
    
    useEffect(() => {
        const fetchWishlist = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "wishlist"));
            const wishlistData = querySnapshot.docs.map((doc) => doc.data());
            console.log(wishlistData)
            setWishlistData(wishlistData);
            setLoading(false);
          } catch (error) {
            toast.error(error.message);
            setLoading(false);
          }
        };
        fetchWishlist();
      }, []);
           
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
            cols='10'
            rows='5'
            placeholder={
              isLoggedIn
                ? `What do you want to suggest ${userName}?`
                : 'Login first to post'
            }
          ></textarea>
          <div className={styles.uploadContainer}>
            <div className={styles.uploadImageContainer}> 
              <label htmlFor="fileInput" className={styles.uploadButton}>
                <IoIosImage className={styles.imageIcon} />
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={fileReceiver}
                multiple
                className={styles.fileInput}
              />
                <p style={textStyle}>{uploadedFiles}/{numOfFiles} Uploaded</p>
            </div>
            <button type='submit' className='--btn --btn-primary3'>
            Submit Wishlist
          </button>
          </div>
          
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
                <div className={styles.wishlistImage}>
                  {item.images.map((imageSource, i) => {
                    return(
                      <img key={i} style={imageStyle} src={imageSource}/>
                    )
                  })}
                </div>
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