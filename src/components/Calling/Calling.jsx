import React, { Component } from "react";
import styles from "./Calling.css";
import { log } from "../../helper/UtilsHelper.js";
import "!style-loader!css-loader!react-circular-progressbar/dist/styles.css";
import Integration from "../../helper/Integration.js";
import IntegrationListener from "../../helper/IntegrationListeners.js";
import * as LCC from "lightning-container";
import XferScreen from "../XferScreen/BindXfer/XferScreen.jsx";
import AssistedXfer from "../XferScreen/AssistedXfer/AssistedXfer.jsx";
import BaseBtn from "../common/BaseBtn/BaseBtn.jsx";
import BaseCheckBox from "../common/BaseCheckBox/BaseCheckBox.jsx";
import BaseStopWatch from "../common/BaseStopWatch/BaseStopWatch.jsx";

import {
  XferBtn,
  HoldBtn,
  MuteBtn,
  HangUpBtn
} from "../common/BaseCallBtn/BaseCallBtn.jsx";
import BaseCircularProgress from "../common/BaseCircularProgress/BaseCircularProgress.jsx";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runCallTimer: false,
      runWrapUpTimer: false,
      data: null,
      disposition: null,
      dispositionSelected: -1,
      subDispositionSelected: -1,
      mute: false,
      hold: false,
      blindXferScreen: false,
      assistedXfer: false
    };
  }

  componentDidMount() {
    IntegrationListener.onDisposition(this.onDisposition);
    IntegrationListener.onSecondCallHangUp(this.onSecondCallHangUp);
  }

  onSecondCallHangUp = () => {
    this.setState({ blindXferScreen: false, assistedXfer: false });
  };

  onDisposition = disposition => {
    this.setState({ disposition });
  };

  onHangUp = () => {
    this.props.onHangUp();
    this.setState({ runCallTimer: false, runWrapUpTimer: true });
  };

  componentDidUpdate(prevProps) {
    const { show, wrongNumber, status, callDataRecived } = this.props;
    if (show && wrongNumber !== prevProps.wrongNumber && wrongNumber) {
      setTimeout(this.onWrapsEnd, 2000);
    }
    if (status.toLowerCase() === "dialog" && prevProps.status !== status) {
      this.setState({ runCallTimer: true });
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

    if (
      prevProps.status.toLowerCase() === "wrapup" &&
      prevProps.status !== status
    ) {
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
    this.props.onWrapsEnd();
    this.setState({
      runCallTimer: false,
      wrapUpTime: -1,
      data: null,
      hold: false,
      mute: false,
      blindXferScreen: false,
      assistedXfer: false,
      runWrapUpTimer: false
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
          <BaseBtn onClick={this.updateData}>Actualizar Datos</BaseBtn>
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

  onDispositionSelection = option => {
    this.setState({ dispositionSelected: parseInt(option.Id) });
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

  onBlindXfer = () => {
    let { blindXferScreen } = this.state;
    !blindXferScreen && Integration.getInstance().getTransfersOptions();
    this.setState({ blindXferScreen: !blindXferScreen });
  };

  onAssistedXfer = () => {
    let { assistedXfer } = this.state;
    !assistedXfer && Integration.getInstance().getTransfersOptions();
    this.setState({ assistedXfer: !assistedXfer });
  };

  ringingHangUp = () => {
    this.onHangUp();
    setTimeout(this.onWrapsEnd, 500);
  };

  render() {
    const { callData, show, labels } = this.props;
    const { data, blindXferScreen, assistedXfer } = this.state;

    return show && callData ? (
      <div className={styles.main}>
        {/* {false ? ( */}
        {blindXferScreen || assistedXfer ? (
          <>
            {blindXferScreen && (
              <XferScreen onBackBtn={this.onBlindXfer}></XferScreen>
            )}
            {assistedXfer && (
              <AssistedXfer onBackBtn={this.onAssistedXfer}></AssistedXfer>
            )}
          </>
        ) : (
          <>
            <div
              className={`${styles.number} ${!this.state.runCallTimer &&
                !this.state.runWrapUpTimer &&
                styles.beforeCall}`}
            >
              <BaseStopWatch running={this.state.runCallTimer} />

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

              {!this.state.runCallTimer && !this.state.runWrapUpTimer && (
                <HangUpBtn onClick={this.ringingHangUp} />
              )}
            </div>

            {this.props.status.toLowerCase() === "wrapup" ? (
              <>
                <BaseCircularProgress
                  initial={data.WrapUpTime}
                  running={this.props.status.toLowerCase() === "wrapup"}
                  onEnd={this.onWrapsEnd}
                  onStop={this.onWrapsEnd}
                />

                <div>Calificar llamada</div>

                <BaseCheckBox
                  hiddenOption={"Seleccione una opcion"}
                  options={this.state.disposition}
                  onChange={this.onDispositionSelection}
                />
                <BaseBtn onClick={this.saveDisposition}>CALIFICAR</BaseBtn>
              </>
            ) : (
              this.state.runCallTimer && (
                <>
                  <div className={styles.callData}>
                    <div className={styles.dataTitle}>Datos del cliente</div>
                    {this.mapData()}
                  </div>
                  <div className={styles.footer}>
                    <MuteBtn onClick={this.onMute} />
                    <HangUpBtn onClick={this.onHangUp} />
                    <HoldBtn onClick={this.onHold} />
                    <XferBtn
                      onBlindXfer={this.onBlindXfer}
                      onAssistedXfer={this.onAssistedXfer}
                    />
                  </div>
                </>
              )
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
