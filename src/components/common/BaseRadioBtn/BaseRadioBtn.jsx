import React from "react";

import { CustomInput, FormGroup, Button } from "reactstrap";

import "!style-loader!css-loader!./BaseRadioBtn.css";

export default function BaseRadioBtn(props) {
  const [active, setActive] = useState(null);
  const onChange = () => {
    console.log("ajas");
  };
  return (
    <>
      <CustomInput
        type="radio"
        id={`chkList`}
        name="radioXfer"
        label={"Algun label"}
        className={"radioBtn"}
        onChange={onChange}
      />
    </>
  );
}
