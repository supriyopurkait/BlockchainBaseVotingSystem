import React, { useState } from "react";
import PropTypes from 'prop-types';
import WalletConnect from "../wallet/walletConnect";

const NAV = ({ setConnected }) => {
  const [walletAddress, setWalletAddress] = useState("");

  // Update the connected state based on wallet address
  React.useEffect(() => {
    setConnected(walletAddress !== ""); // Set true if connected, false otherwise
  }, [walletAddress, setConnected]);

  return (
    <div className="app-container w-full bg-[#98DED9]">
      <nav className="flex justify-between w-full bg-[#98DED9]" >
          <div className="pt-4 flex-none">
            <h5 className="pl-4 pb-4 text-2xl font-semibold w-min sm:w-fit sm:text-2xl sm:font-semibold">Blockchain Voting Machine</h5>
            <ul className="flex place-items-end space-x-4">
              <li className=" p-2 px-4 m-0 hover:bg-[#94bbd8] hover:text-[#505050] "><a href="/">Home</a></li>
              <li className=" p-2 px-4 m-0 hover:bg-[#94bbd8] hover:text-[#505050] "><a href="/vodedone">vote done</a></li>
            </ul>
          </div>
          <div className="flex-none" >
            <WalletConnect setWalletAddress={setWalletAddress} />
          </div>
      </nav>
    </div>
  );
};

NAV.propTypes = {
  setConnected: PropTypes.func.isRequired,
};

export default NAV;
