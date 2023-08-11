import React from 'react'
import styles from './Button.module.css';

const Button = ({btntext, onClick}) => {
  return (
    <button onClick={onClick} className={styles.btn}>
        <span>{btntext}</span>
        <img className={styles.arrow} src="/images/Right_arrow.png" alt="Arrow" />
    </button>
  )
}

export default Button;