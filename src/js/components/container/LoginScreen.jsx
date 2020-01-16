import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert
} from "reactstrap";
import * as LCC from "lightning-container";

import image from "../../../images/agentLogo.png";
import styles from "./LoginScreen.css";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  onSubmit() {
    this.props.onSubmit(this.state.user, this.state.password);
  }

  onUserChange(e) {
    this.setState({ user: e.target.value });
  }

  onPwdChange(e) {
    this.setState({ password: e.target.value });
  }
  onKeyPress(e) {
    if (e.which === 13) {
      this.onSubmit();
    }
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.imageDiv}>
          <img src={image} className={styles.image} />
        </div>
        <div className={styles.form}>
          <FormGroup>
            <div
              className={`${styles.alert} ${
                this.props.error.show ? styles.show : styles.hide
              }`}
            >
              <Alert color="primary">{this.props.error.message}</Alert>
            </div>
          </FormGroup>
          <FormGroup>
            <div className={styles.divLabel}>User</div>
            <div className={styles.divInput}>
              <input
                id="loginUserName"
                type="text"
                name="fname"
                placeholder="Usuario"
                onChange={this.onUserChange}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className={styles.divLabel}>Password</div>
            <div className={styles.divInput}>
              <input
                type="password"
                name="fname"
                placeholder="Contraseña"
                onChange={this.onPwdChange}
                onKeyPress={this.onKeyPress}
              />
            </div>
          </FormGroup>

          <FormGroup className={styles.submitBtn}>
            <Button onClick={this.onSubmit} color="primary">
              Login
            </Button>
          </FormGroup>
        </div>
      </div>
    );
  }
}
export default LoginScreen;
