import React from "react";
import styles from "./Loader.module.css";
import Card from "../Card/Card";

const Loader = ({ message }) => {
  return (
    <div className="cardWrapper">
      <Card>
        <svg className={styles.spinner}
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="none"
        >
          <circle cx="25" cy="25" r="23" stroke="#C4C5C5" strokeWidth="4" />
          <mask id="a" fill="#fff">
            <path d="M32.796 1.247A25 25 0 1 1 .5 29.974l3.968-.805A20.95 20.95 0 1 0 31.533 5.094l1.263-3.847Z" />
          </mask>
          <path
            stroke="#5453E0"
            strokeWidth="8"
            d="M32.796 1.247A25 25 0 1 1 .5 29.974l3.968-.805A20.95 20.95 0 1 0 31.533 5.094l1.263-3.847Z"
            mask="url(#a)"
          />
        </svg>
        <span className={styles.message}>{message}</span>
      </Card>
    </div>
  );
};

export default Loader;
