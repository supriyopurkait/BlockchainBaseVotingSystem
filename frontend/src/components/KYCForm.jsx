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
    DOB:"",
    area: "",
    phoneNumber: "",
    addharcardnumber: "", // Updated key for Aadhaar
    documentImage: null,
    walletAddress: "",
  });

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [take, setTake] = useState(0);
  const [loadingModel, setLoadingModel] = useState(false);
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

  const handleAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, area: value }));
  };

  const validateFields = () => {
    let validationErrors = {};
  
    // Name validation (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      validationErrors.name = "Name must contain only letters and spaces";
    }
  
    // Phone number validation (exactly 10 digits, no special characters)
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }
  
    // Aadhaar card validation (non-empty for now)
    if (formData.addharcardnumber.trim() === "") {
      validationErrors.addharcardnumber = "Aadhaar card number is required";
    }
  
    // Document image validation
    if (!formData.documentImage) {
      validationErrors.documentImage = "Document image is required";
    }
  
    // Captured photo validation
    if (!capturedPhoto) {
      validationErrors.capturedPhoto = "Please capture your photo";
    }
  
    // DOB validation (must be at least 18 years old as of January 1 of the current year)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const qualifyingDate = new Date(`${currentYear}-01-01`);
    const dob = new Date(formData.DOB);
  
    const ageOnQualifyingDate = qualifyingDate.getFullYear() - dob.getFullYear();
    const is18OrOlder = ageOnQualifyingDate > 18 || 
                       (ageOnQualifyingDate === 18 && 
                        (qualifyingDate.getMonth() > dob.getMonth() ||
                         (qualifyingDate.getMonth() === dob.getMonth() && qualifyingDate.getDate() >= dob.getDate())));
  
    if (!is18OrOlder) {
      validationErrors.DOB = `You must be 18 years old or older as of January 1, ${currentYear}.`;
    }
  
    // Area selection validation (must select a non-empty value)
    if (!formData.area || formData.area === "") {
      validationErrors.area = "You must select an area";
    }
  
    setErrors(validationErrors);
  
    // Return true if no validation errors
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
    formDataToSend.append("DOB", formData.DOB);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("addharcardnumber", formData.addharcardnumber);
    formDataToSend.append("documentImage", formData.documentImage);
    formDataToSend.append("walletAddress", formData.walletAddress);

    try {
      setLoadingModel(true);
      const response = await fetch("http://127.0.0.1:5000/api/kyc", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setLoadingModel(false);
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
        setLoadingModel(false);
        console.error("Error submitting KYC:", data.error);
        toast.error(`Error submitting KYC: ${data.error}`, { duration: 10000, position: 'bottom-right' });
      }
    } catch (error) {
      setLoadingModel(false);
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
          <label htmlFor="DOB" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <User size={18} className="mr-2" /> Date of Birth (DOB)
          </label>
          <input
            type="date"
            id="DOB"
            name="DOB"
            value={formData.DOB}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.DOB && (
            <p className="text-red-500 text-sm mt-1">{errors.DOB}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="areaSelect"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <MapPin size={18} className="mr-2" /> Area
          </label>
          <select
            name="areaSelect"
            id="areaSelect"
            value={formData.area}
            onChange={handleAreaChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Area
            </option>
            <option value="area1">area1</option>
            <option value="area2">area2</option>
          </select>
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
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
            htmlFor="addharcardnumber"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FileText size={18} className="mr-2" /> Aadhaar Card Number
          </label>
          <input
            type="text"
            id="addharcardnumber"
            name="addharcardnumber"
            value={formData.addharcardnumber}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.addharcardnumber && (
            <p className="text-red-500 text-sm mt-1">{errors.addharcardnumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="documentImage"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Upload size={18} className="mr-2" /> Upload Document
          </label>
          <input
            type="file"
            id="documentImage"
            name="documentImage"
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.documentImage && (
            <p className="text-red-500 text-sm mt-1">{errors.documentImage}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="capturedPhoto"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Camera size={18} className="mr-2" /> Capture Photo
          </label>
          <button
            type="button"
            onClick={handleOpenCamera}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {take === 0 ? "Open Camera" : "Take Again"}
          </button>
          {errors.capturedPhoto && (
            <p className="text-red-500 text-sm mt-1">{errors.capturedPhoto}</p>
          )}

          {/* Show captured photo if available */}
          {capturedPhoto && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Captured Photo:</p>
              <img
                src={capturedPhoto}
                alt="Captured"
                className="mt-2 max-w-full h-32 rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            Submit <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </form>

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={handleCloseCamera}
        onCapture={handleCapture}
      />
      {loadingModel && <Loading modalVisible={loadingModel}/>}
    </div>
  );
};

export default KYCForm;
