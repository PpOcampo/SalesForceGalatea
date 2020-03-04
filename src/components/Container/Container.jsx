import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Spinner } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./Container.css";
import MainScreen from "../MainScreen/MainScreen.jsx";
import LoginScreen from "../LoginScreen/LoginScreen.jsx";
import getLabels from "../../languages/selector.js";
import { log } from "../../helper/UtilsHelper.js";
import * as utils from "../../helper/UtilsHelper.js";
import IntegrationListener from "../../helper/IntegrationListeners.js";
import Integration from "../../helper/Integration.js";

/*https://xd.adobe.com/view/0c6d8b4e-a668-4927-6bef-3c4a4432aa6e-7a5c/ */

class Container extends Component {
  constructor(props) {
    super(props);
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

  componentDidMount() {
    this.setListeners();
    log("Please Salesforce give me  configuration ");
    LCC.addMessageHandler(this.salesForceListener);
    setTimeout(() => utils.requestSalesForceConfiguration(), 1000);
    this.integration = Integration.getInstance();

    utils.isDev() &&
      setTimeout(() => {
        this.setConfiguration({
          server: "121.nuxiba.com",
          language: "es",
          autologin: false,
          softphoneType: "WebRTC"
        });
      }, 2500);
  }

  salesForceListener = message => {
    log("recivedFromSalesForce => ", message);
    let { SALESFORCE_EVENT } = utils;
    switch (message.name) {
      case SALESFORCE_EVENT.onConfiguration:
        setTimeout(() => this.setConfiguration(message.value), 500);
        break;
      case SALESFORCE_EVENT.onCredentials:
        this.onLoginSubmit(
          message.value.Username.split("@")[0],
          message.value.Id
        );
        break;
      default:
        break;
    }
  };

  setConfiguration = configuration => {
    let secureConnection = true;
    this.integration.WSParameters.server = configuration.server;
    this.integration.WSParameters.secureConnection = secureConnection;
    this.integration.connectToServer();
    this.setState({ configuration });
    this.labels = getLabels(configuration.language);
  };

  //----------------- Kolob Agent Listeners------------------------------------------------------------
  setListeners = () => {
    IntegrationListener.onLogin(() => {});
    IntegrationListener.onDialingNumber(() => {});
    IntegrationListener.onAgentStatus(this.onAgentStatus);
    IntegrationListener.onRemoteLoginError(this.onRemoteLoginError);
    IntegrationListener.onLogOut(this.onLogOut);
    IntegrationListener.onUnavailableTypes(this.onUnavailableTypes);
    IntegrationListener.onCampaigns(this.onCampaigns);
    IntegrationListener.onWrongNumber(this.onWrongNumber);
    IntegrationListener.onCallRecieved(this.onCallRecieved);
    IntegrationListener.onErrorOnDialProcess(() => {});
    IntegrationListener.onError(() => {});
    IntegrationListener.onCallEnds(() => {});
  };

  onAgentStatus = agentStatus => {
    this.setState({ agentStatus: agentStatus });
  };

  onRemoteLoginError = message => {
    message.show = true;
    this.setState({ error: message });
  };

  onLogOut = () => {
    this.setState({ logged: false, error: { show: false } });
  };

  onUnavailableTypes = unavailables => {
    this.setState({ unavailables: unavailables });
  };

  onCampaigns = json => {
    if (json === "" && typeof yourVariable !== "object") {
      setTimeout(() => {
        this.getCampaignsRelated();
      }, 700);
    } else {
      let arrayCampaigns = Object.values(json);
      arrayCampaigns.sort(function(a, b) {
        return b.Default - a.Default;
      });
      this.setState({ campaigns: arrayCampaigns });
    }
  };

  onWrongNumber = phoneNumber => {
    const {
      phoneNum,
      campaignID,
      clientName,
      callKey
    } = this.state.manualCallData;
    this.integration.makeManualCall(phoneNum, campaignID, clientName, callKey);
  };

  onCallRecieved = callDataRecived => {
    this.setState({ callDataRecived });
  };

  //-------------------End Kolob Agent Listeners----------------------------------------------------------

  componentDidUpdate(prevProps, prevState) {
    const { socketOpen, agentStatus, configuration } = this.state;
    let { AGENT_STATUS } = utils;
    if (agentStatus !== prevState.agentStatus) {
      switch (agentStatus.currentState) {
        case AGENT_STATUS.Ready:
          log("Ready");
          this.integration.getUnavailables();
          this.reset();
          return;
        case AGENT_STATUS.LogOut:
          if (configuration && configuration.autologin) {
            utils.requestSalesForceCredentials();
          }
          log("logOut, waiting for login");
          this.setState({ logged: false, autologin: false });
          return;
        case AGENT_STATUS.NotConnected:
          log("NotConnected, integration component hasn't connected");
          // this.integration.connectToServer();
          return;
        case AGENT_STATUS.NotReady:
          log("NotReady, integration component hasn't connected");
          this.integration.getUnavailables();
          this.setState({ notReady: true, logged: true });
          return;

        case AGENT_STATUS.SocketClosed:
          log("SocketClosed, check wss configuration");
          // this.integration.connectToServer();
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

  onLoginSubmit = (username, password) => {
    log("SalesForce ==> ", username);
    this.integration.login(username, password);
  };

  onLogOutClick = () => {
    this.setState({
      configuration: { ...this.state.configuration, autologin: false }
    });
    this.integration.closeSession();
  };

  setUnavailable = unavailableId => {
    this.integration.setOnUnavailableStatus(unavailableId);
  };

  setAvailable = () => {
    this.integration.SetAvailable();
  };

  getCampaignsRelated = () => {
    this.integration.GetCampaignsRelated();
  };

  makeManualCall = (phoneNum, campaign, clientName, callKey) => {
    this.setState({
      manualCallData: { phoneNum, campaignID: campaign.ID, clientName, callKey }
    });
    this.integration.makeManualCall(phoneNum, campaign.ID, clientName, callKey); //tambien arriba
  };

  hangUp = () => {
    log("hangUp");
    this.integration.HangUpManualDial();
    this.integration.HangUpCall();
    this.reset();
  };

  reset = () => {
    this.setState({
      error: { show: false },
      validating: false,
      callData: null,
      manualCallData: null,
      logged: true,
      notReady: false
    });
  };

  render() {
    const { error, unavailables, configuration } = this.state;
    return configuration ? (
      <>
        <iframe
          src={utils.getKolobAgentAddress(
            configuration.server,
            configuration.softphoneType
          )}
          name="KolobAgentFrame"
          className={`${styles.iframeKolob} ${utils.isDev() && styles.dev}`}
          allow="geolocation; microphone;"
        />

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
