import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import AdminAddCandidateCard from '@/components/Admin/AdminAddCandidateCard';

const AdminControl = ({ onCandidate, onUser, onClose }) => {
  const [Candidate, setCandidate] = useState([{
      id: 9999,
      photo: X,
      name: 'Add Candidate',
      candidate_id: '',
      area: '',
      party: ''
  }]);
  const handleAddCandidate = async (candidateId) => {
    setVotingLoading(true);
    try {
      const RELAYER_URL = 'http://127.0.0.1:5000/api';
      console.log('Voting for user:', candidateId);
      const { provider, signer } = wallet;
      const address = await signer.getAddress();

      if (!VotingSystemContractAddress || !VotingSystemABI || !provider || !signer) {
        console.error('Invalid contract address, ABI, or wallet provider/signers.');
        return;
      }

      const contract = new ethers.Contract(VotingSystemContractAddress, VotingSystemABI, signer);
      const nonce = await contract.nonces(address);
      const functionSignature = contract.interface.encodeFunctionData('vote', [candidateId]);

      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'bytes'],
        [address, nonce, functionSignature]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      const signature = await signer.signMessage(messageHashBinary);
      const { r, s, v } = ethers.Signature.from(signature);

      const response = await fetch( `${RELAYER_URL}/execute-meta-tx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, functionSignature, r, s, v })
      });

      const data = await response.json();
      if (data.status === 'success') {
        console.log('Voting successful:', data.txHash);
        setMessageData(`Congratulations! You successfully voted.`);
        setTxHash(data.txHash);
      } else {
        setMessageData(data.message || 'An error occurred while voting. Please try again.');
      }
      setShowAftervoteMessage(true);
    } catch (error) {
      setMessageData('An unexpected error occurred. Please try again later.');
      console.error(error);
      setShowAftervoteMessage(true);
    } finally {
      setVotingLoading(false);
    }
  };
  return (
    <div className="w-svw flex flex-col justify-self-start">
      <div className="flex flex-row justify-between justify-items-center">
        <h1 className="text-xl md:text-4xl font-bold md:my-2 md:py-2 md:px-4 m-4 pt-2">Admin Controls</h1>
        <div className="flex flex-row justify-items-center space-x-3 my-2 py-2 px-4">
          <button
            onClick={onCandidate}
            className="w-fit bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            Candidate Controls
          </button>
          <button
            onClick={onUser}
            className="w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
          >
            User Controls
          </button>
          <button onClick={onClose} className="">
              <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
          </button>
        </div>
      </div>
      <div className="DashBoard">
        <div className="PieChart h-fit">
          {/* Candidate % */}
          <h1 className="text-2xl font-bold m-4">Candidate Progress</h1>
          <div className="h-fit grid grid-cols-2 md:grid-cols-5 justify-items-stretch gap-4 m-4">
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx} className="bg-gray-200 p-4 text-center rounded-lg shadow-sm">
                <p className="text-lg font-semibold">Candidate {idx + 1}</p>
                <p className="text-xl font-bold text-blue-600">20%</p>
              </div>
            ))}
          </div>
          {/* Area % */}
          <h1 className="text-2xl font-bold m-4">Area Progress</h1>
          <div className="h-fit grid grid-cols-2 md:grid-cols-5 justify-items-stretch gap-4 m-4">
            {Array.from({ length: 5 }, (_, idx) => (
              <div key={idx + 5} className="bg-gray-200 p-4 text-center rounded-lg shadow-sm">
                <p className="text-lg font-semibold">Area {idx + 1}</p>
                <p className="text-xl font-bold text-blue-600">20%</p>
              </div>
            ))}
          </div>
        </div>
        {/* End Of Pie Chart */}
        <div></div>
      </div> 
    {/*  end of component */}
    </div>
  );
};

export default AdminControl;
