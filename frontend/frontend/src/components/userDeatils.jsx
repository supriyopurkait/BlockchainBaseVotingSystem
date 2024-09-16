import React, { useState } from "react";
import copy_svg from "/picture/copy-icon.png";
import copy_check from "/icons/copy-check.svg";

// CopyComponent for handling clipboard copy
const CopyComponent = ({ walletAddress }) => {
  const [copySuccess, setCopySuccess] = useState(false); // State to track copy success

  const eventCopy = () => {
    navigator.clipboard.writeText(walletAddress ? walletAddress : "NULL").then(() => {
      setCopySuccess(true); // Set copy success to true

      // Reset the icon back to the default after 1 second
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000);
    });
  };

  return (
    <button
      className="ml-2 p-4 rounded-full"
      onClick={eventCopy}
    >
      <img
        src={copySuccess ? copy_check : copy_svg} // Conditionally display the correct icon
        alt={copySuccess ? "Copy-check" : "Copy"}
        className="w-4 h-4 transition duration-300" // Optional smooth transition
      />
    </button>
  );
};

const UserDeatils = ({ walletAddress }) => {
  const userName = "ABCD";

  return (
    <div
      className="absolute right-[13rem] top-[1rem] w-[30rem] z-60 bg-white shadow-lg rounded-lg transition-all duration-1000 transform scale-100 p-4"
      onMouseEnter={(e) => e.stopPropagation()} // Prevent hover from closing when inside the modal
    >
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold w-min sm:w-fit">User Wallet Information</h5>
      </div>
      
      <div className="mb-4">
        <h5 className="font-semibold">Wallet Address</h5>
        <div className="flex items-center">
          <span className="text-gray-700 hover:bg-slate-100 rounded-md">
            {walletAddress ? walletAddress : "No Wallet Connected"}
          </span>
          {/* Render CopyComponent to handle copying the wallet address */}
          <CopyComponent walletAddress={walletAddress} />
        </div>
      </div>

      <hr className="my-2" />

      <div className="mb-4">
        <h5 className="font-semibold">Your Voting Status</h5>
        {/* Add voting status content here */}
      </div>

      <hr className="my-2" />

      <div className="mb-4">
        <h5 className="font-semibold">User Profile</h5>
        <ul className="list-none">
          <li className="text-gray-700">
            <strong>Full Name:</strong> {userName}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDeatils;
