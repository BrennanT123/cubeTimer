import React from "react";
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import regression from "regression";

export function useLineChart({
  canvasRef,
  containerRef,
  solves,
  setLoading,
  setError,
}) {
  const chartInstanceRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvasRef || !solves || !Array.isArray(solves)) return;
    let solveTimeLength = solves.length;
    // const container = containerRef.current;
    const solveTimes = solves.map((solveData, i) => [
      solveTimeLength - i,
      solveData.time,
    ]);
    //setup the canvas
    canvas.width = 400;
    canvas.height = 400;
    init();

    function init() {
      setLoading(true);
      const regressionResult = regression.linear(solveTimes);
      const chart = canvas;
      const labels = solveTimes.map(() => "");
      const data = {
        labels,
        datasets: [
          {
            label: "Solve times",
            data: solveTimes.map(([x, y]) => ({ x, y })),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            pointRadius: 0.01,
            tension: 0.1,
          },
          {
            label: "Linear regression",
            data: regressionResult.points.map(([x, y]) => ({ x, y })),
            borderColor: "red",
            fill: false,
            tension: 0,
            pointRadius: 0,
          },
        ],
      };
      const options = {
        parsing: false,
        plugins: {
          legend: {
            labels: {
              color: "white",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          title: {
            display: true,
            text: "Solve times",
            color: "white",
            font: {
              size: 18,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
            },
            title: {
              display: true,
              text: "Solve Number",
              color: "white",
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: "white",
            },
            title: {
              display: true,
              text: "Time (s)",
              color: "white",
            },
          },
        },
      };

      const config = {
        type: "line",
        data: data,
        options,
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chart, config);
      setLoading(false);
    }
  }, [canvasRef, solves]);
}
