import React, { useState } from "react";

import { CustomInput, FormGroup, Button } from "reactstrap";

import "!style-loader!css-loader!./BaseRadioBtn.css";

export default function BaseRadioBtn(props) {
  const onClick = e => {
    props.onClick(props.value);
  };

  return (
    <>
      <CustomInput
        type="radio"
        id={props.id}
        name={props.name}
        label={props.label}
        className={`radioBtn ${props.active && "active"}`}
        onClick={onClick}
      />
    </>
  );
}
