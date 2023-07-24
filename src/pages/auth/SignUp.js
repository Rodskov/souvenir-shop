import { useState } from "react"
import styles from "./auth.module.scss"
import signupBg from '../../assets/signupBg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'

import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../../firebase/config"
import Loader from "../../components/loader/Loader"
import { toast, ToastContainer } from 'react-toastify'
import { BsEye, BsEyeSlash, BsFillCheckCircleFill, BsFillExclamationCircleFill } from "react-icons/bs"

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
  
    // let lowerCase = document.getElementById('lower');
    // let upperCase = document.getElementById('upper');
    // let digit = document.getElementById('number');
    // let specialChar = document.getElementById('special');
    // let minLength= document.getElementById('length');

    // function checkPassword(data) {
    //   const lower = new RegExp('(?=.*[a-z])');
    //   const upper = new RegExp('(?=.*[A-Z])')
    //   const number = new RegExp('(?=.*[0-9])')
    //   const special = new RegExp('(?=.*[!@#\$%\^&\*])')
    //   const length= new RegExp('(?=.{8})')

    //   //Lowercase Validation check
    //   if(lower.test(data)){
    //     lowerCase.classList.add("valid");
    //   }else{
    //     lowerCase.classList.remove("valid");
    //   }
    //   //Uppercase Validation check
    //   if(upper.test(data)){
    //     upperCase.classList.add("valid");
    //   }else{
    //     upperCase.classList.remove("valid");
    //   }
    //   //Number Validation check
    //   if(number.test(data)){
    //     digit.classList.add("valid");
    //   }else{
    //     digit.classList.remove("valid");
    //   }
    //   //Special Charac Validation check
    //   if(special.test(data)){
    //     specialChar.classList.add("valid");
    //   }else{
    //     specialChar.classList.remove("valid");
    //   }
    //   //Length Validation check
    //   if(length.test(data)){
    //     minLength.classList.add("valid");
    //   }else{
    //     minLength.classList.remove("valid");
    //   }
    // }
    //Validation states
    const [visible , setVisible] = useState(false);
    const [lowerValidated, setLowerValidated] = useState(false);
    const [upperValidated, setUpperValidated] = useState(false);
    const [numberValidated, setNumberValidated] = useState(false);
    const [specialValidated, setSpecialValidated] = useState(false);
    const [lengthValidated, setLengthValidated] = useState(false);

    const handleChange=(value) =>{
      const lower = new RegExp('(?=.*[a-z])');
      const upper = new RegExp('(?=.*[A-Z])')
      const number = new RegExp('(?=.*[0-9])')
      const special = new RegExp('(?=.*[!@#\$%\^&\*])')
      const length= new RegExp('(?=.{8})')
      //Lowercase Validation check
      if(lower.test(value)){
        setLowerValidated(true);
      }else{
        setLowerValidated(false);
      }
      //Uppercase Validation check
      if(upper.test(value)){
        setUpperValidated(true);
      }else{
        setUpperValidated(false);
      }
      //Number Validation check
      if(number.test(value)){
        setNumberValidated(true);
      }else{
        setNumberValidated(false);
      }
      //Special Charac Validation check
      if(special.test(value)){
        setSpecialValidated(true);
      }else{
        setSpecialValidated(false);
      }
      //Length Validation check
      if(length.test(value)){
        setLengthValidated(true);
      }else{
        setLengthValidated(false);
      }
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
              <div className={styles['password-box']}>
              <input type={visible ? "text" : "password"} placeholder='Password' value={password} onChange={(e) => {setPassword(e.target.value); handleChange(e.target.value)}}  required />
              <div onClick={()=> setVisible(!visible)} className={styles.eyePassword}>
                  {visible ? <BsEye/> : <BsEyeSlash/>}
                </div>
              </div>

              <div className={styles['password-box']}>
              <input type={visible ? "text" : "password"} placeholder='Confirm Password' value={cPassword} onChange={(e) => setCPassword(e.target.value)} required />
              <div onClick={()=> setVisible(!visible)} className={styles.eyePassword}>
                  {visible ? <BsEye/> : <BsEyeSlash/>}
                </div>
              </div>
              <button type="submit" className='--btn --btn-primary --btn-block'>Sign Up</button>
              
          </form>
          <span className={styles.register}>
            <p>Already have an account? </p>
            <Link to='/login'>Login</Link>
          </span>
          <div className={styles["tracker-box"]}>
            <div className={lowerValidated? styles.validated: "not-validated"}>{lowerValidated?(
              <span className={styles["list-icon"]}>
                <BsFillCheckCircleFill/>
              </span>
            ):(
              <span className={styles["list-icon"]}>
                <BsFillExclamationCircleFill/>
              </span>
            )}At least one lowercase character</div>
            <div className={upperValidated? styles.validated: "not-validated"}>{upperValidated?(
              <span className={styles["list-icon"]}>
                <BsFillCheckCircleFill/>
              </span>
            ):(
              <span className={styles["list-icon"]}>
                <BsFillExclamationCircleFill/>
              </span>
            )}At least one uppercase character</div>
            <div className={numberValidated? styles.validated: "not-validated"}>{numberValidated?(
              <span className={styles["list-icon"]}>
                <BsFillCheckCircleFill/>
              </span>
            ):(
              <span className={styles["list-icon"]}>
                <BsFillExclamationCircleFill/>
              </span>
            )}At least one number</div>
            <div className={specialValidated? styles.validated: "not-validated"}>{specialValidated?(
              <span className={styles["list-icon"]}>
                <BsFillCheckCircleFill/>
              </span>
            ):(
              <span className={styles["list-icon"]}>
                <BsFillExclamationCircleFill/>
              </span>
            )}At least one special character</div>
            <div className={lengthValidated? styles.validated: "not-validated"}>{lengthValidated?(
              <span className={styles["list-icon"]}>
                <BsFillCheckCircleFill/>
              </span>
            ):(
              <span className={styles["list-icon"]}>
                <BsFillExclamationCircleFill/>
              </span>
            )}At least 8 characters</div>
          </div>
          
        </div>
      </Card>
      <div className={styles.img}>
        <img src= {signupBg} alt='Login' width="330px"/>
      </div>
      
    </section>
    </>
  )
}

export default SignUp