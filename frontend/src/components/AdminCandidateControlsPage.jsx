import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchCandidate } from '@/utils/getDetails';
import { ethers } from 'ethers';
import Message from '@/components/AfterVoteMessage';
import LoadingModal from '@/components/LoadingModal';
import Face from 'pub/picture/face_img.png';
import AdminCandidateCard from '@/components/AdminCandidateCard';
import AdminAddCandidateCard from '@/components/AdminAddCandidateCard';

const AdminCandidateControlsPage = ({ wallet, VotingSystemContractAddress, VotingSystemABI, onClose }) => {
  const [Candidates, setCandidates] = useState([]);
  const [dummyCandidates, setDummyCandidates] = useState([
    {
      id: 1,
      photo: Face,
      name: 'Alice Johnson',
      candidate_id: '1',
      area: 'area1',
      party: 'Progressive Party'
    },
    {
      id: 2,
      photo: Face,
      name: 'Bob Smith',
      candidate_id: '2',
      area: 'area2',
      party: 'Liberal Party'
    },
    {
      id: 3,
      photo: Face,
      name: 'Charlie Brown',
      candidate_id: '3',
      area: 'area3',
      party: 'Conservative Party'
    },
    {
      id: 4,
      photo: Face,
      name: 'Diana Prince',
      candidate_id: '4',
      area: 'area4',
      party: 'Libertarian Party'
    },
    {
      id: 5,
      photo: Face,
      name: 'Ethan Hunt',
      candidate_id: '5',
      area: 'area5',
      party: 'Independent'
    }
  ]);
  // const [newCandidate, setNewCandidate] = useState([{
  //     id: 9999,
  //     photo: Add,
  //     name: 'Add Candidate',
  //     candidate_id: '',
  //     area: '',
  //     party: ''
  // }]);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAftervoteMessage, setShowAftervoteMessage] = useState(false);
  const [messageData, setMessageData] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        // const fetchedCandidates = await fetchCandidate(wallet);
        // setUsers(fetchedCandidates);
        setCandidates(dummyCandidates); // Using Dummy data for testing
      } catch (err) {
        setError('Failed to load Candidates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, [wallet]);

  const handleRemoveCandidate = async (candidateId) => {
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

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Candidates:</h2>
      <button onClick={onClose} className="absolute right-2 top-20">
        <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Candidates.map(candidate => (
          <AdminCandidateCard key={candidate.candidate_id} candidate={candidate} onRemove={handleRemoveCandidate} />
        ))}
        {<AdminAddCandidateCard onAdd={handleAddCandidate} />}
      </div>
      {votingLoading && <LoadingModal modalVisible={votingLoading} task="Submitting your vote..." />}
      {showAftervoteMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Message
            data={messageData}
            txhash={txHash ? `${txHash}` : null}
            onClose={() => setShowAftervoteMessage(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCandidateControlsPage;
