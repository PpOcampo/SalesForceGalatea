import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import * as LCC from "lightning-container";

import image from "../../../images/agentLogo.png";
import styles from "./LoginScreen.css";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit() {
    this.props.onSubmit();
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.imageDiv}>
          <img src={image} className={styles.image} />
        </div>
        <div className={styles.form}>
          <FormGroup>
            <div className={styles.divInput}>
              <div>
                <div className={styles.pwdMask}></div>
              </div>
              <input type="text" name="fname" placeholder="Usuario" />
            </div>
          </FormGroup>
          <FormGroup>
            <div className={styles.divInput}>
              <div>
                <div className={styles.pwdMask}></div>
              </div>
              <input type="password" name="fname" placeholder="Contraseña" />
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
