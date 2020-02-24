import React, { useState } from "react";
import styles from "./Main.css";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import BasePhoneInput from "../../common/BasePhoneInput/BasePhoneInput.jsx";

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
        <div className={styles.title}>Transferencia Asistida</div>
        <div></div>
      </div>
      <div className={styles.content}>
        <div className={styles.mainScreen}>
          <div>Numero</div>
          <BasePhoneInput value={input} onChange={onChange}></BasePhoneInput>
          <BaseBtn onClick={onBtnClick}>Transferir</BaseBtn>
        </div>
      </div>
    </div>
  );
}
