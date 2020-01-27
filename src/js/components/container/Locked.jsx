import React, { Component } from "react";
import styles from "./Calling.css";

class Locked extends Component {
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
    let seconds = this.state.seconds - 1;
    let minutes = this.state.minutes;
    let hours = this.state.hours;

    if (seconds === -1) {
      seconds = 59;
      minutes = minutes - 1;
    }

    if (minutes === -1) {
      seconds = 59;
      minutes = 59;
      hours = hours - 1;
    }

    if (hours === -1) {
      return this.handleResetClick();
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
    if (
      prevProps.unavailable !== this.props.unavailable &&
      this.props.unavailable
    ) {
      const [hours, minutes, seconds] = this.props.unavailable.Max.split(":");
      this.setState({
        hours: parseInt(3),
        minutes: parseInt(1),
        seconds: parseInt(5)
      });
      this.handleStartClick();
    }
  }

  render() {
    const { show, unavailable } = this.props;

    return show ? (
      <div className={styles.main}>
        <div className={styles.title}>
          <div className={styles.label}>Campaña</div>
        </div>

        <div className={styles.number}>
          <div className={styles.timer}>
            <span>{this.zeroPad(this.state.hours)}:</span>
            <span>{this.zeroPad(this.state.minutes)}:</span>
            <span>{this.zeroPad(this.state.seconds)}</span>
          </div>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
export default Locked;
