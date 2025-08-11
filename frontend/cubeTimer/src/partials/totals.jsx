import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";
import { SolveChart } from "./chart";
// import { useLocation } from "react-router-dom";

export function Totals({ solves }) {
  const [numSolves, setNumSolves] = useState();
  const [numDnf, setNumDnf] = useState(0);
  const [numPlusTwo, setNumPlusTwo] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  //   const location = useLocation();
  //   const solvesFromTable = location.state?.solves;

  //   async function getTotalSolves() {
  //     try {
  //       setLoading(true);
  //       const numberSolves = await axios.get(
  //         `${API_LINK}/dataRouter/getNumSolves`,
  //         {
  //           withCredentials: true,
  //         }
  //       );

  //       setNumSolves(numberSolves.data);
  //       setLoading(false);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //     }
  //   }

  useEffect(() => {
    setNumSolves(solves);
    let tempDnf = 0;
    solves.forEach((e) => {
      if (e.dnf === true) {
        tempDnf++;
      }
    });
    let tempP2 = 0;
    solves.forEach((e) => {
      if (e.plusTwo === true) {
        tempP2++;
      }
    });
    setNumPlusTwo(tempP2);
    setNumDnf(tempDnf);

  }, [solves]);

  //   function handleResetTotals() {
  //     getTotalSolves();
  //   }

  return (
    <>
      {error && <div className={dataStyles.errorText}>An error occurred</div>}
      {loading && <div className={dataStyles.loadingText}>Loading...</div>}
      {!loading && !error && numSolves && (
        <>
          <div className={dataStyles.solveCountTable}>
            <div>
              Number of Solves:<div> {solves.length}</div>
            </div>
            <div>
              Number of DNFs: <div>{numDnf}</div>
            </div>
            <div>
              Number of +2s: <div>{numPlusTwo}</div>
            </div>
          </div>
          {/* <button
            onClick={handleResetTotals}
            className={dataStyles.resetTotalButton}
          >
            Reset Totals
          </button> */}
        </>
      )}
    </>
  );
}
