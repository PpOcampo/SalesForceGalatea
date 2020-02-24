import React, { useState } from "react";
import styles from "./DialingXfer.css";
import { HangUpBtn } from "../../common/BaseCallBtn/BaseCallBtn.jsx";
import Integration from "../../../helper/Integration.js";
import {
  XferCallBtn,
  ConferenceBtn
} from "../../common/BaseCallBtn/BaseCallBtn.jsx";

export default function DialingXfer(props) {
  const [firstCallHold, setFirstCallHold] = useState(true);

  const onHangUpXfer = () => {
    Integration.getInstance().assistedXFerHangUP();
  };

  const onXferHangUp = () => {
    Integration.getInstance().assistedXFerTransferCalls();
  };

  const onConference = () => {
    console.log("asdasd");
  };

  const useMainCall = () => {
    Integration.getInstance().assistedXFerUseMainCall();
    setFirstCallHold(!firstCallHold);
  };

  const useSecondCall = () => {
    Integration.getInstance().assistedXFerUseSecondCall();
    setFirstCallHold(!firstCallHold);
  };

  return (
    <div className={styles.content}>
      <div className={styles.title}>LLAMADAS</div>
      <div className={styles.items}>
        <div
          className={`${styles.item} ${firstCallHold && styles.hold}`}
          onClick={useMainCall}
        />
        <div
          className={`${styles.item} ${!firstCallHold && styles.hold}`}
          onClick={useSecondCall}
        />
      </div>

      <div className={styles.footer}>
        <ConferenceBtn onClick={onConference} />
        <HangUpBtn onClick={onHangUpXfer} />
        <XferCallBtn onClick={onXferHangUp} />
      </div>
    </div>
  );
}
