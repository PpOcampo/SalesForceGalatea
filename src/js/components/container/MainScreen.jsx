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
    const { showKeyBoard, wrongNumber, hangUp, showCalling } = this.state;
    const { agentStatus, callDataRecived } = this.props;

    this.getCampaignsOnKeyboardOpen(prevState.showKeyBoard, showKeyBoard);
    this.onWrongNumber(
      prevProps.agentStatus.currentState,
      agentStatus.currentState
    );
    this.afterHangUp(agentStatus.currentState, wrongNumber, hangUp);
    this.onCallRecived(prevProps.callDataRecived, callDataRecived, showCalling);
  }

  onCallRecived(prevCallDataRecived, currentCallDataRecived, showCalling) {
    if (currentCallDataRecived !== prevCallDataRecived && !showCalling) {
      log("CallDataRecived ", this.props.callDataRecived);
      this.setState({
        showCalling: true,
        showKeyBoard: false,
        showStatusBar: true,
        hangUp: false,
        showHeader: !this.state.showHeader,
        callData: {
          campaign: { Description: "" },
          phoneNum: this.props.callDataRecived.Phone,
          clientName: ""
        }
      });
    }
  }

  afterHangUp = (agentStatusState, wrongNumberState, hangUpState) => {
    if (agentStatusState === "Ready" && wrongNumberState && hangUpState) {
      this.setState({ wrongNumber: false, hangUp: false });
    }
  };

  onWrongNumber = (agentStatusPrevState, agentStatusCurrentState) => {
    if (
      agentStatusPrevState === "Callout" &&
      agentStatusCurrentState === "Ready"
    ) {
      log("Wrong number");
      this.setState({ wrongNumber: true });
    }
  };

  getCampaignsOnKeyboardOpen = (prevState, actualState) => {
    if (actualState && actualState !== prevState) {
      this.props.getCampaignsRelated();
    }
  };

  onKeyboardClick = () => {
    let { showKeyBoard, showStatusBar } = this.state;
    this.setState({
      showKeyBoard: !showKeyBoard,
      showNotReady: false,
      showStatusBar: !showStatusBar
    });
  };

  onLogOut = () => {
    this.props.onLogOut();
  };

  onNotAvailable = () => {
    this.setState({
      showNotReady: !this.state.showNotReady
    });
  };

  backButtonHandler = () => {
    if (this.state.showNotReady) {
      return this.onNotAvailable();
    } else if (this.state.showKeyBoard) {
      return this.onKeyboardClick();
    }
  };

  makeManualCall = (phoneNum, campaign, clientName, callKey) => {
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
  };

  onWrapsEnd = () => {
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
  };

  onHangUp = () => {
    log("onHangUp=>");
    this.props.onHangUp();
  };

  onUnavailable = unavailable => {
    this.props.setUnavailable(unavailable.TypeNotReadyId);
    this.setState({
      showUnavailable: true,
      unavailable,
      showNotReady: false,
      showHeader: false
    });
  };

  onLockedEnd = () => {
    this.props.setAvailable();
    this.setState({
      showUnavailable: false,
      unavailable: undefined,
      showNotReady: false,
      showHeader: true
    });
  };

  render() {
    const {
      showStatusBar,
      showNotReady,
      showKeyBoard,
      showCalling,
      showUnavailable,
      showHeader,
      wrongNumber,
      unavailable
    } = this.state;

    const {
      labels,
      unavailables,
      agentStatus,
      callDataRecived,
      campaigns
    } = this.props;

    let mainScreen =
      !showNotReady && !showKeyBoard && !showCalling && !showUnavailable;

    return (
      <div className={styles.main}>
        <StatusBar
          show={showStatusBar}
          title={wrongNumber ? "Problem" : agentStatus.currentState}
          labels={labels.StatusBar}
        />
        <Header
          show={showHeader}
          onBack={this.backButtonHandler}
          showBack={!mainScreen}
          onLogOut={this.onLogOut}
          labels={labels.Header}
        />

        <div
          className={`${styles.body} ${!showStatusBar &&
            styles.maximize} ${showCalling && styles.showCalling}`}
        >
          <NotReady
            unavailables={unavailables}
            show={showNotReady}
            onUnavailable={this.onUnavailable}
          />

          <Keyboard
            show={showKeyBoard}
            campaigns={campaigns}
            makeManualCall={this.makeManualCall}
            labels={labels.Keyboard}
          />

          <Calling
            show={this.state.showCalling}
            callData={this.state.callData}
            onHangUp={this.onHangUp}
            wrongNumber={wrongNumber}
            status={agentStatus.currentState}
            labels={labels.Calling}
            callDataRecived={callDataRecived}
            onWrapsEnd={this.onWrapsEnd}
          />

          <Locked
            show={this.state.showUnavailable}
            onLockedEnd={this.onLockedEnd}
            unavailable={unavailable ? unavailable : undefined}
            labels={labels.Locked}
          />

          {mainScreen && (
            <>
              <div className={styles.title}>{labels.MainScreen.menu}</div>
              <div
                className={styles.notAvailable}
                onClick={this.onNotAvailable}
              >
                <div className={styles.icon} />
                <div>{labels.MainScreen.unavailable}</div>
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
