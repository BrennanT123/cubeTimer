import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";
import { SolveChart } from "./chart";

export function Totals() {
  const [numSolves, setNumSolves] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getTotalSolves() {
    try {
      setLoading(true);
      const numberSolves = await axios.get(
        `${API_LINK}/dataRouter/getNumSolves`
      );

      setNumSolves(numberSolves.data);
      setLoading(false);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    getTotalSolves();
  }, []);

  function handleResetTotals(){
     getTotalSolves();
  }

  return (
    <>
      {error && <div className={dataStyles.errorText}>An error occurred</div>}
      {loading && <div className={dataStyles.loadingText}>Loading...</div>}
      {!loading && !error && numSolves && (
        <>
          <div className={dataStyles.solveCountTable}>
            <div>
              Number of Solves:<div> {numSolves.solveCount}</div>
            </div>
            <div>
              Number of DNFs: <div>{numSolves.dnfCount}</div>
            </div>
            <div>
              Number of +2s: <div>{numSolves.p2Count}</div>
            </div>
          </div>
          <button onClick= {handleResetTotals} className={dataStyles.resetTotalButton}>Reset Totals</button>
        </>
      )}
    </>
  );
}
