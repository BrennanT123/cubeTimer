import { useState } from "react";
import Data from "../partials/data";


function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Data></Data>
    </>
  );
}

export default Home;
