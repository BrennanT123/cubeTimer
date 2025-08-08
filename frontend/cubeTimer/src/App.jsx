import { useState, useEffect } from "react";
import Data from "./partials/data";
import "./App.css";
import Timer from "./partials/timer";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const [newSolve, setNewSolve] = useState();
  useEffect(() => {
    const preventScroll = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventScroll);

    return () => {
      window.removeEventListener("keydown", preventScroll);
    };
  }, []);
  return (
    <div className="appContainer">
      <Outlet context={{newSolve, setNewSolve}}></Outlet>
    </div>
  );
}

export default App;
