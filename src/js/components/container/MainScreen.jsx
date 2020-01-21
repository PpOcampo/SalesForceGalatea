import React, { Component } from "react";
import * as LCC from "lightning-container";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import styles from "./MainScreen.css";
import BaseBtn from "./BaseBtn.jsx";
import Keyboard from "./Keyboard.jsx";
import Header from "./Header.jsx";
import StatusBar from "./StatusBar.jsx";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.onKeyboardClick = this.onKeyboardClick.bind(this);
    this.onUnavailableChange = this.onUnavailableChange.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
    this.state = {
      showKeyBoard: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { showKeyBoard } = this.state;
    if (showKeyBoard && prevState.showKeyBoard !== showKeyBoard) {
      this.props.getCampaignsRelated();
    }
  }

  onKeyboardClick() {
    this.setState({ showKeyBoard: !this.state.showKeyBoard });
  }

  onLogOut() {
    this.props.onLogOut();
  }

  onUnavailableChange(e) {
    if (e.target.value === "-1") {
      this.props.setAvailable();
    } else {
      this.props.setUnavailable(e.target.value);
    }
  }

  render() {
    return (
      <div className={styles.main}>
        <Header />
        <StatusBar></StatusBar>

        {/* <BaseBtn type={"keyboard"} onClick={this.onKeyboardClick} /> */}

        {/* <Input
                className={styles.selectInput}
                type="select"
                name="select"
                id="unavailable"
                onChange={this.onUnavailableChange}
              >
                <option value="-1">Available</option>
                {this.props.unavailables &&
                  this.props.unavailables.map(unavailable => (
                    <option value={unavailable.TypeNotReadyId}>
                      {unavailable.Description}
                    </option>
                  ))}
              </Input> */}

        {/* <>
          <Keyboard
            onKeyboardClick={this.onKeyboardClick}
            show={this.state.showKeyBoard}
            campaigns={this.props.campaigns}
            makeManualCall={this.props.makeManualCall}
          />
        </> */}
      </div>
    );
  }
}
export default MainScreen;
