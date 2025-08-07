import React from "react";
import { useRef, useState } from "react";
import canvasStyles from "../styles/canvasStyles.module.css";
import { useLineChart } from "./canvasHook";

const Canvas = ({ containerRef, solves, ...props }) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useLineChart({ canvasRef, containerRef, solves, setLoading, setError });
  return (
    <>
      {error && <div className={canvasStyles.errorText}>An error occurred</div>}
      {loading && <div className={canvasStyles.loadingText}>Loading...</div>}
      <canvas className={canvasStyles.canvasSetup} ref={canvasRef} {...props} />
    </>
  );
};

export default Canvas;
