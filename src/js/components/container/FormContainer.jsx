import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./FormContainer.css";
import BaseBtn from "./BaseBtn.jsx";
import MainScreen from "./MainScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";

import { IntegrationApiFactory } from "../../../lib/bower/cw-galatea-integration-api-js-bundle/cw-galatea-integration-api-js-bundle.js";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.windowsFunctions = this.windowsFunctions.bind(this);
    this.state = {
      logged: false,
      integration: undefined,
      agentStatus: undefined
    };
  }

  windowsFunctions() {
    let _this = this;
    window.onAgentStatus = function(agentStatus) {
      _this.setState({ agentStatus: agentStatus });
    };

    window.onLogin = function() {
      _this.setState({ logged: true });
    };
  }

  componentDidMount() {
    this.windowsFunctions();
    let integration = new IntegrationApiFactory().buildClient();
    let server = "192.168.0.107";
    // let server = "demo.nuxiba.com";
    let secureConnection = false;
    integration.WSParameters.server = server;
    integration.WSParameters.secureConnection = secureConnection;
    integration.connectToServer();
    this.setState({ integration: integration });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.agentStatus !== prevState.agentStatus) {
      switch (this.state.agentStatus.currentState) {
        case "logout":
          this.setState({ logged: false });
          return;
        default:
          console.log(this.state.agentStatus.currentState);
          this.state.integration.connectToServer();
      }
    }
  }

  onLoginSubmit(username, password) {
    this.state.integration.login(username, password);
  }

  onClick() {
    // fetch("https://pokeapi.co/api/v2/pokemon/ditto")
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(myJson => {
    //     console.log(myJson);
    //   });

    // this.setState({ clicked: !this.state.clicked });
    LCC.sendMessage({
      event: "LccEvent",
      value: "Hello World"
    });
  }
  render() {
    return (
      <>
        {/* <iframe
          src="https://demo.nuxiba.com/AgentKolob/?softphone=WebRTC"
          name="theFrame"
          style={{ display: "none" }}
        ></iframe> */}
        <div className={styles.main}>
          {this.state.logged ? (
            <MainScreen />
          ) : (
            <LoginScreen onSubmit={this.onLoginSubmit} />
          )}
        </div>
      </>
    );
  }
}
export default FormContainer;

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;
