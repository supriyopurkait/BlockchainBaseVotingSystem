import React from 'react';
import { UserRoundX } from 'lucide-react';

const AdminCandidateCard = ({ candidate, onRemove }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={`data:image/jpeg;base64,${candidate.photo}`} alt={candidate.name} className="w-24 h-24 rounded-full mb-4" />
    <h3 onClick={() => alert("hi")} className="text-xl font-semibold mb-2"><b>Name:</b> {candidate.name}</h3>
    <h4 className="text-lg font-semibold mb-2"><b>Party:</b> {candidate.party}</h4>
    <h4 className="text-lg font-semibold mb-2"><b>Area:</b> {candidate.area}</h4>

    <button
      onClick={() => onRemove(candidate.candidate_id)}
      className="bg-red-500 hover:bg-red-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
    >
      Remove
      <UserRoundX className="ml-2" size={16} />
    </button>
  </div>
);

export default AdminCandidateCard;