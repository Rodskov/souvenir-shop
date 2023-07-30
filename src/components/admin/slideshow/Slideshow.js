import React, { useEffect, useState } from 'react'
import styles from "./Slideshow.module.scss"
import Card from '../../card/Card'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, getFirestore, setDoc, snapshotEqual } from 'firebase/firestore';
import { toast } from 'react-toastify';

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


  const [status, setStatus] = useState(0)
  const storage = getStorage()
  const database = getFirestore()
  const collectionRef = doc(database, "slideshow", "slideshow")


  useEffect(() => {
    getDoc(collectionRef).then((snapshot) => {
      console.log(snapshot.data().data)
      setImageFromDatabase(snapshot.data().data)
    })
  }, [changeDisplay])

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
    width: "192px"
  }

  const cancel = () => {
    setBtnDisplay("none")
    setConfirmBtnDisplay("none")
    setConfirmText("none")
    setImageDisplay("none")
  }

  // Create a handler for submission
  const submissionHandler = (e) => {
    e.preventDefault();
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
      toast.success("Slideshow successfully changed!")
    })
  }

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

  const confirmImages = () => {
    if(authenticator != authentication){
      console.log(authenticator)
      console.log(authentication)
      alert("Images are still uploading")
    }
    else{
      setImageDisplay("inline")
      setConfirmText("block")
      console.log(authenticator)
      console.log(authentication)
      console.log(imageLinksArray)
      linkFetcher()
    }
  }

  // Create a handler in checking files if input has changed
  const handleEventChange = async (event) => {
    console.log(event.target.files)
    if(event.target.files.length != 0){
      var statusUpdate = 0;
      setStatsDisplay("block")
      setStatus(statusUpdate)
      setConfirmBtnDisplay("none")
      setBtnDisplay("block")
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
        imageLinks.push("gs://pup-souvenir-shop.appspot.com/slideshows/"+fileName)
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
            <label>
              Choose your images:
            </label>
            <Card cardClass={styles.group}>
            <div>
              <input onChange={handleEventChange} id="imageFiles" type="file" multiple/>
            </div>
            <div>
              <button style={confirmButtonStyle}>Confirm New Slideshow</button>
              <button type="button" style={confirmButtonStyle} onClick={cancel}>Cancel</button>
            </div>
            </Card>
          </form>
          <div>
            <p style={statusText}>{status}/{numFiles} file(s) uploaded</p>
          </div>
          <div>
            <button onClick={confirmImages} style={buttonStyle}>Confirm Images</button>
          </div>
          <h3 style={textConfirmation}>Below are the Images to be included in the slideshow. Please check:</h3>
          <div>
            {imageDownloadArray.map((data, i) => {
              return(
                <img style={imageStyle} src={data}></img>
              )
            })}
          </div>
          <h3 className={styles.text_ss}>Current slideshow:</h3>
          <div>
            {imageFromDatabase.map((data, i) => {
              console.log(data.image)
              return(
                <img style={{display: "inline", height: "108px", width: "192px"}} src={data.image}></img>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
    </>
  
  
  )
}

export default Slideshow