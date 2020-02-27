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
import Reprogram from "./Reprogram.jsx";

import {
  XferBtn,
  HoldBtn,
  MuteBtn,
  HangUpBtn
} from "../common/BaseCallBtn/BaseCallBtn.jsx";
import BaseCircularProgress from "../common/BaseCircularProgress/BaseCircularProgress.jsx";

import { element } from "prop-types";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runCallTimer: false,
      runWrapUpTimer: false,
      data: null,
      disposition: null,
      dispositionSelected: null,
      subDispositionSelected: null,
      mute: false,
      hold: false,
      blindXferScreen: false,
      assistedXfer: false,
      reprogram: false,
      phoneNumbers: null,
      callBackNumber: null,
      dateTime: null,
      existingNumber: false
    };
  }

  componentDidMount() {
    IntegrationListener.onDisposition(this.onDisposition);
    IntegrationListener.onSecondCallHangUp(this.onSecondCallHangUp);
    IntegrationListener.onPhoneNumbers(this.onPhoneNumbers);
  }

  onPhoneNumbers = phoneNumbers => {
    this.setState({ phoneNumbers });
  };

  onSecondCallHangUp = () => {
    this.setState({ blindXferScreen: false, assistedXfer: false });
  };

  onDisposition = disposition => {
    let copyDisposition = [...disposition];
    let newDisposition = copyDisposition.map(element => ({
      ...element,
      SubDisposition: Object.values(element.SubDisposition)
    }));
    log(newDisposition);
    this.setState({ disposition: newDisposition });
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
    setTimeout(
      () =>
        Integration.getInstance().getPhoneNumbers(this.state.data.CallOutId),
      2000
    );
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
      runWrapUpTimer: false,
      dispositionSelected: null,
      subDispositionSelected: null,
      disposition: null,
      reprogram: false,
      phoneNumbers: null,
      callBackNumber: null,
      existingNumber: false
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
    this.setState({
      dispositionSelected: option,
      reprogram: option.CanReprogram,
      SubDisposition: null
    });
  };

  onSubdispositionSelection = option => {
    this.setState({
      subDispositionSelected: option,
      reprogram: option.CanReprogram
    });
  };

  saveDisposition = () => {
    let {
      data,
      dispositionSelected,
      subDispositionSelected,
      reprogram
    } = this.state;
    if (this.state.data.CallType === 2) {
      Integration.getInstance().disposeCampaingCall(
        dispositionSelected.Id,
        data.ID,
        data.CallId,
        subDispositionSelected ? subDispositionSelected.Id : ""
      );

      this.state.reprogram && this.state.dateTime && this.state.callBackNumber;
      Integration.getInstance().reprogramCampaignCall(
        data.ID,
        dispositionSelected.Id,
        data.CallId,
        this.state.dateTime,
        this.state.callBackNumber,
        this.state.existingNumber,
        subDispositionSelected.Id
      );
    } else {
      Integration.getInstance().dispositionACDCall(
        dispositionSelected.Id,
        data.CallId,
        subDispositionSelected ? subDispositionSelected.Id : ""
      );
      let dataContact = this.state.data.DataContact[i];
      this.state.reprogram &&
        this.state.dateTime &&
        this.state.callBackNumber &&
        Integration.getInstance().CallBackAcd(
          data.ID,
          dispositionSelected.Id,
          data.CallId,
          this.state.dateTime,
          this.state.callBackNumber,
          data.CalKey,
          dataContact[0],
          dataContact[1],
          dataContact[2],
          dataContact[3],
          dataContact[4],
          this.state.existingNumber,
          subDispositionSelected.Id
        );
    }
    if (reprogram) {
      this.saveCallBack();
    }
    this.onWrapsEnd();
  };

  onReprogramChange = (callBackNumber, dateTime, existingNumber) => {
    this.setState({ callBackNumber, dateTime, existingNumber });
  };

  saveCallBack = () => {};

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
    const {
      data,
      blindXferScreen,
      assistedXfer,
      runWrapUpTimer,
      dispositionSelected,
      subDispositionSelected,
      disposition
    } = this.state;

    return show && callData ? (
      <div className={styles.main}>
        <div
          className={`${styles.stopWatch} ${!(
            blindXferScreen ||
            assistedXfer ||
            runWrapUpTimer
          ) && styles.show}`}
        >
          <BaseStopWatch running={this.state.runCallTimer} />
        </div>
        {(blindXferScreen || assistedXfer) && !runWrapUpTimer ? (
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
                !runWrapUpTimer &&
                styles.beforeCall}`}
            >
              {/* <BaseStopWatch running={true} />
              <BaseStopWatch running={this.state.runCallTimer} /> */}

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
                <div className={styles.wrapUpBody}>
                  <BaseCircularProgress
                    initial={data.WrapUpTime}
                    running={this.props.status.toLowerCase() === "wrapup"}
                    onEnd={this.onWrapsEnd}
                    onStop={this.onWrapsEnd}
                  />
                  <div>Calificar llamada</div>

                  <BaseCheckBox
                    hiddenOption={"Seleccione una opcion"}
                    options={disposition}
                    onChange={this.onDispositionSelection}
                  />

                  {dispositionSelected &&
                    dispositionSelected.SubDisposition.length > 0 && (
                      <BaseCheckBox
                        hiddenOption={"Seleccione una opcion"}
                        options={dispositionSelected.SubDisposition}
                        onChange={this.onSubdispositionSelection}
                      />
                    )}

                  {this.state.reprogram && (
                    <Reprogram
                      phoneNumbers={this.state.phoneNumbers}
                      onChange={this.onReprogramChange}
                    />
                  )}

                  <BaseBtn onClick={this.saveDisposition}>CALIFICAR</BaseBtn>
                </div>
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
