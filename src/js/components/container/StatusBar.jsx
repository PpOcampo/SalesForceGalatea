import React, { Component } from "react";
import styles from "./StatusBar.css";

class StatusBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.show ? (
      <div className={`${styles.main} ${styles["green"]}`}>Disponible</div>
    ) : (
      <></>
    );
  }
}
export default StatusBar;
