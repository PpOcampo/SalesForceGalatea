import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Spinner } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./Container.css";
import MainScreen from "./MainScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";
import Keyboard from "./Keyboard.jsx";
import getLabels from "../../../languages/selector.js";
import { IntegrationApiFactory } from "../../../lib/bower/cw-galatea-integration-api-js-bundle/cw-galatea-integration-api-js-bundle.js";

/*https://xd.adobe.com/view/0c6d8b4e-a668-4927-6bef-3c4a4432aa6e-7a5c/ */

class Container extends Component {
  constructor(props) {
    super(props);

    this.windowListenerFunctions = this.windowListenerFunctions.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onLogOutClick = this.onLogOutClick.bind(this);
    this.setUnavailable = this.setUnavailable.bind(this);
    this.setAvailable = this.setAvailable.bind(this);
    this.getCampaignsRelated = this.getCampaignsRelated.bind(this);
    this.makeManualCall = this.makeManualCall.bind(this);
    this.hangUp = this.hangUp.bind(this);
    this.reset = this.reset.bind(this);
    this.salesForceListener = this.salesForceListener.bind(this);
    this.setConfiguration = this.setConfiguration.bind(this);

    this.state = {
      logged: false,
      agentStatus: undefined,
      socketOpen: true,
      error: { show: false },
      validating: false,
      unavailables: undefined,
      campaigns: undefined,
      wrongNumber: false,
      notReady: false,
      configuration: undefined
    };
    this.integration = undefined;
    this.labels = getLabels("en");
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
      console.log("================", unavailables);
      _this.setState({ unavailables: unavailables });
    };

    window.wrongNumber = function(phoneNumber) {
      _this.setState({ wrongNumber: true });
    };

    window.onCampaigns = function(json) {
      if (json === "") {
        _this.getCampaignsRelated();
      } else {
        let arrayCampaigns = Object.values(json);
        arrayCampaigns[1].Default = true;
        arrayCampaigns.sort(function(a, b) {
          return b.Default - a.Default;
        });
        _this.setState({ campaigns: arrayCampaigns });
      }
    };

    window.onDialingNumber = function(message) {
      console.log("dialingNumber=>", phoneNumber);
    };
  }

  salesForceListener(message) {
    console.log("SalesForce ==> ", message);
    switch (message.name) {
      case "configuration":
        this.setConfiguration(message.value);
        break;
      case "credentials":
        this.onLoginSubmit(message.value.Username, message.value.Id);
        break;
      default:
        break;
    }
  }

  setConfiguration(configuration) {
    let secureConnection = true;
    this.integration.WSParameters.server = configuration.server;
    this.integration.WSParameters.secureConnection = secureConnection;
    this.integration.connectToServer();
    this.setState({ configuration });
    this.labels = getLabels(configuration.language);
  }

  componentDidMount() {
    this.windowListenerFunctions();
    LCC.addMessageHandler(this.salesForceListener);
    LCC.sendMessage({
      event: "LccEvent",
      value: "GetConfig"
    });
    this.integration = new IntegrationApiFactory().buildClient();
    this.setConfiguration({ server: "demo.nuxiba.com", language: "en" });
  }

  componentDidUpdate(prevProps, prevState) {
    const { socketOpen, agentStatus } = this.state;
    if (agentStatus !== prevState.agentStatus) {
      console.log("agentStatus=>", agentStatus);
      switch (agentStatus.currentState) {
        case "logout":
          LCC.sendMessage({
            event: "LccEvent",
            value: "GetCredentials"
          });
          this.setState({ logged: false });
          return;
        case "NotConnected":
          this.integration.connectToServer();
          return;
        case "NotReady":
          this.integration.getUnavailables();
          this.setState({ notReady: true, logged: true });
          return;
        case "Ready":
          this.integration.getUnavailables();
          this.setState({ logged: true });
          return;
        case "SocketClosed":
          if (socketOpen) {
            this.setState({ socketOpen: false, logged: false });
          }
          this.onLogOutClick();
          this.setState({ error: { show: true, message: "Socket Closed" } });
          return;
      }
    }

    if (socketOpen !== prevState.socketOpen && !socketOpen) {
      console.log("Verificar Integracion ");
    }
  }

  onLoginSubmit(username, password) {
    console.log("SalesForce ==> ", username, password);
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
    this.integration.makeManualCall(phoneNum, campaign.ID, clientName, callKey);
  }

  hangUp() {
    this.integration.HangUpCall();
    this.reset();
  }

  reset() {
    this.setState({
      error: { show: false },
      validating: false,
      wrongNumber: false
    });
  }

  render() {
    const { error, unavailables, wrongNumber, configuration } = this.state;
    return configuration ? (
      <>
        <iframe
          src={`https://${configuration.server}/AgentKolob/?softphone=WebRTC`}
          name="KolobAgentFrame"
          style={{
            display: "none"
          }}
          allow="geolocation; microphone;"
        ></iframe>
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
              notReady={this.state.notReady}
              labels={this.labels}
            />
          ) : (
            <LoginScreen
              onSubmit={this.onLoginSubmit}
              error={error}
              labels={this.labels.LoginScreen}
            />
          )}
        </div>
      </>
    ) : (
      <Spinner className={styles.spinner} />
    );
  }
}
export default Container;

const wrapper = document.getElementById("root");

wrapper ? ReactDOM.render(<Container />, wrapper) : false;
