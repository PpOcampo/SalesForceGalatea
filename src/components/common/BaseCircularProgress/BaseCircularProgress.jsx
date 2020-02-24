import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "!style-loader!css-loader!react-circular-progressbar/dist/styles.css";
import styles from "./BaseCircularProgress.css";

export default function BaseCircularProgress(props) {
  const [timer, setTimer] = useState(null);
  const [initial, setInitial] = useState(props.initial);

  // useEffect(() => props.running && startTimer(), []);

  useEffect(() => {
    if (!props.running) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [props.running]);

  const startTimer = () => {
    let tempTimer = setInterval(() => {
      setInitial(prevInitial => prevInitial - 1);
    }, 1000);
    setTimer(tempTimer);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
    props.onStop();
  };

  useEffect(() => {
    if (initial === 0) {
      stopTimer();
      setInitial(props.initial);
      props.onEnd();
    }
  }, [initial]);

  return (
    <div className={styles.progressBar}>
      <CircularProgressbar
        value={initial}
        maxValue={props.initial}
        text={`${initial}`}
        styles={{
          path: {
            stroke: `#FFA61D`,
            strokeLinecap: "butt",
            transition: "stroke-dashoffset 0.5s ease 0s",
            transform: "rotate(0.25turn)",
            transformOrigin: "center center"
          },
          path: {
            stroke: `#FFA61D`
          },
          trail: {
            stroke: `#192A34`
          },
          text: {
            fill: "#FFA61D",
            fontSize: "16px"
          }
        }}
      />
    </div>
  );
}
