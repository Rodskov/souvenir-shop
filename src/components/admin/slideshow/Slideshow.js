import React, { useEffect, useRef, useState } from 'react'
import styles from "./Slideshow.module.scss"
import Card from '../../card/Card'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, getFirestore, setDoc, snapshotEqual } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { configImagesLinks } from '../../../firebase/config';
import { FaTimes } from 'react-icons/fa';
import ImageModal from '../../../pages/wishlist/modalWishlist';



const Slideshow = () => {
  const [imageLinksArray, setImageLinksArray] = useState([]);
  const [imageDownloadArray, setImageDownloadArray] = useState([]);
  const [changeDisplay, setChangeDiplay] = useState(0);
  const [confirmation, setConfirmation] = useState(false)
  const [btnDisplay, setBtnDisplay] = useState("none")
  const [confirmBtnDisplay, setConfirmBtnDisplay] = useState("none")
  const [confirmText, setConfirmText] = useState("none")
  const [imageDisplay, setImageDisplay] = useState("inline")
  const [statsDisplay, setStatsDisplay] = useState("none")

  const [imageFromDatabase, setImageFromDatabase] = useState([])
  const [numFiles, setNumFiles] = useState([])
  
  const [authentication, setAuthentication] = useState(0)
  const [authenticator, setAuthenticator] = useState(0)
  const fileInputRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState('');


  const [status, setStatus] = useState(0)
  const storage = getStorage()
  const database = getFirestore()
  const collectionRef = doc(database, "slideshow", "slideshow")
  

  useEffect(() => {
    setTimeout(() => {
      cancel()
    }, 1)
    cancel()
    setConfirmBtnDisplay("none")
    setStatsDisplay("none")
    setBtnDisplay("none")
  }, [])

  useEffect(() => {
    getDoc(collectionRef).then((snapshot) => {
      console.log(snapshot.data().data)
      setImageFromDatabase(snapshot.data().data)
    })
  }, [changeDisplay])

  useEffect(() => { 
    console.log("Changes have been made")
    console.log(imageDownloadArray)
    console.log(imageLinksArray)
  }, [imageDownloadArray, imageLinksArray])

  const statusText = {
    display: statsDisplay
  }

  const textConfirmation = {
    display: confirmText,
  }

  const buttonStyle = {
    display: btnDisplay
  }

  const confirmButtonStyle = {
    display: confirmBtnDisplay
  }

  const imageStyle = {
    display: imageDisplay,
    height: "108px",
    width: "192px",
    
  }

  const cancel = () => {
  setBtnDisplay("none");
  setConfirmBtnDisplay("none");
  setConfirmText("none");
  setImageDisplay("none");
  setStatsDisplay("none"); // Add this line to hide the status text as well
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
  }

  // Create a handler for submission
  const submissionHandler = (e) => {
    e.preventDefault();
    if(authenticator === authentication){
      console.log(imageDownloadArray)
      var dataArray = []
      const collectionRefWithName = doc(database, "slideshow", "slideshow")
      for(var i=0; i < imageDownloadArray.length; i++){
        const imageData = {
          image: imageDownloadArray[i]
        }
        dataArray.push(imageData)
        console.log(dataArray)
      }
      setDoc(collectionRefWithName, {
        data: dataArray
      }).then(() => {
        setChangeDiplay(Math.random())
        setImageDisplay("none")
        setConfirmBtnDisplay("none")
        setStatsDisplay("none")
        setConfirmText("none")
        setStatsDisplay("none")
        toast.success("Slideshow successfully changed!")
      })
    }
    else{
      toast.error("Images are still uploading")
    }
  }
  const deleteImage = (index) => {
    const updatedLinksArray = [...imageLinksArray];
    updatedLinksArray.splice(index, 1);
    setImageLinksArray(updatedLinksArray);

    const updatedDownloadArray = [...imageDownloadArray];
    updatedDownloadArray.splice(index, 1);
    setImageDownloadArray(updatedDownloadArray);
  };

  useEffect(() => {
    if (imageDownloadArray.length === 0) {
      setBtnDisplay("none");
      setConfirmBtnDisplay("none");
      setConfirmText("none");
      setImageDisplay("none");
      setStatsDisplay("none");
    }
  }, [imageDownloadArray]);

  const showImages = () => {
    
    return imageDownloadArray.map((link, i) => (
      <div key={i} className={styles.imageContainer}>
        <img style={imageStyle} src={link} alt={`Uploaded Image ${i + 1}`} />
        <button className={styles.deleteButton} onClick={() => deleteImage(i)}>
          <FaTimes />
        </button>
        <div className={styles.arrowContainer}>
          <div className={styles.arrow}></div>
        </div>
        <div className={styles.redCircle}></div>
      </div>
    ));
  };

  const linkFetcher = async () => {
    setConfirmation(true)
    setBtnDisplay("none")
    try{
      const urls = await Promise.all(imageLinksArray.map((URLs) => {
        const imageRef = ref(storage, URLs);
        return getDownloadURL(imageRef);
      })
      );
      setImageDownloadArray(urls)
      
      setConfirmBtnDisplay("block")
    } catch(error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    showImages()
  }, [imageDownloadArray])

  useEffect(() => {
    linkFetcher()
  }, [imageLinksArray])

  const confirmImages = () => {
    if(authenticator != authentication){
      console.log(authenticator)
      console.log(authentication)
    }
    else{
      setImageDisplay("inline")
      setConfirmText("block")
      console.log(authenticator)
      console.log(authentication)
      console.log(imageLinksArray)
    }
  }
  const handleImageClick = (imageSource) => { // Fix the variable name here
    setIsModalOpen(true);
    setEnlargedImage(imageSource); // Fix the variable name here
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Create a handler in checking files if input has changed
  const handleEventChange = async (event) => {
    console.log(event.target.files)
    if(event.target.files.length != 0){
      var statusUpdate = 0;
      setStatsDisplay("block")
      setStatus(statusUpdate)
      setConfirmBtnDisplay("none")
      //setBtnDisplay("block")
      setImageLinksArray([])
      setImageDownloadArray([])
      const imageLinks = [];
      var authenticatorChild = 0;
      setNumFiles(event.target.files.length)
      const authenticationChild = event.target.files.length
      setAuthentication(authenticatorChild)
      setAuthenticator(authenticationChild)
      console.log(authentication)
      console.log(event.target.files)
      const receiveFiles = event.target.files
      console.log(receiveFiles)
      for(var i=0; i < receiveFiles.length; i++){
        const fileName = receiveFiles[i].name;
        imageLinks.push(configImagesLinks+"slideshows/"+fileName)
        const imageRef = ref(storage, "slideshows/"+fileName)
        console.log(fileName)
        await uploadBytes(imageRef, receiveFiles[i]).then((snapshot) => {
          statusUpdate++
          setStatus(statusUpdate)
          authenticatorChild++
          console.log(authenticatorChild)
          console.log(authenticationChild)
          console.log(snapshot)
        })
      }
      setAuthentication(authenticationChild)
      setAuthenticator(authenticatorChild)
      setImageLinksArray(imageLinks)
      confirmImages()
    }
    else{
      setConfirmText("none")
      setImageDisplay("none")
      setStatsDisplay("none")
      setConfirmBtnDisplay("none")
      setBtnDisplay("none")
    }
  }

  return (
    <>
    <div className={styles.product}>
      <h2>Home Slideshow Editor</h2>
      <Card cardClass={styles.group}>
        <div>
            <form onSubmit={submissionHandler}>
            <label className={styles.choose}>
              Choose your images:
            </label>
            <div className={styles.card_custom}>
            <div>
              <input ref={fileInputRef} onChange={handleEventChange} id="imageFiles" type="file" accept='image/*' multiple/>
            </div>
            <div className={styles.newslideshow_confirmcancel}>
              <button className={styles.confirm_ns} style={confirmButtonStyle}>Confirm New Slideshow</button>
              <button className={styles.cancel} type="button" style={confirmButtonStyle} onClick={cancel}>Cancel</button>
            </div>
            </div>
          </form>
          
          
          <h3 className={styles.check_text} style={textConfirmation}>Below are the Images to be included in the slideshow:</h3>
          {/* <div className={styles.uploaded}>
            <p style={statusText}>{status}/{numFiles} file(s) uploaded</p>
          </div> */}
          <div>
            {/* {imageDownloadArray.map((data, i) => {
              return(
                <img style={imageStyle} src={data}></img>
              )
            })} */}
            {showImages()}
          </div>
          <h3 className={styles.text_ss}><b>Current slideshow:</b></h3>
          <div>
            {imageFromDatabase.map((data, i) => (
              <img
                key={i}
                style={{ display: "inline", height: "108px", width: "192px", margin: "5px" }}
                src={data.image}
                onClick={() => handleImageClick(data.image)} // Pass the image URL to handleImageClick
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
    {isModalOpen && (
          <ImageModal imageUrl={enlargedImage} onClose={handleCloseModal} />
    )}
    </>
  
  
  )
}

export default Slideshow