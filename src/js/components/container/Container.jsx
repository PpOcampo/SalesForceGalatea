import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Spinner } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./Container.css";
import MainScreen from "./MainScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";

import { IntegrationApiFactory } from "../../../lib/bower/cw-galatea-integration-api-js-bundle/cw-galatea-integration-api-js-bundle.js";

class Container extends Component {
  constructor(props) {
    super(props);

    this.windowListenerFunctions = this.windowListenerFunctions.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLogOutClick = this.onLogOutClick.bind(this);
    this.setUnavailable = this.setUnavailable.bind(this);
    this.setAvailable = this.setAvailable.bind(this);
    this.microphoneUse = this.microphoneUse.bind(this);

    this.state = {
      logged: false,
      agentStatus: undefined,
      socketOpen: true,
      error: { show: false },
      validating: false,
      unavailables: undefined
    };
    this.integration = undefined;
  }

  windowListenerFunctions() {
    let _this = this;
    window.onAgentStatus = function(agentStatus) {
      _this.setState({ agentStatus: agentStatus });
    };

    window.onLogin = function() {
      _this.setState({ logged: true });
    };
    window.remoteLoginError = function(message) {
      message.show = true;
      _this.setState({ error: message });
    };

    window.onLogOut = function() {
      _this.setState({ logged: false });
    };

    window.onUnavailableTypes = function(unavailables) {
      _this.setState({ unavailables: unavailables });
    };
  }

  componentDidMount() {
    this.windowListenerFunctions();
    this.integration = new IntegrationApiFactory().buildClient();
    // let server = "192.168.0.107";
    let server = "demo.nuxiba.com";
    let secureConnection = false;
    this.integration.WSParameters.server = server;
    this.integration.WSParameters.secureConnection = secureConnection;
    this.integration.connectToServer();
  }

  componentDidUpdate(prevProps, prevState) {
    const { socketOpen, agentStatus } = this.state;
    if (agentStatus !== prevState.agentStatus) {
      console.log(agentStatus);
      switch (agentStatus.currentState) {
        case "logout":
          this.setState({ logged: false });
          return;
        case "NotConnected":
          this.integration.connectToServer();
          return;
        case "NotReady":
          return;
        case "Ready":
          console.log("prev");
          this.microphoneUse();
          this.integration.getUnavailables();
          this.setState({ logged: true });
          return;
        case "SocketClosed":
          if (socketOpen) {
            this.setState({ socketOpen: false, logged: false });
          }
          return;
      }
    }

    if (socketOpen !== prevState.socketOpen && !socketOpen) {
      console.log("Verificar Integracion ");
    }
  }

  onLoginSubmit(username, password) {
    this.integration.login(username, password);
  }

  onLogOutClick() {
    this.integration.closeSession();
  }

  setUnavailable(unavailableId) {
    this.integration.setOnUnavailableStatus(unavailableId);
  }

  setAvailable() {
    this.integration.SetAvailable();
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

  microphoneUse() {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true })
    //   .then(function(stream) {
    //     console.log("You let me use your mic!");
    //   })
    //   .catch(function(err) {
    //     console.log("No mic for you!");
    //   });
  }

  render() {
    const { error, unavailables } = this.state;
    return (
      <>
        <iframe
          src="https://demo.nuxiba.com/AgentKolob/?softphone=WebRTC"
          name="theFrame"
          style={{
            display: "none"
          }}
          allow="geolocation; microphone;"
        ></iframe>
        {/* <div>
          <Spinner color="primary" />
        </div> */}
        <div className={styles.main}>
          {this.state.logged ? (
            <MainScreen
              onLogOut={this.onLogOutClick}
              unavailables={unavailables}
              setUnavailable={this.setUnavailable}
              setAvailable={this.setAvailable}
            />
          ) : (
            <LoginScreen onSubmit={this.onLoginSubmit} error={error} />
          )}
        </div>
      </>
    );
  }
}
export default Container;

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<Container />, wrapper) : false;
