import React, { Component } from "react";
import styles from "./XferScreen.css";

class XferScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.back} />
          <div>Transferencia</div>
          <div className={styles.lupa}></div>
        </div>
        <div className={styles.tabs}>
          <div>ACD</div>
          <div>Agente</div>
          <div>Numero</div>
        </div>

        <div className={styles.content}>content</div>
        <div className={styles.footer}>footer</div>
      </div>
    );
  }
}
export default XferScreen;
