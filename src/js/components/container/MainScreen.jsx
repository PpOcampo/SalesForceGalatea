import React, { Component } from "react";
import * as LCC from "lightning-container";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import styles from "./MainScreen.css";
import BaseBtn from "./BaseBtn.jsx";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.onKeyboardClick = this.onKeyboardClick.bind(this);
    this.state = {
      showKeyBoard: false
    };
  }

  onKeyboardClick() {
    this.setState({ showKeyBoard: !this.state.showKeyBoard });
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.header} />

        <div className={styles.end}>
          <div className={styles.minMargin}>
            <BaseBtn type={"xfer"} />
          </div>
        </div>

        <div>
          <div className={styles.btnStates}>
            <BaseBtn />
          </div>
          <div className={`${styles.marginRight} ${styles.btnStatesEnd}`}>
            <div>
              <BaseBtn type={"call"} />
            </div>
            <div>
              {" "}
              <Input
                className={styles.selectInput}
                type="select"
                name="select"
                id="exampleSelect"
              >
                <option>Break Nuxiba</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </div>
          </div>
        </div>

        <div>
          <textarea rows="2" />
        </div>

        <div className={styles.labels}>
          <div>
            <div className={styles.imageExt} />
            2011
          </div>
        </div>

        <div className={styles.labels}>
          <div>
            <span className={`${styles.marginRight} ${styles.bold}`}>
              Status:{" "}
            </span>{" "}
            DIALOG
          </div>
        </div>

        <div>
          <div>
            <BaseBtn type={"call"} />
          </div>
          <div>
            <BaseBtn type={"keyboard"} onClick={this.onKeyboardClick} />
          </div>
          <div>
            <BaseBtn type={"pause"} />
          </div>
          <div className={styles.minMargin}>
            <BaseBtn type={"stop"} />
          </div>
        </div>

        <div>
          <div>
            <BaseBtn type={"xfer"} />
          </div>
          <div>
            <BaseBtn type={"blindXfer"} />
          </div>
          <div>
            <BaseBtn type={"note"} />
          </div>
          <div className={styles.minMargin}>
            <div></div>
          </div>
        </div>

        <>
          <Modal isOpen={this.state.showKeyBoard} toggle={this.onKeyboardClick}>
            <ModalHeader toggle={this.onKeyboardClick} />
            <ModalBody>
              <div class={styles.rowNumbers}>
                <div>1</div>
                <div>2</div>
                <div>3</div>
              </div>
              <div class={styles.rowNumbers}>
                <div>4</div>
                <div>5</div>
                <div>6</div>
              </div>
              <div class={styles.rowNumbers}>
                <div>7</div>
                <div>8</div>
                <div>9</div>
              </div>
              <div class={styles.rowNumbers}>
                <div>*</div>
                <div>0</div>
                <div>#</div>
              </div>
            </ModalBody>
          </Modal>
        </>
      </div>
    );
  }
}
export default MainScreen;
