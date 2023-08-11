import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";

const Navigation = () => {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItem: "center",
  };
  const logo = {
    width: "31px",
    marginRight: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);

  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img style={logo} src="/images/wave_emoji.png" alt="Logo" />
        <span>JKLU Radio</span>
      </Link>
      {isAuth && user.activated && user && (
        <div className={styles.navRight}>
          <h3>{user.name}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout_icon.png" alt="logout" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
