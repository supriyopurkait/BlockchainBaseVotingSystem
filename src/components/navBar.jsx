import React, { useState } from "react";
import WalletConnect from "./walletConnect";

const NAV = ({ setConnected }) => {
  const [walletAddress, setWalletAddress] = useState("");

  // Update the connected state based on wallet address
  React.useEffect(() => {
    setConnected(walletAddress !== ""); // Set true if connected, false otherwise
  }, [walletAddress, setConnected]);

  return (
    <div className="app-container">
      <nav className="navbar navbar-light bg-light" style={{ height: "60px" }}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="ps-2">
            <h5 className="mb-0">Blockchain Voting Machine</h5>
          </div>
          <div className="p-1" style={{ width: "fit-content" }}>
            <WalletConnect setWalletAddress={setWalletAddress} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NAV;
