import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import copy_svg from "pub/picture/copy-icon.png?url";
import copy_check from "pub/icons/copy-check.svg?url";
import { fetchUsers } from "@/utils/getDetails";

// CopyComponent for handling clipboard copy
const CopyComponent = ({ walletAddress, wallet }) => {
  const [copySuccess, setCopySuccess] = useState(false); // State to track copy success

  const eventCopy = () => {
    navigator.clipboard
      .writeText(walletAddress ? walletAddress : "NULL")
      .then(() => {
        setCopySuccess(true); // Set copy success to true

        // Reset the icon back to the default after 1 second
        setTimeout(() => {
          setCopySuccess(false);
        }, 1000);
      });
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsers(wallet);
        //console.error("Fetched users:", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        setError("Failed to load users. Please try again later.");
        //console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      loadUsers();
    }
  }, [wallet]);

  return (
    <button className="ml-2 p-4 rounded-full" onClick={eventCopy}>
      <img
        src={copySuccess ? copy_check : copy_svg} // Conditionally display the correct icon
        alt={copySuccess ? "Copy-check" : "Copy"}
        className="w-4 h-4 transition duration-300" // Optional smooth transition
      />
    </button>
  );
};

const UserDeatils = ({ walletAddress, onEnter, onClose, details, kycStatus }) => {
  const status = (kycStatus ? "Verified ✅" : "Not Verified ❌"); 
  let walletAddressShort = `${walletAddress.substring(
    0,
    12
  )}...${walletAddress.substring(walletAddress.length - 12)}`;
  return (
    <div
      className="z-4 absolute right-[1rem] top-[7rem] w-[20rem] sm:right-[12rem] sm:top-[1rem] sm:w-[30rem] z-60 bg-white shadow-lg rounded-lg transition-all duration-1000 transform scale-100 p-4"
      // onMouseEnter={(e) => e.stopPropagation()} // Prevent hover from closing when inside the modal
      onMouseEnter={onEnter} // Prevent hover from closing when inside the modal
    >
      <button
        onClick={onClose}
        className="absolute left-[17rem] sm:left-[27rem] text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold w-min sm:w-fit">
          User Wallet Information
        </h5>
      </div>
      <div className="mb-4">
        <h5 className="font-semibold">Wallet Address</h5>
        <div className="flex items-center">
          <span className="inline sm:hidden text-gray-700 hover:bg-slate-100 rounded-md">
            {walletAddress ? walletAddressShort : "No Wallet Connected"}
          </span>
          <span className="hidden sm:inline text-gray-700 hover:bg-slate-100 rounded-md">
            {walletAddress ? walletAddress : "No Wallet Connected"}
          </span>
          {/* Render CopyComponent to handle copying the wallet address */}
          <CopyComponent walletAddress={walletAddress} />
        </div>
      </div>

      <hr className="my-2" />

      <div className="mb-4">
        <strong className="font-semibold">Kyc Status:</strong> {status}

      </div>

      <hr className="my-2" />

      <div className="my-4 p-4 bg-white rounded-lg">
        <h5 className="font-semibold text-lg text-gray-900 mb-4">
          User Details
        </h5>
        <ul className="list-none space-y-2">
          {/* Added vertical spacing between list items */}
          <li className="text-gray-700">
            <strong className="text-gray-800">VID Number:</strong> {details[1]}
          </li>
          <li className="text-gray-700">
            <strong className="text-gray-800">Booth:</strong> {details[0]}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDeatils;
