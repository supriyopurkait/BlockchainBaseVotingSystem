import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Trophy, Users, Flag } from "lucide-react";

const ShowVoteResultPage = () => {
  const data = [
    { name: "Candidate A", votes: 500 },
    { name: "Candidate B", votes: 300 },
    { name: "Candidate C", votes: 150 },
    { name: "Candidate D", votes: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const winner = data[0].name;
  const winnerVotes = data[0].votes;
  const partyName = "Party X";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8 sm:mb-10 md:mb-12">Election Results</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">Voting Results</h2>
            <div className="h-64 sm:h-80 md:h-96 lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="votes"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Winner's Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">Winner</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">{winner}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Votes</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">{winnerVotes}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Flag className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Party</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">{partyName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.map((candidate, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{candidate.name}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{candidate.votes}</p>
              <p className="text-sm text-gray-500 mt-1">votes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowVoteResultPage;