import React, { useState, useEffect } from "react";
import { X } from 'lucide-react';
import copy_svg from "pub/picture/copy-icon.png?url";
import copy_check from "pub/icons/copy-check.svg?url";
import { fetchUsers } from '@/utils/getDetails';

// CopyComponent for handling clipboard copy
const CopyComponent = ({ walletAddress, wallet }) => {
  const [copySuccess, setCopySuccess] = useState(false); // State to track copy success

  const eventCopy = () => {
    navigator.clipboard.writeText(walletAddress ? walletAddress : "NULL").then(() => {
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
        console.error('Fetched users:', fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      loadUsers();
    }
  }, [wallet]);

  return (
    <button
      className="ml-2 p-4 rounded-full"
      onClick={eventCopy}
    >
      <img
        src={copySuccess ? copy_check : copy_svg} // Conditionally display the correct icon
        alt={copySuccess ? "Copy-check" : "Copy"}
        className="w-4 h-4 transition duration-300" // Optional smooth transition
      />
    </button>
  );
};

const UserDeatils = ({ walletAddress, onEnter, onClose }) => {
  const userName = "ABCD";
  let walletAddressShort = `${walletAddress.substring(0, 12)}...${walletAddress.substring(walletAddress.length - 12)}`
  return (
    <div
      className="z-4 absolute right-[1rem] top-[7rem] w-[20rem] sm:right-[12rem] sm:top-[1rem] sm:w-[30rem] z-60 bg-white shadow-lg rounded-lg transition-all duration-1000 transform scale-100 p-4"
      // onMouseEnter={(e) => e.stopPropagation()} // Prevent hover from closing when inside the modal
      onMouseEnter={onEnter} // Prevent hover from closing when inside the modal
    >
      <button onClick={onClose} className="absolute left-[17rem] sm:left-[27rem] text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold w-min sm:w-fit">User Wallet Information</h5>
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
    </div>
  );
};

export default UserDeatils;
