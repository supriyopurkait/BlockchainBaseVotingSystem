import React, { useState, useEffect } from "react";
import { Wallet, Vote } from "lucide-react";
import UserDetails from "@/components/userDeatils"; // Corrected component name
import signOutIcon from "pub/picture/sign-out-icon.png?url";
import metamask from "pub/icons/metamask-icon.svg?url";
import { fetchUsers } from '@/utils/getDetails';
import { checkNFTOwnership } from "@/utils/web3Utils";
const Header = ({ onLogo, isConnected, onConnect, walletAddress, onDisconnect, wallet, voterIDContract, adminModeOn }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [data, setData] = useState([])
  const [userfetched, setUserfetched] = useState(false)
  const [kycStatus, setKYCStatus] = useState(false)

  // Function to load user data
  const loadUserData = async () => {
    const fetchedUsers = await fetchUsers(wallet, voterIDContract);
    setData([fetchedUsers["area"], fetchedUsers["VIDNumber"]]);
    setUserfetched(true)
    
    // Use console.log instead of console.error for regular logging
    toggleDropdown(); // Toggling dropdown after fetching data
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle clicks outside dropdown or UserDetails to close them
  useEffect(() => {
    const checkForNFTOwnership = async () => {
      const hasVID = await checkNFTOwnership(voterIDContract[1], voterIDContract[0], wallet);
      if (hasVID) {
        setKYCStatus(true);
      }
    }
    const loadAreaAndVIDNumber = async () => {
      const fetchedUsers = await fetchUsers(wallet, voterIDContract);
      setData([fetchedUsers["area"], fetchedUsers["VIDNumber"]]);
    }
    const handleOutsideClick = (event) => {
      const dropdownMenu = document.querySelector(".dropdown-menu");
      const userDetailsContainer = document.querySelector(".user-details-container");

      // Check if the click is outside the dropdown or UserDetails, close if so
      if (isDropdownOpen && dropdownMenu && !dropdownMenu.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (showUserDetails && userDetailsContainer && !userDetailsContainer.contains(event.target)) {
        setShowUserDetails(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    if(voterIDContract && wallet){
      checkForNFTOwnership();
      loadAreaAndVIDNumber();
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };

  }, [isDropdownOpen, showUserDetails, voterIDContract, wallet]);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <button  onClick={onLogo}>
        <div className="text-white font-bold text-2xl flex items-center">
          <Vote className="ml-1 mt-1.5 mr-2" size={35} /> | On Chain Vote
        </div>
      </button>

      <div className="">
        {/* Button displaying the connected wallet with dropdown functionality */}
        <button
          className={`${
            isConnected ? "bg-green-500" : "bg-blue-500"
          } hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded flex items-center`}
          onClick={isConnected ? userfetched?toggleDropdown:loadUserData : onConnect} // Call connect when not connected
        >
          <Wallet className="mr-2" size={20} />
          <img src={metamask} className="h-6 w-6 pe-1" alt="Metamask logo" />
          <div className="hidden sm:flex">
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
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && isConnected && ( // Only show dropdown when connected
          <div className="z-3 absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10 dropdown-menu">
            {/* Disconnect button */}
            <button
              className="block w-48 px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100"
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

            {/* User Details button */}
            {(!adminModeOn) && (<button
              className="block w-48 px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowUserDetails((prev) => !prev)} // Toggle user details visibility
            >
              User Details
            </button>)}
          </div>
        )}
      </div>

      {/* Show UserDetails component when clicked */}
      {showUserDetails && isConnected && (
        <div
          className="absolute right-0 mt-2 user-details-container"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUserDetails(false);
            }
          }}
        >
          <UserDetails
            walletAddress={walletAddress}
            wallet={wallet}
            onClose={() => setShowUserDetails(false)}
            details = {data}
            kycStatus = {kycStatus}
          />
        </div>
      )}
    </header>
  );
};

export default Header;