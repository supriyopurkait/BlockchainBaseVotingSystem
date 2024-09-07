import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NAV from "./components/navBar.jsx";
import VoteBtn from "./components/voteBtn.jsx";
import Detailsdata from "./components/Blogdata.jsx";
import VoterCandiate from "./components/voterCanditate.jsx";
import Home from "./components/home.jsx"; // Ensure uppercase 'H' in 'Home.jsx'
import ThankYou from "./components/thankYou.jsx";

function App() {
  const [connected, setConnected] = useState(false); // Initialize as false (not connected)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home connected={connected} />, // Correct case for 'Home'
    },
    {
      path: "/voterCanditate",
      element: <VoterCandiate />,
    },
    {
      path: "/vodedone",
      element: <ThankYou />,
    },
  ]);

  return (
    <>
      <NAV setConnected={setConnected} />
      <div className="content">
        {/* Use RouterProvider for routing */}
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
