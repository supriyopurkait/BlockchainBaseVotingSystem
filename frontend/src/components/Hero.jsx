import React from 'react';
import { ArrowRight, Info } from 'lucide-react';
import VoterBoxicon from "/picture/VoteBoxIcon.png";

const Hero = ({ onEnterDApp }) => (
  <div className="flex flex-col md:flex-row items-center justify-between px-4 py-16 bg-gray-100">
    <div className="md:w-1/2 mb-8 md:mb-0">
      <h1 className="text-4xl font-bold mb-4">Welcome Voter</h1>
      <p className="text-xl mb-8">Vote for yourself, for future and for the nation.</p>
      <div className="flex space-x-4">
        <button onClick={onEnterDApp} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center">
          Enter DApp
          <ArrowRight className="ml-2" size={20} />
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center">
          Learn More
          <Info className="ml-2" size={20} />
        </button>
      </div>
    </div>
    <div className="md:w-1/2">
      <img src={VoterBoxicon} alt="Crypto DApp Illustration" className="rounded-lg  h-[24rem] w-[26rem] ms-[190px]" />
    </div>
  </div>
);

export default Hero;
