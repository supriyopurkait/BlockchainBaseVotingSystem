import React from 'react';
import { ArrowRight, Info } from 'lucide-react';
import VoterBoxicon from "pub/picture/Mascot.png?url";
import { Typewriter } from 'react-simple-typewriter';

const Hero = ({ onEnterDApp, showVoteButton, onEnterShowResult }) => (
  <div className="hero centre h-fit w-fit flex flex-col min-[970px]:flex-row items-center justify-center px-4">
    <div className="p-8 sm:w-1/2">
      <h1 className="text-4xl font-bold mb-4 md:text-5xl">Welcome Voter</h1>
      <p className="text-lg md:text-xl mb-8">
        <span className="font-medium text-gray-600">
          Shape Tomorrow:
        </span>
        <span className="text-gray-600"> Vote for </span>
        <span className="text-blue-700 font-semibold">
          <Typewriter
            words={['Yourself', 'Unity', 'Progress', 'Future', 'Nation']}
            loop={50}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </span>
      </p>

      <div className="flex flex-col items-center md:flex-row">
        <button onClick={onEnterDApp} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center text-nowrap">
          Enter DApp
          <ArrowRight className="ml-2" size={20} />
        </button>
        <div className="p-2"></div>
        <button onClick={() => { window.location.assign("https://github.com/supriyopurkait/BlockchainBaseVotingSystem/blob/main/README.md"); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center text-nowrap">
          Learn More
          <Info className="ml-2" size={20} />
        </button>
      </div>
      {/* if the value of showVoteButton == true button will show or hide*/}
      {showVoteButton && (
        <div className="mt-8">
          <button className="bg-blue-500 mx-2 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center" onClick={onEnterShowResult}>
            Check result
          </button>
        </div>
      )}
    </div>
    <img src={VoterBoxicon} alt="Crypto DApp Illustration" className="min-[970px]:size-1/3" />
  </div>
);

export default Hero;