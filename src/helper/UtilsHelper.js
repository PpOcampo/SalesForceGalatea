import * as LCC from "lightning-container";

export function log(...args) {
  console.log("iLog => ", ...args);
}

/**Agent Status */
export const AGENT_STATUS = {
  Ready: "Ready",
  Callout: "Callout",
  LogOut: "logout",
  NotConnected: "NotConnected",
  NotReady: "NotReady",
  SocketClosed: "SocketClosed"
};

export function isStatusReady(status) {
  return stringEqualsIgnoreCase(AGENT_STATUS.Ready, status);
}

export function isStatusCallOut(status) {
  return stringEqualsIgnoreCase(AGENT_STATUS.Callout, status);
}

export function stringEqualsIgnoreCase(string_1, string_2) {
  return string_1.toLowerCase() === string_2.toLowerCase();
}

/* SalesForceMsg */

export const SALESFORCE_EVENT = {
  onConfiguration: "configuration",
  onCredentials: "credentials"
};

export function requestSalesForceConfiguration() {
  LCC.sendMessage({
    event: "LccEvent",
    value: "GetConfig"
  });
}

export function requestSalesForceCredentials() {
  LCC.sendMessage({
    event: "LccEvent",
    value: "GetCredentials"
  });
}

/* Server */

export function getKolobAgentAddress(server, softphoneType) {
  return `https://${server}/AgentKolob/?softphone=${
    softphoneType ? softphoneType : "MizuJs"
  }`;
}
