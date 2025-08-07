import dataStyles from "../styles/dataStyles.module.css";
import axios from "axios";
import { API_LINK } from "../utl/constants";
import { useEffect, useState, useRef } from "react";

import Canvas from "./canvas";

export function SolveChart() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allSolves, setAllSolves] = useState();
  const [chartNumSolves, setChartNumSolves] = useState(250);
  const containerRef = useRef(null);
  const solveNumRef = useRef(250);

  async function getSolvesForChart() {
    try {
      setLoading(true);
      const allSolvesRes = await axios.get(
        `${API_LINK}/dataRouter/getHistory`,
        {
          params: {
            numSolves: chartNumSolves,
          },
        }
      );
      setAllSolves(allSolvesRes.data.recentSolves);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }
  function handleChartNumChange() {
    setChartNumSolves(solveNumRef.current.value);
  }


  useEffect(() => {
    getSolvesForChart();
  }, [chartNumSolves]);

  return (
    <div className={dataStyles.chartContainer}>
      {!loading && (
        <>
          <Canvas containerRef={containerRef} solves={allSolves}></Canvas>
          <input
          ref = {solveNumRef}
            type="number"
            name="numberOfSolves"
            id="numberOfSolves"
            defaultValue={chartNumSolves}
          />
          <button onClick={handleChartNumChange}>Reset Chart</button>
        </>
      )}
    </div>
  );
}
