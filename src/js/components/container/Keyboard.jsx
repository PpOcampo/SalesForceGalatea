import React, { Component } from "react";
import styles from "./Keyboard.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.state = {
      keyboardValue: ""
    };
  }

  onChangeValue(e) {
    this.setState({ keyboardValue: e.target.value });
  }

  onKeyPressed(value) {
    this.setState({ keyboardValue: this.state.keyboardValue + value });
  }

  render() {
    return (
      <>
        <Modal isOpen={this.props.show} toggle={this.props.onKeyboardClick}>
          <ModalHeader toggle={this.props.onKeyboardClick} />
          <ModalBody>
            <div>
              <Input
                type="text"
                value={this.state.keyboardValue}
                onChange={this.onChangeValue}
              />
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("1")}>1</div>
              <div onClick={() => this.onKeyPressed("2")}>2</div>
              <div onClick={() => this.onKeyPressed("3")}>3</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("4")}>4</div>
              <div onClick={() => this.onKeyPressed("5")}>5</div>
              <div onClick={() => this.onKeyPressed("6")}>6</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("7")}>7</div>
              <div onClick={() => this.onKeyPressed("8")}>8</div>
              <div onClick={() => this.onKeyPressed("9")}>9</div>
            </div>
            <div className={styles.rowNumbers}>
              <div onClick={() => this.onKeyPressed("*")}>*</div>
              <div onClick={() => this.onKeyPressed("0")}>0</div>
              <div onClick={() => this.onKeyPressed("#")}>#</div>
            </div>
            <div>
              <Button>Marcar</Button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default Keyboard;
