import { useState, useEffect } from "react";
import Data from "./partials/data";
import "./App.css";
import Timer from "./partials/timer";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_LINK } from "./utl/constants";
import axios from "axios";
function App() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [newSolve, setNewSolve] = useState();
  const [sessionReady, setSessionReady] = useState(false);

  async function checkSession() {
    try {
      const sessionExists = await axios.get(
        `${API_LINK}/dataRouter/checkSession`,
        { withCredentials: true }
      );

      // if (sessionExists.data.sessionExists === false) {

      // }
      // console.log(sessionExists);
    } catch (error) {
      console.log(`Error checking session`);
      console.log(error);
    } finally {
      setSessionReady(true);
    }
  }
  useEffect(() => {
    checkSession(); 
  }, []);


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

  if (!sessionReady) return <div>Loading session...</div>;

  return (
    <div className="appContainer">
      <Outlet context={{ newSolve, setNewSolve }}></Outlet>
    </div>
  );
}

export default App;
