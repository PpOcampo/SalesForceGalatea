import React, { Component } from "react";
import styles from "./XferScreen.css";
import { CustomInput, FormGroup, Button } from "reactstrap";
import IntegrationListener from "../../../helper/IntegrationListeners.js";
import { log } from "../../../helper/UtilsHelper.js";
import Integration from "../../../helper/Integration.js";
import BaseBtn from "../../common/BaseBtn/BaseBtn.jsx";
import BaseRadioBtn from "../../common/BaseRadioBtn/BaseRadioBtn.jsx";
import BaseSearchInput from "../../common/BaseSearchInput/BaseSearchInput.jsx";

class XferScreen extends Component {
  state = {
    activeTab: 0,
    acdList: [],
    agentList: [],
    phoneList: [],
    currentXfer: null,
    searching: false
  };

  componentDidMount() {
    IntegrationListener.onTransferOptions(this.onTransferOptions);
  }

  onTransferOptions = xferOptions => {
    let acdList = xferOptions.data[0].map(item => ({
      ...item,
      id: item.inbound_id
    }));
    let phoneList = xferOptions.data[1].map(item => ({
      ...item,
      id: item.number
    }));
    let agentList = xferOptions.data[2].map(item => ({
      ...item,
      id: item.extid
    }));
    this.setState({ acdList, agentList, phoneList });
  };

  onTabChange = activeTab => {
    this.setState({ activeTab, currentXfer: null });
  };

  showContent = () => {
    if (this.state.searching) {
      return this.searching();
    }
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

  searching = () => {
    return <>{this.renderCheckList(this.state.acdList)}</>;
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

  onXferSelect = element => {
    this.setState({ currentXfer: element });
  };

  blindXfer = () => {
    let integration = Integration.getInstance();
    if (!this.state.currentXfer) return;
    switch (this.state.activeTab) {
      case 1:
        integration.transferCallToAgent(this.state.currentXfer.id);
      case 2:
        integration.transferCallToPhoneNumber(this.state.currentXfer.id);
      case 0:
      default:
        integration.transferCallToACD(this.state.currentXfer.id);
    }
    this.props.onBackBtn();
  };

  renderCheckList = list => {
    let { currentXfer } = this.state;
    return (
      <FormGroup>
        {list.map((element, index) => (
          <BaseRadioBtn
            id={`chkList${index}`}
            name="radioXfer"
            label={element.name}
            value={element}
            onClick={this.onXferSelect}
            active={currentXfer && currentXfer.id === element.id}
          />
        ))}
      </FormGroup>
    );
  };

  onBackBtn = () => {
    this.props.onBackBtn();
  };

  onSearch = () => {
    this.setState({ searching: true });
  };

  onSearchClose = () => {
    this.setState({ searching: false });
  };

  render() {
    const { activeTab, searching } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          {!searching ? (
            <>
              <div className={styles.back} onClick={this.onBackBtn} />
              <div>Transferencia</div>
              <div className={styles.lupa} onClick={this.onSearch}></div>
            </>
          ) : (
            <>
              <div className={styles.searchInput}>
                <BaseSearchInput onClose={this.onSearchClose}></BaseSearchInput>
              </div>
            </>
          )}
        </div>
        {!searching && this.tabMenu()}
        <div className={`${styles.content} ${searching && styles.search}`}>
          {this.showContent()}
        </div>

        <div className={styles.footer}>
          <BaseBtn onClick={this.blindXfer}>Transferir</BaseBtn>
        </div>
      </div>
    );
  }
}
export default XferScreen;
