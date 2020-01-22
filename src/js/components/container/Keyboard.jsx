import React, { Component } from "react";
import styles from "./Keyboard.css";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onCampaignSelection = this.onCampaignSelection.bind(this);
    this.manualCall = this.manualCall.bind(this);
    this.onBackSpaceClick = this.onBackSpaceClick.bind(this);
    this.state = {
      keyboardValue: "",
      campaign: undefined
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show && this.props.show) {
      this.setState({ keyboardValue: "", campaign: undefined });
    }
  }

  onKeyDown(e) {
    /* if is *, # or number*/
    let key = e.key.toLowerCase();
    if (/^[0-9*#\b]$/i.test(key) || key === "backspace") {
      key = key === "*" ? "asterisk" : key;
      key = key === "#" ? "hash" : key;
      key = "k" + key;
      let keyBtn = document.getElementById(key);
      keyBtn.classList.add(styles.simulateClick);
      setTimeout(() => {
        keyBtn.classList.remove(styles.simulateClick);
      }, 200);
    }
  }

  onChangeValue(e) {
    this.setState({ keyboardValue: e.target.value });
  }

  onKeyPressed(e) {
    this.setState({
      keyboardValue: this.state.keyboardValue + e.target.innerText
    });
  }

  onBackSpaceClick(e) {
    this.setState({ keyboardValue: this.state.keyboardValue.slice(0, -1) });
  }

  onCampaignSelection(e) {
    let campaign = this.props.campaigns.find(
      campaign => campaign.ID == e.target.value
    );
    this.setState({ campaign });
  }

  manualCall() {
    const { keyboardValue, campaign } = this.state;
    this.props.makeManualCall(keyboardValue, campaign, "", "");
  }

  render() {
    const { keyboardValue, campaign } = this.state;
    let allData =
      keyboardValue.length > 1 && campaign && /^\d+$/.test(keyboardValue);
    return this.props.show ? (
      <div className={styles.main}>
        <div>Campaña</div>
        <div>
          <Input
            className={styles.selectInput}
            type="select"
            name="select"
            id="campaignCallSelection"
            onChange={this.onCampaignSelection}
          >
            <option hidden selected>
              Seleccione una campaña
            </option>
            {this.props.campaigns &&
              this.props.campaigns.map(campaign => (
                <option value={campaign.ID}>{campaign.Description}</option>
              ))}
          </Input>
        </div>
        <div>Numero</div>
        <div className={styles.inputKeyBoard}>
          <Input
            type="text"
            value={this.state.keyboardValue}
            onChange={this.onChangeValue}
            onKeyDown={this.onKeyDown}
          />
          {this.state.keyboardValue.length > 0 && (
            <div id="kbackspace" onClick={this.onBackSpaceClick} />
          )}
        </div>
        <div className={styles.rowNumbers}>
          <div id="k1" onClick={this.onKeyPressed}>
            1
          </div>
          <div id="k2" onClick={this.onKeyPressed}>
            2
          </div>
          <div id="k3" onClick={this.onKeyPressed}>
            3
          </div>
        </div>
        <div className={styles.rowNumbers}>
          <div id="k4" onClick={this.onKeyPressed}>
            4
          </div>
          <div id="k5" onClick={this.onKeyPressed}>
            5
          </div>
          <div id="k6" onClick={this.onKeyPressed}>
            6
          </div>
        </div>
        <div className={styles.rowNumbers}>
          <div id="k7" onClick={this.onKeyPressed}>
            7
          </div>
          <div id="k8" onClick={this.onKeyPressed}>
            8
          </div>
          <div id="k9" onClick={this.onKeyPressed}>
            9
          </div>
        </div>
        <div className={styles.rowNumbers}>
          <div id="kasterisk" onClick={this.onKeyPressed}>
            *
          </div>
          <div id="k0" onClick={this.onKeyPressed}>
            0
          </div>
          <div id="khash" onClick={this.onKeyPressed}>
            #
          </div>
        </div>
        <div
          className={`${styles.rowNumbers} ${styles.telephone} ${!allData &&
            styles.disabled}`}
          onClick={allData ? this.manualCall : null}
        >
          <div>
            <div className={styles.iconTelephone} />
          </div>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
export default Keyboard;
