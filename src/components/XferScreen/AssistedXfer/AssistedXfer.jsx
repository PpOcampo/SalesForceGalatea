import React, { useState } from "react";
import styles from "./AssistedXfer.css";
import { log } from "../../../helper/UtilsHelper.js";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import BasePhoneInput from "../../common/BasePhoneInput/BasePhoneInput.jsx";
import BaseCircularProgress from "../../common/BaseCircularProgress/BaseCircularProgress.jsx";
import BaseStopWatch from "../../common/BaseStopWatch/BaseStopWatch.jsx";
import { CircularProgressbar } from "react-circular-progressbar";
import BaseCheckBox from "../../common/BaseCheckBox/BaseCheckBox.jsx";

export default function AssistedXfer(props) {
  const [input, setInput] = useState("");

  const onBackBtn = () => {
    props.onBackBtn();
  };

  const onChange = value => {
    setInput(value);
  };

  const onSelectChange = value => {
    console.log(value);
  };

  const onBtnClick = value => {
    console.log(value);
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
        <BaseCheckBox
          id="default"
          hiddenOption={"Selecciona una option para continuar "}
          options={[
            { Id: 1, Description: "Alex" },
            { Id: 2, Description: "Alex2" }
          ]}
          onChange={onSelectChange}
        />
      </div>
    </div>
  );
}
