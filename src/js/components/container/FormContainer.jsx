import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal } from "reactstrap";
import * as LCC from "lightning-container";
import styles from "./FormContainer.css";
import BaseBtn from "./BaseBtn.jsx";
import MainScreen from "./MainScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.createScript = this.createScript.bind(this);
    this.state = {
      logged: false
    };
  }
  onLoginSubmit() {
    this.setState({ logged: true });
  }

  createScript(file) {
    const script = document.createElement("script");
    script.src = file;
    script.async = true;
    script.onload = () => this.scriptLoaded();
    document.body.appendChild(script);
  }

  componentDidMount() {
    console.log("Connecting server");
    window.connectToServer();
    console.log("----");
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
    return (
      <div className={styles.main}>
        {this.state.logged ? (
          <MainScreen />
        ) : (
          <LoginScreen onSubmit={this.onLoginSubmit} />
        )}
      </div>
    );
  }
}
export default FormContainer;

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;
