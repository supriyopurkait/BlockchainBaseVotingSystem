import React from 'react'
import CandiateCard from './candiateCard'
function VoterCanditate() {
  return (
    <>
    <div className="container mx-auto my-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 my">Let's Vote</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6">
          <CandiateCard />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6">
          <CandiateCard />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6">
          <CandiateCard />
        </div>
      </div>
    </div>
  </>
  
  )
}

export default VoterCanditate;
