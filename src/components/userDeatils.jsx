import React from "react";
import copy_svg from "../icon/copy-icon.png";

const UserDeatils = ({ showModal, handleCloseModal, walletAddress }) => {
  const userName = "ABCD";

  const eventCopy = () => {
    navigator.clipboard.writeText(walletAddress ? walletAddress : "NULL");
  };

  return (
    <div
      className={`modal fade ${showModal ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Background overlay
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Wallet Information</h5>
            <button type="button" className="close border-white btn " onClick={handleCloseModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h5>Wallet Address</h5>
            <p>
              {walletAddress ? walletAddress : "No Wallet Connected"}
              <button  className=" btn  ps-0 pe-1  pt-0 pb-0 mx-2" onClick={eventCopy}>
                <img
                  src={copy_svg}
                  alt="Copy"
                  style={{ width: "15px", height: "15px", marginLeft: "5px" }}
                />
              </button>
            </p>

            <hr />

            <h5>Your Voting Status</h5>

            <hr />

            <h5>User Profile</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Full Name:</strong> {userName}
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeatils;
