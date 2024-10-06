import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchCandidate } from '@/utils/getDetails';
import { ethers } from 'ethers';
import Message from '@/components/AfterVoteMessage';
import LoadingModal from '@/components/LoadingModal';
import AdminCandidateCard from '@/components/Admin/AdminCandidateCard';
import AdminAddCandidateCard from '@/components/Admin/AdminAddCandidateCard';

const AdminCandidateControlsPage = ({ wallet, onRemove, onClose }) => {
  const [Candidates, setCandidates] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAftervoteMessage, setShowAftervoteMessage] = useState(false);
  const [messageData, setMessageData] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const fetchedCandidates = await fetchCandidate(wallet);
        console.log('Fetched candidates:', fetchedCandidates);
        setCandidates(fetchedCandidates);
        // setCandidates(dummyCandidates); // Using Dummy data for testing
      } catch (err) {
        setError('Failed to load Candidates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, [wallet]);

  const handleCandidateAdd  = async (candidateId) => {
    alert("Candidate Added");
  }
  const handleCandidateRemove  = async (candidateId) => {
    alert("Candidate Removed");
  }

  if (loading) return (<div><LoadingModal modalVisible={loading} task="Loading Candidates..." onClose={onClose} /></div>);
  if (error) return (
    <div>
      <div className="loading-modal-overlay" onClick={onClose}>
        <div className="loading-modal">
          <p>{error}</p>
        </div>
        <button onClick={onClose} className="relative right-0 top-[-3rem]">
          <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
        </button>
      </div>
    </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 underline">All Candidates:</h2>
      <button onClick={onClose} className="absolute right-2 top-20">
        <X className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-700 rounded-full" size={24} />
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Candidates.map(candidate => (
          <AdminCandidateCard key={candidate.candidate_id} candidate={candidate} onRemove={handleCandidateRemove} />
        ))}
        {<AdminAddCandidateCard onAdd={handleCandidateAdd} />}
      </div>
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