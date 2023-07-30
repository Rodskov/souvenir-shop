import { useEffect, useState } from "react"
import styles from "./auth.module.scss"
import signupBg from '../../assets/signupBg.jpg'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'

import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth'
import { auth } from "../../firebase/config"
import Loader from "../../components/loader/Loader"
import { toast } from 'react-toastify'
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
      } else if(
        !lowerValidated ||
        !upperValidated ||
        !numberValidated ||
        !specialValidated ||
        !lengthValidated
      ){
        toast.error("Password does not meet the required criteria.");
      }
      setIsLoading(true)

      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        signOut(auth);
        // Send verification email to the user
        sendEmailVerification(user)
          .then(() => {
            setIsLoading(false);
            toast.success("Registration Successful. Verification email sent!");
            
            navigate("/login");
          })
          .catch((error) => {
            toast.error("Error sending verification email.");
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
      

    }
    
  
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
      const special = new RegExp('(?=.*[!@#$%^&*-_+=])')
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
                    {visible ? <BsEye/>  :  <BsEyeSlash/>}
                  </div>
              </div>

              <div className={styles['password-box']}>
              <input type={visible ? "text" : "password"} placeholder='Confirm Password' value={cPassword} onChange={(e) => setCPassword(e.target.value)} required />
              <div onClick={()=> setVisible(!visible)} className={styles.eyePassword}>
                  {visible ? <BsEye/> :  <BsEyeSlash/>}
                </div>
              </div>
              <button type="submit" className='--btn --btn-signUp --btn-block'>Sign Up</button>
              
          </form>
          <span className={styles.register}>
            <p>Already have an account? </p>
            <Link to='/login'>Login</Link>
          </span>
          <div className={`${styles['tracker-box']} ${styles[password.length > 0 ? 'show' : 'hide']}`}>
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
      <div className={styles.imgSignUp}>
        <img src= {signupBg} alt='SignUp' width="470px"/>
      </div>
      
    </section>
    </>
  )
}

export default SignUp