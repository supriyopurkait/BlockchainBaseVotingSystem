import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Building,
  FileText,
  Upload,
  ArrowRight,
  Camera,
} from "lucide-react";
import Loading from "@/components/LoadingModal";
import toast from 'react-hot-toast';

const AdminAddCandidateForm = ({ onSubmit, onCancel, walletAddress }) => {
  const [formData, setFormData] = useState({
      candidate_name: "",
      candidate_id: "",
      area: "",
      party: "",
      photo: null,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (walletAddress == import.meta.env.VITE_ADMINADDRESS) {
      setIsAdmin(true);
    }
  }, [walletAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleAreaChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, area: value }));
  };

  const handlePartyChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, party: value }));
  };

  const validateFields = () => {
    let validationErrors = {};
  
    // Name validation (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(candidate_name)) {
      validationErrors.candidate_name = "Name must contain only letters and spaces";
    }

    // Document image validation
    if (!formData.photo) {
      validationErrors.photo = "Photo is required";
    }
  
    // Area selection validation (must select a non-empty value)
    if (!formData.area || formData.area === "") {
      validationErrors.area = "You must select an area";
    }
    if (!formData.party || formData.party === "") {
      validationErrors.party = "You must select an party";
    }
  
    setErrors(validationErrors);
  
    // Return true if no validation errors
    return Object.keys(validationErrors).length === 0;
  };

  const base64ToBlob = (base64Data, contentType = "image/png") => {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if no photo has been captured
    if (!formData.photo) {
      alert("Please capture your photo to complete the KYC process.");
      return;
    }
    const faceImageBlob = base64ToBlob(formData.photo);
    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append("candidate_name", formData.candidate_name);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("party", formData.party);
    formDataToSend.append("photo", faceImageBlob, "faceImage.png");

    try {
      setLoadingModel(true);
      const response = await fetch("http://127.0.0.1:5000/api/newCandidate", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setLoadingModel(false);
        console.log("New Candidate Added Successfully:", data);
        if (data.status === "success") {
          // Show toast notification with hyperlinked TxHash
          toast.success(
            <div>
              New Candidate Added Successfully.
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
        console.error("Error Candidate Creation:", data.error);
        toast.error(`Error Candidate Creation: ${data.error}`, { duration: 10000, position: 'bottom-right' });
      }
    } catch (error) {
      setLoadingModel(false);
      console.error("Error during API call:", error);
      toast.error("Error submitting New Candidate Form. Please try again.", { duration: 10000, position: 'bottom-right' });
    }
  };

  // if (isAdmin === true) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg overflow-y-auto h-max">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add a New Candidate
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
              htmlFor="candidate_name"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <User size={18} className="mr-2" /> Full Name
            </label>
            <input
              type="text"
              id="candidate_name"
              name="candidate_name"
              value={formData.candidate_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.candidate_name && (
              <p className="text-red-500 text-sm mt-1">{errors.candidate_name}</p>
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
              className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* <div className="w-full"> */}
                <option value="" disabled>
                  Select Area
                </option>
                <option value="area1">area1</option>
                <option value="area2">area2</option>
              {/* </div> */}
            </select>
            {errors.area && (
              <p className="text-red-500 text-sm mt-1">{errors.area}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="partySelect"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Building size={18} className="mr-2" /> Party
            </label>
            <select
              name="partySelect"
              id="partySelect"
              value={formData.party}
              onChange={handlePartyChange}
              className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Party
              </option>
              <option value="party1">party1</option>
              <option value="party2">party2</option>
            </select>
            {errors.area && (
              <p className="text-red-500 text-sm mt-1">{errors.party}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="photo"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Upload size={18} className="mr-2" /> Upload Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
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
        {loadingModel && <Loading modalVisible={loadingModel}/>}
      </div>
    );
  // }
};

export default AdminAddCandidateForm;
