import React from 'react';
import styles from './Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {

  const signin = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
  }
  
  const navigate = useNavigate();

  function startRegister() {
    navigate('/authenticate');
  }


  return (

    <div className='cardWrapper'>

      <Card title="Welcome to JKLU Radio!" icon="wave_emoji">

      <p className={styles.text}>We’re working to make a community where we can discuss about anything:)</p>

      <div>
        <Button onClick={startRegister} btntext="Let's Go" />
      </div>

      {/* <div>
        <span className={styles.hasInvite}>Have an invite text?</span>
        <Link style = {signin} to="/login">Sign in</Link>
      </div> */}

      </Card>

    </div>
  );
}

export default Home;