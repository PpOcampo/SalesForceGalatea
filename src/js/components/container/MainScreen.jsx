import React, { Component } from "react";
import * as LCC from "lightning-container";
import styles from "./MainScreen.css";
import BaseBtn from "./BaseBtn.jsx";
import Keyboard from "./Keyboard.jsx";
import Header from "./Header.jsx";
import StatusBar from "./StatusBar.jsx";
import NotReady from "./NotReady.jsx";
import Calling from "./Calling.jsx";
import Locked from "./Locked.jsx";
import log from "./Logger.jsx";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.onKeyboardClick = this.onKeyboardClick.bind(this);
    this.onNotAvailable = this.onNotAvailable.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
    this.backButtonHandler = this.backButtonHandler.bind(this);
    this.makeManualCall = this.makeManualCall.bind(this);
    this.onHangUp = this.onHangUp.bind(this);
    this.onUnavailable = this.onUnavailable.bind(this);
    this.onLockedEnd = this.onLockedEnd.bind(this);

    this.state = {
      showKeyBoard: false,
      showNotReady: false,
      showStatusBar: true,
      showCalling: false,
      showHeader: true,
      showUnavailable: false,
      callData: undefined,
      unavailable: undefined,
      wrongNumber: false,
      hangUp: false
    };
  }

  componentDidMount() {
    if (this.props.notReady) {
      this.setState({
        unavailable: this.props.agentStatus,
        showUnavailable: true,
        showNotReady: false,
        showHeader: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { showKeyBoard } = this.state;
    if (showKeyBoard && prevState.showKeyBoard !== showKeyBoard) {
      this.props.getCampaignsRelated();
    }
    if (
      prevProps.agentStatus.currentState === "Callout" &&
      this.props.agentStatus.currentState === "Ready"
    ) {
      log("=>>>>>>>>>>>>", this.props.agentStatus.currentState);
      log("Wrong number");
      this.setState({ wrongNumber: true });
    }
    if (
      this.props.agentStatus.currentState === "Ready" &&
      this.state.wrongNumber &&
      this.state.hangUp
    ) {
      this.setState({ wrongNumber: false, hangUp: false });
    }
  }

  onKeyboardClick() {
    this.setState({
      showKeyBoard: !this.state.showKeyBoard,
      showNotReady: false,
      showStatusBar: !this.state.showStatusBar
    });
  }

  onLogOut() {
    this.props.onLogOut();
  }

  onNotAvailable() {
    this.setState({
      showNotReady: !this.state.showNotReady
    });
  }

  backButtonHandler() {
    if (this.state.showNotReady) {
      return this.onNotAvailable();
    } else if (this.state.showKeyBoard) {
      return this.onKeyboardClick();
    }
  }

  makeManualCall(phoneNum, campaign, clientName, callKey) {
    this.setState({
      showCalling: true,
      showKeyBoard: false,
      showStatusBar: true,
      hangUp: false,
      showHeader: !this.state.showHeader,
      callData: {
        campaign: campaign,
        phoneNum: phoneNum,
        clientName: clientName
      }
    });
    this.props.makeManualCall(phoneNum, campaign, clientName, callKey);
  }

  onHangUp() {
    this.setState({
      showCalling: false,
      showKeyBoard: false,
      showHeader: true,
      showStatusBar: true,
      showUnavailable: false,
      callData: undefined,
      wrongNumber: false,
      hangUp: true
    });

    this.props.onHangUp();
  }

  onUnavailable(unavailable) {
    this.props.setUnavailable(unavailable.TypeNotReadyId);
    this.setState({
      showUnavailable: true,
      unavailable,
      showNotReady: false,
      showHeader: false
    });
  }

  onLockedEnd() {
    this.props.setAvailable();
    this.setState({
      showUnavailable: false,
      unavailable: undefined,
      showNotReady: false,
      showHeader: true
    });
  }

  render() {
    const {
      showStatusBar,
      showNotReady,
      showKeyBoard,
      showCalling,
      showUnavailable,
      showHeader
    } = this.state;
    let mainScreen =
      !showNotReady && !showKeyBoard && !showCalling && !showUnavailable;
    return (
      <div className={styles.main}>
        <Header
          show={showHeader}
          onBack={this.backButtonHandler}
          showBack={!mainScreen}
          onLogOut={this.onLogOut}
          labels={this.props.labels.Header}
        />
        <StatusBar
          show={showStatusBar}
          title={
            this.state.wrongNumber
              ? "Problem"
              : this.props.agentStatus.currentState
          }
          labels={this.props.labels.StatusBar}
        />
        <div
          className={`${styles.body} ${!showStatusBar &&
            styles.maximize} ${showCalling && styles.showCalling}`}
        >
          <NotReady
            unavailables={this.props.unavailables}
            show={showNotReady}
            onUnavailable={this.onUnavailable}
          />

          <Keyboard
            show={showKeyBoard}
            campaigns={this.props.campaigns}
            makeManualCall={this.makeManualCall}
            labels={this.props.labels.Keyboard}
          />

          <Calling
            show={this.state.showCalling}
            callData={this.state.callData}
            onHangUp={this.onHangUp}
            wrongNumber={this.state.wrongNumber}
            status={this.props.agentStatus.currentState}
            labels={this.props.labels.Calling}
            callDataRecived={this.props.callDataRecived}
          />

          <Locked
            show={this.state.showUnavailable}
            onLockedEnd={this.onLockedEnd}
            unavailable={
              this.state.unavailable ? this.state.unavailable : undefined
            }
            labels={this.props.labels.Locked}
          />

          {mainScreen && (
            <>
              <div className={styles.title}>
                {this.props.labels.MainScreen.menu}
              </div>
              <div
                className={styles.notAvailable}
                onClick={this.onNotAvailable}
              >
                <div className={styles.icon} />
                <div>{this.props.labels.MainScreen.unavailable}</div>
                <div className={styles.arrow} />
              </div>
            </>
          )}

          {!showKeyBoard && !showCalling && !showUnavailable && (
            <div className={styles.keyboardBtn} onClick={this.onKeyboardClick}>
              <div />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default MainScreen;
