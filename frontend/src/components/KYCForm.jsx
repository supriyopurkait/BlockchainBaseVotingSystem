<<<<<<< HEAD
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
import CameraModal from "./CameraModal";
=======
import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, FileText, Upload, ArrowRight } from 'lucide-react';
import WebcamStreamCapture from '@/components/Camera';

>>>>>>> db936bad47678112c4ce99ffa0b0cab17ca05aa2
const KYCForm = ({ onSubmit, onCancel, walletAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    documentNumber: "",
    documentImage: null,
<<<<<<< HEAD
    walletAddress: "",
=======
    walletAddress: ''
    // video: null
>>>>>>> db936bad47678112c4ce99ffa0b0cab17ca05aa2
  });

  // Set the wallet address on component mount or when walletAddress changes
  useEffect(() => {
    if (walletAddress) {
      setFormData((prevData) => ({ ...prevData, walletAddress })); // Set wallet address silently
    }
  }, [walletAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      documentImage: e.target.files[0],
    }));
  };

  const handleCamera = (data) => {
    setFormData(prevData => ({ ...prevData, video: data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data for submission
    const formDataToSend = new FormData();
<<<<<<< HEAD
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("documentNumber", formData.documentNumber);
    formDataToSend.append("documentImage", formData.documentImage);
    formDataToSend.append("walletAddress", formData.walletAddress);

=======
    formDataToSend.append('name', formData.name);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('documentNumber', formData.documentNumber);
    formDataToSend.append('documentImage', formData.documentImage);
    formDataToSend.append('walletAddress', formData.walletAddress);
    // formDataToSend.append('video', formData.video);
  
>>>>>>> db936bad47678112c4ce99ffa0b0cab17ca05aa2
    try {
      const response = await fetch("http://127.0.0.1:5000/api/kyc", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("KYC submitted successfully:", data);
        if (data.status === "success") {
          onSubmit({ ...formData, txHash: data.tx_hash });
        } else {
          console.error("Unexpected success response:", data);
        }
      } else {
        console.error("Error submitting KYC:", data.error);
        // Handle specific error cases
        if (
          data.error === "A KYC record already exists for this wallet address."
        ) {
          // Handle duplicate KYC record
        } else if (data.error === "SBT already minted by this address.") {
          // Handle already minted SBT
        }
        // You might want to show these errors to the user
      }
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle network errors or unexpected exceptions
    }
  };

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showModalOption, setShowModalOption] = useState(true);

  const handleOpenCamera = () => {
    setIsCameraModalOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraModalOpen(false);
  };

  const handleCapture = (photoData) => {
    setCapturedPhoto(photoData);
    setShowModalOption(false);
  };

  return (
<<<<<<< HEAD
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-[38rem]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Complete KYC Process
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
=======
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-center">Complete KYC Process</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className=""><WebcamStreamCapture sendData={handleCamera}/></div>
>>>>>>> db936bad47678112c4ce99ffa0b0cab17ca05aa2
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
            <div className="mb-4">
              <h2 className="flex items-center text-sm font-medium text-gray-700 mb-1">Captured Photo</h2>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="mt-2 rounded-md w-10 h-8"
              />
            </div>
          ) : (
            <p>No photo captured yet</p>
          )}

          {/* Your custom button embedded inside a container */}
          {showModalOption && (
            <div className="container">
              <button
                className="flex gap-2 border-gray-700 rounded-md px-3 py-[0.1rem] bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleOpenCamera}
              >
                <Camera /> {/* Camera icon */}
                Capture Face
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
          )}
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

export default KYCForm;
