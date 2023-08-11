import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';
import Error from '../../../../components/shared/Error/Error';

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch();
 
  async function submit() {

    if(!email) {
      setShowWarning(true);
      return;
    };        
    const { data } = await sendOtp({email: email});
    console.log(data);
    dispatch(setOtp({email: data.email, hash: data.hash}));
    onNext();
  }
  return (
    <Card title="Enter your email id" icon="email_emoji">
      { showWarning && <Error text="Please enter your email !!" onClose={() => setShowWarning(false)}/>}
      

      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      
      <div>

        <div>
          <Button btntext="Next" onClick={submit} />
        </div>

        <div>
          <p className={styles.paragraph}>By entering your email, you’re agreeing to our Terms of Services and Privacy Policy. Thanks!</p>
        </div>

      </div>

      </Card>
  )
}

export default Email;