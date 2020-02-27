import React from "react";
import styles from "./BaseCheckBox.css";
import { Input } from "reactstrap";

export default function BaseCheckBox(props) {
  const onChange = e => {
    var selected = props.options.find(
      option => parseInt(option.Id) === parseInt(e.currentTarget.value)
    );
    props.onChange(selected);
  };

  return (
    <Input
      className={styles.selectInput}
      type="select"
      name="select"
      id={`chk-${props.id}`}
      onChange={onChange}
    >
      {props.default && (
        <option hidden selected>
          {props.hiddenOption}
        </option>
      )}

      {props.options &&
        props.options.map(option => (
          <option value={option.Id}>{option.Description}</option>
        ))}
    </Input>
  );
}
