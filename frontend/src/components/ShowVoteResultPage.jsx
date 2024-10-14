import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Trophy, Users, Flag, ArrowRight,CircleArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ShowVoteResultPage = ({onBack}) => {
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

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const winnerPhoto = data[0].photo;
  const winner = data[0].name;
  const winnerVotes = data[0].votes;
  const partyName = "Party X";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Arrow Container positioned at top-left */}
      <div className="relative w-full flex justify-start items-start">
  <button
    className="relative ps-[2rem] h-10 w-10 text-purple-900 hover:text-purple-500" // Adjusted size and position
    onClick={onBack}
  >
    <CircleArrowLeft size={34} strokeWidth={1.75} />
  </button>
</div>

  
      <motion.div
        className="max-w-7xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-indigo-900 mb-12"
          variants={itemVariants}
        >
          Election Results 2024
        </motion.h1>
  
        {/* Main Content: Pie Chart & Winner Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Pie Chart Section */}
          <motion.div
            className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-indigo-800 mb-6 text-center">
              Vote Distribution
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
          </motion.div>
  
          {/* Winner's Information Section */}
          <motion.div
            className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white"
            variants={itemVariants}
          >
            <img
              src={winnerPhoto}
              alt="Winner"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
            />
            <h2 className="text-3xl font-bold text-center mb-8">Winner</h2>
  
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-indigo-200">Name</p>
                  <p className="text-xl font-semibold">{winner}</p>
                </div>
              </div>
  
              <div className="flex items-center space-x-4">
                <Users className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-indigo-200">Total Votes</p>
                  <p className="text-xl font-semibold">
                    {winnerVotes.toLocaleString()}
                  </p>
                </div>
              </div>
  
              <div className="flex items-center space-x-4">
                <Flag className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-sm text-indigo-200">Party</p>
                  <p className="text-xl font-semibold">{partyName}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
  
        {/* Additional Statistics for Other Candidates */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {data.map((candidate, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition duration-500 hover:scale-105"
              variants={itemVariants}
            >
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-200"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {candidate.name}
              </h3>
              <p className="text-2xl font-bold text-indigo-600">
                {candidate.votes.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">votes</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
  
};

export default ShowVoteResultPage;