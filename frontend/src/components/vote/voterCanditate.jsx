import React from "react";
import CandiateCard from "./candiateCard";
import { X } from "lucide-react";

function VoterCanditate({ onClose }) {
  return (
    <>
      <div className="container fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex flex-col items-end p-4">
        <button onClick={onClose} className="backdrop-blur-none text-white">
          <X size={30} />
        </button>
        <div className="bg-blue-200 w-full flex flex-col items-center p-4">
          <h2 className="text-2xl font-semibold mb-6">Let's Vote</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 bg-white py-10 mx-20">
              <CandiateCard />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 bg-white py-10 mx-20">
              <CandiateCard />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 bg-white py-10 mx-20">
              <CandiateCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoterCanditate;
