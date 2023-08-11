import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvatar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http/index";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepAvatar = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/monkey-img.png");
  const [loading, setLoading] = useState(false);

  function captureChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if (!name) return;
    setLoading(true);
    try {
      let requestData = { name };
      if (avatar) {
        requestData.avatar = avatar;
      }

      const { data } = await activate(requestData);
      if (data.auth) {
        dispatch(setAuth(data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader message={"Activation in progress..."} />;

  return (
    <>
      <Card title={`Okay, ${name}!`} icon="monkey_emoji">
        <p className={styles.subHeading}>How's this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImg} src={image} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureChange}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a diffrent photo
          </label>
        </div>
        <div>
          <Button onClick={submit} btntext="Next" />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
