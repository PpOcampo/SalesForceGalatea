import React, { useState, useEffect } from "react";

import BaseRadioBtn from "../common/BaseRadioBtn/BaseRadioBtn.jsx";
import BaseInput from "../common/BaseInput/BaseInput.jsx";
import styles from "./Reprogram.css";
import { FormGroup } from "reactstrap";
import BaseDatePicker from "../common/BaseDatePicker/BaseDatePicker.jsx";
import SecundaryBtn from "../common/BaseBtn/SecundaryBtn.jsx";
import BaseCheckBox from "../common/BaseCheckBox/BaseCheckBox.jsx";
import BasePopOver from "../common/BasePopOver/BasePopOver.jsx";
import { log } from "../../helper/UtilsHelper.js";
import BasePhoneInput from "../common/BasePhoneInput/BasePhoneInput.jsx";

export default function WrapUp(props) {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [date, setDate] = useState(null);
  const [fullHr, setFulHr] = useState(null);
  const [existingNum, setExistingNum] = useState(false);

  //auxiliars
  const [phoneInput, setPhoneInput] = useState("");
  const [currentRadio, setCurrentRadio] = useState(null);
  const [minutes, setMinutes] = useState(30);
  const [hrs, setHrs] = useState(12);
  const [clock, setClock] = useState(null);

  useEffect(() => {
    if (phoneNumber && date && fullHr) {
      props.onChange(phoneNumber, date + " " + fullHr, existingNum);
    }
  }, [phoneNumber, date, fullHr, existingNum]);

  useEffect(() => {
    if (minutes && hrs && clock) {
      let hrs24 = hrs;
      let min = minutes < 10 ? "0" + minutes : minutes;
      if (clock === "PM") {
        hrs24 = hrs === 12 ? hrs : hrs24 + 12;
      } else if (clock === "AM" && hrs === 12) {
        hrs24 = 0;
      }
      setFulHr(hrs24 + ":" + min);
    }
  }, [minutes, hrs, clock]);

  const onClick = currentRadio => {
    setCurrentRadio(currentRadio);
    let value = currentRadio.Id === "default" ? phoneInput : currentRadio.phone;
    currentRadio.Id === "default";
    setExistingNum(currentRadio.Id !== "default");
    setPhoneNumber(value);
  };

  const onPhoneInput = value => {
    setCurrentRadio({ Id: "default", phone: value });
    setPhoneNumber(value);
    setPhoneInput(value);
  };

  const onDateChange = date => {
    let splitDate = date.toLocaleDateString("en-US").split("/");
    let auxDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
    setDate(auxDate);
  };

  const onMinutes = e => {
    setMinutes(parseInt(e.target.value));
  };

  const onHrs = e => {
    setHrs(parseInt(e.target.value));
  };

  const onClock = item => {
    setClock(item.Description);
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

          <BasePhoneInput
            value={phoneInput}
            onChange={onPhoneInput}
            className={styles.phoneInput}
          />
        </div>
        <div>Fecha</div>
        <BaseDatePicker onChange={onDateChange} />
        <div>Hora</div>
        <div className={styles.btnHrs}>
          <SecundaryBtn id={"PopoverLegacy"}>
            {fullHr ? fullHr + " hrs" : "Seleccione una Hora"}
          </SecundaryBtn>
        </div>
        <BasePopOver
          placement="top"
          target="PopoverLegacy"
          className={styles.mainPopOver}
        >
          <div>
            <div className={styles.popOverTitle}>Hora</div>
            <div>
              <div className={styles.popOverHrs}>
                <BaseInput
                  type={"number"}
                  name={"inputHr"}
                  id={"wrapInputHr"}
                  className={styles.inputHr}
                  onChange={onHrs}
                  min={1}
                  max={12}
                  value={hrs}
                  regex={"^([1-9]|1[012])$"}
                />
                <div className={styles.dots}>:</div>
                <BaseInput
                  type={"number"}
                  name={"inputHr"}
                  id={"wrapInputHr"}
                  className={styles.inputHr}
                  onChange={onMinutes}
                  min={1}
                  max={59}
                  value={minutes}
                  regex={"^[0-5]?[0-9]$"}
                />
              </div>

              <BaseCheckBox
                id={`wrapHrCk`}
                options={[
                  { Id: 1, Description: "AM" },
                  { Id: 2, Description: "PM" }
                ]}
                onChange={onClock}
              />
            </div>
          </div>
        </BasePopOver>
      </FormGroup>
    </div>
  );
}
