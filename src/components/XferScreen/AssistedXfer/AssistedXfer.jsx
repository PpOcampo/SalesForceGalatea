import React, { useState } from "react";
import styles from "./AssistedXfer.css";
import { log } from "../../../helper/UtilsHelper.js";
import Integration from "../../../helper/Integration.js";
import CallingXfer from "./CallingXfer.jsx";
import Main from "./Main.jsx";
import BaseRadioBtn from "../../common/BaseRadioBtn/BaseRadioBtn.jsx";

export default function AssistedXfer(props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNext, setShowNext] = useState(false);

  const onBackBtn = () => {
    props.onBackBtn();
  };

  const onXfer = phoneNumber => {
    setPhoneNumber(phoneNumber);
    Integration.getInstance().assistedDialNumber(phoneNumber);
    setShowNext(true);
  };

  return (
    <div className={styles.main}>
      {/* {showNext ? (
        <CallingXfer phoneNumber={phoneNumber} />
      ) : (
        <Main onXfer={onXfer} onBackBtn={onBackBtn} />
      )} */}
      <BaseRadioBtn />
      <BaseRadioBtn />
    </div>
  );
}
