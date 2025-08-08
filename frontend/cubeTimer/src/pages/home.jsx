import { useState } from "react";
import Data from "../partials/data";
import Timer from "../partials/timer";

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Timer></Timer>
      <Data></Data>
    </>
  );
}

export default Home;
