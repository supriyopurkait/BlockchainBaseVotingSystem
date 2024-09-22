import React from 'react';
import { User } from 'lucide-react';

const UserCard = ({ user, onVote }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
    <img src={user.photo} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
    <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
    <button
      onClick={() => onVote(user.candidate_id)}
      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
    >
      Vote
      <User className="ml-2" size={16} />
    </button>
  </div>
);

export default UserCard;
