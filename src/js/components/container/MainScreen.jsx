import React, { Component } from "react";
import * as LCC from "lightning-container";
import styles from "./MainScreen.css";
import BaseBtn from "./BaseBtn.jsx";
import Keyboard from "./Keyboard.jsx";
import Header from "./Header.jsx";
import StatusBar from "./StatusBar.jsx";
import NotReady from "./NotReady.jsx";
import Calling from "./Calling.jsx";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.onKeyboardClick = this.onKeyboardClick.bind(this);
    this.onNotAvailable = this.onNotAvailable.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
    this.backButtonHandler = this.backButtonHandler.bind(this);
    this.makeManualCall = this.makeManualCall.bind(this);
    this.state = {
      showKeyBoard: false,
      showNotReady: false,
      showStatusBar: true,
      showCalling: false,
      showHeader: true
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { showKeyBoard } = this.state;
    if (showKeyBoard && prevState.showKeyBoard !== showKeyBoard) {
      this.props.getCampaignsRelated();
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

  makeManualCall(phoneNum, campId, clientName, callKey) {
    this.setState({
      showCalling: true,
      showKeyBoard: false,
      showStatusBar: true,
      showHeader: !this.state.showHeader
    });
    // this.props.makeManualCall(phoneNum, campId, clientName, callKey);
  }

  render() {
    const {
      showStatusBar,
      showNotReady,
      showKeyBoard,
      showCalling,
      showHeader
    } = this.state;
    let mainScreen = !showNotReady && !showKeyBoard && !showCalling;
    return (
      <div className={styles.main}>
        <Header
          show={showHeader}
          onBack={this.backButtonHandler}
          showBack={!mainScreen}
          main
        />
        <StatusBar show={showStatusBar} />
        <div className={`${styles.body} ${!showStatusBar && styles.maximize}`}>
          <NotReady
            unavailables={this.props.unavailables}
            show={showNotReady}
          />

          <Keyboard
            show={showKeyBoard}
            campaigns={this.props.campaigns}
            makeManualCall={this.makeManualCall}
          />

          <Calling show={this.state.showCalling} />

          {mainScreen && (
            <>
              <div className={styles.title}>MENU</div>
              <div
                className={styles.notAvailable}
                onClick={this.onNotAvailable}
              >
                <div className={styles.icon} />
                <div>Seleccion no disponible</div>
                <div className={styles.arrow} />
              </div>
            </>
          )}

          {!showKeyBoard && !showCalling && (
            <div
              className={styles.keyboardBtn}
              onClick={this.onKeyboardClick}
            />
          )}
        </div>
      </div>
    );
  }
}
export default MainScreen;
