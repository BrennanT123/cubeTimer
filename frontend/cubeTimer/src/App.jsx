import { useState } from "react";
import Data from "./partials/data";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Data></Data>
    </>
  );
}

export default App;
