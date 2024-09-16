import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NAV from "./components/NavBar/navBar.jsx";
import Home from "./components/home.jsx"; // Ensure uppercase 'H' in 'Home.jsx'
import ThankYou from "./components/vote/thankYou.jsx";

function App() {
  const [connected, setConnected] = useState(false); // Initialize as false (not connected)
  const [vh, setVh] = useState(window.innerHeight);
  const [vw, setVw] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setVh(window.innerHight);
      setVw(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home connected={connected} />, // Correct case for 'Home'
    },
    // {
    //   path: "/voterCanditate",
    //   element: <VoterCandiate />,
    // },
    {
      path: "/vodedone",
      element: <ThankYou />,
    },
  ]);

  return (
    <>
    <div style={{ hight: vh, width: vw }}>
      <NAV setConnected={setConnected} />
      <div className="w-full h-full">
        {/* Use RouterProvider for routing */}
        <RouterProvider router={router} />
      </div>
    </div>
    </>
  );
}

export default App;
