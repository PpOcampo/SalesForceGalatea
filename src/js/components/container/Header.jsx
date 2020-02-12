import React, { Component } from "react";
import styles from "./Header.css";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class MainScreen extends Component {
  constructor(props) {
    super(props);
  }

  onBack = () => {
    this.props.onBack();
  };

  onLogOut = () => {
    this.props.onLogOut();
  };

  render() {
    const { showBack, show, labels } = this.props;
    return show ? (
      <div className={styles.main}>
        <div className={styles.title}>
          {showBack && <div className={styles.arrow} onClick={this.onBack} />}
          <div className={styles.text}>{labels.title}</div>
        </div>
        <UncontrolledDropdown direction="left" className={styles.dropdown}>
          <DropdownToggle className={styles.dropdownBtn}>
            <div className={styles.dropdownIcon} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.onLogOut}>{labels.logout}</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ) : (
      <></>
    );
  }
}
export default MainScreen;
