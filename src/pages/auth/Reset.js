import React, { useState } from 'react'
import styles from "./auth.module.scss"
import resetBg from '../../assets/reset.jpg'
import { Link } from 'react-router-dom'
import Card from '../../components/card/Card'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { ToastContainer, toast } from 'react-toastify'
import Loader from '../../components/loader/Loader'


const Reset = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
const resetPassword = (e) =>{
  e.preventDefault()
  setIsLoading(true)

  sendPasswordResetEmail(auth, email)
  .then(() => {
    setIsLoading(false)
    toast.success("Check your email")
  })
  .catch((error) => {
    setIsLoading(false)
    toast.error(error.message)
    
  });
}

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
            theme= "dark"/>
    {isLoading && <Loader/>}
    <section className={`container ${styles.auth}`}>
      
      <Card>
        <div className={styles.form}>
          <h2>Reset Password</h2>
          
          <form onSubmit={resetPassword}>
              <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type= 'submit' className='--btn --btn-primary3 --btn-block'>Reset Password</button>
              <div className={styles.links}>
                <p>
                <Link to ='/login'>--Login</Link>
                </p>
                <p>
                <Link to ='/register'>SignUp--</Link>
                </p>
                
              </div>
              
          </form>
          <span className={styles.register}>
            <p>Already have an account? </p>
            <Link to='/login'>Login</Link>
          </span>
          
        </div>
      </Card>
      <div className={styles.img}>
        <img src= {resetBg} alt='Login' width="420px"/>
      </div>

    </section>
    </>
  )
}

export default Reset