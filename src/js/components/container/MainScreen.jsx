import React, { Component } from "react";
import * as LCC from "lightning-container";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import styles from "./MainScreen.css";
import BaseBtn from "./BaseBtn.jsx";
import Keyboard from "./Keyboard.jsx";

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
        <div className={styles.header} />

        <div>
          <button onClick={this.onLogOut}>logout</button>
        </div>

        <div className={styles.end}>
          <div className={styles.minMargin}>
            <BaseBtn type={"xfer"} />
          </div>
        </div>

        <div>
          <div className={styles.btnStates}>
            <BaseBtn />
          </div>
          <div className={`${styles.marginRight} ${styles.btnStatesEnd}`}>
            <div>
              <BaseBtn type={"call"} />
            </div>
            <div>
              {" "}
              <Input
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
              </Input>
            </div>
          </div>
        </div>

        <div>
          <textarea rows="2" />
        </div>

        <div className={styles.labels}>
          <div>
            <div className={styles.imageExt} />
            2011
          </div>
        </div>

        <div className={styles.labels}>
          <div>
            <span className={`${styles.marginRight} ${styles.bold}`}>
              Status:{" "}
            </span>{" "}
            {this.props.agentStatus.currentState}
          </div>
        </div>

        <div>
          <div>
            <BaseBtn type={"call"} />
          </div>
          <div>
            <BaseBtn type={"keyboard"} onClick={this.onKeyboardClick} />
          </div>
          <div>
            <BaseBtn type={"pause"} />
          </div>
          <div className={styles.minMargin}>
            <BaseBtn type={"stop"} />
          </div>
        </div>

        <div>
          <div>
            <BaseBtn type={"xfer"} />
          </div>
          <div>
            <BaseBtn type={"blindXfer"} />
          </div>
          <div>
            <BaseBtn type={"note"} />
          </div>
          <div className={styles.minMargin}>
            <div></div>
          </div>
        </div>

        <>
          <Keyboard
            onKeyboardClick={this.onKeyboardClick}
            show={this.state.showKeyBoard}
            campaigns={this.props.campaigns}
            makeManualCall={this.props.makeManualCall}
          />
        </>
      </div>
    );
  }
}
export default MainScreen;
