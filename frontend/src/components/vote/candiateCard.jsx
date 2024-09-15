import React from "react";
import { Link } from "react-router-dom";
import Image from "/picture/face_img.png";

const executeContract =()=>{
  
};
function CandiateCard() {
  let canditateName = "XYZ";
  return (
    <>
      <div className="mt-10 mx-14 ">
        {" "}
        {/* Ensure card takes full width */}
        <img
          src={Image}
          className="h-[10rem] w-[10rem]"
        />
        <div className="card-body">
          <h5 className="card-title">Name: {canditateName}</h5>
          <button className=" bg-black text-white px-2  py-1 justify-center hover:text-black hover:bg-[#424242] rounded-md" onClick={executeContract}>Vote</button>
        </div>
      </div>
    </>
  );
}

export default CandiateCard;
