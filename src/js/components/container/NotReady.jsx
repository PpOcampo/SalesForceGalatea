import React, { Component } from "react";
import styles from "./NotReady.css";
import { Progress } from "reactstrap";

class NotReady extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.show ? (
      <div className={styles.main}>
        {this.props.unavailables &&
          this.props.unavailables.map(unavailable => (
            <div className={styles.item}>
              <div className={styles.icon} />
              <div className={styles.content}>
                <div>{unavailable.Description}</div>
                <div className={styles.progress}>
                  <Progress value="463" max={500} />
                </div>
                <div className={styles.time}>
                  <span>{unavailable.Max}</span>
                  <span>2/5</span>
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
