import { useState } from "react";
import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect } from "react";
import { data } from "react-router-dom";

function Data() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSolves, setRecentSolves] = useState();
  const [numSolves, setNumSolves] = useState();

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

      const numberSolves = await axios.get(
        `${API_LINK}/dataRouter/getNumSolves`
      );

      setNumSolves(numberSolves.data);
      console.log(numberSolves);
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
        prevSolves.map((solve) => {
          {
            solve.id === solveId
              ? { ...solve, plusTwo: !solve.plusTwo }
              : solve;
          }
        })
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
  }, []);

  return (
    <>
      {error && <div className={dataStyles.errorText}>An error occurred</div>}
      {loading && <div className={dataStyles.loadingText}>Loading...</div>}

      {!loading && recentSolves && (
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
          <div className={dataStyles.previousSolves}>
            <div className={dataStyles.headerRow}>
              <div>Time (s)</div>
              <div>DNF</div>
              <div>+2</div>
              <div>Delete</div>
            </div>

            {recentSolves.map((solve) => (
              <div key={solve.id} className={dataStyles.solveRow}>
                <div>{solve.time.toFixed(2)}</div>
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
    </>
  );
}

export default Data;
