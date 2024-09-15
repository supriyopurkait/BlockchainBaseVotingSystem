import React from "react";
import VoteBoxIcon from "/picture/VoteBoxIcon.png";

function Detailsdata() {
  return (
    <div>
      <div className="p-5  flex h-[20rem]  ">
      <ul className="list-unstyled align-center w-[60rem]">
        <li className=" text-3xl">Secure, Transparent, and Decentralized Voting.</li>
        <li>Our blockchain-based voting system ensures trust and transparency in elections by recording every vote on a tamper-proof ledger. Votes are secure, anonymous, and easily verifiable, guaranteeing fairness and integrity in the democratic process. </li>
        <li>Participate from anywhere with confidence in the security of your vote.</li>
        </ul>
      <div className="relative   w-[40rem]  justify-end ">
          <img src={VoteBoxIcon} className="image_properties h-[26rem]  mx-20 my-10 justify-center border-4" />
        </div>
    </div>
    </div>
    
  );
}

export default Detailsdata;
