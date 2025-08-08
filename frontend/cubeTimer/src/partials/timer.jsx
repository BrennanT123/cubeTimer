import timerStyles from "../styles/timerStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useOutletContext } from "react-router-dom";
function Timer() {
  const [currentScramble, setCurrentScramble] = useState();
  const spacePressedRef = useRef(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { newSolve, setNewSolve } = useOutletContext();

  function createScramble() {
    let scramble = "";
    for (let i = 0; i < 16; i++) {
      const numTurn = Math.floor(Math.random() * 6);
      const numDirection = Math.round(Math.random());
      let currentTurn;
      switch (numTurn) {
        case 0:
          currentTurn = `F`;
          break;
        case 1:
          currentTurn = `B`;
          break;
        case 2:
          currentTurn = `D`;
          break;
        case 3:
          currentTurn = `U`;
          break;
        case 4:
          currentTurn = `L`;
          break;
        case 5:
          currentTurn = `R`;
          break;
      }
      switch (numDirection) {
        case 0:
          currentTurn = currentTurn + ` `;
          break;
        case 1:
          currentTurn = currentTurn + `' `;
      }
      scramble = scramble + currentTurn;
    }
    setCurrentScramble(scramble);
  }

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;
  const timeString = `${hours}:${minutes.toString().padStart(2, "0")}:
        ${seconds.toString().padStart(2, "0")}:
        ${milliseconds.toString().padStart(2, "0")}`;
  const timeForBackend = time / 100;
  const reset = () => {
    setTime(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !spacePressedRef.current) {
        e.preventDefault();
        if (!isRunning) {
          reset();
        }
        spacePressedRef.current = true;
        setSpacePressed(true);
        console.log("Space held down");
      }
    };

    const handleKeyUp = async (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        spacePressedRef.current = false;
        setSpacePressed(false);
        if (isRunning) {
          console.log(`Time ${timeForBackend} scramble ${currentScramble}`);
          try {
            await axios.post(`${API_LINK}/dataRouter/postNewTime`, {
              time: timeForBackend,
              scramble: currentScramble,
            });
            setNewSolve(timeForBackend);
          } catch (error) {
            setError(error);
          }
        }
        setIsRunning(!isRunning);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(intervalId);
    };
  }, [isRunning, time]);

  useEffect(() => {
    createScramble();
  }, []);

  return (
    <div className={timerStyles.timerContainer}>
      <div className={timerStyles.scrambleContainer}>{currentScramble}</div>
      <div
        className={`${timerStyles.timer} ${
          spacePressed ? timerStyles.preppedTimer : ""
        }`}
      >
        {timeString}
      </div>
    </div>
  );
}

export default Timer;
