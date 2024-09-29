import React, { useState, useEffect } from 'react';
import UserCard from './candidateCard';
import { fetchCandidate } from '../utils/getDetails';
import { ethers } from 'ethers';

const UserCardsPage = ({ wallet, VotingSystemContractAddress, VotingSystemABI }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchCandidate(wallet);
        console.error('Fetched users:', fetchedUsers);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      loadUsers();
    }
  }, [wallet]);

  const handleVote = async (candidateId) => {
    console.log('Voting for user:', candidateId);
    const { provider, signer, smartWallet } = wallet;
  
    // Log these values to ensure they are set
    console.log('VotingSystemContractAddress:', VotingSystemContractAddress);
    console.log('VotingSystemABI:', VotingSystemABI);
  
    if (!VotingSystemContractAddress || !VotingSystemABI || !provider || !signer) {
      console.error('Invalid contract address, ABI, or wallet provider/signers.');
      return;
    }
  
    const contract = new ethers.Contract(VotingSystemContractAddress, VotingSystemABI, signer);
  
    try {
      // Assuming you have a vote function in your contract
      const tx = await contract.vote(candidateId);  // Replace 'vote' with your actual function name
      console.log('Transaction sent:', tx);
  
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
    } catch (error) {
      console.error('Error in handleVote:', error);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Vote for Your Favorite User</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map(user => (
          <UserCard key={user.candidate_id} user={user} onVote={handleVote} />
        ))}
      </div>
    </div>
  );
};

export default UserCardsPage;
