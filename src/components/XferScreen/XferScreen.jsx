import React, { Component } from "react";
import styles from "./XferScreen.css";
import { CustomInput, FormGroup } from "reactstrap";

class XferScreen extends Component {
  state = {
    activeTab: 0
  };

  onTabChange = activeTab => {
    this.setState({ activeTab });
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
    return (
      <>
        {this.renderCheckList([
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ])}
      </>
    );
  };

  agentTab = () => {
    return <>{this.renderCheckList([1, 2, 3, 4, 5])}</>;
  };

  numberTab = () => {
    return <>NumberTab</>;
  };

  renderCheckList = list => {
    return (
      <FormGroup>
        {list.map(element => (
          <CustomInput
            type="radio"
            id={`chkList${element}`}
            name="customRadio"
            label="Select this custom radio"
            color="warning"
            className={styles.radioBtn}
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
        <div className={styles.footer}>footer</div>
      </div>
    );
  }
}
export default XferScreen;
