import React from 'react'
import styles from './Card.module.css';

const Card = ({title, icon, children}) => {
    
    const logo = {
        width:"31px"
    } 

  return (
      <div className={styles.card}>
        <div className={styles.headingWrapper}>
            {icon && <img style={logo} src={`/images/${icon}.png`} alt="Logo" />}
            {title && <h1 className={styles.heading}>{title}</h1>}
        </div>
        {children}
      </div>
  )
}

export default Card