import React, { Component } from "react";
import styles from "./Keyboard.css";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import BasePhoneInput from "../common/BasePhoneInput/BasePhoneInput.jsx";

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardValue: "",
      campaign: undefined
    };
  }

  componentDidUpdate(prevProps) {
    this.resetOnOpen(prevProps);
    this.selectDefaultCampaign();
  }

  resetOnOpen = prevProps => {
    if (prevProps.show !== this.props.show && this.props.show) {
      this.setState({ keyboardValue: "", campaign: undefined });
    }
  };

  selectDefaultCampaign = () => {
    if (
      this.props.campaigns &&
      this.props.campaigns[0].Default &&
      !this.state.campaign
    ) {
      this.setState({ campaign: this.props.campaigns[0] });
    }
  };

  onKeyDown = e => {
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
  };

  onChangeValue = keyboardValue => {
    this.setState({ keyboardValue });
  };

  onKeyPressed = e => {
    this.setState({
      keyboardValue: this.state.keyboardValue + e.target.innerText
    });
  };

  onCampaignSelection = e => {
    let campaign = this.props.campaigns.find(
      campaign => campaign.ID == e.target.value
    );
    this.setState({ campaign });
  };

  manualCall = () => {
    const { keyboardValue, campaign } = this.state;
    this.props.makeManualCall(keyboardValue, campaign, "", "");
    this.setState({ keyboardValue: "" });
  };

  render() {
    const { labels } = this.props;
    const { keyboardValue, campaign } = this.state;
    let allData =
      keyboardValue.length > 1 && campaign && /^\d+$/.test(keyboardValue);
    return this.props.show ? (
      <div className={styles.main}>
        <div>{labels.campaignTitle}</div>
        <div className={styles.divInput}>
          <Input
            className={styles.selectInput}
            type="select"
            name="select"
            id="campaignCallSelection"
            onChange={this.onCampaignSelection}
          >
            <option hidden selected>
              {labels.defaultOption}
            </option>
            {this.props.campaigns &&
              this.props.campaigns.map(campaign => (
                <option
                  value={campaign.ID}
                  selected={
                    this.state.campaign &&
                    campaign.ID === this.state.campaign.ID
                  }
                >
                  {campaign.Description}
                </option>
              ))}
          </Input>
        </div>
        <div>{labels.number}</div>

        <BasePhoneInput
          value={this.state.keyboardValue}
          onChange={this.onChangeValue}
          onKeyDown={this.onKeyDown}
        />

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
