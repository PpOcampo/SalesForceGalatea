import { log } from "../helper/UtilsHelper.js";

export default class IntegrationListener {
  static onDisposition = delegateFunction => {
    window.onDispositions = function(disposition) {
      log("onDispositions=>", disposition);
      delegateFunction(disposition);
    };
  };

  static onAgentStatus = delegateFunction => {
    window.onAgentStatus = function(agentStatus) {
      log("agentStatus=>", agentStatus);
      delegateFunction(agentStatus);
    };
  };

  static onLogin = delegateFunction => {
    window.onLogin = function() {
      log("Login success");
      delegateFunction();
    };
  };

  static onRemoteLoginError = delegateFunction => {
    window.remoteLoginError = function(message) {
      log("onRemoteLoginError=>", message);
      delegateFunction(message);
    };
  };

  static onLogOut = delegateFunction => {
    window.onLogOut = function() {
      log("onLogOut");
      delegateFunction();
    };
  };

  static onUnavailableTypes = delegateFunction => {
    window.onUnavailableTypes = function(unavailables) {
      log("onUnavailableTypes=>", unavailables);
      delegateFunction(unavailables);
    };
  };

  static onWrongNumber = delegateFunction => {
    window.wrongNumber = function(phoneNumber) {
      log("onWrongNumber=> " + phoneNumber + " ,but dialing anyway");
      delegateFunction(phoneNumber);
    };
  };

  static onCampaigns = delegateFunction => {
    window.onCampaigns = function(json) {
      log("onCampaigns=>", json);
      delegateFunction(json);
    };
  };

  static onDialingNumber = delegateFunction => {
    window.onDialingNumber = function(message) {
      log("onDialingNumber=>", message);
      delegateFunction(message);
    };
  };

  static onCallRecieved = delegateFunction => {
    window.onCallRecieved = function(callDataRecived) {
      log("onDialingNumber=>", callDataRecived);
      delegateFunction(callDataRecived);
    };
  };

  static onTransferOptions = delegateFunction => {
    window.onTransferOptions = function(data) {
      log("onTransferOptions=>", data);
      delegateFunction(data);
    };
  };

  static onErrorOnDialProcess = delegateFunction => {
    window.errorOnDialProcess = function(data) {
      log("onErrorOnDialProcess=>", data);
      delegateFunction(data);
    };
  };

  static onError = delegateFunction => {
    window.onError = function(data) {
      log("onError=>", data);
      delegateFunction(data);
    };
  };

  static onCallEnds = delegateFunction => {
    window.onCallEnds = function(data) {
      log("onCallEnds =>", data);
      delegateFunction(data);
    };
  };

  static onDialResult = delegateFunction => {
    window.onDialResult = function(callResult) {
      log("onDialResult =>", callResult);
      delegateFunction(callResult);
    };
  };

  //Message from SalesForce
}
