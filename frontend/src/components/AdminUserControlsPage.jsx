import React, { useState } from 'react';
import { X } from 'lucide-react';

const AdminUserControlsPage = ({ onClose }) => {
  const [Users, setUsers] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votesPerUser, setVotesPerUser] = useState(0);

  const addUser = () => {
    setUsers([...Users, `User ${Users.length + 1}`]); // pass additional data for Users
    // write additional web3 mint actions here
  };

  const removeUser = (index) => {
    setUsers(Users.filter((_, i) => i !== index));
    // write additional web3 burn actions here
  };

  const declareVotesPerUser = () => {
    setVotesPerUser(votesPerUser + 1);
    // write additional web3 transactions count per User actions here
  };

  const declareTotalVotes = () => {
    setTotalVotes(totalVotes + 1);
    // write additional web3 transactions count actions here
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-8">Admin User Controls</h1>
      <button onClick={onClose} className="relative top-[-3.7rem] right-[-13rem]">
          <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
      </button>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-lg font-semibold mb-2">Users:</h2>
        <ul className="list-none">
          {Users.map((User, index) => (
            <li key={index} className="flex items-center mb-2 px-2">
              {User}
              <button
                className="w-fit bg-red-500 hover:bg-red-600 text-white font-bold my-2 mx-4 py-2 px-4 rounded"
                onClick={() => removeUser(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
          className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
          onClick={addUser}
        >
          Add User
        </button>
      </div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-lg font-semibold mb-2">Votes Per User:</h2>
        <p>{votesPerUser}</p>
        <button
          className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
          onClick={declareVotesPerUser}
        >
          Declare Votes Per User
        </button>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Total Votes:</h2>
        <p>{totalVotes}</p>
        <button
          className="w-fit bg-blue-700 hover:bg-blue-800 text-white font-bold my-2 py-2 px-4 rounded"
          onClick={declareTotalVotes}
        >
          Declare Total Votes
        </button>
      </div>
    </div>
  );
};

export default AdminUserControlsPage;