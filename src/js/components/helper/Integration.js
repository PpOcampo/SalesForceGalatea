import { IntegrationApiFactory } from "../../../lib/bower/cw-galatea-integration-api-js-bundle/cw-galatea-integration-api-js-bundle.js";

export default class Integration {
  static instance;
  constructor(configuration) {
    this.integration = new IntegrationApiFactory().buildClient();
  }

  static getInstance() {
    if (Integration.instance) {
      return Integration.instance.integration;
    }
    Integration.instance = new Integration();
    return Integration.instance.integration;
  }
}
