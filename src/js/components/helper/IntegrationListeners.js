export default class IntegrationListener {
  static instance;
  constructor(configuration) {
    this.integration = new IntegrationListener();
  }

  static getInstance() {
    if (Integration.instance) {
      return Integration.instance.integration;
    }
    Integration.instance = new Integration();
    return Integration.instance.integration;
  }
}
