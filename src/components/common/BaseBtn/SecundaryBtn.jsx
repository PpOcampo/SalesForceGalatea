import React, { Component } from "react";
import styles from "./SecundaryBtn.css";
import { Button } from "reactstrap";

class SecundaryBtn extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.props.onClick();
  }

  render() {
    return (
      <div
        className={`${styles.submitBtn} ${
          this.props.className ? this.props.className : ""
        }`}
      >
        <Button
          id={this.props.id}
          onClick={this.onClick}
          disabled={this.props.disabled}
        >
          {this.props.children}
        </Button>
      </div>
    );
  }
}
export default SecundaryBtn;
