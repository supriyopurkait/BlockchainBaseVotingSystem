import React, { useState } from "react";
import VoterCanditate from "./vote/voterCanditate";

const VoteBtn = () => {
  const [showModal, setShowModal] = useState(false); 

  const Voteclick = () => {
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false); 
  };

  return (
    <>
      <button
        className="me-2  justify-center bg-slate-600 text-white hover:bg-slate-50 hover:text-black py-[0.15rem] hover:border-black hover:border-[1px]"
        onClick={Voteclick}
      >
        Let's vote
      </button>
      {showModal && <VoterCanditate onClose={closeModal} />} {/* Pass closeModal function */}
    </>
  );
};

export default VoteBtn;
