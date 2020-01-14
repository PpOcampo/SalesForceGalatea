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
          {this.props.error.show && (
            <Alert color="danger">{this.props.error.message}</Alert>
          )}
          <FormGroup>
            <div className={styles.divInput}>
              <div>
                <div className={styles.pwdMask}></div>
              </div>
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
            <div className={styles.divInput}>
              <div>
                <div className={styles.pwdMask}></div>
              </div>
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
              Entrar
            </Button>
          </FormGroup>
        </div>
      </div>
    );
  }
}
export default LoginScreen;
