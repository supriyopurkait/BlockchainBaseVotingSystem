import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Trophy, Users, Flag } from "lucide-react";
const ShowVoteResultPage = () => {
  const data = [
    {
      photo: "https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg",
      name: "Candidate A",
      votes: 500,
    },
    {
      photo: "https://xsgames.co/randomusers/assets/avatars/pixel/2.jpg",
      name: "Candidate B",
      votes: 300,
    },
    {
      photo: "https://xsgames.co/randomusers/assets/avatars/pixel/3.jpg",
      name: "Candidate C",
      votes: 150,
    },
    {
      photo: "https://xsgames.co/randomusers/assets/avatars/pixel/4.jpg",
      name: "Candidate D",
      votes: 100,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const winnerPhoto = data[0].photo;
  const winner = data[0].name;
  const winnerVotes = data[0].votes;
  const partyName = "Party X";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-7xl w-full">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Election Results
        </h1>

        {/* Main Content: Pie Chart & Winner Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Pie Chart Section (65%) */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
              Voting Results
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="votes"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Winner's Information Section (35%) */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5">
            <img
              src={winnerPhoto}
              alt="Winner"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
              Winner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Name Section */}
              <div className="flex flex-col items-center sm:items-start justify-center space-y-1">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {winner}
                </p>
              </div>

              {/* Votes Section */}
              <div className="flex flex-col items-center sm:items-start justify-center space-y-1">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <p className="text-sm text-gray-500">Votes</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {winnerVotes}
                </p>
              </div>

              {/* Party Section */}
              <div className="flex flex-col items-center sm:items-start justify-center space-y-1">
                <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                <p className="text-sm text-gray-500">Party</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {partyName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics for Other Candidates */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((candidate, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center"
            >
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-24 h-24 rounded-full mx-auto mb-3"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                {candidate.name}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                {candidate.votes}
              </p>
              <p className="text-sm text-gray-500 mt-1">votes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowVoteResultPage;
