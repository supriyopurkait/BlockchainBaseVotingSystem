import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import UserDeatils from "../aboutUser/userDeatils";
import signOutIcon from "/picture/sign-out-icon.png";
import metamask from "/icons/metamask-icon.svg";

const width = window.innerWidth;
const WalletConnect = ({ setWalletAddress }) => {
  const [num, setNum] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false); // State to control UserDeatils component visibility
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const getData = async () =>{
    const url = "https://catfact.ninja/fact";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log("this is api response ",json.fact);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Config for paymaster
  const config = {
    biconomyPaymasterApiKey: "3L23bfz1T.d84dfba5-6c8b-408d-800a-33e2b01d7b87",
    bundlerUrl: "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: "84532"
  };

  let smartWallet;
  let saAddress;
  let provider;
  let signer;

  useEffect(() => {
    if (localStorage.getItem("isWalletConnected") === "true") {
      console.log("Wallet was connected previously, not auto-connecting");
    }
  }, []);

  const walletConnect = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setNum(addr);
        setIsConnected(true);
        setWalletAddress(addr);
        console.log("Account Address: ", addr);
      } catch (err) {
        console.error(err.message);
      }
      // Switching to Base Chain 
      const selectedChainId = await window.ethereum.request({ method: "eth_chainId" })
      console.log("Chain ID", selectedChainId)
      let chainId = `0x${Number(config.chainId).toString(16)}`;
      if (selectedChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
          });
        } catch (switchError) {
          console.error("Failed to change");
        }
      }

      // Creation of smart wallet
      try {
        smartWallet = await createSmartAccountClient({
          signer,
          biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
          bundlerUrl: config.bundlerUrl,
        });

        saAddress = await smartWallet.getAccountAddress();
        console.log("Smart wallet Address", saAddress);
        localStorage.setItem("isWalletConnected", "true");
        // contractInteraction();
      } catch (err) {
        console.error("Some error occurred!", err.message);
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

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <div className="flex items-center p-4 w-fit">
        {!isConnected && (
          <button
            type="button"
            className="wallet bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center w-max"
            onClick={walletConnect} onLoad={getData}
          >
            <img src={metamask} alt="Metamask" className="w-5 h-5 mr-2" />
            Connect
          </button>
        )}

        {isConnected && (
          <div className="relative">
          {/* Button displaying the connected wallet with dropdown functionality */}
          <button
            className="wallet bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center w-max"
            onClick={toggleDropdown} // Toggle dropdown on click
          >
            <img src={metamask} alt="Connected" className="w-5 h-5 mr-2" />
            {`${num.substring(0, 3)}...${num.substring(38)}`}
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
          </button>

            {isDropdownOpen && (
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
            )}

            {/* Show UserDetails component when hovered */}
            {showUserDetails && (
              <div
                className=" sm:absolute sm:right-0 sm:mt-2"
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
