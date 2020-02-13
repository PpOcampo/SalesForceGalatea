import log from "../container/Logger.jsx";

export default class IntegrationListener {
  static onDisposition = delagateFunction => {
    window.onDispositions = function(disposition) {
      log("onDispositions=>", disposition);
      delagateFunction(disposition);
    };
  };

  static onAgentStatus = delagateFunction => {
    window.onAgentStatus = function(agentStatus) {
      log("agentStatus=>", agentStatus);
      delagateFunction(agentStatus);
    };
  };

  static onLogin = delagateFunction => {
    window.onLogin = function() {
      log("Login success");
      delagateFunction();
    };
  };

  static onRemoteLoginError = delagateFunction => {
    window.remoteLoginError = function(message) {
      log("onRemoteLoginError=>", message);
      delagateFunction(message);
    };
  };

  static onLogOut = delagateFunction => {
    window.onLogOut = function() {
      log("onLogOut");
      delagateFunction();
    };
  };

  static onUnavailableTypes = delagateFunction => {
    window.onUnavailableTypes = function(unavailables) {
      log("onUnavailableTypes=>", unavailables);
      delagateFunction(unavailables);
    };
  };

  static onWrongNumber = delagateFunction => {
    window.wrongNumber = function(phoneNumber) {
      log("onWrongNumber=> " + phoneNumber + " ,but dialing anyway");
      delagateFunction(phoneNumber);
    };
  };

  static onCampaigns = delagateFunction => {
    window.onCampaigns = function(json) {
      log("onCampaigns=>", json);
      delagateFunction(json);
    };
  };

  static onDialingNumber = delagateFunction => {
    window.onDialingNumber = function(message) {
      log("onDialingNumber=>", message);
      delagateFunction(message);
    };
  };

  static onCallRecieved = delagateFunction => {
    window.onCallRecieved = function(callDataRecived) {
      log("onDialingNumber=>", callDataRecived);
      delagateFunction(callDataRecived);
    };
  };

  //Message from SalesForce
}
