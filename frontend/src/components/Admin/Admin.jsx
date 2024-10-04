import React, { useState, useEffect } from 'react';
import { Rss, X } from 'lucide-react';
import AdminAddCandidateCard from '@/components/Admin/AdminAddCandidateCard';
import PieDiagram from '@/components/PieChart';

const AdminControl = ({ onAdd, onCandidate, onUser, onStartVote, onEndVote, onClose }) => {
  const [Candidate, setCandidate] = useState([{
      id: 9999,
      photo: X,
      name: 'Add Candidate',
      candidate_id: '',
      area: '',
      party: ''
  }]);
  const statData = [
        { id: 0, value: 10, label: 'Candidate 1', color: '#1BE7FF' },
        { id: 1, value: 15, label: 'Candidate 2', color: '#6EEB83' },
        { id: 2, value: 20, label: 'Candidate 3', color: '#E4FF1A' },
    ];
  
  return (
    <div className="w-svw flex flex-col justify-self-start p-20">
      <div className="TopBar mx-6 flex flex-row justify-between justify-items-center">
        <h1 className="text-xl md:text-4xl font-bold md:my-2 md:py-2 md:px-4 m-4 pt-4">Admin Controls</h1>
        <div className="flex flex-row justify-items-center space-x-3 my-2 py-2">
          <button
            onClick={onCandidate}
            className="w-fit bg-cyan-500 hover:bg-cyan-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            Candidate Controls
          </button>
          <button
            onClick={onUser}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            User Controls
          </button>
          <button
            onClick={onStartVote}
            className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            Start Vote
          </button>
          <button
            onClick={onEndVote}
            className="w-fit bg-red-500 hover:bg-red-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            End Vote
          </button>
          <button onClick={onClose} className="">
              <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
          </button>
        </div>
      </div>
      <div className="DashBoard flex flex-col md:flex-row">
        <div className="PieChart bg-white rounded-2xl shadow-md flex-grow m-6">
          {/* Pie Chart % */}
          <h1 className="text-2xl font-bold flex-shrink m-4">Statistics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-stretch">
          {Array.from({ length: 4 }, (_, idx) => (
            <PieDiagram key={idx} title={"Area "+`${idx + 1}`} data={statData} fontsize={12} mgr={{ left: 25 }} size={250} cx={125} cy={125} ir={20} or={100}/>
          ))}
          </div>
        </div>
        {/* End Of Pie Chart */}
        <div className="Stats h-max flex flex-col md:flex-col flex-grow-0 m-4">
          <div className="flex flex-col md:flex-row justify-around">
            {/* Add Candidate Button */}
            <div className="md:w-fit m-4 flex justify-center">
              <AdminAddCandidateCard onAdd={onAdd} />
            </div>
            {/* Total Vote */}
            <div className="m-4 p-4 bg-white rounded-lg shadow-md flex flex-col flex-grow justify-around items-center">
              <h3 className="text-xl font-bold">Total Vote</h3>
              <p className="text-2xl text-blue-600 font-bold">9,884,153</p>
              <button
                onClick={onAdd}
                className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
              >
                Declare Results
                <Rss className="ml-2" size={16} />
              </button>
            </div>
          </div>
          {/* Area Votes */}
          <div className="m-4 p-4 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold pb-2">Area Votes:</h3>
            <div className="text-center">
              <div className="flex justify-around bg-gray-400 hover:bg-gray-100 m-4 rounded">
                <span className="p-2 md:ml-8 font-bold">Area </span>
                <span className="p-2 md:ml-6 font-bold">Votes Per Area</span>
                <span className="p-2 md:ml-4 font-bold">Winner of Area</span>
                <span className="p-2 md:ml-2 font-bold">Won By Votes</span>
              </div>
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx + 5} className="flex justify-around bg-gray-200 hover:bg-gray-100 m-4 rounded">
                <span className="p-2">Area {idx + 1}: </span>
                <span className="p-2 font-bold">5453</span>
                <span className="p-2">Candidate {idx + 1}: </span>
                <span className="p-2 font-bold">567</span>
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
