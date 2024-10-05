import React from 'react';
import { UserRoundX } from 'lucide-react';

const AdminUserCard = ({ user, onRemove }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <img src={user.photo} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
    <h3 onClick={() => alert("hi")} className="text-xl font-semibold mb-2"><b>Name:</b> {user.name}</h3>
    <h4 className="text-lg font-semibold mb-2"><b>Area:</b> {user.area}</h4>
    <h4 className="text-lg font-semibold mb-2"><b>Wallet Address:</b> {user.wallet_address}</h4>

    <button
      onClick={() => onRemove(user.id, user.wallet_address)}
      className="bg-red-500 hover:bg-red-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
    >
      Remove
      <UserRoundX className="ml-2" size={16} />
    </button>
  </div>
);

export default AdminUserCard;