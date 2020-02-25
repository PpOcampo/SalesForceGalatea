import React, { useState } from "react";
import styles from "./DialingXfer.css";
import { HangUpBtn } from "../../common/BaseCallBtn/BaseCallBtn.jsx";
import Integration from "../../../helper/Integration.js";
import {
  XferCallBtn,
  ConferenceBtn
} from "../../common/BaseCallBtn/BaseCallBtn.jsx";

export default function DialingXfer(props) {
  const [firstCallActive, setFirstCallActive] = useState(true);

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
    if (!firstCallActive) {
      Integration.getInstance().assistedXFerUseMainCall();
      setFirstCallActive(!firstCallActive);
    }
  };

  const useSecondCall = () => {
    if (firstCallActive) {
      Integration.getInstance().assistedXFerUseSecondCall();
      setFirstCallActive(!firstCallActive);
    }
  };

  const item = (active, onClick, onHanUp, text) => {
    return (
      <div className={`${styles.item} ${!active && styles.hold}`}>
        <div onClick={onClick} className={styles.click}>
          <div
            className={`${active ? styles.pauseIcon : styles.phoneIcon}`}
          ></div>
          <div>
            <div>{text}</div>
            <div>{active ? "En dialogo" : "En espera"}</div>
          </div>
        </div>
        <div className={styles.itemHangUp}>
          <HangUpBtn onClick={onHanUp} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.content}>
      <div className={styles.title}>LLAMADAS</div>
      <div className={styles.items}>
        {item(firstCallActive, useMainCall, () => {}, "Primera llamada")}
        {item(!firstCallActive, useSecondCall, () => {}, "Segunda llamada")}
      </div>

      <div className={styles.footer}>
        <ConferenceBtn onClick={onConference} />
        <HangUpBtn onClick={onHangUpXfer} />
        <XferCallBtn onClick={onXferHangUp} />
      </div>
    </div>
  );
}
