import React, { useEffect, useState } from 'react'
import styles from "./ReturnProduct.module.scss"
import { useSelector } from 'react-redux'
import { selectUserID, selectUserName } from '../../redux/slice/authSlice'
import { Link, useParams } from 'react-router-dom'
import Card from '../card/Card'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { configImagesLinks, db, storage } from '../../firebase/config'
import useFetchDocuments from '../../customHooks/useFetchDocuments'
import spinnerImg from "../../assets/spinner.jpg"
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'

const ReturnProduct = () => {
  const [returns, setReturns] = useState("");
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  const [imageLinksArray, setImageLinksArray] = useState([])
  const [imageDownloadsArray, setImageDownloadsArray] = useState([])

  const [videoLinksArray, setVideoLinksArray] = useState([])
  const [videoDownloadArray, setVideoDownloadArray] = useState([])

  const [fileLength, setFileLength] = useState(0)
  const [authenticator, setAuthenticator] = useState(0)

  const date = new Date()
  const year = date.getFullYear()
  const day = date.getDate()
  const month = date.getMonth()
  const hour = date.getHours()

  useEffect(() => {
    setImageDownloadsArray([])
    setImageLinksArray([])
  }, [])

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderRef = doc(db, 'orders', id);
        const orderSnapshot = await getDoc(orderRef);
        if (orderSnapshot.exists()) {
          setOrder(orderSnapshot.data());
        } else {
          // Handle case where the order does not exist
          console.log("Order does not exist.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderData();
  }, [id]);

  useEffect(() => {
    // Assuming you have a 'returns' collection in Firestore and 'id' is the document ID
    const fetchReturnsData = async () => {
      try {
        const returnsRef = doc(db, 'returns', id);
        const returnsSnapshot = await getDoc(returnsRef);
        if (returnsSnapshot.exists()) {
          setReturns(returnsSnapshot.data().returns || "");
        } else {
          // Handle case where the returns document does not exist
          console.log("Returns document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching returns:", error);
      }
    };

    fetchReturnsData();
  }, [id]);

  const videoLinkFetcher = async () => {
    try{
      const urls = await Promise.all(videoLinksArray.map((URLs) => {
        const imageRef = ref(storage, URLs);
        return getDownloadURL(imageRef);
      })
      );
      setVideoDownloadArray(urls)
    } catch(error) {
      console.error("error", error)
    }
  }

  const imageLinkFetcher = async () => {
    try{
      const urls = await Promise.all(imageLinksArray.map((URLs) => {
        const imageRef = ref(storage, URLs);
        return getDownloadURL(imageRef);
      })
      );
      setImageDownloadsArray(urls)
    } catch(error) {
      console.error("error", error)
    }
  }
  
  useEffect(() => {
    console.log(videoDownloadArray)
  }, [videoDownloadArray])

  useEffect(() => {
    console.log(videoLinksArray)
    videoLinkFetcher()
  }, [videoLinksArray])

  useEffect(() => {
    console.log(imageDownloadsArray)
  }, [imageDownloadsArray])

  useEffect(() => {
    console.log(imageLinksArray)
    imageLinkFetcher()
    
  }, [imageLinksArray])

  const handleImages = async (e) => {
    if(e.target.files.length != 0){
      toast.success("Uploads started, please wait until all images are uploaded")
      const file = e.target.files
      console.log(file)
      var adder = 0
      setAuthenticator(0)
      setFileLength(file.length)
      setImageLinksArray([])
      setImageDownloadsArray([])
      var imageLinks = []
      var videoLinks = []
      for(var i=0; i < file.length; i++){
        if(file[i].type === "video/mp4"){
          toast.success("Video found!")
          const videoRef = ref(storage, `returnVideos/${year}-${day}-${month}-${hour}_${file[i].name}`)
          videoLinks.push(configImagesLinks+`returnVideos/${year}-${day}-${month}-${hour}_${file[i].name}`)
          await uploadBytes(videoRef, file[i]).then((snapshot) => {
            adder++
            toast.success(file[i].name+" is successfully added")
            console.log(snapshot)
          })
        }
        if(file[i].type === "image/jpg" || file[i].type === "image/jpeg" || file[i].type === "image/png") {
          const imageRef = ref(storage, `returnImages/${year}-${day}-${month}-${hour}_${file[i].name}`)
          imageLinks.push(configImagesLinks+`returnImages/${year}-${day}-${month}-${hour}_${file[i].name}`)
          await uploadBytes(imageRef, file[i]).then((snapshot) => {
            adder++
            toast.success(file[i].name+" is successfully added")
            console.log(snapshot)
          })
        }
      }
      setAuthenticator(adder)
      setImageLinksArray(imageLinks)
      setVideoLinksArray(videoLinks)
      toast.success("All images are added succesfully")
    }
    else{
      toast.error("Files successfully removed")
    }
  }

  const returnProduct = async (e) => {
    e.preventDefault();

    if(authenticator === fileLength){
      const today = new Date();
      const date = today.toDateString();

      const returnConfig = {
        userID,
        userName,
        id: id,
        returns,
        videoURLs: videoDownloadArray,
        imageURLs: imageDownloadsArray,
        returnDate: date,
        createdAt: Timestamp.now().toDate()
      };

    
      try {
        const newItemRef = doc(db, "returns", id);
        await setDoc(newItemRef, returnConfig, { merge: true });
        toast.success("Return Form Submitted");
        setReturns("");
      } catch (error) {
        toast.error(error.message);
      }
    }
    else{
      toast.error("Images are still uploading")
    }

    const orderConfig = {
      userID: order.userID,
      userEmail: order.userEmail,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      orderAmount: order.orderAmount,
      orderStatus: "For Return",
      cartItems: order.cartItems,
      shippingAddress: order.shippingAddress,
      shippingFee: order.shippingFee,
      createdAt: order.createdAt,
      editedAt: Timestamp.now().toDate(),
    }

    try {
      
      setDoc(doc(db, "orders", id), orderConfig);
      setDoc(doc(db, "returns", id), orderConfig);

    } catch (error) {
      toast.error(error.message);
    }

  };

  return (
    <section>
      <div className={`container ${styles.review}`}>
      
        <h2>Product Return Form</h2>
        <Link to={`/order-details/${id}`}>
        &larr; Back to Order Details
      </Link>
        <Card cardClass={styles.card_img}>
        {order === null ? (
          <img src={spinnerImg} alt='Loading...' style={{width: "60px"}}/>
        ):(
          <>
            <p className={styles.prod_name}><b>Product Name: </b> {order.cartItems[0].name}</p>
          <img src={order.cartItems[0].imageURL} alt={order.cartItems[0].name} />
        </>
        )}
        </Card>
        
        <Card cardClass={styles.card}>
          <form onSubmit={(e)=> returnProduct(e)}>
            <label>Return Details:</label>
            <textarea value= {returns} required onChange= {(e)=> setReturns(e.target.value)}cols="30" rows="10"></textarea>
            <input type='file' onChange={(e) => handleImages(e)} accept='image/*, video/mp4' multiple/>
            <button type='submit' className='--btn --btn-primary'>Submit Request</button>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default ReturnProduct