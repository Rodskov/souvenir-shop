import React, { useEffect, useState } from 'react'
import styles from "./Wishlist.module.scss"
import { useSelector } from 'react-redux'

import { selectIsLoggedIn, selectUserID, selectUserName } from '../../redux/slice/authSlice'


import { IoIosArrowUp, IoIosImage } from 'react-icons/io';
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'


import Card from '../../components/card/Card'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import ImageModal from './modalWishlist';

const Wishlist = () => {
    
    const [wishlistData, setWishlistData] = useState("")
    const [newWishlist, setNewWishlist] = useState("")
    const [imageArray, setImageArray] = useState([])
    const [authenticator, setAuthenticator] = useState(false)

    const [numOfFiles, setNumOfFiles] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState(0)

    const [uploadState, setUploadState] = useState("none")
    const [divDisplay, setDivDisplay] = useState("none")

    const isLoggedIn = useSelector(selectIsLoggedIn); 
    const userID = useSelector(selectUserID)
    const userName = useSelector(selectUserName)
    const [loading, setLoading] = useState(true);
  
    const  [eventChanger, setEventChanger] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState('');

    const handleImageClick = (imageSource) => { // Fix the variable name here
      setIsModalOpen(true);
      setEnlargedImage(imageSource); // Fix the variable name here
    };
  
    // Function to handle the click on the close button and hide the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    const deleteImage = (index) => {
      const newImageArray = [...imageArray];
      newImageArray.splice(index, 1);
      setImageArray(newImageArray);
    };
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    

    const storage = getStorage()

    const imageStyle = {
    //display: imageDisplay,
   
    }

    const divStyle = {
      display: divDisplay,
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
        setUploadedFiles(0)
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
          imageLinks.push("gs://pup-souvenir-shop.appspot.com/wishlist/"+fileName)
          const imageRef = ref(storage, "wishlist/"+fileName)
          await uploadBytes(imageRef, arrayImage[i]).then((snapshot) => {
            uploaded++
            console.log(numOfFiles)
            console.log(uploaded)
            console.log(uploaded+"/"+numOfFiles+": uploaded")
          })
        }
          setDivDisplay("block")
          setUploadedFiles(uploaded)
          console.log(uploadedFiles)
          console.log(numOfFiles)
          console.log(imageLinks)
          setAuthenticator(true)
          linkFetcher()
      }
      else{
        setDivDisplay("none")
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
        <button
          className={styles.scrollToTopButton}
          onClick={handleScrollToTop}
          title="Scroll to Top"
        >
          <IoIosArrowUp className={styles.icon} />
        </button>
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
              <div className={styles.uploadedImageRow}>
                {imageArray.map((links, i) => (
                  <div key={i} className={styles.uploadedImageContainer}>
                    <img style={imageStyle} src={links} alt={`Uploaded ${i + 1}`} />
                    <button
                      type="button"
                      className={styles.deleteImageButton}
                      onClick={() => deleteImage(i)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
             
              
            </div>
            <div className={styles.bottomIconWishlist}>
                <label htmlFor="fileInput" className={styles.uploadButton}>
                  <IoIosImage className={styles.imageIcon} />
                </label>
                <input
                  type="file"
                  id="fileInput"
                  onChange={fileReceiver}
                  multiple
                  accept="image/png, image/gif, image/jpeg"
                  className={styles.fileInput}
                />
                 <p style={textStyle}>{uploadedFiles}/{numOfFiles} Uploaded</p>
              
                <button type='submit' className='--btn --btn-primary3'>
                Submit Wishlist</button>
            </div>
            
          </div>
          
        </form>
      </Card>
      
      
        
      {loading ? (
          <p>Loading...</p>
        ) : (
          wishlistData.length > 0 ? (
            wishlistData.map((item, index) => (
              <div className={styles.card} key={index}>
                <div>
                <div className={styles.profileInfo}>
                  <div className={styles.iconTextContainer}>
                 
                    <p className={styles["wishlist-user-name"]}>{item.userName}</p>
                    <p className={styles["wishlist-date"]}>{item.wishlistDate}</p>
                  </div>
                  <p className={styles["wishlist-status"]}>{item.wishlist}</p>
                </div>
                  {/* Check if there's only one image */}
                  {item.images.length === 1 && (
                    <div
                    className={styles.centeredImage}
                    onClick={() => handleImageClick(item.images[0])}
                  >
                    <img
                      style={imageStyle}
                      src={item.images[0]}
                      alt={`Wishlist ${index + 1}`}
                    />
                  </div>
                  )}
                  {/* Check if there are multiple images */}
                  {item.images.length > 1 && (
                     <div
                     className={`${styles.wishlistImage} ${
                       item.images.length % 3 === 0 ? styles.threeRows : styles.twoRows
                     }`}
                   >
                     {item.images.map((imageSource, i) => (
                       <div key={i} onClick={() => handleImageClick(imageSource)}>
                         <img
                           style={imageStyle}
                           src={imageSource}
                           alt={`Wishlist ${index + 1} - Image ${i + 1}`}
                         />
                       </div>
                     ))}
                   </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No wishlist data available.</p>
          )
        )}
        {isModalOpen && (
          <ImageModal imageUrl={enlargedImage} onClose={handleCloseModal} />
        )}
      
    </div>
  </section>
  )
}

export default Wishlist