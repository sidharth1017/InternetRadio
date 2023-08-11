import React from "react";
import styles from "./Error.module.css";

const Error = ({ text, onClose }) => {
  return (
    <div className={styles.errorWrapper}>
      <span>
        <p>{text}</p>
        <button onClick={onClose}>
          <img src="/images/close.png" alt="" />
        </button>
      </span>
    </div>
  );
};

export default Error;
