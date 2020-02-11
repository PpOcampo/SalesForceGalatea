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
import log from "./Logger.jsx";

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
      notReady: false,
      configuration: undefined,
      autologin: true,
      callDataRecived: null,
      manualCallData: null
    };
    this.integration = undefined;
    this.labels = getLabels("es");
  }

  windowListenerFunctions() {
    let _this = this;
    window.onAgentStatus = function(agentStatus) {
      log("agentStatus=>", agentStatus);
      _this.setState({ agentStatus: agentStatus });
    };

    window.onLogin = function() {
      log("Login success");
    };

    window.remoteLoginError = function(message) {
      message.show = true;
      log("loginError=>", message);
      _this.setState({ error: message });
    };

    window.onLogOut = function() {
      log("onLogoOut");
      _this.setState({ logged: false, error: { show: false } });
    };

    window.onUnavailableTypes = function(unavailables) {
      log("onUnavailableTypes=>", unavailables);
      _this.setState({ unavailables: unavailables });
    };

    window.wrongNumber = function(phoneNumber) {
      log("wrongNumber " + phoneNumber + " ,but dialing anyway");
      const {
        phoneNum,
        campaignID,
        clientName,
        callKey
      } = _this.state.manualCallData;
      _this.integration.makeManualCall(
        phoneNum,
        campaignID,
        clientName,
        callKey
      );
      // _this.setState({ wrongNumber: true });
    };

    window.onCampaigns = function(json) {
      log("onCampaigns =>", json);
      if (json === "") {
        _this.getCampaignsRelated();
      } else {
        let arrayCampaigns = Object.values(json);
        arrayCampaigns.sort(function(a, b) {
          return b.Default - a.Default;
        });
        _this.setState({ campaigns: arrayCampaigns });
      }
    };

    window.onDialingNumber = function(message) {
      log("onDialingNumber => ", message);
    };

    window.onCallRecieved = function(callDataRecived) {
      _this.setState({ callDataRecived });
      log("onCallRecieved =>", callDataRecived);
    };
  }

  salesForceListener(message) {
    log("recivedFromSalesForce => ", message);
    switch (message.name) {
      case "configuration":
        this.setConfiguration(message.value);
        break;
      case "credentials":
        this.onLoginSubmit(
          message.value.Username.split("@")[0],
          message.value.Id
        );
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
    // this.setConfiguration({ server: "121.nuxiba.com", language: "es" });
    this.setConfiguration({ server: "demo.nuxiba.com", language: "es" });
  }

  componentDidUpdate(prevProps, prevState) {
    const { socketOpen, agentStatus } = this.state;
    if (agentStatus !== prevState.agentStatus) {
      switch (agentStatus.currentState) {
        case "logout":
          if (this.state.autologin) {
            LCC.sendMessage({
              event: "LccEvent",
              value: "GetCredentials"
            });
          }
          log("logOut, waiting for login");
          this.setState({ logged: false, autologin: false });
          return;
        case "NotConnected":
          log("NotConnected, integration component hasn't connected");
          this.integration.connectToServer();
          return;
        case "NotReady":
          log("NotReady, integration component hasn't connected");
          this.integration.getUnavailables();
          this.setState({ notReady: true, logged: true });
          return;
        case "Ready":
          log("Ready");
          this.integration.getUnavailables();
          this.reset();
          // this.setState({ logged: true, notReady: false });
          return;
        case "SocketClosed":
          log("SocketClosed, check wss configuration");
          if (socketOpen) {
            this.setState({ socketOpen: false, logged: false });
          }
          this.onLogOutClick();
          this.setState({ error: { show: true, message: "Socket Closed" } });
          return;
      }
    }

    if (socketOpen !== prevState.socketOpen && !socketOpen) {
      log("Something is wrong (Check integration component)");
    }
  }

  onLoginSubmit(username, password) {
    log("SalesForce ==> ", username, password);
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
    this.setState({
      manualCallData: { phoneNum, campaignID: campaign.ID, clientName, callKey }
    });
    this.integration.makeManualCall(phoneNum, campaign.ID, clientName, callKey);
  }

  hangUp() {
    log("hangUp");
    this.integration.HangUpCall();
    this.reset();
  }

  reset() {
    this.setState({
      error: { show: false },
      validating: false,
      callData: null,
      manualCallData: null,
      logged: true,
      notReady: false
    });
  }

  render() {
    const { error, unavailables, configuration } = this.state;
    return configuration ? (
      <>
        <iframe
          src={`https://${configuration.server}/AgentKolob`}
          name="KolobAgentFrame"
          style={{
            // display: "none",
            width: "300px",
            height: "500px"
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
              notReady={this.state.notReady}
              labels={this.labels}
              callDataRecived={this.state.callDataRecived}
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
