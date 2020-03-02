import React, { useState, useEffect } from "react";
import styles from "./CallingXfer.css";
import { HangUpBtn } from "../../common/BaseCallBtn/BaseCallBtn.jsx";
import StatusBar from "../../StatusBar/StatusBar.jsx";
import DialingXfer from "./DialingXfer.jsx";
import IntegrationListener from "../../../helper/IntegrationListeners.js";
import Integration from "../../../helper/Integration.js";

export default function CallingXfer(props) {
  const [input, setInput] = useState("");
  const [secondCall, setSecondCall] = useState(false);

  useEffect(() => {
    IntegrationListener.onSecondCallConected(onSecondCall);
  }, []);

  const onSecondCall = () => {
    setSecondCall(true);
  };
  const onHangUp = () => {
    Integration.getInstance().assistedXFerHangUP();
  };

  return (
    <div className={styles.content}>
      {/* {false ? ( */}
      {!secondCall ? (
        <div className={styles.calling}>
          <div className={styles.title}>{props.labels.title}</div>
          <div className={styles.center}>
            <div className={styles.logo} />
            <div className={styles.number}>{props.phoneNumber}</div>
          </div>
          <HangUpBtn onClick={onHangUp} phoneNumber={props.phoneNumber} />
        </div>
      ) : (
        <DialingXfer labels={props.labels.DialingXfer} />
      )}
    </div>
  );
}
