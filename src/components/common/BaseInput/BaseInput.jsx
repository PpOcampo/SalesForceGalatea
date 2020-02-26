import React, { useState } from "react";

import { Input } from "reactstrap";

import "!style-loader!css-loader!./BaseInput.css";

export default function BaseInput(props) {
  const onChange = e => {
    props.onChange(e);
  };

  return (
    <>
      <Input
        className={`base-input ${props.className}`}
        type={props.type}
        name={props.name}
        id={props.id}
        onChange={onChange}
        step={props.step}
        min={props.min}
        max={props.max}
      />
    </>
  );
}
