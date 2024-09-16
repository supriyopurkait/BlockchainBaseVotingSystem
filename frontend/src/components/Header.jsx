import React, { useState } from "react";
import { Wallet, Vote } from "lucide-react";
import UserDeatils from "./userDeatils"; // Assuming you have this component for displaying user details
import signOutIcon from "/picture/sign-out-icon.png";
import metamask from "/icons/metamask-icon.svg";

const Header = ({ isConnected, onConnect, walletAddress, onDisconnect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false); // State to control UserDetails visibility

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <div className="text-white font-bold text-2xl flex items-center">
        <Vote className="ml-1 mt-1.5 mr-2" size={35} /> | On Chain Vote
      </div>

      <div className="relative">
        {/* Button displaying the connected wallet with dropdown functionality */}
        <button
          className={`${
            isConnected ? "bg-green-500" : "bg-blue-500"
          } hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded flex items-center`}
          onClick={isConnected ? toggleDropdown : onConnect} // Call connect when not connected
        >
          <Wallet className="mr-2" size={20} /><img src={metamask} className="h-6 w-6 pe-1"/>
          {isConnected
            ? `${walletAddress.substring(0, 3)}...${walletAddress.substring(walletAddress.length - 4)}`
            : "Connect Wallet"}
          {isConnected && (
            <svg
              className="w-2.5 h-2.5 ml-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && isConnected && ( // Only show dropdown when connected
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
            {/* User Details button */}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onMouseEnter={() => setShowUserDetails(true)} // Show on hover
              onMouseLeave={() => setShowUserDetails(false)} // Hide when not hovered
            >
              User Details
            </button>

            {/* Disconnect button */}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onDisconnect();
                setDropdownOpen(false); // Close the dropdown after disconnecting
              }}
            >
              <img
                src={signOutIcon}
                alt="Sign Out"
                className="w-5 h-5 mr-2 inline-block"
              />
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Show UserDetails component when hovered */}
      {showUserDetails && isConnected && (
        <div
          className="absolute right-0 mt-2"
          onMouseEnter={() => setShowUserDetails(true)} // Keep modal visible when hovering over it
          onMouseLeave={() => setShowUserDetails(false)} // Hide modal when the mouse leaves
        >
          <UserDeatils walletAddress={walletAddress} />
        </div>
      )}
    </header>
  );
};

export default Header;
