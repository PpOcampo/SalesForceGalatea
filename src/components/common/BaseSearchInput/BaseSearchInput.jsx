import React, { useState } from "react";

import { Input } from "reactstrap";

import "!style-loader!css-loader!./BaseSearchInput.css";

export default function BaseSearchInput(props) {
  const onClose = () => {
    props.onClose();
  };

  const onChange = e => {
    props.onChange(e.target.value);
  };

  return (
    <>
      <div className={"main-search-btn"}>
        <div className={"search-icon-btn"}></div>
        <div>
          <Input
            className={`base-search-input ${props.className}`}
            type={"text"}
            onChange={onChange}
          />
        </div>

        <div className={"close-icon-btn"} onClick={onClose}></div>
      </div>
    </>
  );
}
