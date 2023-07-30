import React, { useState } from 'react'
import styles from "./auth.module.scss"
import resetBg from '../../assets/reset.jpg'
import { Link } from 'react-router-dom'
import Card from '../../components/card/Card'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify'
import Loader from '../../components/loader/Loader'
import  {BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs"

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
    
    {isLoading && <Loader/>}
    <section className={`container ${styles.auth}`}>
      
      <Card>
        <div className={`${styles.reset}`}>
          <div className={`${styles.resetWrapper}`}>
          <h2>Reset Password</h2>
          
            <form onSubmit={resetPassword}>
                <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type= 'submit' className='--btn --btn-reset --btn-block'>Reset Password</button>
                <div className={styles.links}>
                  <p>
                  <Link to ='/login'><BsFillArrowLeftCircleFill className={styles.resetIcon}/>Login</Link>
                  </p>
                  <p>
                  <Link to ='/register'>SignUp<BsFillArrowRightCircleFill className={styles.resetIcon}/></Link>
                  </p>
                  
                </div>
                
            </form>
          
          </div>
        </div>
      </Card>
      <div className={styles.imgReset}>
        <img src= {resetBg} alt='Login' width="570px"/>
      </div>

    </section>
    </>
  )
}

export default Reset