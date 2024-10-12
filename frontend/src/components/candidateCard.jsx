import React from 'react';
import { User } from 'lucide-react';

const CandidateCard = ({ candidate, onVote }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
    <img src={`data:image/jpeg;base64,${candidate.photo}`} alt={candidate.name} className="w-24 h-24 rounded-full mb-4" />
    <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
    <h4 className="text-lg font-semibold mb-2 text-sm">{candidate.party}</h4>
    <button
      onClick={() => onVote(candidate.candidate_id)}
      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
    >
      Vote
      <User className="ml-2" size={16} />
    </button>
  </div>
);

export default CandidateCard;