import React, { Component } from "react";
import styles from "./Calling.css";

class Calling extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return this.props.show ? (
      <div className={styles.main}>
        <div className={styles.title}>
          <div>Campaña</div>
          <div>Citibanamex</div>
        </div>

        <div className={styles.number}>
          <div>Logo</div>
          <div>Logo</div>
        </div>
        <div className={styles.btn}>Numero</div>
      </div>
    ) : (
      <></>
    );
  }
}
export default Calling;
