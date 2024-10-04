import React from 'react';
import { UserPlus } from 'lucide-react';
import Add from 'pub/picture/Add_candidate.png';

const AdminAddCandidateCard = ({ candidate, onAdd }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <img src={Add} alt="Add New Candidate" className="w-24 h-24 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Add New Candidate</h3>
    <button
      onClick={onAdd}
      className="bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
    >
      Add
      <UserPlus className="ml-2" size={16} />
    </button>
  </div>
);

export default AdminAddCandidateCard;