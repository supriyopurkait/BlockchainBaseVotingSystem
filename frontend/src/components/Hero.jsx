import React from 'react';
import { ArrowRight, Info } from 'lucide-react';
import VoterBoxicon from "pub/picture/Mascot.png?url";

const Hero = ({ onEnterDApp, showVoteButton }) => (
  <div className="hero centre h-fit w-fit flex flex-col min-[970px]:flex-row items-center justify-center px-4">
    <div className="p-8 sm:w-1/2">
      <h1 className="text-4xl font-bold mb-4">Welcome Voter</h1>
      <p className="text-wrap md:text-nowrap text-xl mb-8">Vote for yourself, for future and for the nation.</p>
      <div className="flex flex-col items-center md:flex-row">
        <button onClick={onEnterDApp} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center text-nowrap">
          Enter DApp
          <ArrowRight className="ml-2" size={20} />
        </button>
        <div className="p-2"></div>
        <button onClick={() => {window.location.assign("https://github.com/supriyopurkait/BlockchainBaseVotingSystem/blob/main/README.md");}} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center text-nowrap">
          Learn More
          <Info className="ml-2" size={20} />
        </button>
      </div>
      {/* if the value of showVoteButton == true button will show or hide*/}
      {showVoteButton && (
        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center" onClick={()=>{console.log("vote declared button clicked")}}>
            See results of your area
          </button>
        </div>
      )}
    </div>
    <img src={VoterBoxicon} alt="Crypto DApp Illustration" className="min-[970px]:size-1/3" />
  </div>
);

export default Hero;
