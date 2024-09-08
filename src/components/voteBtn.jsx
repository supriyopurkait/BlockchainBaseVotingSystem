import React from "react";
import { Link } from "react-router-dom";

const VoteBtn = () => {
  return (
    <>
      
        <Link className="me-2 justify-center bg-slate-600 text-white hover:bg-slate-50 hover:text-black py-[0.15rem]  hover:border-black hover:border-[1px]" to="/voterCanditate">Let's vote</Link>
    </>
  );
};

export default VoteBtn;
