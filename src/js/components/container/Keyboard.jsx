import React, { Component } from "react";
import styles from "./Keyboard.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onCampaignSelection = this.onCampaignSelection.bind(this);
    this.manualCall = this.manualCall.bind(this);
    this.state = {
      keyboardValue: "",
      campaignSelection: 0
    };
  }

  onChangeValue(e) {
    this.setState({ keyboardValue: e.target.value });
  }

  onKeyPressed(value) {
    this.setState({ keyboardValue: this.state.keyboardValue + value });
  }
  onCampaignSelection(e) {
    this.setState({ campaignSelection: e.target.value });
  }

  manualCall() {
    const { keyboardValue, campaignSelection } = this.state;
    this.props.makeManualCall(keyboardValue, campaignSelection, "", "");
  }

  render() {
    return (
      <>
        <Modal isOpen={this.props.show} toggle={this.props.onKeyboardClick}>
          <ModalHeader toggle={this.props.onKeyboardClick} />
          <ModalBody>
            <div>
              <Input
                className={styles.selectInput}
                type="select"
                name="select"
                id="campaignCallSelection"
                onChange={this.onCampaignSelection}
              >
                {this.props.campaigns &&
                  this.props.campaigns.map(campaign => (
                    <option value={campaign.ID}>{campaign.Description}</option>
                  ))}
              </Input>
            </div>
            <div>
              <Input
                type="text"
                value={this.state.keyboardValue}
                onChange={this.onChangeValue}
              />
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("1")}>1</div>
              <div onClick={() => this.onKeyPressed("2")}>2</div>
              <div onClick={() => this.onKeyPressed("3")}>3</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("4")}>4</div>
              <div onClick={() => this.onKeyPressed("5")}>5</div>
              <div onClick={() => this.onKeyPressed("6")}>6</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("7")}>7</div>
              <div onClick={() => this.onKeyPressed("8")}>8</div>
              <div onClick={() => this.onKeyPressed("9")}>9</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("*")}>*</div>
              <div onClick={() => this.onKeyPressed("0")}>0</div>
              <div onClick={() => this.onKeyPressed("#")}>#</div>
            </div>
            <div>
              <Button onClick={this.manualCall}>Marcar</Button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default Keyboard;
