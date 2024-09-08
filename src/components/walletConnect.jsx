import React, { useState, useEffect } from "react";
import signOutIcon from "../icon/sign-out-icon.png";
import metamask from "../icon/metamask-icon.svg";
import UserDeatils from "./userDeatils";
import { ethers } from "ethers";

const WalletConnect = ({ setWalletAddress }) => {
  const [num, setNum] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false); // State to control UserDeatils component visibility

  useEffect(() => {
    if (localStorage.getItem("isWalletConnected") === "true") {
      console.log("Wallet was connected previously, not auto-connecting");
    }
  }, []);

  const handleConnection = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setNum(accounts[0]);
          setIsConnected(true);
          setWalletAddress(accounts[0]);
          localStorage.setItem("isWalletConnected", "true");
        } else {
          walletConnect();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const walletConnect = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setNum(addr);
        setIsConnected(true);
        setWalletAddress(addr);
        localStorage.setItem("isWalletConnected", "true");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const walletDisconnect = () => {
    setNum("");
    setIsConnected(false);
    setWalletAddress("NULL");
    localStorage.setItem("isWalletConnected", "false");
    console.log("Disconnected");
  };

  return (
    <>
      <div className="flex justify-end items-center p-4">
        {!isConnected && (
          <button
            type="button"
            className="wallet bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleConnection}
          >
            <img src={metamask} alt="Metamask" className="w-5 h-5 mr-2" />
            Connect
          </button>
        )}

        {isConnected && (
          <div className="relativehidden group-hover:block">
            <button
              className="wallet bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center"
              type="button"
            >
              <img src={metamask} alt="Connected" className="w-5 h-5 mr-2" />
              {`${num.substring(0, 3)}...${num.substring(38)}`}
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1">
              {/* User Details button with hover to show details */}
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
                onClick={walletDisconnect}
              >
                <img
                  src={signOutIcon}
                  alt="Sign Out"
                  className="w-5 h-5 mr-2 inline-block"
                />
                Disconnect
              </button>
            </div>

            {/* Show UserDetails component when hovered */}
            {showUserDetails && (
              <div
                className="absolute right-0 mt-2"
                onMouseEnter={() => setShowUserDetails(true)} // Keep modal visible when hovering over it
                onMouseLeave={() => setShowUserDetails(false)} // Hide modal when the mouse leaves
              >
                <UserDeatils walletAddress={num} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default WalletConnect;
