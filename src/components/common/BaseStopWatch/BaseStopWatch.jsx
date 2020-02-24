import React, { useState, useEffect } from "react";
import styles from "./BaseStopWatch.css";

export default function BaseCircularProgress(props) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  const [interval, setTimerInterval] = useState(null);

  const zeroPad = value => {
    return value < 10 ? `0${value}` : value;
  };

  useEffect(() => {
    if (!props.running) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [props.running]);

  useEffect(() => {
    let sec = seconds;
    let min = minutes;
    let hrs = hours;
    if (sec === 60) {
      sec = 0;
      min = min + 1;
    }
    if (min === 60) {
      sec = 0;
      min = 0;
      hrs = hrs + 1;
    }
    setHours(hrs);
    setMinutes(min);
    setSeconds(sec);
  }, [seconds]);

  const startTimer = () => {
    let timerInterval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    setTimerInterval(timerInterval);
  };

  const stopTimer = () => {
    clearInterval(interval);
    setTimerInterval(null);
    reset();
  };

  const reset = () => {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div className={styles.timer}>
      <span>{zeroPad(hours)}:</span>
      <span>{zeroPad(minutes)}:</span>
      <span>{zeroPad(seconds)}</span>
    </div>
  );
}
