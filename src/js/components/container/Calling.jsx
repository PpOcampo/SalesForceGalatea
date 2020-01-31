import React, { Component } from "react";
import styles from "./Calling.css";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      running: false
    };
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.onHangUp = this.onHangUp.bind(this);
  }

  handleStartClick(event) {
    var _this = this;
    if (!this.state.running) {
      this.interval = setInterval(() => {
        this.tick();
      }, 1000);

      this.setState({ running: true });
    }
  }

  handleStopClick(event) {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({ running: false });
    }
  }

  handleResetClick(event) {
    this.handleStopClick();
    this.update(0, 0, 0);
  }

  tick() {
    let seconds = this.state.seconds + 1;
    let minutes = this.state.minutes;
    let hours = this.state.hours;

    if (seconds === 60) {
      seconds = 0;
      minutes = minutes + 1;
    }

    if (minutes === 60) {
      seconds = 0;
      minutes = 0;
      hours = hours + 1;
    }
    this.update(seconds, minutes, hours);
  }

  zeroPad(value) {
    return value < 10 ? `0${value}` : value;
  }

  update(seconds, minutes, hours) {
    this.setState({
      seconds,
      minutes,
      hours
    });
  }

  onHangUp() {
    this.handleResetClick();
    this.props.onHangUp();
  }

  componentDidUpdate(prevProps) {
    // if (this.props.show && this.props.show !== prevProps.show) {

    //   this.handleStartClick();
    // }
    if (
      this.props.show &&
      this.props.wrongNumber !== prevProps.wrongNumber &&
      this.props.wrongNumber
    ) {
      setTimeout(this.onHangUp, 2000);
    }
    if (
      this.props.status.toLowerCase() === "dialog" &&
      prevProps.status !== this.props.status
    ) {
      this.handleStartClick();
    }
  }

  render() {
    const { callData, show, labels } = this.props;
    return show && callData ? (
      <div className={styles.main}>
        <div className={styles.title}>
          <div className={styles.label}>{labels.campaign}</div>
          <div className={styles.name}>{callData.campaign.Description}</div>
        </div>

        <div className={styles.number}>
          <div className={styles.logo} />
          <div className={styles.num}>{callData.phoneNum}</div>
          {this.state.running && (
            <div className={styles.timer}>
              <span>{this.zeroPad(this.state.hours)}:</span>
              <span>{this.zeroPad(this.state.minutes)}:</span>
              <span>{this.zeroPad(this.state.seconds)}</span>
            </div>
          )}
        </div>
        <div className={` ${styles.btn}`} onClick={this.onHangUp}>
          <div />
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
export default Calling;
