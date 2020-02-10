import React, { Component } from "react";
import styles from "./Calling.css";
import { CircularProgressbar } from "react-circular-progressbar";

import "!style-loader!css-loader!react-circular-progressbar/dist/styles.css";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      running: false,
      wrapNote: false
    };
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.inputData = this.inputData.bind(this);
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

  inputData(value) {
    console.log("data aqui ", this.props.callDataRecived.DataContact);
    return (
      <>
        <div className={styles.dataInput}>
          <div className={styles.dataInputNo}>{value}</div>
          <div className={styles.input}>
            <input placeholder={"Datos del cliente"} />
          </div>
        </div>
        <div />
      </>
    );
  }

  render() {
    const { callData, callDataRecived, show, labels } = this.props;
    console.log("========>", callDataRecived);
    return show ? (
      <div className={styles.main}>
        <div className={styles.number}>
          {this.state.running && (
            // {true && (
            <div className={styles.timer}>
              <span>{this.zeroPad(this.state.hours)}:</span>
              <span>{this.zeroPad(this.state.minutes)}:</span>
              <span>{this.zeroPad(this.state.seconds)}</span>
            </div>
          )}

          <div className={styles.title}>
            <div className={styles.label}>{labels.campaign}</div>
            <div className={styles.name}>{callData.campaign.Description}</div>
          </div>

          <div className={styles.phoneNumber}>
            <div className={styles.logo} />
            <div className={styles.num}>{callData.phoneNum}</div>
          </div>
        </div>
        {/* {true ? ( */}
        {this.state.wrapNote ? (
          <div className={styles.progressBar}>
            <CircularProgressbar
              value={20}
              maxValue={100}
              text={`${1 * 90}%`}
              styles={{
                path: {
                  // Path color
                  stroke: `#FFA61D`,
                  strokeLinecap: "butt",
                  // Customize transition animation
                  transition: "stroke-dashoffset 0.5s ease 0s",
                  // Rotate the path
                  transform: "rotate(0.25turn)",
                  transformOrigin: "center center"
                },
                path: {
                  stroke: `#FFA61D`
                },
                trail: {
                  stroke: `#192A34`
                },
                text: {
                  fill: "#FFA61D",
                  fontSize: "16px"
                }
              }}
            />
          </div>
        ) : (
          <>
            <div className={styles.callData}>
              <div className={styles.dataTitle}>Datos del cliente</div>
              {this.inputData(1)}
              {this.inputData(2)}
              {this.inputData(3)}
              {this.inputData(4)}
              {this.inputData(5)}
            </div>
            <div className={styles.footer}>
              <div className={` ${styles.btn}`} onClick={this.onHangUp}>
                <div />
              </div>
            </div>
          </>
        )}
      </div>
    ) : (
      <></>
    );
  }
}
export default Calling;
