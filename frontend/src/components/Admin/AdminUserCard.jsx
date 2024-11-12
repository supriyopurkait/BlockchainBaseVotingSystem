import React, { useState, useEffect } from 'react';
import { UserRoundX } from 'lucide-react';
import Face from 'pub/picture/face_img.png?url';
import copy_svg from "pub/picture/copy-icon.png?url";
import copy_check from "pub/icons/copy-check.svg?url";

const CopyComponent = ({ walletAddress }) => {
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

const AdminUserCard = ({ user, onRemove }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <img src={`data:image/jpeg;base64,${user.faceImage}`} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
    <h3 onClick={() => alert("hi")} className="text-xl font-semibold mb-2"><b>Name:</b> {user.name}</h3>
    <h4 className="text-lg font-semibold mb-2"><b>Booth:</b> {user.area}</h4>
    <h4 className="text-lg font-semibold mb-2"><b>Doc Number:</b> {user.documentNumber} </h4>
    <h4 className="text-lg font-semibold mb-2"><b>VID Number:</b> {user.VIDNumber} </h4>
    <h4 className="text-lg font-semibold mb-2"><b>Wallet Address:</b></h4>
    <h4 className="text-lg font-semibold mb-2">
      {`${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 6)}`}
      <CopyComponent walletAddress={user.walletAddress} />
    </h4>

    <button
      onClick={() => onRemove(user.id, user.walletAddress)}
      className="bg-red-500 hover:bg-red-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
    >
      Remove
      <UserRoundX className="ml-2" size={16} />
    </button>
  </div>
);

export default AdminUserCard;