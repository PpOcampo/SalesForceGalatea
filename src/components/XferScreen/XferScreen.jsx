import React, { Component } from "react";
import styles from "./XferScreen.css";
import { CustomInput, FormGroup, Button } from "reactstrap";
import IntegrationListener from "../../helper/IntegrationListeners.js";
import { log } from "../../helper/UtilsHelper.js";
import Integration from "../../helper/Integration.js";

class XferScreen extends Component {
  state = {
    activeTab: 0,
    acdList: [],
    agentList: [],
    phoneList: [],
    currentXfer: null
  };

  componentDidMount() {
    IntegrationListener.onTransferOptions(this.onTransferOptions);
  }

  onTransferOptions = xferOptions => {
    let acdList = xferOptions.data[0];
    let phoneList = xferOptions.data[1];
    let agentList = xferOptions.data[2];
    this.setState({ acdList, agentList, phoneList });
  };

  onTabChange = activeTab => {
    this.setState({ activeTab, currentXfer: null });
  };

  showContent = () => {
    switch (this.state.activeTab) {
      case 1:
        return this.agentTab();
      case 2:
        return this.numberTab();
      case 0:
      default:
        return this.acdTab();
    }
  };

  tabMenu = () => {
    const { activeTab } = this.state;
    return (
      <div className={styles.tabs}>
        <div
          className={`${activeTab === 0 && styles.active}`}
          onClick={() => this.onTabChange(0)}
        >
          ACD
        </div>
        <div
          className={`${activeTab === 1 && styles.active}`}
          onClick={() => this.onTabChange(1)}
        >
          Agente
        </div>
        <div
          className={`${activeTab === 2 && styles.active}`}
          onClick={() => this.onTabChange(2)}
        >
          Numero
        </div>
      </div>
    );
  };

  acdTab = () => {
    return <>{this.renderCheckList(this.state.acdList)}</>;
  };

  agentTab = () => {
    return <>{this.renderCheckList(this.state.agentList)}</>;
  };

  numberTab = () => {
    return <>{this.renderCheckList(this.state.phoneList)}</>;
  };

  onXferSelect = (e, element) => {
    if (e.currentTarget.checked) {
      this.setState({ currentXfer: element });
    }
  };

  blindXfer = () => {
    let integration = Integration.getInstance();
    if (!this.state.currentXfer) return;
    switch (this.state.activeTab) {
      case 1:
        integration.transferCallToAgent(this.state.currentXfer.extid);
      case 2:
        integration.transferCallToPhoneNumber(this.state.currentXfer.number);
      case 0:
      default:
        integration.transferCallToACD(this.state.currentXfer.inbound_id);
    }
    this.props.onBackBtn();
  };

  renderCheckList = list => {
    return (
      <FormGroup>
        {list.map((element, index) => (
          <CustomInput
            type="radio"
            id={`chkList${index}`}
            name="radioXfer"
            label={element.name}
            className={styles.radioBtn}
            onChange={e => this.onXferSelect(e, element)}
          />
        ))}
      </FormGroup>
    );
  };

  onBackBtn = () => {
    this.props.onBackBtn();
  };

  render() {
    const { activeTab } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.back} onClick={this.onBackBtn} />
          <div>Transferencia</div>
          <div className={styles.lupa}></div>
        </div>
        {this.tabMenu()}
        <div className={styles.content}>{this.showContent()}</div>
        <div className={styles.footer}>
          <Button onClick={this.blindXfer}>Trasnferir</Button>
        </div>
      </div>
    );
  }
}
export default XferScreen;
