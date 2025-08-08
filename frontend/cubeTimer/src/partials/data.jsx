import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";
import { SolveChart } from "./chart";
import { Totals } from "./totals";
import { useOutletContext } from "react-router-dom";
function Data() {
  const { newSolve, setNewSolve } = useOutletContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSolves, setRecentSolves] = useState();

  async function getSolvesForTable() {
    try {
      setLoading(true);
      const recentSolvesRes = await axios.get(
        `${API_LINK}/dataRouter/getHistory`,
        {
          params: {
            numSolves: 10,
          },
        }
      );

      setRecentSolves(recentSolvesRes.data.recentSolves);

      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  async function handlePlusTwoClick(solveId) {
    try {
      await axios.put(`${API_LINK}/dataRouter/putPlusTwo/${solveId}`);

      setRecentSolves((prevSolves) =>
        prevSolves.map((solve) =>
          solve.id === solveId ? { ...solve, plusTwo: !solve.plusTwo } : solve
        )
      );
    } catch (error) {
      setError(error);
    }
  }

  async function handleDnfClick(solveId) {
    try {
      await axios.put(`${API_LINK}/dataRouter/putDnf/${solveId}`);
      setRecentSolves((prevSolves) =>
        prevSolves.map((solve) =>
          solve.id === solveId ? { ...solve, dnf: !solve.dnf } : solve
        )
      );
    } catch (error) {
      setError(error);
    }
  }

  async function handleDelClick(solveId) {
    try {
      await axios.delete(`${API_LINK}/dataRouter/deleteTime/${solveId}`);
      setRecentSolves((prevSolves) =>
        prevSolves.filter((solve) => solve.id !== solveId)
      );
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    getSolvesForTable();
  }, [newSolve]);

  return (
    <div className={dataStyles.dataContainer}>
      <SolveChart></SolveChart>
      {error && <div className={dataStyles.errorText}>An error occurred</div>}
      {loading && <div className={dataStyles.loadingText}>Loading...</div>}

      {!loading && !error && recentSolves && (
        <>
          <Totals solves={recentSolves}></Totals>
          <div className={dataStyles.previousSolves}>
            <div>Last 10 solves</div>
            <div className={dataStyles.headerRow}>
              <div>Time (s)</div>
              <div>Scramble</div>
              <div>DNF</div>
              <div>+2</div>
              <div>Delete</div>
            </div>

            {recentSolves.map((solve) => (
              <div key={solve.id} className={dataStyles.solveRow}>
                <div>{solve.time.toFixed(2)}</div>
                <div className={dataStyles.scramble}>{solve.scramble}</div>
                <div
                  className={`${dataStyles.clickableCell} ${
                    solve.dnf ? dataStyles.trueValue : ""
                  }`}
                  onClick={() => handleDnfClick(solve.id)}
                ></div>
                <div
                  className={`${dataStyles.clickableCell} ${
                    solve.plusTwo ? dataStyles.trueValue : ""
                  }`}
                  onClick={() => handlePlusTwoClick(solve.id)}
                ></div>
                <div
                  className={dataStyles.delSolve}
                  onClick={() => handleDelClick(solve.id)}
                >
                  X
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Data;