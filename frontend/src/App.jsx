import React, { useState, useEffect } from 'react'; 
import Header from './components/Header';
import Hero from './components/Hero';
import UserCardsPage from './components/UserCardsPage';
import KYCForm from './components/KYCForm';
import WalletConnectionModal from './components/WalletConnectionModal';
import { connectWallet, checkNFTOwnership } from './utils/web3Utils';
import { ethers } from 'ethers';

const App = () => {
  const [showUserCards, setShowUserCards] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showKYCConfirm, setShowKYCConfirm] = useState(false); // New state for KYC prompt
  const [wallet, setWallet] = useState(null);
  const [VoterIdABI, setVoterIdABI] = useState(null);
  const [VoterIDContractAddress, setContractAddress] = useState(null);
  const [VotingSystemABI, setVotingSystemABI] = useState(null);
  const [VotingSystemContractAddress, setVotingSystemContractAddress] = useState(null);

  const handleConnectWallet = async () => {
    const connectedWallet = await connectWallet();
    if (connectedWallet) {
      console.log(connectedWallet);
      setWallet(connectedWallet);
      setIsWalletConnected(true);
      setShowWalletModal(false);
      handleGetABI();
    }
  };

  const handleGetABI = async () => {
    const VoterIDabi = await fetch('http://127.0.0.1:5000/api/get_abi/VoterID');
    const VoterIDjson = await VoterIDabi.json();
    console.log("Json", VoterIDjson);
    setVoterIdABI(VoterIDjson.abi);
    setContractAddress(VoterIDjson.ca);

    const votingSystemAbi = await fetch('http://127.0.0.1:5000/api/get_abi/VotingSystem');
    const votingSystemJson = await votingSystemAbi.json();
    setVotingSystemABI(votingSystemJson.abi);
    setVotingSystemContractAddress(votingSystemJson.ca);
  };

  useEffect(() => {
    if (VoterIdABI && VoterIDContractAddress && VotingSystemABI && VotingSystemContractAddress) {
      console.log("Voter ID ABI:", VoterIdABI);
      console.log("Voter ID Contract Address:", VoterIDContractAddress);
      console.log("VotingSystemABI", VotingSystemABI);
      console.log("VotingSystemContractAddress", VotingSystemContractAddress);
    }
  }, [VoterIdABI, VoterIDContractAddress, VotingSystemABI, VotingSystemContractAddress]);

  const handleEnterDApp = async () => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
      return;
    }

    const hasNFT = await checkNFTOwnership(VoterIdABI, VoterIDContractAddress, wallet);
    if (!hasNFT) {
      setShowKYCConfirm(true);  // Show KYC confirmation prompt if NFT is not owned
    } else {
      setShowUserCards(true); // Show user cards page if NFT is owned
    }
  };

  // Show KYC form when "Complete KYC" button is clicked
  const handleCompleteKYCConfirm = () => {
    setShowKYCConfirm(false);  // Hide the KYC prompt
    setShowKYCModal(true);     // Show the KYC form modal
  };

  const handleCompleteKYC = (formData) => {
    console.log("KYC data submitted:", formData);
    setShowKYCModal(false);
    setShowUserCards(true); // Show user cards page after KYC is completed
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header 
        isConnected={isWalletConnected} 
        walletAddress={wallet?.address || null} 
        onConnect={handleConnectWallet} 
        onDisconnect={() => setIsWalletConnected(false)} // Handling disconnect
      />
      <main className="flex-grow mx-36">
        {showUserCards ? (
          <UserCardsPage wallet={wallet} VotingSystemContractAddress={VotingSystemContractAddress} VotingSystemABI={VotingSystemABI} />
        ) : (
          <Hero onEnterDApp={handleEnterDApp} />
        )}
      </main>
      <footer className="bg-gray-900 text-white text-center py-4">
        © 2024 OnChainVote. All rights reserved.
      </footer>

      {/* KYC Confirmation Prompt */}
      {showKYCConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">KYC Required</h2>
            <p className="mb-6">You need to complete the KYC process to access this feature.</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={handleCompleteKYCConfirm}
            >
              Complete KYC
            </button>
          </div>
        </div>
      )}

      {/* KYC Form Modal */}
      {showKYCModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <KYCForm onSubmit={handleCompleteKYC} onCancel={() => setShowKYCModal(false)} walletAddress={wallet.address} />
        </div>
      )}

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <WalletConnectionModal onClose={() => setShowWalletModal(false)} onConnect={handleConnectWallet} />
      )}
    </div>
  );
};

export default App;