import React, { Component } from "react";
import { Button, Form, FormGroup, Spinner, Alert } from "reactstrap";
import image from "../../images/agentLogo.png";
import styles from "./LoginScreen.css";
import BaseBtn from "../common/BaseBtn/BaseBtn.jsx";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUserChange = this.onUserChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onPwdEyeClick = this.onPwdEyeClick.bind(this);
    this.state = {
      loading: false,
      disabledBtn: true,
      user: "",
      password: "",
      showPassword: false
    };
  }
  onSubmit() {
    this.setState({ loading: true });
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
  onPwdEyeClick() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading, user, password, disabledBtn } = this.state;
    const { error } = this.props;
    if (loading && error.show && prevProps.error.show !== error.show) {
      this.setState({ loading: false });
    }
    if (user.length === 0 && password.length === 0 && !disabledBtn) {
      this.setState({ disabledBtn: true });
    }
    if (user.length > 0 && password.length > 0 && disabledBtn) {
      this.setState({ disabledBtn: false });
    }
  }

  render() {
    const { labels, agentStatus } = this.props;
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
            <div className={styles.divLabel}>{labels.user}</div>
            <div className={styles.divInput}>
              <input
                id="loginUserName"
                type="text"
                name="fname"
                placeholder={labels.inputUserPh}
                onChange={this.onUserChange}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className={styles.divLabel}>{labels.pwd}</div>
            <div
              className={`${styles.divInput} ${styles.password} ${
                this.state.showPassword ? styles.show : ""
              }`}
            >
              <input
                type={this.state.showPassword ? "text" : "password"}
                name="fname"
                placeholder={labels.inputPwdPh}
                onChange={this.onPwdChange}
                onKeyPress={this.onKeyPress}
              />
              <div id="pwdEye" onClick={this.onPwdEyeClick}></div>
            </div>
          </FormGroup>

          <FormGroup className={styles.submitBtn}>
            {this.state.loading ? (
              <Spinner className={styles.spinner} />
            ) : (
              <BaseBtn
                onClick={this.onSubmit}
                disabled={this.state.disabledBtn}
              >
                {labels.btnSubmit}
              </BaseBtn>
            )}
          </FormGroup>
        </div>
      </div>
    );
  }
}
export default LoginScreen;
