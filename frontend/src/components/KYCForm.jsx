import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Upload,
  ArrowRight,
  Camera,
  ExternalLink
} from "lucide-react";
import CameraModal from "./CameraModal";
import Loading from "@/components/LoadingModal";
import toast from 'react-hot-toast';

const KYCForm = ({ onSubmit, onCancel, walletAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    documentNumber: "",
    documentImage: null,
    walletAddress: "",
  });

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [take, setTake] = useState(0);

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
    setFormData((prevData) => ({ ...prevData, documentImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if no photo has been captured
    if (!capturedPhoto) {
      alert("Please capture your photo to complete the KYC process.");
      return;
    }

    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("documentNumber", formData.documentNumber);
    formDataToSend.append("documentImage", formData.documentImage);
    formDataToSend.append("walletAddress", formData.walletAddress);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/kyc", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("KYC submitted successfully:", data);
        if (data.status === "success") {
          // Show toast notification with hyperlinked TxHash
          toast.success(
            <div>
              Thank you for submitting your KYC! You can now vote for your favorite candidate.
              <br />
              TxHash:{' '}
              <a
                href={`https://base-sepolia.blockscout.com/tx/${data.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {data.tx_hash.slice(0, 10)}...{data.tx_hash.slice(-8)}
                <ExternalLink className="h-5 w-5 hover:text-blue-400 transition-colors duration-200" />
              </a>
            </div>,
            {
              duration: 10000, // 10 seconds
              position: 'bottom-right',
            }
          );
          onSubmit({ ...formData, txHash: data.tx_hash });
        } else {
          console.error("Unexpected success response:", data);
          toast.error("Unexpected response from server", { duration: 10000, position: 'bottom-right' });
        }
      } else {
        console.error("Error submitting KYC:", data.error);
        toast.error(`Error submitting KYC: ${data.error}`, { duration: 10000, position: 'bottom-right' });
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("Error submitting KYC. Please try again.", { duration: 10000, position: 'bottom-right' });
    }
  };

  const handleOpenCamera = () => {
    setIsCameraModalOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraModalOpen(false);
  };

  const handleCapture = (photoData) => {
    setCapturedPhoto(photoData);
    setTake(1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-[38rem]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Complete KYC Process
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

export default KYCForm;
