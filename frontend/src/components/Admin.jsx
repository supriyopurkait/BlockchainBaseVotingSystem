import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import AdminAddCandidateCard from '@/components/AdminAddCandidateCard';

const AdminControl = ({ onCandidate, onUser, onClose }) => {
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
    <div className="w-svw flex flex-col justify-self-start bg-gray-300">
      <div className="flex flex-row justify-between justify-items-center">
        <h1 className="text-xl md:text-4xl font-bold my-2 py-2 px-4">Admin Controls</h1>
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
      <div className="flex flex-row bg-blue-200">
        <div className="w-1/5 bg-blue-300">Pie Chart</div>
        <div className="w-4/5 bg-blue-400">
          <div className="flex flex-row bg-blue-500">
            <div className="w-1/4 bg-blue-600">
              {<AdminAddCandidateCard onAdd={handleAddCandidate} />}
            </div>
            <div className="w-3/4 bg-blue-700">stat</div>
          </div>
          <div className="flex flex-row bg-blue-800">
            <div className="w-2/4 bg-green-300">per area vote</div>
            <div className="w-2/4 bg-green-400">per Candidate vote</div>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center mb-4 text-yellow-500">
        <AlertTriangle size={24} className="mr-2" />
        <p className="font-semibold">Proceed With Caution</p>
      </div>
      <p className="mb-2">You Have ADMIN PRIVILEGES</p>
      <p className="mb-6 text-red-500">Controls Beyond This Point Are Critical</p> */}
      
    </div>
  );
};

export default AdminControl;
