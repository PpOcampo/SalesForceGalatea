import React, { Component } from "react";
import styles from "./StatusBar.css";

class StatusBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = this.props.title.toLowerCase();
    return this.props.show ? (
      <div className={`${styles.main} ${styles[className]}`}>
        {this.props.title}
      </div>
    ) : (
      <></>
    );
  }
}
export default StatusBar;
