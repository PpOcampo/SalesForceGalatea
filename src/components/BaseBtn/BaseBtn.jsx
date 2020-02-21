import React, { Component } from "react";
import styles from "./BaseBtn.css";
import { Button } from "reactstrap";

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
      <div className={styles.submitBtn}>
        <Button onClick={this.onClick} disabled={this.props.disabled}>
          {this.props.children}
        </Button>
      </div>
    );
  }
}
export default BaseBtn;
