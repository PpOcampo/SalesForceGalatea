import React, { useState } from "react";

import {
  Input,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

import BaseInput from "../BaseInput/BaseInput.jsx";
import BaseCheckBox from "../BaseCheckBox/BaseCheckBox.jsx";

import "!style-loader!css-loader!./BasePopOver.css";

export default function BasePopOver(props) {
  const onChange = e => {
    props.onClick(e);
  };

  return (
    <>
      <UncontrolledPopover
        trigger="legacy"
        placement={props.placement}
        target={props.target}
        className={""}
      >
        <PopoverBody>
          <div className={props.className}>{props.children}</div>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  );
}
