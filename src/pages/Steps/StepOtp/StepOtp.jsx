import React, { useState } from "react";
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import styles from './StepOtp.module.css';
import { verifyOtp } from '../../../http/index';
import { useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { useDispatch } from "react-redux";
import Error from '../../../components/shared/Error/Error';


const StepOtp = () => {
  const [otp, setOtp ] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showMessage, setShowMessage] = useState("Please enter correct OTP !!");
  const dispatch = useDispatch();
  const { phone, email, hash} = useSelector((state) => state.auth.otp);

  async function submit() {
    const phoneEmail = phone || email;
    if(!otp || !phoneEmail || !hash) {
      setShowWarning(true);
      return;
    };

    try {
      const { data } = await verifyOtp({otp, hash, phone, email});
      // console.log(data);
      dispatch(setAuth(data));
    } catch(err){
      setShowMessage(err.response.data.message);
      setShowWarning(true);
    }
  }

  return (
    <>
      <div className='cardWrapper'>
        <Card title="Enter the code we just texted you" icon="lock">
        { showWarning && <Error text={showMessage} onClose={() => setShowWarning(false)}/>}

          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />

          <div>
            <div>
              <Button onClick={submit} btntext="Next" />
            </div>

            <div>
              <p className={styles.paragraph}>
                By entering your email, you’re agreeing to our Terms of Services
                and Privacy Policy. Thanks!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
