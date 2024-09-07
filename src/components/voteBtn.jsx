import React from "react";
import { Link } from "react-router-dom";

const VoteBtn = () => {
  return (
    <>
      
      <div className="btn btn-ligth ps-4 mx-2">
        <Link className="btn btn-grey" to="/voterCanditate">Let's vote</Link></div>
    </>
  );
};

export default VoteBtn;
