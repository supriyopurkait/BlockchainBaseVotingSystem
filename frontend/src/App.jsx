import React, { useState, useEffect, useRef } from 'react'; 
import { ethers } from 'ethers';
import { connectWallet, checkNFTOwnership } from '@/utils/web3Utils';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CandidateCardsPage from '@/components/candidateCardPage';
import KYCForm from '@/components/KYCForm';
import KYCModal from '@/components/KYCModal';
import AdminControl from '@/components/Admin/Admin';
import AdminCandidateControlsPage from '@/components/Admin/AdminCandidateControlsPage';
import AdminAddCandidateForm from '@/components/Admin/AdminAddCandidateForm';
import AdminUserControlsPage from '@/components/Admin/AdminUserControlsPage';
import WalletConnectionModal from '@/components/WalletConnectionModal';
import ShowVoteResultPage from '@/components/ShowVoteResultPage'
import { Toaster } from 'react-hot-toast';
import toastMsg from '@/utils/toastMsg';  

const App = () => {

  const votingContractRef = useRef(null); // Add this at the top within your component, alongside other state variables.

  const [showCandidateCards, setshowCandidateCards] = useState(false);
  const [showVoteResultCards,setShowVoteResultCards] = useState(false);
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
  const [AdminMode, setAdminMode] = useState(false);
  const [showAdminCandidateControlsPage, setAdminCandidateControlsPage] = useState(false);
  const [showAdminAddCandidateForm, setshowAdminAddCandidateForm] = useState(false);
  const [showAdminUserControlsPage, setAdminUserControlsPage] = useState(false);
  const [votingStatusButton, setVotingStatusButton] = useState(false)

  const handleConnectWallet = async () => {
    const connectedWallet = await connectWallet();
    if (connectedWallet) {
      //console.log(connectedWallet);
      setWallet(connectedWallet);
      handleGetABI();
      if ((connectedWallet.address == import.meta.env.VITE_ADMINADDRESS)) {
        // const votingStatus = await votingState(VotingSystemABI, VotingSystemContractAddress, wallet);
        // console.log("Voting State:", votingStatus);
        // setAdminVotingStatus(votingStatus);
        // console.log("Admin vote status",AdminVotingStatus);
        // if (votingStatus == 1) {
        //   toastMsg("success", "Voting is ongoing.", 10000, "top-center");
        // } else if (votingStatus == 0) {
        //   toastMsg("error", "Voting has not started yet.", 100000, "top-center");
        // } else if (votingStatus == 2) {
        //   toastMsg("error", "Voting has ended.", 100000, "top-center");
        // } else if (votingStatus == -1) {
        //   toastMsg("error", "Error checking voting status. Please try again later.", 10000, "top-center");
        // }
        setAdminControlModal(true);
        setAdminMode(true);
        // console.log("Admin address:", connectedWallet.address, "is connected");
        // const votingStatus = await votingState(VotingSystemABI, VotingSystemContractAddress, connectedWallet);
        // console.log("Voting State:", votingStatus);
        // setAdminVotingStatus(votingStatus);
      }
      // if (!(connectedWallet.address == import.meta.env.VITE_ADMINADDRESS)) {
      //   const hasNFT = await checkNFTOwnership(VoterIdABI, VoterIDContractAddress, connectedWallet);
      //   console.log(hasNFT);
      //   if (!hasNFT) {
      //     toastMsg("error", "You do not have a Voter ID NFT! Please complete the KYC process first.", 5000);
      //     setShowKYCConfirm(true);  // Show KYC confirmation prompt if NFT is not owned
      //   } else {
      //     setshowCandidateCards(true); // Show user cards page if NFT is owned
      //   }
      // }
      setIsWalletConnected(true);
      setShowWalletModal(false);
      
    }
  };


  const getVotingContract = () => {
    if (!votingContractRef.current && VotingSystemABI && VotingSystemContractAddress && wallet) {
      votingContractRef.current = new ethers.Contract(VotingSystemContractAddress, VotingSystemABI, wallet.signer);
      //console.log("Contract created:", votingContractRef.current);
    }
    return votingContractRef.current;
  };
  
  const handleGetABI = async () => {
    const VoterIDabi = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get_abi/VoterID`);
    const VoterIDjson = await VoterIDabi.json();
    //console.log("Json", VoterIDjson);
    setVoterIdABI(VoterIDjson.abi);
    setContractAddress(VoterIDjson.ca);

    const votingSystemAbi = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get_abi/VotingSystem`);
    const votingSystemJson = await votingSystemAbi.json();
    setVotingSystemABI(votingSystemJson.abi);
    setVotingSystemContractAddress(votingSystemJson.ca);
  };

  // Function to get the results declared status
  const isDeclared = async () => {
    return await getVotingContract().resultsDeclared();
  };

  useEffect(() => {
    if (VoterIdABI && VoterIDContractAddress && VotingSystemABI && VotingSystemContractAddress) {
      // console.log("Voter ID ABI:", VoterIdABI);
      // console.log("Voter ID Contract Address:", VoterIDContractAddress);
      // console.log("VotingSystemABI:", VotingSystemABI);
      // console.log("VotingSystemContractAddress:", VotingSystemContractAddress);
      // console.log("Wallet Address:", wallet.address);
      // Check if results have been declared
      const checkResultsDeclared = async () => {
        try {
          const declared = await isDeclared();    //// true for testing only
          //console.log("Result declared:", declared);
          setVotingStatusButton(declared);
          if (declared) {
            toastMsg("success", "Results have been declared.", 10000, "top-center");
          }
        } catch (error) {
          //console.error("Error in declaring results:", error);
        }
      }
      checkResultsDeclared(); 
    };
  }, [VoterIdABI, VoterIDContractAddress, VotingSystemABI, VotingSystemContractAddress, wallet]);
  

  const handleEnterDApp = async () => {
    if (!isWalletConnected) {
      toastMsg("error","Please connect your wallet first", 2000, "bottom-right");
      setShowWalletModal(true);
      return;
    }
    // Check voting state
    const votingStatus = await getVotingContract().votingState();
    //here is the vote declared logic
    //const isdeclared = await getVotingContract().resultDeclared();
    // if(true){
    //   setVotingStatusButton(true);
    // }
    //console.log("Voting State:", votingStatus);

    if (votingStatus == 1) {
      toastMsg("success", "Voting is ongoing.", 5000, "top-center");
    } else if (votingStatus == 0) {
      toastMsg("error", "Voting has not started yet.", 5000, "top-center");
    } else if (votingStatus == 2) {
      toastMsg("error", "Voting has ended.", 5000, "top-center");
    } else if (votingStatus == -1) {
      toastMsg("error", "Error checking voting status. Please try again later.", 10000, "top-center");
    }
    //console.log("ENV Admin address:", import.meta.env.VITE_ADMINADDRESS)
    if (!(wallet.address == import.meta.env.VITE_ADMINADDRESS)) { // Use for Admin Debug
      const hasNFT = await checkNFTOwnership(VoterIdABI, VoterIDContractAddress, wallet);
      if (!hasNFT) {
        toastMsg("error", "You do not have a Voter ID NFT! Please complete the KYC process first.", 5000);
        setShowKYCConfirm(true);  // Show KYC confirmation prompt if NFT is not owned
      } else {
        setshowCandidateCards(true); // Show user cards page if NFT is owned
      }
      return;
    }
    setAdminControlModal(true);
    //console.log("Admin address:", wallet.address, "is connected");
  };
  //here it will help to show vote result modal
  const handelShowVoteResult = ()=>{
    setShowVoteResultCards(true);
  };

  // Show KYC form when "Complete KYC" button is clicked
  const handleCompleteKYCConfirm = () => {
    setShowKYCConfirm(false);  // Hide the KYC prompt
    setshowKYCFormModal(true);     // Show the KYC form modal
  };

  const handleCompleteKYC = (formData) => {
    //console.log("KYC data submitted:", formData);
    setshowKYCFormModal(false);
    setshowCandidateCards(true); // Show user cards page after KYC is completed
  };

  const handleAdminCandidateControls = () => {
    setAdminControlModal(false);
    setAdminCandidateControlsPage(true);
  };

  const handleAdminUserControls = () => {
    setAdminControlModal(false);
    setAdminUserControlsPage(true);
  };

  const handleAdminStartVote = async() => {
    try {
      const contract = getVotingContract();
      const state = await contract.votingState();
      if(state == 1) {
        toastMsg("error", "Voting is ongoing", 10000, "top-center");
        return;
      } else if(state == 2) {
        toastMsg("error", "Voting has ended", 10000, "top-center");
        return;
      }
      // Attempt to call the startVote function on the contract
      const tx = await contract.startVote();
      tx.wait();
      // If successful, display a success message
      toastMsg("success", "Voting has started successfully.", 10000, "top-center");
    } catch (error) {
      // Log the error for debugging
      //console.error('Failed to start voting:', error);
      toastMsg("error", "Failed to start voting", 10000, "top-center");
    }
  };

  // stop vote function
  const handleAdminStopVote = async() => {
    try {
      const contract = getVotingContract();
      const state = await contract.votingState();
      if(state == 0) {
        toastMsg("error", "Either Voting has not started yet.", 10000, "top-center");
        return;
      } else if(state == 2) {
        toastMsg("error", "Either Voting has ended", 10000, "top-center");
        return;
      }
      // Attempt to call the stopVote function on the contract
      const tx = await contract.stopVote();
      tx.wait();
      // If successful, display a success message
      toastMsg("success", "Voting has stopped successfully.", 10000, "top-center");
    } catch (error) {
      // Log the error for debugging
      //console.error('Failed to stop voting:', error);
      toastMsg("error", "Failed to stop voting", 10000, "top-center");
    }
    
  };
  const handleCandidateAdd  = () => {
    setshowAdminAddCandidateForm(true);
    //console.log('Adding candidate:');
  }

  const handleCandidateAdded  = () => {
    setshowAdminAddCandidateForm(false);
    setAdminCandidateControlsPage(true);
    //console.log('Added candidate:');
  }

  const handleCandidateRemove  = async (candidateId) => {
    //console.error('Removing candidate:', candidateId);
    const contract = getVotingContract();
    const state = await contract.votingState();
    if(state == 1) {
      toastMsg("error", "Voting is ongoing.", 10000, "top-center");
      return;
    } else if(state == 2) {
      toastMsg("error", "Voting has already ended.", 10000, "top-center");
      return;
    }
    try {
      const tx = await getVotingContract().deleteCandidate(candidateId);
      //console.log("Transaction sent:", tx.hash);
      await tx.wait();
      toastMsg("success", "Candidate Removed.", 5000, "top-center");
    } catch (error) {
      toastMsg("error", `Failed to remove candidate`, 10000, "top-center");
      //console.error('Failed to remove candidate:', error);
    }
  }


  const handleUserRemove = async (userId, userWalletAddress) => {
    // TO DO
    toastMsg("error", "User Removed.", 10000, "top-center");
  };

  // Declare results function
  const handleDeclareResults = async (wallet) => {
    const contract = getVotingContract();
    try {
      const votingState = await contract.votingState();
      const resultsDeclared = await contract.resultsDeclared();
  
      if(votingState == 1) {
        toastMsg("error", "Voting is ongoing. Please till the voting has ended.", 10000, "top-center");
        return;      
      } else if(votingState == 0) {
        toastMsg("error", "Voting has not started yet.", 10000, "top-center");
        return;
      }
      
      if(!resultsDeclared) {
        //console.log("Attempting to declare results...");
        const tx = await contract.declareResults();
        //console.log("Transaction sent:", tx.hash);
        await tx.wait();
        //console.log("Transaction confirmed");
        toastMsg("success", "Results Declared.", 10000, "top-center");
      } else {
        toastMsg("error", "Results Already Declared.", 10000, "top-center");
        //console.error("resultsDeclared:", resultsDeclared);
      }
    } catch (error) {
      toastMsg("error", `Failed to declare results`, 10000, "top-center");
      //console.error('Failed to declare results:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="bottom-right" />
      <Header 
        onLogo={() => {
          setshowCandidateCards(false);
          setAdminControlModal(false);
          setAdminCandidateControlsPage(false);
          setAdminUserControlsPage(false);
        }} // Handling disconnect
        isConnected={isWalletConnected} 
        walletAddress={isWalletConnected ? wallet.address : null} 
        onConnect={handleConnectWallet} 
        onDisconnect={() => {
          setIsWalletConnected(false);
          setshowCandidateCards(false);
          setAdminMode(false);
          setAdminControlModal(false);
          setAdminCandidateControlsPage(false);
          setAdminUserControlsPage(false);
          setShowVoteResultCards(false)
        }} // Handling disconnect
        wallet={wallet}
        voterIDContract={[VoterIDContractAddress, VoterIdABI]}
        adminModeOn={AdminMode}
      />
      <main className="w-svw flex flex-grow justify-center items-center">
        {(() => {
          if (showCandidateCards) {
            return (
              <CandidateCardsPage 
                wallet={wallet} 
                VotingSystemContractAddress={VotingSystemContractAddress} 
                VotingSystemABI={VotingSystemABI}
                onBack = {()=>{setshowCandidateCards(false)}}
              />
            );
          }
          if(showVoteResultCards){
            return(
              <ShowVoteResultPage
              onBack = {()=>{setShowVoteResultCards(false)}}
              wallet={wallet}
              />
            );
          }//here i have to add the voting result show modal 
          if (AdminControlModal) {
            return <AdminControl
                wallet={wallet}
                votingContract={getVotingContract()}
                onAdd={handleCandidateAdd}
                onDeclareResults={handleDeclareResults}
                onCandidate={handleAdminCandidateControls} 
                onUser={handleAdminUserControls} 
                onStartVote={handleAdminStartVote} 
                onEndVote={handleAdminStopVote}
                onClose={() => setAdminControlModal(false)} 
                onBack={()=>setAdminControlModal(false)}
                />;
          }
          if (showAdminCandidateControlsPage) {
            return <AdminCandidateControlsPage
                wallet={wallet}
                onAdd={handleCandidateAdd}
                onRemove={handleCandidateRemove} 
                VotingSystemContractAddress={VotingSystemContractAddress} 
                VotingSystemABI={VotingSystemABI}
                onClose={() => {
                  setAdminCandidateControlsPage(false);
                  setAdminControlModal(true);
                }}
                onBack={()=>{setAdminCandidateControlsPage(false);
                  setAdminControlModal(true);}} />;
          }
          if (showAdminUserControlsPage) {
            return <AdminUserControlsPage 
                wallet={wallet} 
                onRemove={handleUserRemove}
                VotingSystemContractAddress={VotingSystemContractAddress} 
                VotingSystemABI={VotingSystemABI}
                onClose={() => {
                  setAdminUserControlsPage(false);
                  setAdminControlModal(true);
                }}
                onBack={() => {setAdminUserControlsPage(false);
                  setAdminControlModal(true);}} />;
          }
          return <Hero onEnterDApp={handleEnterDApp} showVoteButton={votingStatusButton} onEnterShowResult= {handelShowVoteResult}/*here pass the show vote model hook*/ />;
        })()}
      </main>
      <footer className="bg-gray-900 text-white text-center py-4">
        © 2024 OVM | On-Chain Voting Machine. All rights reserved.
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
      {/* Admin Add Candidate Form */}
      {showAdminAddCandidateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <AdminAddCandidateForm onSubmit={handleCandidateAdded} onCancel={() => setshowAdminAddCandidateForm(false)} wallet={wallet} contract={getVotingContract()}/>
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
