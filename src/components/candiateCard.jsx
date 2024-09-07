import React from "react";
import { Link } from "react-router-dom";
import Image from "../icon/face_img.png";

function CandiateCard() {
  let canditateName = "XYZ";
  return (
    <>
      <div className="card" style={{ width: "100%" }}>
        {" "}
        {/* Ensure card takes full width */}
        <img
          src={Image}
          className="card-img-top"
          alt="..."
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">Name: {canditateName}</h5>
          <Link rel="stylesheet" to="/vodedone" className="btn btn-primary" >Vote</Link>
        </div>
      </div>
    </>
  );
}

export default CandiateCard;
