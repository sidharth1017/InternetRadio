import React, { useState } from 'react';
import Phone from './Phone/Phone';
import Email from './Email/Email';
import styles from './StepPhoneEmail.module.css';

const phoneEmailMap = {
  phone: Phone,
  email: Email
}

const StepPhoneEmail = ({onNext}) => {
  
  const [type, setType] = useState('email');
  const Component = phoneEmailMap[type];

  return (
      <>
        <div className='cardWrapper'> 
          <div>
            <div className={styles.buttonWrapper}>
              <button className= {`${styles.tabBtn} ${type === 'email' ? styles.active: ''}`} onClick={() => setType('email')}>
              <img src="/images/email_icon.png" alt="email" />
              </button>
              <button className = {`${styles.tabBtn} ${type === 'phone' ? styles.active: ''}`} onClick={() => setType('phone')}>
                <img src="/images/phone_icon.png" alt="phone" />
              </button>
            </div>
            <Component onNext={onNext} />
          </div>       
        </div>


      
      
      
      </>
  )

}

export default StepPhoneEmail