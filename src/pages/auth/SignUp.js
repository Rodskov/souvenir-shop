import { useState } from "react"
import styles from "./auth.module.scss"
import signupBg from '../../assets/signupBg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'

import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../../firebase/config"
import Loader from "../../components/loader/Loader"
import { toast, ToastContainer } from 'react-toastify'

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

const registerUser = (e) =>{
      e.preventDefault()
      if (password !== cPassword){
          toast.error("Passwords do not match.")
      }
      setIsLoading(true)

      createUserWithEmailAndPassword(auth,email, password)
      .then((userCredential) => {
          
          const user = userCredential.user
          console.log(user)
          setIsLoading(false)
          toast.success("Registration Successful")
          navigate("/login")
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
          
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
          <h2>Sign Up</h2>
          
          <form onSubmit={registerUser}>
              <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)}  />
              <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}  required />
              <input type='password' placeholder='Confirm Password' value={cPassword} onChange={(e) => setCPassword(e.target.value)} required />
              <button type="submit" className='--btn --btn-primary --btn-block'>Sign Up</button>
              
          </form>
          <span className={styles.register}>
            <p>Already have an account? </p>
            <Link to='/login'>Login</Link>
          </span>
          
        </div>
      </Card>
      <div className={styles.img}>
        <img src= {signupBg} alt='Login' width="220px"/>
      </div>

    </section>
    </>
  )
}

export default SignUp