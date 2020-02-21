import React, { Component } from "react";
import styles from "./AssistedXfer.css";
import { CustomInput, FormGroup, Button } from "reactstrap";
import IntegrationListener from "../../helper/IntegrationListeners.js";
import { log } from "../../helper/UtilsHelper.js";
import Integration from "../../helper/Integration.js";
import BaseBtn from "../BaseBtn/BaseBtn.jsx";
import BasePhoneInput from "../BasePhoneInput/BasePhoneInput.jsx";

class XferScreen extends Component {
  state = {
    xferPhoneNumber: ""
  };

  componentDidMount() {
    IntegrationListener.onTransferOptions(this.onTransferOptions);
  }

  onBackBtn = () => {
    this.props.onBackBtn();
  };

  onChange = value => {
    this.setState({ xferPhoneNumber: value });
  };

  render() {
    const { xferPhoneNumber } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.back} onClick={this.onBackBtn} />
          <div className={styles.title}>Transferencia Asistida</div>
          <div></div>
        </div>
        <div className={styles.content}>
          <div className={styles.mainScreen}>
            Numero
            <BasePhoneInput
              value={xferPhoneNumber}
              onChange={this.onChange}
            ></BasePhoneInput>
            <BaseBtn>Transferir</BaseBtn>
          </div>
        </div>
      </div>
    );
  }
}
export default XferScreen;
