import React, { useState, useEffect } from 'react'; 
import { ethers } from 'ethers';
import { connectWallet, checkNFTOwnership } from '@/utils/web3Utils';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UserCardsPage from '@/components/canditateCardPage';
import KYCForm from '@/components/KYCForm';
import KYCModal from '@/components/KYCModal';
import AdminControl from '@/components/Admin';
import AdminControlsPage from '@/components/AdminControls';
import WalletConnectionModal from '@/components/WalletConnectionModal';


const App = () => {
  const [showUserCards, setShowUserCards] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showKYCFormModal, setshowKYCFormModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showKYCConfirm, setShowKYCConfirm] = useState(false); // New state for KYC prompt
  const [wallet, setWallet] = useState(null);
  const [VoterIdABI, setVoterIdABI] = useState(null);
  const [VoterIDContractAddress, setContractAddress] = useState(null);
  const [VotingSystemABI, setVotingSystemABI] = useState(null);
  const [VotingSystemContractAddress, setVotingSystemContractAddress] = useState(null);
  const [AdminControlModal, setAdminControlModal] = useState(false);
  const [showAdminControlsPage, setAdminControlsPage] = useState(false);

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
    const VoterIDabi = await fetch('http://'+'127.0.0.1'+':5000/api/get_abi/VoterID');
    const VoterIDjson = await VoterIDabi.json();
    console.log("Json", VoterIDjson);
    setVoterIdABI(VoterIDjson.abi);
    setContractAddress(VoterIDjson.ca);

    const votingSystemAbi = await fetch('http://'+'127.0.0.1'+':5000/api/get_abi/VotingSystem');
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
      console.log("Addr ", wallet.address)
    }
  }, [VoterIdABI, VoterIDContractAddress, VotingSystemABI, VotingSystemContractAddress, wallet]);

  const handleEnterDApp = async () => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
      return;
    }
    console.log("ENV Admin address:", import.meta.env.VITE_ADMINADDRESS)
    // if (!(wallet.address == import.meta.env.VITE_ADMINADDRESS)) { // Use for Admin Debug
    if ( true || !(wallet.address == import.meta.env.VITE_ADMINADDRESS)) { // Use for KYC Debug
      const hasNFT = await checkNFTOwnership(VoterIdABI, VoterIDContractAddress, wallet);
      if (!hasNFT) {
        setShowKYCConfirm(true);  // Show KYC confirmation prompt if NFT is not owned
      } else {
        setShowUserCards(true); // Show user cards page if NFT is owned
      }
      return;
    }
    setAdminControlModal(true);
    console.log("Admin address:", wallet.address, "is connected");
  };

  // Show KYC form when "Complete KYC" button is clicked
  const handleCompleteKYCConfirm = () => {
    setShowKYCConfirm(false);  // Hide the KYC prompt
    setshowKYCFormModal(true);     // Show the KYC form modal
  };

  const handleCompleteKYC = (formData) => {
    console.log("KYC data submitted:", formData);
    setshowKYCFormModal(false);
    setShowUserCards(true); // Show user cards page after KYC is completed
  };

  const handleAdminControls = () => {
    setAdminControlModal(false);
    setAdminControlsPage(true); // Show user cards page after KYC is completed
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header 
        isConnected={isWalletConnected} 
        walletAddress={isWalletConnected ? wallet.address : null} 
        onConnect={handleConnectWallet} 
        onDisconnect={() => setIsWalletConnected(false)} // Handling disconnect
        wallet={wallet}
      />
      <main className="w-svw flex flex-grow items-center">
        {(() => {
          if (showUserCards) {
            return (
              <UserCardsPage 
                wallet={wallet} 
                VotingSystemContractAddress={VotingSystemContractAddress} 
                VotingSystemABI={VotingSystemABI} 
              />
            );
          }
          if (showAdminControlsPage) {
            return <AdminControlsPage />;
          }
          if ((!showUserCards) && (!showAdminControlsPage))
          return <Hero onEnterDApp={handleEnterDApp} />;
        })()}
      </main>
      <footer className="bg-gray-900 text-white text-center py-4">
        © 2024 OnChainVote. All rights reserved.
      </footer>

      {/* KYC Confirmation Prompt */}
      {showKYCConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <KYCModal onComplete={handleCompleteKYCConfirm} onClose={() => setShowKYCConfirm(false)} />
        </div>
      )}

      {/* KYC Form Modal */}
      {showKYCFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <KYCForm onSubmit={handleCompleteKYC} onCancel={() => setshowKYCFormModal(false)} walletAddress={wallet.address} />
        </div>
      )}

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <WalletConnectionModal onClose={() => setShowWalletModal(false)} onConnect={handleConnectWallet} />
      )}
      {/* Admin Control Modal */}
      {AdminControlModal && (
        <AdminControl onLoad={handleAdminControls} onClose={() => setAdminControlModal(false)} />
      )}
    </div>
  );
};

export default App;
