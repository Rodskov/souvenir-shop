import { useState } from 'react'
import styles from "./auth.module.scss"
import loginBg from '../../assets/loginBg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import { FaGoogle } from "react-icons/fa"
import { toast, ToastContainer } from 'react-toastify'
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import { auth } from "../../firebase/config"
import Loader from "../../components/loader/Loader"
import { useSelector } from 'react-redux'
import { selectPreviousURL } from '../../redux/slice/cartSlice'
import { BsEye, BsEyeSlash } from "react-icons/bs"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const previousURL = useSelector(selectPreviousURL)
  const navigate = useNavigate()

  const redirectUser = () => {
    if (previousURL.includes("cart")) {
      return navigate("/cart")
    }
    navigate("/")
  };

  const loginUser = (e) =>{
    e.preventDefault()
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      // const user = userCredential.user;
      setIsLoading(false)
      toast.success("Login Successful")
      redirectUser()
    })
    .catch((error) => {
      setIsLoading(false)
      toast.error(error.message)
    });
  }
  //Login with Google
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () =>{
    signInWithPopup(auth, provider)
    .then((result) => {
      // const user = result.user;
      toast.success("Login Successfully with Google")
      redirectUser()
    }).catch((error) => {
      toast.error(error.message)
      
    });
  }

  const [visible , setVisible] = useState(false);

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
      <div className={styles.img}>
        <img src= {loginBg} alt='Login' width="250px"/>
      </div>

      <Card>
        <div className={styles.form}>
          <h2>Login</h2>
          
          <form onSubmit={loginUser}>
              <input type='text' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className={styles['password-box']}>
                <input type={visible ? "text" : "password"} placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                <div onClick={()=> setVisible(!visible)} className={styles.eyePassword}>
                  {visible ? <BsEye/> : <BsEyeSlash/>}
                </div>
              </div>
              <button type='submit' className='--btn --btn-primary --btn-block'>Login</button>
              <div className={styles.links}>
                <Link to ='/reset'>Reset Password</Link>
              </div>
            <p>-- or --</p>
          </form>
          <button className='--btn --btn-danger --btn-block' onClick={signInWithGoogle}><FaGoogle color='#fff'/> Login With Google</button>
          <span className={styles.register}>
            <p>Don't have an account? </p>
            <Link to='/register'>Register</Link>
          </span>
          
        </div>
      </Card>

    </section>
    </>
  )
}

export default Login