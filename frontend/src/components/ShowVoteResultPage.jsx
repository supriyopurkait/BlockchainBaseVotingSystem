import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Trophy, Users, Flag, CircleArrowLeft, Handshake } from "lucide-react";
import { fetchResult } from "@/utils/getDetails";
import LoadingModal from "@/components/LoadingModal";

const ShowVoteResultPage = ({ onBack, wallet }) => {
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      setLoading(true);
      try {
        const fetchResultData = await fetchResult(wallet);
        console.log(fetchResultData);
        setElectionData(fetchResultData);
      } catch (err) {
        setErrorData(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      loadResult();
    }
  }, [wallet]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.candidate_name}</p>
          {data.party && (
            <p className="text-gray-600 text-sm">{data.party}</p>
          )}
          <p className="text-indigo-600 font-medium mt-1">
            {data.vote_count.toLocaleString()} votes
            {' '}({((data.vote_count / data.total_votes) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.payload.candidate_name}
              {entry.payload.party && ` - ${entry.payload.party}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <LoadingModal
        modalVisible={loading}
        task="Loading Vote Result. Kindly wait a bit..."
      />
    );
  }

  if (errorData) {
    return (
      <div className="Error">
        Something went wrong, data could not be retrieved.
      </div>
    );
  }

  if (electionData?.status === "Voting process is ongoing") {
    return (
      <div className="Error">
        Voting is currently ongoing. Results will be available after voting
        concludes.
      </div>
    );
  }

  // Process candidates data to include total votes for percentage calculation
  const processCandidatesData = (candidates) => {
    const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0);
    return candidates.map(candidate => ({
      ...candidate,
      total_votes: totalVotes
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="w-full flex justify-start items-start mb-6">
        <button
          className="p-2 text-purple-900 hover:text-purple-500 transition-colors"
          onClick={onBack}
        >
          <CircleArrowLeft size={34} strokeWidth={1.75} />
        </button>
      </div>

      <div className="max-w-7xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-900 mb-12">
          Election Results 2024
        </h1>

        {electionData?.data.map((areaData, areaIndex) => (
          <div key={areaIndex} className="mb-12">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4 text-center">
              Area: {areaData.area}
            </h2>

            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80">
                <h3 className="text-xl font-semibold text-indigo-800 mb-6 text-center">
                  Vote Distribution
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processCandidatesData(areaData.candidates)}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="vote_count"
                        label={({ candidate_name, vote_count, total_votes }) =>
                          `${((vote_count / total_votes) * 100).toFixed(0)}%`
                        }
                      >
                        {areaData.candidates.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        content={<CustomLegend />}
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rest of your component remains the same */}
              {/* Winner's Information Section */}
              {areaData.message === "winner determined" && (
                <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
                  <img
                    src={`data:image/jpeg;base64,${areaData.winners[0].photo}`}
                    // alt="Winner"
                    className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover"
                  />
                  <h2 className="text-3xl font-bold text-center mb-8">Winner</h2>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-sm text-indigo-200">Name</p>
                        <p className="text-xl font-semibold">
                          {areaData.winners[0].candidate_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Handshake className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-sm text-indigo-200">Party
                        </p>
                        <p className="text-xl font-semibold">
                        {areaData.winners[0].party}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Users className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-sm text-indigo-200">Vote obtained
                        </p>
                        <p className="text-xl font-semibold">
                        {areaData.max_votes.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Flag className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="text-sm text-indigo-200">Out of</p>
                        <p className="text-xl font-semibold">
                          {areaData.winners[0].vote_count.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Statistics Section */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {areaData.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={`data:image/jpeg;base64,${candidate.photo}`}
                    alt={candidate.candidate_name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-200 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {candidate.candidate_name}
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {candidate.vote_count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">votes</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowVoteResultPage;