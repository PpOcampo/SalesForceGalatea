import React, { useState } from "react";
import styles from "./AssistedXfer.css";
import { log } from "../../../helper/UtilsHelper.js";
import Integration from "../../../helper/Integration.js";
import CallingXfer from "./CallingXfer.jsx";
import Main from "./Main.jsx";
import BaseRadioBtn from "../../common/BaseRadioBtn/BaseRadioBtn.jsx";
import { CustomInput, FormGroup, Button } from "reactstrap";

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
      {showNext ? (
        <CallingXfer
          phoneNumber={phoneNumber}
          labels={props.labels.CallingXfer}
        />
      ) : (
        <Main
          onXfer={onXfer}
          onBackBtn={onBackBtn}
          labels={props.labels.Main}
        />
      )}
      {/* <FormGroup>
        <BaseRadioBtn id={"1"} name={"xfer"} label={"seleccionado"} />
        <BaseRadioBtn id={"2"} name={"xfer"} label={"seleccionado"} />
      </FormGroup> */}
    </div>
  );
}
