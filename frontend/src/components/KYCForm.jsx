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
import Loading from "@/components/LoadingModal";

const KYCForm = ({ onSubmit, onCancel, walletAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    votercardNumber: "",
    documentImage: null,
    walletAddress: "",
  });

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [take, setTake] = useState(0);
  const [loadingmodel, setLoadingmodel] = useState(false);
  const [errors, setErrors] = useState({}); // Track validation errors

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

  const validateFields = () => {
    let validationErrors = {};

    // Name validation (no numbers or special characters)
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      validationErrors.name = "Name must contain only letters and spaces";
    }

    // Phone number validation (exactly 10 digits, no special characters)
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // Voter card validation (non-empty for now)
    if (formData.votercardNumber.trim() === "") {
      validationErrors.votercardNumber = "Voter card number is required";
    }

    // Document image validation
    if (!formData.documentImage) {
      validationErrors.documentImage = "Document image is required";
    }

    // Captured photo validation
    if (!capturedPhoto) {
      validationErrors.capturedPhoto = "Please capture your photo";
    }

    setErrors(validationErrors);

    // Return true if no validation errors, otherwise false
    return Object.keys(validationErrors).length === 0;
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
    formDataToSend.append("documentNumber", formData.votercardNumber);
    formDataToSend.append("documentImage", formData.documentImage);
    formDataToSend.append("walletAddress", formData.walletAddress);

    try {
      setLoadingmodel(true);
      const response = await fetch("http://127.0.0.1:5000/api/kyc", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setLoadingmodel(false);
        console.log("KYC submitted successfully:", data);
        if (data.status === "success") {
          onSubmit({ ...formData, txHash: data.tx_hash });
        } else {
          console.error("Unexpected success response:", data);
        }
      } else {
        setLoadingmodel(false);
        console.error("Error submitting KYC:", data.error);
      }
    } catch (error) {
      setLoadingmodel(false);
      console.error("Error during API call:", error);
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
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (validateFields()) {
            handleSubmit(e); // Only proceed to handleSubmit if validation passes
          }
        }}
      >
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
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="subject"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <MapPin size={18} className="mr-2" /> Area
          </label>
          <select
            name="subject"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" selected="selected">
              Select Area
            </option>
            <option value="area1">area1</option>
            <option value="area2">area2</option>
          </select>
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
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="votercardNumber"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FileText size={18} className="mr-2" /> Voter card Number
          </label>
          <input
            type="text"
            id="votercardNumber"
            name="votercardNumber"
            value={formData.votercardNumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.votercardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.votercardNumber}</p>
          )}
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
          {errors.documentImage && (
            <p className="text-red-500 text-sm mt-1">{errors.documentImage}</p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="">{}</div>
          <button
            type="button"
            onClick={handleOpenCamera}
            className="flex items-center text-white bg-blue-500 px-4 py-2 rounded-md"
          >
            <Camera size={18} className="mr-2" />
            {take === 1 ? "Recapture Photo" : "Capture Your Photo"}
          </button>
          {errors.capturedPhoto && (
            <p className="text-red-500 text-sm mt-1">{errors.capturedPhoto}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 text-gray-700 bg-gray-200 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center text-white bg-green-500 px-4 py-2 rounded-md"
          >
            Submit
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </form>

      {isCameraModalOpen && (
        <CameraModal
          isOpen={isCameraModalOpen}
          onClose={handleCloseCamera}
          onCapture={handleCapture}
        />
      )}
      {loadingmodel && <Loading modalVisible={loadingmodel}/>}
    </div>
  );
};

export default KYCForm;
