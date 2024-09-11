import React, { useState } from "react";
import WalletConnect from "../wallet/walletConnect";

const NAV = ({ setConnected }) => {
  const [walletAddress, setWalletAddress] = useState("");

  // Update the connected state based on wallet address
  React.useEffect(() => {
    setConnected(walletAddress !== ""); // Set true if connected, false otherwise
  }, [walletAddress, setConnected]);

  return (
    <div className="app-container">
      <nav className="flex justify-between bg-[#98DED9]" >
          <div className="ps-2 pt-4">
            <h5 className="font-semibold ">Blockchain Voting Machine</h5>
            <ul className="shift mt-1 ms-6">
              <li><a href="/">Home</a></li>
            </ul>
          </div>
          <div className="" >
            <WalletConnect setWalletAddress={setWalletAddress} />
          </div>
      </nav>
    </div>
  );
};

export default NAV;
