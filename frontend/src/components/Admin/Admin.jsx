import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { fetchStatData } from '@/utils/getDetails';
import { Rss, AtSign, UserRoundCog, CirclePlay, CircleStop, Ellipsis, Search, X } from 'lucide-react';
import LoadingModal from '@/components/LoadingModal';
import AdminAddCandidateCard from '@/components/Admin/AdminAddCandidateCard';
import PieDiagram from '@/components/PieChart';
import { processAreaData, calculateTotalVotes } from '@/utils/StatDataProcessor';

import { sdata } from '@/utils/testData2';

const AdminControl = ({ wallet, voteStatus, onAdd, onDeclareResults, onCandidate, onUser, onStartVote, onEndVote, onClose }) => {
  const [areaData, setAreaData] = useState({});
  const [NumberOfArea, setNumberOfArea] = useState(0);
  const [TotalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStat, setShowStat] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [moreORless, setmoreORless] = useState("More");

  // Function to show toast messages
  const toastMsg = (status, msg, duration, position) => {
    // Call the appropriate toast function based on the status
    if (toast[status]) {
      toast[status](msg, {
        duration, // 10 seconds
        position,
      });
    } else {
      console.error(`Invalid status: ${status}`);
    }
  };

  const handleShowMore = () => {
    if(!showMore){
      setShowMore(true);
      setmoreORless("Less");
      toastMsg("success", "Loading More", 1000, "top-center");
    }
    if(showMore){
      setShowMore(false);
      setmoreORless("More");
      toastMsg("success", "Loading Less", 1000, "top-center");
    }
    
  };
  const handleCheckVoteStatus = () => {
    if (voteStatus == 1) {
      toastMsg("success", "Voting is ongoing.", 10000, "top-center");
    } else if (voteStatus == 0) {
      toastMsg("error", "Voting has not started yet.", 100000, "top-center");
    } else if (voteStatus == 2) {
      toastMsg("error", "Voting has ended.", 100000, "top-center");
    } else if (voteStatus == -1) {
      toastMsg("error", "Error checking voting status. Please try again later.", 10000, "top-center");
    }
  };
  
  useEffect(() => {
    const loadStatData = async () => {
      setLoading(true);
      try {
        const fetchedStatData = await fetchStatData(wallet);
        if(fetchStatData){
          setAreaData(processAreaData(fetchedStatData));
          // setareaData(processAreaData(sdata)); // Using Dummy data for testing
          setNumberOfArea(areaData.length);
          setTotalVotes(calculateTotalVotes(fetchedStatData));
          setShowStat(true);
        }
      } catch (err) {
        setError('Failed to load Vote Data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStatData();
  }, [wallet]);

  if (loading) return (<div><LoadingModal modalVisible={loading} task="Loading Vote Data..." onClose={() => {setLoading(false);}} /></div>);
  if (error) return (
    <div>
      <div className="loading-modal-overlay" onClick={() => {setError(null)}}>
        <div className="loading-modal">
          <p>{error}</p>
        </div>
        <button onClick={() => {setError(null)}} className="relative right-0 top-[-3rem]">
          <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
        </button>
      </div>
    </div>
    );

  return (
    <div className="w-svw flex flex-col justify-self-start m-10">
      <div className="TopBar mx-6 flex flex-col md:flex-row justify-between justify-items-center">
        <h1 className="text-4xl font-bold md:my-2 md:py-2 md:px-4 m-4 pt-4">Admin Controls</h1>
        <div className="flex flex-row justify-items-center my-2 py-2">
          <button
            onClick={onCandidate}
            className="w-fit bg-cyan-500 hover:bg-cyan-600 text-white font-bold my-2 mx-3 py-2 px-4 rounded"
          >
            <div className="flex flex-row items-center">
              <AtSign size={24} />
              <div className="hidden md:block pl-2"> 
                Candidate Controls 
              </div>
            </div>
          </button>
          <button
            onClick={onUser}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 mx-3 py-2 px-4 rounded"
          >
            <div className="flex flex-row items-center">
              <UserRoundCog size={24} />
              <div className="hidden md:block pl-2"> 
                User Controls 
              </div>
            </div>
          </button>
          <button
            onClick={onStartVote}
            className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 mx-3 py-2 px-4 rounded"
          >
            <div className="flex flex-row items-center">
              <CirclePlay size={24} />
              <div className="hidden md:block pl-2"> 
                Start Vote 
              </div>
            </div>
          </button>
          <button
            onClick={onEndVote}
            className="w-fit bg-red-500 hover:bg-red-600 text-white font-bold my-2 mx-3 py-2 px-4 rounded"
          >
            <div className="flex flex-row items-center">
              <CircleStop size={24} />
              <div className="hidden md:block pl-2"> 
                End Vote 
              </div>
            </div>
          </button>
          <button onClick={onClose} className="">
              <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
          </button>
        </div>
      </div>
      <div className="DashBoard flex flex-col lg:flex-row">
      {showStat && (
        <div className="PieChart h-fit bg-white rounded-2xl shadow-md flex-grow m-0 p-2 pl-8">
          {/* Pie Chart % */}
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold flex-shrink my-4 mr-4">Statistics</h1>
            <button
              onClick={handleShowMore}
              className="w-fit bg-gray-200 hover:bg-gray-300 text-black font-bold my-2 mx-3 py-2 px-4 rounded"
            >
              <div className="flex flex-row items-center">
                <Ellipsis size={24} />
                <div className="hidden md:block pl-2"> 
                  {moreORless} 
                </div>
              </div>
            </button>
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2 justify-items-center">
            { Object.entries(areaData).map(([areaId, area]) => (
                ((showMore || areaId === "0" || areaId === "1") &&
                  <PieDiagram key={area.id} 
                    title={area.areaName}
                    total={area.totalVotes} 
                    data={area.statData} 
                    fontsize={12} 
                    cx={80} 
                    cy={110} 
                    sizeH={300} 
                    sizeW={300} 
                    outerRadius={100}
                    innerRadius={20} 
                    margin={{ left: 25, right: 25, top: 25, bottom: 25 }} 
                    padding={{ left: 25, right: 25, top: 0, bottom: 0 }} 
                  />
                )
              ))
            }
          </div>
        </div>
      )}
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
              <p className="text-2xl text-blue-600 font-bold">{TotalVotes?TotalVotes:"Vote Has Not Started.."}</p>
              <button
                onClick={onDeclareResults}
                className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
              >
                Declare Results
                <Rss className="ml-2" size={16} />
              </button>
              <button
                onClick={handleCheckVoteStatus}
                className="w-fit bg-purple-500 hover:bg-purple-600 text-white font-bold my-2 py-2 px-4 rounded-full flex items-center"
              >
                Check Vote Status
                <Search className="ml-2" size={16} />
              </button>
            </div>
          </div>
          {/* Area Votes */}
          {showStat && (
          <div className="m-4 p-4  w-full bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold pb-2">Area Votes:</h3>
            <div className="text-center">
              <div className="grid grid-cols-4 bg-gray-400 hover:bg-gray-100 m-2 rounded">
                <span className="p-2 font-bold">Area </span>
                <span className="p-2 font-bold">Votes Per Area</span>
                <span className="p-2 font-bold">Winner of Area</span>
                <span className="p-2 font-bold">Winner's Vote Count</span>
              </div>
              { Object.entries(areaData).map(([areaId, area]) => (
                <div key={areaId + NumberOfArea} className="grid grid-cols-4 bg-gray-200 hover:bg-gray-100 m-2 rounded">
                  <span className="p-2">{area.areaName}</span>
                  <span className="p-2 font-bold">{area.totalVotes}</span>
                  <span className="p-2">{area.winner}</span>
                  <span className="p-2 font-bold">{area.wonByVotes}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
        {/* End Of Stats */}
      </div> 
    {/*  end of component */}
    </div>
  );
};

export default AdminControl;
