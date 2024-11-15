import React, { useState, useEffect } from "react";
import CandidateCard from "@/components/candidateCard";
import { fetchCandidate } from "@/utils/getDetails";
import { ethers } from "ethers";
import Message from "@/components/AfterVoteMessage";
import LoadingModal from "@/components/LoadingModal";
import { CircleArrowLeft } from "lucide-react";

import { dummyCandidates } from "@/utils/testData";

const CandidateCardsPage = ({
  wallet,
  VotingSystemContractAddress,
  VotingSystemABI,
  onBack,
}) => {
  const [candidates, setcandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAftervoteMessage, setShowAftervoteMessage] = useState(false);
  const [messageData, setMessageData] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    const loadcandidates = async () => {
      setLoading(true);
      try {
        const fetchedcandidates = await fetchCandidate(wallet);
        setcandidates(fetchedcandidates);
        // setcandidates(dummyCandidates); // Using Dummy data for testing
      } catch (err) {
        setError("Failed to load candidates. Please try again later.");
        //console.error(err);
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
      //console.log("Voting for candidate:", candidateId);
      const { provider, signer } = wallet;
      const address = await signer.getAddress();

      if (
        !VotingSystemContractAddress ||
        !VotingSystemABI ||
        !provider ||
        !signer
      ) {
        // console.error(
        //   "Invalid contract address, ABI, or wallet provider/signers."
        // );
        return;
      }

      const contract = new ethers.Contract(
        VotingSystemContractAddress,
        VotingSystemABI,
        signer
      );
      if ((await contract.votingState()) == 0) {
        setMessageData("Voting has not started yet. Please wait.");
        setShowAftervoteMessage(true);
        return;
      } else if (contract.votingState() == 2) {
        setMessageData("Voting has ended.");
        setShowAftervoteMessage(true);
        return;
      }
      const nonce = await contract.nonces(address);
      const functionSignature = contract.interface.encodeFunctionData("vote", [
        candidateId,
      ]);

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "bytes"],
        [address, nonce, functionSignature]
      );
      const messageHashBinary = ethers.getBytes(messageHash);
      let signature;
      try {
        signature = await signer.signMessage(messageHashBinary);
      } catch (error) {
        if (error.code === "ACTION_REJECTED") {
          setMessageData("User rejected signature. Please try again.");
          setShowAftervoteMessage(true);
          return;
        }
      }
      const { r, s, v } = ethers.Signature.from(signature);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/execute-meta-tx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: address,
          functionSignature,
          r,
          s,
          v,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        //console.log("Voting successful:", data.txHash);
        setMessageData(`Congratulations! You successfully voted.`);
        setTxHash(data.txHash);
      } else {
        setMessageData(
          data.message || "An error occurred while voting. Please try again."
        );
      }
      setShowAftervoteMessage(true);
    } catch (error) {
      setMessageData("An unexpected error occurred. Please try again later.");
      //console.error(error);
      setShowAftervoteMessage(true);
    } finally {
      setVotingLoading(false);
    }
  };

  if (loading) return <div>Loading candidates...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="relative w-full flex justify-start items-start">
          <button
            className="relative ps-[2rem] h-10 w-10 text-black-500 hover:text-gray-500" // Adjusted size and position
            onClick={onBack}
          >
            <CircleArrowLeft size={34} strokeWidth={1.75} />
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center pb-4">
          Vote for Your Favorite Candidate
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.candidate_id}
              candidate={candidate}
              onVote={handleVote}
            />
          ))}
        </div>

        {/* Show loading modal when voting is in progress */}
        {votingLoading && (
          <LoadingModal
            modalVisible={votingLoading}
            task="Submitting your vote..."
          />
        )}

        {/* Show success/failure message modal after vote */}
        {showAftervoteMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Message
              data={messageData}
              txhash={txHash ? `${txHash}` : "null"}
              onClose={() => setShowAftervoteMessage(false)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateCardsPage;
