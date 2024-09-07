import React from "react";
import Detailsdata from "./Blogdata.jsx"; // Import Detailsdata
import VoteBtn from "./voteBtn.jsx";

export default function Home({ connected }) {
  return (
    <>
      <div className="content">
        <Detailsdata /> {/* Use Detailsdata after importing */}
        <div
          className="d-flex align-items-center"
          style={{ minHeight: "100px" }}
        >
          {connected && <VoteBtn />} {/* Show VoteBtn only if connected */}
          <button type="button" className="btn btn-info btn-sm mx-2">
            Know more
          </button>
        </div>
      </div>
    </>
  );
}
