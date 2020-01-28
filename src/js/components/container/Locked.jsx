import React, { Component } from "react";
import styles from "./Locked.css";
import { Button, FormGroup } from "reactstrap";

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
    this.onLockedEnd = this.onLockedEnd.bind(this);
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
      if (this.props.unavailable.Max) {
        const [hours, minutes, seconds] = this.props.unavailable.Max.split(":");
        this.setState({
          hours: parseInt(hours),
          minutes: parseInt(minutes),
          seconds: parseInt(seconds)
        });
      } else {
        let time = "00:00:00";
        if (this.props.unavailable.time > 0) {
          var measuredTime = new Date(null);
          measuredTime.setSeconds(this.props.unavailable.time);
          time = measuredTime.toISOString().substr(11, 8);
        }
        const [hours, minutes, seconds] = time.split(":");
        this.setState({
          hours: parseInt(hours),
          minutes: parseInt(minutes),
          seconds: parseInt(seconds)
        });
      }

      this.handleStartClick();
    }
  }

  onLockedEnd() {
    this.props.onLockedEnd();
  }

  render() {
    const { show, unavailable } = this.props;
    console.log("========>", unavailable);
    return show ? (
      <div className={styles.main}>
        <div className={styles.icon} />
        <div className={styles.label}>
          {unavailable.Description
            ? unavailable.Description
            : unavailable.description}
        </div>
        <div className={styles.timer}>
          <span>{this.zeroPad(this.state.hours)}:</span>
          <span>{this.zeroPad(this.state.minutes)}:</span>
          <span>{this.zeroPad(this.state.seconds)}</span>
        </div>
        <FormGroup className={styles.submitBtn}>
          <Button onClick={this.onLockedEnd}>Salir</Button>
        </FormGroup>
      </div>
    ) : (
      <></>
    );
  }
}
export default Locked;
