import React, { useState } from "react";

import BaseRadioBtn from "../common/BaseRadioBtn/BaseRadioBtn.jsx";
import styles from "./Reprogram.css";
import { FormGroup } from "reactstrap";

export default function WrapUp(props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [currentRadio, setCurrentRadio] = useState(null);

  const onClick = currentRadio => {
    setCurrentRadio(currentRadio);
  };

  return (
    <div className={styles.main}>
      <div>Seleccionar o agregar numero</div>
      <FormGroup>
        {props.phoneNumbers.map(
          (element, i) =>
            element.length > 0 && (
              <BaseRadioBtn
                id={`rRadio-${i}`}
                name={"reprogramRadio"}
                label={`${element}`}
                onClick={onClick}
                value={{ Id: i, phone: element }}
                active={currentRadio && currentRadio.Id === i}
              />
            )
        )}
        <div className={styles.defaultRadio}>
          <BaseRadioBtn
            id={`rRadio-default`}
            name={"reprogramRadio"}
            onClick={onClick}
            value={{ Id: "default", phone: "" }}
            active={currentRadio && currentRadio.Id === "default"}
          />
          <input
            id="loginUserName"
            type="text"
            name="fname"
            placeholder={"Ingresa un numero"}
          />
        </div>
      </FormGroup>
    </div>
  );
}
