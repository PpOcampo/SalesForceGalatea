import React, { Component } from "react";
import styles from "./StatusBar.css";

class StatusBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { labels } = this.props;

    let className = this.props.title.toLowerCase();
    return this.props.show ? (
      <div className={`${styles.main} ${styles[className]}`}>
        {labels[className]}
      </div>
    ) : (
      <></>
    );
  }
}
export default StatusBar;
