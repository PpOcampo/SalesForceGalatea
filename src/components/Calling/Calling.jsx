import React, { Component } from "react";
import { Input, Button } from "reactstrap";
import styles from "./Calling.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { log } from "../../helper/UtilsHelper.js";
import "!style-loader!css-loader!react-circular-progressbar/dist/styles.css";
import Integration from "../../helper/Integration.js";
import IntegrationListener from "../../helper/IntegrationListeners.js";
import * as LCC from "lightning-container";
import XferScreen from "../XferScreen/XferScreen.jsx";

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
      subDispositionSelected: -1,
      mute: false,
      hold: false,
      xferScreen: false
    };
  }

  componentDidMount() {
    IntegrationListener.onDisposition(this.onDisposition);
  }

  onDisposition = disposition => {
    this.setState({ disposition });
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
      _this.setState({ running: true });
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
        LCC.sendMessage({
          event: "LccEvent",
          value: "onCwData",
          call: {
            id: callDataRecived.CallId,
            data: callDataRecived.DataContact
          }
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
    this.setState({
      wrapUpTime: -1,
      data: null,
      hold: false,
      mute: false,
      xferScreen: false
    });
  };

  onChangeValue = (index, event) => {
    let tempData = null;
    if (this.state.data && this.state.data.DataContact) {
      tempData = [...this.state.data.DataContact];
    } else {
      tempData = ["", "", "", "", ""];
    }
    tempData[index] = event.target.value;
    this.setState({
      data: { ...this.state.data, DataContact: tempData }
    });
  };

  onHold = () => {
    log("onHold: ");
    Integration.getInstance().HoldCall();
    this.setState({ hold: !this.state.hold });
  };

  onMute = () => {
    let mute = !this.state.mute;
    log("Mute: ", mute);
    Integration.getInstance().SetMute(mute);
    this.setState({ mute });
  };

  mapData = data => {
    return (
      <>
        {Array(5)
          .fill()
          .map((_, i) => (
            <>
              <div className={styles.dataInput}>
                <div className={styles.dataInputNo}>{i + 1}</div>
                <div className={styles.input}>
                  <input
                    placeholder={"Datos del cliente"}
                    value={
                      this.state.data && this.state.data.DataContact[i]
                        ? this.state.data.DataContact[i]
                        : ""
                    }
                    onChange={e => this.onChangeValue(i, e)}
                  />
                </div>
              </div>
              <div />
            </>
          ))}
        <div className={styles.updateBtn}>
          <Button onClick={this.updateData}>Actualizar Datos</Button>
        </div>
      </>
    );
  };

  updateData = () => {
    let { data } = this.state;
    if (data && data.DataContact) {
      log("Updating call data");
      Integration.getInstance().updateCallData(
        data.CallOutId,
        data.DataContact[0],
        data.DataContact[1],
        data.DataContact[2],
        data.DataContact[3],
        data.DataContact[4]
      );
    }
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

  onXfer = () => {
    let { xferScreen } = this.state;
    !xferScreen && Integration.getInstance().getTransfersOptions();
    this.setState({ xferScreen: !xferScreen });
  };

  render() {
    const { callData, show, labels } = this.props;
    const { data, mute, hold, xferScreen } = this.state;
    return show && callData ? (
      <div className={styles.main}>
        {/* {false ? ( */}
        {xferScreen ? (
          <XferScreen onBackBtn={this.onXfer}></XferScreen>
        ) : (
          <>
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
                <div className={styles.name}>
                  {callData.campaign.Description}
                </div>
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
                  {this.mapData()}
                </div>
                <div className={styles.footer}>
                  <div className={styles.btnAdvance} onClick={this.onMute}>
                    <div
                      className={`${styles.mute} ${mute && styles.active}`}
                    />
                  </div>
                  <div className={` ${styles.btn}`} onClick={this.onHangUp}>
                    <div className={styles.hangUp} />
                  </div>
                  <div className={styles.btnAdvance} onClick={this.onHold}>
                    <div
                      className={`${styles.hold} ${hold && styles.active}`}
                    />
                  </div>
                  <div className={styles.btnAdvance} onClick={this.onXfer}>
                    <div className={styles.xfer} />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    ) : (
      <></>
    );
  }
}
export default Calling;
