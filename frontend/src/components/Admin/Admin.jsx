import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AdminAddCandidateCard from '@/components/Admin/AdminAddCandidateCard';

const AdminControl = ({ onAdd, onCandidate, onUser, onClose }) => {
  const [Candidate, setCandidate] = useState([{
      id: 9999,
      photo: X,
      name: 'Add Candidate',
      candidate_id: '',
      area: '',
      party: ''
  }]);
  
  return (
    <div className="w-svw flex flex-col justify-self-start">
      <div className="TopBar m-6 flex flex-row justify-between justify-items-center">
        <h1 className="text-xl md:text-4xl font-bold md:my-2 md:py-2 md:px-4 m-4 pt-2">Admin Controls</h1>
        <div className="flex flex-row justify-items-center space-x-3 my-2 py-2">
          <button
            onClick={onCandidate}
            className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            Candidate Controls
          </button>
          <button
            onClick={onUser}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            User Controls
          </button>
          <button onClick={onClose} className="">
              <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
          </button>
        </div>
      </div>
      <div className="DashBoard">
        <div className="PieChart h-fit m-6">
          {/* Candidate % */}
          <h1 className="text-2xl font-bold m-4">Candidate Progress</h1>
          <div className="h-fit grid grid-cols-2 md:grid-cols-5 justify-items-stretch gap-4 m-4">
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx} className="bg-gray-200 p-4 text-center rounded-lg shadow-sm">
                <p className="text-lg font-semibold">Candidate {idx + 1}</p>
                <p className="text-xl font-bold text-blue-600">20%</p>
              </div>
            ))}
          </div>
          {/* Area % */}
          <h1 className="text-2xl font-bold m-4">Area Progress</h1>
          <div className="h-fit grid grid-cols-2 md:grid-cols-5 justify-items-stretch gap-4 m-4">
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx + 5} className="bg-gray-200 p-4 text-center rounded-lg shadow-sm">
                <p className="text-lg font-semibold">Area {idx + 1}</p>
                <p className="text-xl font-bold text-blue-600">20%</p>
              </div>
            ))}
          </div>
        </div>
        {/* End Of Pie Chart */}
        <div className="Stats h-max flex flex-col md:flex-row justify-around m-4">
          {/* Add Candidate Button */}
          <div className="md:w-fit m-4 flex justify-center"><AdminAddCandidateCard candidate={Candidate} onAdd={onAdd} /></div>
          {/* Total Vote */}
          <div className="m-4 p-4 bg-white rounded-lg shadow-md text-center flex flex-col justify-center">
            <h3 className="text-xl font-bold">Total Vote</h3>
            <p className="text-2xl text-blue-600 font-bold">9,884,153</p>
            <p className="text-2xl text-green-600 font-bold">Winner: Candidate 1</p>
          </div>
          {/* Area Votes */}
          <div className="m-4 p-4 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold pb-2">Area Votes:</h3>
            <div className="space-y-4">
              <div className="flex justify-between space-x-10 bg-gray-200 hover:bg-gray-100 p-4 rounded">
                <span>Area 1</span>
                <span>5453</span>
              </div>
              <div className="flex justify-between space-x-10 bg-gray-200 hover:bg-gray-100 p-4 rounded">
                <span>Area 1</span>
                <span>451</span>
              </div>
              <div className="flex justify-between space-x-10 bg-gray-200 hover:bg-gray-100 p-4 rounded">
                <span>Area 1</span>
                <span>645</span>
              </div>
            </div>
          </div>
          {/* Winner Declaration */}
          <div className="m-4 p-4 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold pb-4">Declarer Winner:</h3>
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, idx) => (
                <div key={idx} className="flex justify-between space-x-4 bg-gray-200 hover:bg-gray-100 p-4 rounded">
                  <span>Candidate Name</span>
                  <span className="font-bold">Total Vote: 468</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* End Of Stats */}
      </div> 
    {/*  end of component */}
    </div>
  );
};

export default AdminControl;
