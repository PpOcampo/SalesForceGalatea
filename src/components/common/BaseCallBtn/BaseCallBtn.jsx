import styles from "./BaseCallBtn.css";
import React, { useState } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

/************* HangUpBtn *************/
export const HangUpBtn = props => (
  <div className={` ${styles.btn}`} onClick={props.onClick}>
    <div className={styles.hangUp} />
  </div>
);

/************* MuteBtn *************/
export function MuteBtn(props) {
  const [mute, setMute] = useState(false);

  const onClick = () => {
    setMute(!mute);
    props.onClick();
  };

  return (
    <div className={styles.btnAdvance} onClick={onClick}>
      <div className={`${styles.mute} ${mute && styles.active}`} />
    </div>
  );
}

/************* HoldBtn *************/
export function HoldBtn(props) {
  const [hold, setHold] = useState(false);

  const onClick = () => {
    setHold(!hold);
    props.onClick();
  };

  return (
    <div className={styles.btnAdvance} onClick={onClick}>
      <div className={`${styles.hold} ${hold && styles.active}`} />
    </div>
  );
}

/************* XferCallBtn *************/
export function XferCallBtn(props) {
  const [xferCall, setXferCall] = useState(false);

  const onClick = () => {
    setXferCall(!xferCall);
    props.onClick();
  };

  return (
    <div className={styles.btnAdvance} onClick={onClick}>
      <div className={`${styles.xferCall} ${xferCall && styles.active}`} />
    </div>
  );
}

/************* XferCallBtn *************/
export function ConferenceBtn(props) {
  const [conference, setConference] = useState(false);

  const onClick = () => {
    setConference(!conference);
    props.onClick();
  };

  return (
    <div className={styles.btnAdvance} onClick={onClick}>
      <div className={`${styles.conference} ${conference && styles.active}`} />
    </div>
  );
}

/************* XferBtn *************/
export const XferBtn = props => (
  <UncontrolledDropdown direction="left" className={styles.dropdown}>
    <DropdownToggle className={styles.btnAdvance}>
      <div className={styles.xfer} />
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem onClick={props.onBlindXfer}>
        Transferencia ciega
      </DropdownItem>
      <DropdownItem onClick={props.onAssistedXfer}>
        Transferencia Asistida
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);
