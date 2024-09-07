import React, { useState, useEffect } from "react";
import signOutIcon from "../icon/sign-out-icon.png";
import metamask from "../icon/metamask-icon.svg";
import UserDeatils from "./userDeatils";
import { ethers } from "ethers"
// import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";

const WalletConnect = ({ setWalletAddress }) => {
  const [num, setNum] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleUser = () => {
    setShowModal(true); // Show modal on button click
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide modal when user closes it
  };

  const config = {
    // privateKey: "0x48bab8b9c6b901a8b5041d8f8b653d0be99c93a071ea77c59ab911e0457b23f9",
    biconomyPaymasterApiKey: "3L23bfz1T.d84dfba5-6c8b-408d-800a-33e2b01d7b87",
    bundlerUrl: "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    // rpcUrl: "https://base-sepolia.g.alchemy.com/v2/RgeyJKs9hgssSiIpmKeN2wWjDwcXiF82",
    chainId: "84532"
  };

  useEffect(() => {
    // Check connection status on initial load, but don't auto-connect
    if (localStorage.getItem("isWalletConnected") === "true") {
      console.log("Wallet was connected previously, not auto-connecting");
      // You can optionally re-establish the connection here
      // handleConnection();
    }
  }, []);

  // Handle connection or prompt for connection
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
          // Wallet is connected
          console.log("Already connected:", accounts[0]);
          setNum(accounts[0]);
          setIsConnected(true);
          setWalletAddress(accounts[0]);
          localStorage.setItem("isWalletConnected", "true");
        } else {
          // Wallet is not connected, prompt for connection
          walletConnect();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  // Connect to the wallet
  const walletConnect = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // It will prompt user for account connections if it isnt connected
        const signer = await provider.getSigner();
        const addr = await signer.getAddress()
        setNum(addr);
        setIsConnected(true);
        setWalletAddress(addr);
        console.log("Account:", await signer.getAddress());

        // Get chain ID and if not matched ask user to confirm to change chain ID to base sepolia
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
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError) {
              console.log("Failed to change");
            }
          }
        }
        // ================ Smart Wallet =================
        // const smartWallet = await createSmartAccountClient({
        //   signer,
        //   biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        //   bundlerUrl: config.bundlerUrl,
        // });

        // const saAddress = await smartWallet.getAccountAddress();
        // console.log("SA Address", saAddress);

        localStorage.setItem("isWalletConnected", "true");

      } catch (err) {
        console.log(err.message);
      }
    }
  };

  // Disconnect from the wallet
  const walletDisconnect = () => {
    setNum("");
    setIsConnected(false);
    setWalletAddress("NULL");
    localStorage.setItem("isWalletConnected", "false");
    console.log("Disconnected");
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-end rounded-3 p-3">
        {!isConnected && (
          <button
            type="button"
            className="btn btn-primary btn-sm "
            onClick={handleConnection} // Check connection or prompt for connection
          >
            <img
                src={metamask}
                alt="Sign Out"
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
              />
          </button>
        )}

        {isConnected && (
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenu1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={metamask}
                alt="Sign Out"
                style={{ width: "20px", height: "20px", marginRight: "5px" }}
              />
              {`(${num.substring(0, 3)}...${num.substring(38)})`}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={handleUser}
                >
                  User details
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item btn btn-light"
                  onClick={walletDisconnect}
                >
                  <img
                    src={signOutIcon}
                    alt="Sign Out"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  />
                  Disconnect
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Pass the state and close handler to the LoginPage component */}
      <UserDeatils
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        walletAddress={num}
      />
    </>
  );
};

export default WalletConnect;
