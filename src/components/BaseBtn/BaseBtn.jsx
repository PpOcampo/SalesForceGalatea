import React, { Component } from "react";
import styles from "./BaseBtn.css";

class BaseBtn extends Component {
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
        className={`${styles.main} ${styles[this.props.type]}`}
        onClick={this.onClick}
      >
        <div className={`${styles.icon}  ${styles[this.props.type]}`}></div>
      </div>
    );
  }
}
export default BaseBtn;
