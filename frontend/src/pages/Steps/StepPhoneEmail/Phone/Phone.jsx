import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';
import Error from '../../../../components/shared/Error/Error';


const Phone = ({onNext}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
 
  async function submit() {

    if(!phoneNumber) {
      setShowWarning(true);
      return;
    };        
    const { data } = await sendOtp({phone: phoneNumber});
    console.log(data);
    dispatch(setOtp({phone: data.phone, hash: data.hash}));
    onNext();
  }

  const handleClick = () => {
    setShowMessage(true);
  };

  return (
    <Card title="Enter your phone number" icon="phone_emoji">
      { showWarning && <Error text="Please enter your phone number !!" onClose={() => setShowWarning(false)}/>}
      { showMessage && <Error text="Please use email option to login !!" onClose={() => setShowMessage(false)}/>}
      
      <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      
      <div>

      <div>
        <Button btntext="Next" onClick={handleClick} />
      </div>

      <div>
        <p className={styles.paragraph}>By entering your number, you’re agreeing to our Terms of Services and Privacy Policy. Thanks!</p>
      </div>

      </div>

      </Card>
  )
}

export default Phone;