import React, { useRef } from 'react'
import styles from "./Contact.module.scss"
import Card from '../../components/card/Card'
import { FaEnvelope, FaFacebook, FaPhoneAlt } from 'react-icons/fa'
import { GoLocation } from "react-icons/go"
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify'

const ContactUs = () => {
  const form = useRef();


  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(process.env.REACT_APP_EMAILJS_ID , 'template_jcitp0k', form.current, '2e3ng8vS4fOomnpan')
      .then((result) => {
         toast.success("The Message was sent")
      }, (error) => {
        toast.error(error.text)
         
      });
      e.target.reset()
  };

  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <h2>Contact Us</h2>
        <div className={styles.section}>
          <form ref={form} onSubmit={sendEmail}>
            <Card cardClass = {styles.card}>
              <label>Name</label>
              <input type='text' name='user_name' placeholder='Full Name' required/>
              <label>Email</label>
              <input type='email' name='email' placeholder='Active Email' required/>
              <label>Subject</label>
              <input type='text' name='subject' placeholder='Subject' required/>
              <label>Message</label>
              <textarea name= "message" cols="30" rows="10"></textarea>
              <button className='--btn --btn-primary3'>Send Message</button>
            </Card>
          </form>
          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our Contact Information</h3>
              <p>The trendsetter clothing brand for every PUPian, <br/>because great minds deserve great styles.</p>

              <div className={styles.icons}>
                <span>
                  <FaPhoneAlt size={"15px"}/>
                  <p>0931-106-6088</p>
                </span>
                <span>
                  <FaEnvelope size={"15px"}/>
                  <p>tanglawclothing@gmail.com</p>
                </span> 
                <span>
                  <GoLocation size={"15px"}/>
                  <p>247 Teresa St. Sta. Mesa, Manila</p>
                </span>
                <span>
                  <FaFacebook size={"15px"}/>
                  <p>Tanglaw Clothing</p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs