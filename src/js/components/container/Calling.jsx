import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import styles from "./Calling.css";
import { CircularProgressbar } from "react-circular-progressbar";
import log from "./Logger.jsx";
import "!style-loader!css-loader!react-circular-progressbar/dist/styles.css";
import Integration from "../helper/Integration.js";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 1,
      running: false,
      data: null,
      wrapUpTime: -1,
      disposition: null,
      dispositionSelected: -1,
      subDispositionSelected: -1
    };
  }

  componentDidMount() {
    this.windowListenerFunctions();
  }

  windowListenerFunctions = () => {
    let _this = this;
    window.onDispositions = function(disposition) {
      log("disposition=>", disposition);
      _this.setState({ disposition });
    };
  };

  handleStartClick = event => {
    var _this = this;
    if (!this.state.running) {
      this.interval = setInterval(() => {
        this.tick();
      }, 1000);
      this.setState({ running: true });
    }
  };

  handleWrapNoteStartClick = () => {
    var _this = this;
    if (!this.state.running) {
      this.interval = setInterval(() => {
        this.setState({ wrapUpTime: this.state.wrapUpTime - 1 });
      }, 1000);
      this.setState({ running: true });
    }
  };

  handleStopClick = event => {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({ running: false });
    }
  };

  handleResetClick = event => {
    this.handleStopClick();
    this.update(0, 0, 0);
  };

  tick = () => {
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
  };

  zeroPad = value => {
    return value < 10 ? `0${value}` : value;
  };

  update = (seconds, minutes, hours) => {
    this.setState({
      seconds,
      minutes,
      hours
    });
  };

  onHangUp = () => {
    this.handleResetClick();
    this.setState({ running: false }, this.handleWrapNoteStartClick);
    this.props.onHangUp();
  };

  componentDidUpdate(prevProps) {
    const { show, wrongNumber, status, callDataRecived } = this.props;
    if (show && wrongNumber !== prevProps.wrongNumber && wrongNumber) {
      setTimeout(this.onWrapsEnd, 2000);
    }
    if (status.toLowerCase() === "dialog" && prevProps.status !== status) {
      this.handleStartClick();
      this.getDispositions();
    }

    if (callDataRecived && prevProps.callDataRecived !== callDataRecived) {
      if (!this.state.data) {
        this.setState({
          data: callDataRecived,
          wrapUpTime: callDataRecived.WrapUpTime
        });
      }
    }

    if (status.toLowerCase() === "wrapup" && prevProps.status !== status) {
      this.onHangUp();
    }

    if (this.state.wrapUpTime === 0) {
      this.onWrapsEnd();
    }
  }

  getDispositions = () => {
    if (this.state.data.CallType === 2) {
      Integration.getInstance().getCampaignDispositions(this.state.data.Id);
    } else {
      Integration.getInstance().getACDDispositions(this.state.data.Id);
    }
  };

  /* Una vez que se termina el tiempo de notas */
  onWrapsEnd = () => {
    this.handleStopClick();
    this.props.onWrapsEnd();
    this.setState({ wrapUpTime: -1, data: null });
  };

  inputData = () => {
    const { data } = this.state;
    if (data && data.DataContact) {
      log("DataContact", data.DataContact);
      return this.mapData(data.DataContact);
    }
    return this.mapData(["", "", "", "", ""]);
  };

  mapData = data => {
    return data.map((value, index) => (
      <>
        {log(value)}
        <div className={styles.dataInput}>
          <div className={styles.dataInputNo}>{index + 1}</div>
          <div className={styles.input}>
            <input
              placeholder={"Datos del cliente"}
              value={value ? value : ""}
            />
          </div>
        </div>
        <div />
      </>
    ));
  };

  onDispositionSelection = e => {
    this.setState({ dispositionSelected: parseInt(e.target.value) });
  };

  saveDisposition = () => {
    let { data, dispositionSelected, subDispositionSelected } = this.state;
    if (this.state.data.CallType === 2) {
      Integration.getInstance().disposeCampaingCall(
        dispositionSelected,
        data.ID,
        data.CallId,
        subDispositionSelected
      );
    } else {
      Integration.getInstance().dispositionACDCall(
        dispositionId,
        data.CallId,
        subDispositionSelected
      );
    }
    this.onWrapsEnd();
  };

  render() {
    const { callData, show, labels } = this.props;
    const { data } = this.state;
    return show && callData ? (
      <div className={styles.main}>
        <div className={styles.number}>
          {this.state.running && (
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

        {this.props.status.toLowerCase() === "wrapup" ? (
          <>
            <div className={styles.progressBar}>
              <CircularProgressbar
                value={this.state.wrapUpTime}
                maxValue={data.WrapUpTime}
                text={`${this.state.wrapUpTime}`}
                styles={{
                  path: {
                    stroke: `#FFA61D`,
                    strokeLinecap: "butt",
                    transition: "stroke-dashoffset 0.5s ease 0s",
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
            <div>Calificar llamada</div>
            <Input
              className={styles.selectInput}
              type="select"
              name="select"
              id="dispositionSelection"
              onChange={this.onDispositionSelection}
            >
              <option hidden selected>
                Seleccione una opcion
              </option>
              {this.state.disposition &&
                this.state.disposition.map(disposition => (
                  <option value={disposition.Id}>
                    {disposition.Description}
                  </option>
                ))}
            </Input>

            <Button
              onClick={this.saveDisposition}
              className={styles.dispositionBtn}
            >
              CALIFICAR
            </Button>
          </>
        ) : (
          <>
            <div className={styles.callData}>
              <div className={styles.dataTitle}>Datos del cliente</div>
              {this.inputData()}
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
