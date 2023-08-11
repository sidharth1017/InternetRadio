import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";
import styles from "./StepName.module.css";
import Error from "../../../components/shared/Error/Error";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullName] = useState(name);
  const [showWarning, setShowWarning] = useState(false);

  function nextStep() {
    if (!fullname) {
      setShowWarning(true);
      return;
    }
    dispatch(setName(fullname));
    onNext();
  }

  return (
    <>
      <Card title="What's your full name?" icon="google_emoji">
        {showWarning && (
          <Error
            text="Please enter your name !!"
            onClose={() => setShowWarning(false)}
          />
        )}

        <TextInput
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div>
          <div>
            <p className={styles.paragraph}>
              People use real names at JKLU Radio :) !
            </p>
          </div>
          <div>
            <Button onClick={nextStep} btntext="Next" />
          </div>
        </div>
      </Card>
    </>
  );
};

export default StepName;
