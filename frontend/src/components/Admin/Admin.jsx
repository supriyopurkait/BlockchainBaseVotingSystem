import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Rss, X } from 'lucide-react';
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
      <div className="TopBar mx-6 flex flex-row justify-between justify-items-center">
        <h1 className="text-xl md:text-4xl font-bold md:my-2 md:py-2 md:px-4 m-4 pt-4">Admin Controls</h1>
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
      <div className="DashBoard flex flex-col md:flex-row">
        <div className="PieChart m-6">
          {/* Pie Chart % */}
          <h1 className="text-2xl font-bold flex-shrink m-4">Statistics</h1>
          <div className="grid grid-cols-1">
            <div className="justify-self-center bg-white rounded-lg shadow-md m-2 p-4">
              <h2 className="text-justify text-2xl font-bold">Area 1</h2>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Candidate 1', color: '#1BE7FF' },
                    { id: 1, value: 15, label: 'Candidate 2', color: '#6EEB83' },
                    { id: 2, value: 20, label: 'Candidate 3', color: '#E4FF1A' },
                  ],
                  arcLabel: (item) => `${item.value}%  ${item.label}`,
                  arcLabelsRadiusOffset: 10,
                  arcLabelMinAngle: 10,
                  arcLabelRadius: '90%',
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 10,
                  outerRadius: 120,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                  animate: true,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: '#000000',
                  
                  fontSize: 15,
                },
              }}
              height={300}
              width={300}
              legend={{ hidden: true }}
            />
            </div>
            <div className="justify-self-center bg-white rounded-lg shadow-md m-2 p-4">
              <h2 className="text-justify text-2xl font-bold">Area 2</h2>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Candidate 1', color: '#E18335' },
                    { id: 1, value: 15, label: 'Candidate 2', color: '#E4CC37' },
                    { id: 2, value: 20, label: 'Candidate 3', color: '#8FC93A' },
                  ],
                  arcLabel: (item) => `${item.value}%  ${item.label}`,
                  arcLabelsRadiusOffset: 10,
                  arcLabelMinAngle: 10,
                  arcLabelRadius: '90%',
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 10,
                  outerRadius: 120,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                  animate: true,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: '#000000',
                  
                  fontSize: 15,
                },
              }}
              height={300}
              width={300}
              legend={{ hidden: true }}
            />
            </div>
            <div className="justify-self-center bg-white rounded-lg shadow-md m-2 p-4">
              <h2 className="text-justify text-2xl font-bold">Area 3</h2>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Candidate 1', color: '#EE7B30' },
                    { id: 1, value: 15, label: 'Candidate 2', color: '#D1B490' },
                    { id: 2, value: 20, label: 'Candidate 3', color: '#CBCBD4' },
                  ],
                  arcLabel: (item) => `${item.value}%  ${item.label}`,
                  arcLabelsRadiusOffset: 10,
                  arcLabelMinAngle: 10,
                  arcLabelRadius: '90%',
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 10,
                  outerRadius: 120,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                  animate: true,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: 'bold',
                  fill: '#000000',
                  
                  fontSize: 15,
                },
              }}
              height={300}
              width={300}
              legend={{ hidden: true }}
            />
            </div>
          </div>
        </div>
        {/* End Of Pie Chart */}
        <div className="Stats h-max flex flex-col md:flex-col flex-grow m-4">
          <div className="flex flex-col md:flex-row justify-around">
            {/* Add Candidate Button */}
            <div className="md:w-fit m-4 flex justify-center"><AdminAddCandidateCard onAdd={onAdd} /></div>
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
                <span className="p-2 ml-8 font-bold">Area </span>
                <span className="p-2 ml-6 font-bold">Votes Per Area</span>
                <span className="p-2 ml-4 font-bold">Winner of Area</span>
                <span className="p-2 ml-2 font-bold">Won By Votes</span>
              </div>
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx} className="flex justify-around bg-gray-200 hover:bg-gray-100 m-4 rounded">
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
