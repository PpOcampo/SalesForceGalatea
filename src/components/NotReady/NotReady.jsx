import React, { Component } from "react";
import styles from "./NotReady.css";
import { Progress } from "reactstrap";

class NotReady extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onUnavailable = unavailable => {
    this.props.onUnavailable(unavailable);
  };

  render() {
    return this.props.show ? (
      <div className={styles.main}>
        {this.props.unavailables &&
          this.props.unavailables.map(unavailable => (
            <div
              className={`${unavailable.NumberOfEvents === "0" &&
                styles.wrapper}`}
            >
              <div
                className={`${styles.item} ${unavailable.NumberOfEvents ===
                  "0" && styles.unclickable}`}
                onClick={() => this.onUnavailable(unavailable)}
              >
                <div className={styles.icon} />
                <div className={styles.content}>
                  <div>{unavailable.Description}</div>
                  <div className={styles.progress}>
                    <Progress value="500" max={500} />
                  </div>
                  <div className={styles.time}>
                    <span>{unavailable.Max}</span>
                    <span>{unavailable.NumberOfEvents}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    ) : (
      <></>
    );
  }
}
export default NotReady;