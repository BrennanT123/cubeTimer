import timerStyles from "../styles/timerStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";

function Timer() {
  const [currentScramble, setCurrentScramble] = useState();

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
  useEffect(() => {
    createScramble();
  },[])


  return (
    <div className={timerStyles.timerContainer}>
      <div className={timerStyles.scrambleContainer}>{currentScramble}</div>
    </div>
  );
}


export default Timer;