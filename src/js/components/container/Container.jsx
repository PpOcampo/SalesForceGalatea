import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Spinner } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./Container.css";
import MainScreen from "./MainScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";
import Keyboard from "./Keyboard.jsx";

import { IntegrationApiFactory } from "../../../lib/bower/cw-galatea-integration-api-js-bundle/cw-galatea-integration-api-js-bundle.js";

/*https://xd.adobe.com/view/0c6d8b4e-a668-4927-6bef-3c4a4432aa6e-7a5c/ */

class Container extends Component {
  constructor(props) {
    super(props);

    this.windowListenerFunctions = this.windowListenerFunctions.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLogOutClick = this.onLogOutClick.bind(this);
    this.setUnavailable = this.setUnavailable.bind(this);
    this.setAvailable = this.setAvailable.bind(this);
    this.getCampaignsRelated = this.getCampaignsRelated.bind(this);
    this.makeManualCall = this.makeManualCall.bind(this);
    this.hangUp = this.hangUp.bind(this);

    this.state = {
      logged: false,
      agentStatus: undefined,
      socketOpen: true,
      error: { show: false },
      validating: false,
      unavailables: undefined,
      campaigns: undefined,
      wrongNumber: false
    };
    this.integration = undefined;
  }

  windowListenerFunctions() {
    let _this = this;
    window.onAgentStatus = function(agentStatus) {
      _this.setState({ agentStatus: agentStatus });
    };

    window.onLogin = function() {};

    window.remoteLoginError = function(message) {
      message.show = true;
      _this.setState({ error: message });
    };

    window.onLogOut = function() {
      _this.setState({ logged: false, error: { show: false } });
    };

    window.onUnavailableTypes = function(unavailables) {
      _this.setState({ unavailables: unavailables });
    };

    window.wrongNumber = function(phoneNumber) {
      _this.setState({ wrongNumber: true });
    };

    window.onCampaigns = function(json) {
      if (json === "") {
        _this.getCampaignsRelated();
      } else {
        _this.setState({ campaigns: Object.values(json) });
      }
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
      console.log("agentStatus=>", agentStatus);
      switch (agentStatus.currentState) {
        case "logout":
          this.setState({ logged: false });
          return;
        case "NotConnected":
          this.integration.connectToServer();
          return;
        case "NotReady":
          this.setState({ error: { show: true, message: "Not Ready" } });
          return;
        case "Ready":
          this.integration.getUnavailables();
          this.setState({ logged: true });
          return;
        case "SocketClosed":
          if (socketOpen) {
            this.setState({ socketOpen: false, logged: false });
          }
          this.setState({ error: { show: true, message: "Socket Closed" } });
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

  getCampaignsRelated() {
    this.integration.GetCampaignsRelated();
  }

  makeManualCall(phoneNum, campaign, clientName, callKey) {
    console.log("===>", campaign);
    this.integration.makeManualCall(phoneNum, campaign.ID, clientName, callKey);
  }

  hangUp() {
    this.integration.HangUpCall();
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
    const { error, unavailables, wrongNumber } = this.state;
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

        {/* <iframe
          src="https://demo.nuxiba.com/AgentKolob/?softphone=WebRTC"
          name="theFrame"
          style={{
            width: "100%",
            height: "250px"
          }}
          allow="geolocation; microphone;"
        ></iframe> */}
        {/* <div>
          <Spinner color="primary" />
        </div> */}

        {/* <div className={styles.main}>
          <MainScreen></MainScreen>
        </div> */}

        <div className={styles.main}>
          {this.state.logged ? (
            <MainScreen
              onLogOut={this.onLogOutClick}
              unavailables={unavailables}
              setUnavailable={this.setUnavailable}
              setAvailable={this.setAvailable}
              getCampaignsRelated={this.getCampaignsRelated}
              campaigns={this.state.campaigns}
              makeManualCall={this.makeManualCall}
              agentStatus={this.state.agentStatus}
              onHangUp={this.hangUp}
              wrongNumber={wrongNumber}
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

// wrapper
//   ? ReactDOM.render(
//       <Keyboard
//         onKeyboardClick={() => {}}
//         show={true}
//         campaigns={null}
//         makeManualCall={true}
//       />,
//       wrapper
//     )
//   : false;

wrapper ? ReactDOM.render(<Container />, wrapper) : false;
