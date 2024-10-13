import React, { useState, useEffect } from 'react';
import CandidateCard from '@/components/candidateCard';
import { fetchCandidate } from '@/utils/getDetails';
import { ethers } from 'ethers';
import Message from '@/components/AfterVoteMessage';
import LoadingModal from '@/components/LoadingModal';

import { dummyCandidates } from '@/utils/testData';

const CandidateCardsPage = ({ wallet, VotingSystemContractAddress, VotingSystemABI }) => {
  const [candidates, setcandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAftervoteMessage, setShowAftervoteMessage] = useState(false);
  const [messageData, setMessageData] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    const loadcandidates = async () => {
      setLoading(true);
      try {
        const fetchedcandidates = await fetchCandidate(wallet);
        setcandidates(fetchedcandidates);
        // setcandidates(dummyCandidates); // Using Dummy data for testing
      } catch (err) {
        setError('Failed to load candidates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      loadcandidates();
    }
  }, [wallet]);

  const handleVote = async (candidateId) => {
    setVotingLoading(true);
    try {
      const RELAYER_URL = 'http://127.0.0.1:5000/api';
      console.log('Voting for candidate:', candidateId);
      const { provider, signer } = wallet;
      const address = await signer.getAddress();

      if (!VotingSystemContractAddress || !VotingSystemABI || !provider || !signer) {
        console.error('Invalid contract address, ABI, or wallet provider/signers.');
        return;
      }

      const contract = new ethers.Contract(VotingSystemContractAddress, VotingSystemABI, signer);
      if( await contract.votingState() == 0) {
        setMessageData('Voting has not started yet. Please wait.');
        setShowAftervoteMessage(true);
        return;
      } else if(contract.votingState() == 2) {
        setMessageData('Voting has ended.');
        setShowAftervoteMessage(true);
        return;
      }
      const nonce = await contract.nonces(address);
      const functionSignature = contract.interface.encodeFunctionData('vote', [candidateId]);

      const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'bytes'],
        [address, nonce, functionSignature]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      let signature;
      try {
        signature = await signer.signMessage(messageHashBinary);
      } catch (error) {
        if(error.code === 'ACTION_REJECTED') {
          setMessageData("User rejected signature. Please try again.");
          setShowAftervoteMessage(true);  
          return;
        }
      }
      const { r, s, v } = ethers.Signature.from(signature);

      const response = await fetch( `${RELAYER_URL}/execute-meta-tx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateAddress: address, functionSignature, r, s, v })
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

  if (loading) return <div>Loading candidates...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Vote for Your Favorite candidate</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {candidates.map(candidate => (
          <CandidateCard key={candidate.candidate_id} candidate={candidate} onVote={handleVote} />
        ))}
      </div>
      {votingLoading && <LoadingModal modalVisible={votingLoading} task="Submitting your vote..." />}
      {showAftervoteMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Message
            data={messageData}
            txhash={txHash ? `${txHash}` : "null"}
            onClose={() => setShowAftervoteMessage(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateCardsPage;
