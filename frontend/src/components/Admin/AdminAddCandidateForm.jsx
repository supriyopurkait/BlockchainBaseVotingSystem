import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Building,
  Upload,
  ArrowRight
} from "lucide-react";
import Loading from "@/components/LoadingModal";
// import toast from 'react-hot-toast';
import toastMsg from "@/utils/toastMsg";
import { updateCandidateDb } from "@/utils/getDetails";

const AdminAddCandidateForm = ({ onSubmit, onCancel, wallet, contract }) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidate_id: "",
    area: "",
    party: "",
    photo: null,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (wallet.address == import.meta.env.VITE_ADMINADDRESS) {
      setIsAdmin(true);
    }
  }, [wallet.address]);

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

    // // Name validation (letters and spaces only)
    // if (!/^[a-zA-Z\s]+$/.test(candidateName)) {
    //   validationErrors.candidateName = "Name must contain only letters and spaces";
    // }

    // Document image validation
    if (!formData.photo) {
      validationErrors.photo = "Photo is required";
    }

    // Area selection validation (must select a non-empty value)
    if (!formData.area || formData.area === "") {
      validationErrors.area = "You must select an Booth";
    }
    if (!formData.party || formData.party === "") {
      validationErrors.party = "You must select an party";
    }

    setErrors(validationErrors);

    // Return true if no validation errors
    return Object.keys(validationErrors).length === 0;
  };

  // Function to handle the image upload and conversion if needed
  const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("photo", file); // Use "photo" as the key, since the backend is expecting "photo"
    formData.append("address", wallet.address); // Assuming wallet.address is available

    try {
      toastMsg("info", "Uploading image to IPFS...", 5000, "bottom-right");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-image-ipfs`, {
        method: "POST",
        body: formData, // FormData is automatically encoded as multipart/form-data
      });

      const data = await response.json();

      if (response.ok) {
        toastMsg("success", "Image uploaded successfully", 5000, "bottom-right");
        //console.log("File uploaded successfully:", data);
        return data.ipfs_hash;
      } else {
        toastMsg("error", "Error uploading image", 5000, "bottom-right");
        //console.error("Unexpected error response:", data);
        throw new Error("Error uploading file to IPFS");
      }
    } catch (error) {
      toastMsg("error", "Error uploading image", 5000, "bottom-right");
      //console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the photo exists before submitting
    if (!formData.photo) {
      alert("No photo selected. Please select a photo before submitting.");
      return;
    }

    let imageFile = formData.photo;

    setLoadingModel(true); // Show loading indicator
    let ipfsHash = null;
    try {

      // Check if contract object is correctly initialized
      if (!contract || !contract.addCandidate) {
        throw new Error("Contract is not initialized correctly.");
      }
      // Upload the photo to IPFS
      ipfsHash = await uploadFileToIPFS(imageFile);
      if (!ipfsHash) {
        return;
      }
      const imageUrl = "https://ipfs.io/ipfs/" + ipfsHash;

      // Get candidate details from formData
      const _candidateName = formData.candidateName;
      const _area = formData.area;
      const _party = formData.party;

      // Debugging: Log the contract and arguments to ensure correctness
      //console.log("Arguments for addCandidate:", _candidateName, _area, _party, imageUrl);

      // Send the transaction to the smart contract
      const tx = await contract.addCandidate(_candidateName, _area, _party, imageUrl);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      //console.log("Transaction receipt:", receipt);
      toastMsg("success", `Transaction confirmed! ${formData.candidateName} Added to candidates.`, 10000, "top-center");
      
      updateCandidateDb(wallet.address); // Call the updateCandidateDb function
      
    } catch (error) {
      unpinFileFromIPFS(ipfsHash);
      //console.error("Error during form submission:", error);
      toastMsg("error", "Error adding candidate. Please try again.", 5000, "top-center");
    } finally {
      setLoadingModel(false); // Hide loading indicator
    }
  };

// Unpin file from IPFS to free up space
  const unpinFileFromIPFS = async (ipfsHash) => {
    const requestData = {
      ipfs_hash: ipfsHash,
      address: wallet.address,
    };
  
    //console.log("Request data:", requestData);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/unpin-image-ipfs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        //console.log("File un-pinned successfully:", data);
      } else {
        //console.error("Unexpected error response:", data);
        throw new Error("Error un-pinning file from IPFS");
      }
    } catch (error) {
      //console.error("Error un-pinning image:", error);
      throw error;
    }
  }

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
            htmlFor="candidateName"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User size={18} className="mr-2" /> Full Name
          </label>
          <input
            type="text"
            id="candidateName"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.candidateName && (
            <p className="text-red-500 text-sm mt-1">{errors.candidateName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="areaSelect"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <MapPin size={18} className="mr-2" /> Booth
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
              Select Booth
            </option>
            <option value="Sarisha">Sarisha</option>
            <option value="Laxmikantapur">Laxmikantapur</option>
            <option value="Daimond-Harbour">Daimond-Harbour</option>
            <option value="Budge-Budge">Budge-Budge</option>
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
            <option value="party3">party3</option>
            <option value="party4">party4</option>
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
      {loadingModel && <Loading modalVisible={loadingModel} />}
    </div>
  );
  // }
};

export default AdminAddCandidateForm;
