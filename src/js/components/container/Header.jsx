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
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    this.props.onBack();
  }

  render() {
    const { showBack, show } = this.props;
    return show ? (
      <div className={styles.main}>
        <div className={styles.title}>
          {showBack && <div className={styles.arrow} onClick={this.onBack} />}
          <div className={styles.text}>Centerware Kolob</div>
        </div>
        <UncontrolledDropdown direction="down">
          <DropdownToggle className={styles.dropdownBtn}>
            <div className={styles.dropdownIcon} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem disabled>Action</DropdownItem>
            <DropdownItem>Another Action</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Another Action</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ) : (
      <></>
    );
  }
}
export default MainScreen;
