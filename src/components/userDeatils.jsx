import React from "react";
import copy_svg from "../icon/copy-icon.png";

const UserDeatils = ({ walletAddress }) => {
  const userName = "ABCD";

  const eventCopy = () => {
    navigator.clipboard.writeText(walletAddress ? walletAddress : "NULL");
  };

  return (
    <div
      className={`absolute right-[12rem] -top-[1rem] w-[29rem] z-60 bg-white shadow-lg rounded-lg transition-all duration-1000 transform scale-100 p-4 float-left `}
      onMouseEnter={(e) => e.stopPropagation()} // Prevent hover from closing when inside the modal
    >
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold">User Wallet Information</h5>
        {/* <button
          type="button"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button> */}
      </div>
      <div className="mb-4">
        <h5 className="font-semibold">Wallet Address</h5>
        <div className="flex items-center">
          <span className="text-gray-700">
            {walletAddress ? walletAddress : "No Wallet Connected"}
          </span>
          <button
            className="ml-2 p-4 rounded-full"
            onClick={eventCopy}
          >
            <img
              src={copy_svg}
              alt="Copy"
              className="w-4 h-4"
            />
          </button>
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

      <div className="flex justify-end">
        {/* <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default UserDeatils;
