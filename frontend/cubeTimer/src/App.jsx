import { useState } from "react";
import Data from "./partials/data";
import "./App.css";
import Timer from "./partials/timer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Timer></Timer>
      <Data></Data>
    </>
  );
}

export default App;
