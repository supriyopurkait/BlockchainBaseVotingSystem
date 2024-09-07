import React from 'react'
import CandiateCard from './candiateCard'
function VoterCanditate() {
  return (
    <>
    <div className="container my-3">
  <h2>Let's Vote</h2>
  <div className="row my-3 justify-content-center">
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <CandiateCard />
    </div>
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <CandiateCard />
    </div>
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <CandiateCard />
    </div>
  </div>
</div>


    </>
  )
}

export default VoterCanditate;
