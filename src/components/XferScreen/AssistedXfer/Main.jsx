import React, { useState } from "react";
import styles from "./Main.css";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import BasePhoneInput from "../../common/BasePhoneInput/BasePhoneInput.jsx";
import BaseRadioBtn from "../../common/BaseRadioBtn/BaseRadioBtn.jsx";

export default function Main(props) {
  const [input, setInput] = useState("");

  const onBackBtn = () => {
    props.onBackBtn();
  };

  const onChange = input => {
    setInput(input);
  };

  const onBtnClick = () => {
    props.onXfer(input);
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.back} onClick={onBackBtn} />
        <div className={styles.title}>{props.labels.title}</div>
        <div></div>
      </div>
      <div className={styles.content}>
        <div className={styles.mainScreen}>
          <div>{props.labels.numLabel}</div>
          <BasePhoneInput value={input} onChange={onChange}></BasePhoneInput>
          <BaseBtn onClick={onBtnClick} disabled={input.length < 4}>
            {props.labels.xferBtn}
          </BaseBtn>
        </div>
      </div>
    </div>
  );
}
