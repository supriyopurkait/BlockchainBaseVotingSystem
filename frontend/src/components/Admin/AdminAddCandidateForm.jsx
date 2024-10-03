import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Upload,
  ArrowRight,
  Camera,
} from "lucide-react";

const AdminAddCandidateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
      photo: null,
      name: "",
      candidate_id: "",
      area: "",
      party: "",
      walletAddress: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, documentImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append("photo", formData.photo);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("candidate_id", formData.candidate_id);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("party", formData.party);
    formDataToSend.append("walletAddress", formData.walletAddress);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/newCandidate", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Candidate Data submitted successfully:", data);
        if (data.status === "success") {
          onSubmit({ ...formData, txHash: data.tx_hash });
        } else {
          console.error("Unexpected success response:", data);
        }
      } else {
        console.error("Error submitting Candidate Data:", data.error);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-[38rem]">
      {/* Submit Section */}
      {/* <div className="bg-gray-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Submit</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-bold" htmlFor="candidateName">Candidate Name:</label>
            <input
              type="text"
              id="candidateName"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold" htmlFor="party">Party:</label>
            <input
              type="text"
              id="party"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold" htmlFor="area">Area:</label>
            <input
              type="text"
              id="area"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Submit
          </button>
        </div>
      </div> */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New Candidate
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User size={18} className="mr-2" /> Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <MapPin size={18} className="mr-2" /> Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Phone size={18} className="mr-2" /> Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="documentNumber"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FileText size={18} className="mr-2" /> Document Number
          </label>
          <input
            type="text"
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="documentImage"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Upload size={18} className="mr-2" /> Upload Document Image
          </label>
          <input
            type="file"
            id="documentImage"
            name="documentImage"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="ps-2">
          {/* Show captured photo if available */}
          {capturedPhoto ? (
            <div className="flex flex-col justify-between items-start">
              <h2 className="text-sm font-medium text-gray-700 mb-1">Captured Photo</h2>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="m-2 object-contain rounded-md w-20 h-18"
              />
            </div>
          ) : (
            <p className="mb-4">No photo captured yet</p>
          )}

          <div className="container">
            <button
              type="button"
              className="flex gap-2 items-center border-gray-700 rounded-md h-10 px-3 py-[0.1rem] bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleOpenCamera}
            >
              <Camera /> {/* Camera icon */}
              {take === 0 ? "Capture Face" : "Retake"}
            </button>

            {/* Camera Modal */}
            {isCameraModalOpen && (
              <CameraModal
                isOpen={isCameraModalOpen}
                onClose={handleCloseCamera}
                onCapture={handleCapture}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            Submit KYC <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCandidateForm;
