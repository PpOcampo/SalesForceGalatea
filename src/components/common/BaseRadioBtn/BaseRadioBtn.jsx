import React, { useState } from "react";

import { CustomInput, FormGroup, Button } from "reactstrap";

import "!style-loader!css-loader!./BaseRadioBtn.css";

export default function BaseRadioBtn(props) {
  const [active, setActive] = useState(false);

  const onChange = e => {
    console.log(e.currentTarget);
    setActive(e.currentTarget.checked);
    props.onChange({ id: props.id, name: props.name });
  };
  return (
    <>
      <CustomInput
        type="radio"
        id={props.id}
        name={props.name}
        label={props.label}
        className={`radioBtn ${active && "active"}`}
        onChange={onChange}
      />
    </>
  );
}
