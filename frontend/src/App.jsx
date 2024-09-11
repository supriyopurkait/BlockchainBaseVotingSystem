import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NAV from "./components/NavBar/navBar.jsx";
import Home from "./components/home.jsx"; // Ensure uppercase 'H' in 'Home.jsx'
import ThankYou from "./components/vote/thankYou.jsx";

function App() {
  const [connected, setConnected] = useState(false); // Initialize as false (not connected)

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
      <NAV setConnected={setConnected} />
      <div className="h-[30rem] bg-[#c6e7e5]">
        {/* Use RouterProvider for routing */}
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
