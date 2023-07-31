import React, { useEffect, useState } from 'react'
import styles from "./ReturnMessage.module.scss"
import Card from '../../card/Card'
import spinnerImg from "../../../assets/spinner.jpg"
import useFetchDocuments from '../../../customHooks/useFetchDocuments'
import { useParams } from 'react-router-dom'
import { doc, documentId, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import useFetchCollection from '../../../customHooks/useFetchCollection'
import ImageModal from '../../../pages/wishlist/modalWishlist';
import VideoModal from '../../../pages/wishlist/modalVideo';

const ReturnMessage = () => {
  const [returns, setReturns] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id, productID} = useParams()
  const { data } = useFetchCollection('returns')

  const imageStyleHardCoded = {
    height: 200,
    width: Math.round(200 * 16 / 9),
    objectFit: 'cover'
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState('');

  const handleImageClick = (imageSource) => { // Fix the variable name here
    setIsModalOpen(true);
    setEnlargedImage(imageSource); // Fix the variable name here
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [enlargedVideo, setEnlargedVideo] = useState('');

  const handleVideoClick = (videoSource) => {
    setIsVideoModalOpen(true);
    setEnlargedVideo(videoSource);
  };

  useEffect(() => {
    const fetchReturnsData = async () => {
      try {
        const documentRef = doc(db, 'returns', id);
        const snapshot = await getDoc(documentRef);
        console.log(snapshot.data());
        setReturns(snapshot.data());
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReturnsData();
  }, []);
  

  useEffect(() => {
    console.log(returns?.productID);
  }, [returns]);
  console.log(returns)
//   useEffect(() => {
//       console.log(returns)
//     const fetchReturnsData = async () => {
//       try {
//         const returnsData = await document; // Assuming the useFetchDocuments hook returns a promise
//         console.log(returnsData)
//         setReturns(returnsData);
//         setLoading(false);
//         console.log("Return Document:", returnsData);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchReturnsData();
//   }, [returns]);

//   const { document: ordersDocument } = useFetchDocuments("orders", id)
  
//   useEffect(()=>{
//     console.log("Order Document:", ordersDocument);
//       setOrder(ordersDocument)
//       setLoading(false);
//   }, [ordersDocument])

//   const { document: returnsDocument } = useFetchDocuments("returns", id)

//   useEffect(() => {
//     console.log("Return Document:", returnsDocument);
//     setOrder(returnsDocument);
//     setLoading(false);
//   }, [returnsDocument]);

    return (
        <>
          {loading ? (
            <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
          ) : returns === null ? (
            <p>No order data found.</p>
          ) : (
            <div className={styles.statusReturnMessage}  >
              {returns ? (
                <Card cardClass={styles.card}>
                  <h4>Reason for Return Request:</h4>
                  <p>
                  {returns.returns}
                  {returns.productID}
                  </p>
                  <div className={styles.statusContainerMessage}>
                    {returns.videoURLs !== undefined ? (
                      returns.videoURLs.map((links, i) => {
                        return(
                          <div key={i}>
                            <video src={links} style={imageStyleHardCoded} controls onClick={() => handleVideoClick(links)}/>
                          </div>
                        )
                      })
                    ) : (
                      console.log("Return has no media files")
                    )}
                    {returns.imageURLs !== undefined ? (
                      returns.imageURLs.map((links, i) => {
                        return (
                          <div key={i} style={{display: 'inline'}}>
                            <img src={links} style={imageStyleHardCoded} onClick={() => handleImageClick(links)}/>
                          </div>
                        )
                      })
                    ) : (
                      console.log("Return has no media files")
                    )
                    }
                  </div>
                </Card>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          )}
           {isModalOpen && (
          <ImageModal imageUrl={enlargedImage} onClose={handleCloseModal} />
    )}
    {isVideoModalOpen && (
        <VideoModal videoUrl={enlargedVideo} onClose={() => setIsVideoModalOpen(false)} />
      )}
        </>
      )
    }

export default ReturnMessage