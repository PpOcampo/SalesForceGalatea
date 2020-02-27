import React, { useState } from "react";

import { Input } from "reactstrap";

import "!style-loader!css-loader!./BaseInput.css";
import { log } from "../../../helper/UtilsHelper.js";

export default function BaseInput(props) {
  const [value, setValue] = useState(props.value);

  const onChange = e => {
    const regex = RegExp(props.regex);
    if (regex.test(e.target.value)) {
      props.onChange(e);
      setValue(e.target.value);
    }
  };

  return (
    <>
      <Input
        className={`base-input ${props.className}`}
        type={"number"}
        name={props.name}
        id={props.id}
        onChange={onChange}
        step={props.step}
        min={props.min}
        max={props.max}
        value={value}
        // onKeyPress={onKeyPress}
      />
    </>
  );
}
