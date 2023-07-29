import { useState } from 'react'
import styles from "./auth.module.scss"
import loginBg from '../../assets/loginBg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import { FcGoogle } from "react-icons/fc"
import { toast, ToastContainer } from 'react-toastify'
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import { auth } from "../../firebase/config"
import Loader from "../../components/loader/Loader"
import { useSelector } from 'react-redux'
import { selectPreviousURL } from '../../redux/slice/cartSlice'
import { BsEnvelope, BsEye, BsEyeSlash } from "react-icons/bs"
import { BiLock } from "react-icons/bi"

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
      
      const user = userCredential.user;
      setIsLoading(false);
      if (user.emailVerified) {
        toast.success("Login Successful");
        redirectUser();
      } else {
        toast.error("Please verify your email before logging in.");
      }
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
      const user = result.user;
      if (user.emailVerified) {
        toast.success("Login Successfully with Google");
        redirectUser();
      } else {
        toast.error("Please verify your email before logging in.");
      }
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
      <div className={styles.imgLogin}>
        <img src= {loginBg} alt='Login' width="600px"/>
      </div>

      
      <Card>
        <div className={styles.form}>
          <h2>Login</h2>
          
          <form onSubmit={loginUser}>
          <div className={styles['input-box']}>
              <div className={styles['input-background']}>
                <BsEnvelope className={styles['input-icon']} />
              </div>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles['input-box']}>
              <div className={styles['input-background']}>
                <BiLock className={styles['input-icon']} />
              </div>
              <input
                type={visible ? 'text' : 'password'}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div onClick={() => setVisible(!visible)} className={styles.eyePassword}>
                {visible ? <BsEye /> : <BsEyeSlash />}
              </div>
            </div>
              <button type='submit' className='--btn --btn-Login --btn-block'>Login</button>
              <div className={styles.links}>
                <Link to ='/reset'>Forgot Password?</Link>
              </div>
            <p>-- or --</p>
          </form>
          <div className={styles.googleButton}>
            <button className="--btn --btn-google --btn-block" onClick={signInWithGoogle}>
                <FcGoogle className={styles.googleIcon} />
                <span>Login With Google</span>
            </button>
          </div>
          <span className={styles.register}>
            <p>Don't have an account? </p>
            <Link to='/register'>SignUp</Link>
          </span>
          
        </div>
      </Card>

    </section>
    </>
  )
}

export default Login