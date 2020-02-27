import React, { Component } from "react";
import styles from "./BasePhoneInput.css";
import { Input } from "reactstrap";

class BasePhoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.props.onChange(this.state.value);
    }
  }

  onBackSpaceClick = e => {
    this.setState({ value: this.state.value.slice(0, -1) });
  };

  onChange = e => {
    let regex = /^\d*$/i;
    if (regex.test(e.target.value)) {
      this.setState({ value: e.target.value });
    }
  };

  onKeyDown = e => {
    this.props.onKeyDown(e);
  };

  render() {
    return (
      <div className={`${styles.inputKeyBoard} ${this.props.className}`}>
        <Input
          type="text"
          value={this.props.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        {this.props.value.length > 0 && (
          <div id="kbackspace" onClick={this.onBackSpaceClick} />
        )}
      </div>
    );
  }
}
export default BasePhoneInput;
