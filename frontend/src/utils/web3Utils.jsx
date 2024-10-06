import { ethers } from "ethers";

// Configuration for connecting to the Base Chain
const config = {
  rpcUrl: "https://base-sepolia.blockpi.network/v1/rpc/public",
  chainId: "0x14a34",
  blockExplorerUrl: "https://base-sepolia.blockscout.com"
};

// Connect Wallet using ethers.js and setup the provider and signer
export const connectWallet = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      // Initialize ethers provider using window.ethereum (MetaMask or other provider)
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Prompt user to connect their MetaMask account
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Get signer from the provider
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("Account Address: ", address);

      // Switching to the correct chain (Base Chain in this case)
      const selectedChainId = await window.ethereum.request({ method: "eth_chainId" });

      console.log("Connected Chain ID:", selectedChainId);

      if (selectedChainId !== config.chainId) {
        try {
          // Attempt to add the desired chain if it isn't already added
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: config.chainId,
                chainName: "Base Sepolia Testnet",
                rpcUrls: [config.rpcUrl],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [config.blockExplorerUrl],
              },
            ],
          });
          console.log("Base Sepolia Testnet added successfully.");
        } catch (addChainError) {
          // If the chain is already added, switch to it or handle errors
          if (addChainError.code === 4001) {
            console.error("User rejected the chain addition.");
            return null;
          } else {
            console.error("Failed to add the chain:", addChainError.message);
            return null;
          }
        }

        // After adding the chain, or if it's already added, switch to it
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: config.chainId }],
          });
          console.log("Switched to Base Sepolia Testnet.");
        } catch (switchError) {
          if (switchError.code === 4001) {
            console.error("User rejected the chain switch.");
            return null;
          } else {
            console.error("Failed to switch chain:", switchError.message);
            return null;
          }
        }
      }

      return { provider, signer, address };

    } catch (err) {
      console.error("Failed to connect wallet:", err.message);
      return null;
    }

  } else {
    console.log("Ethereum provider not found. Please install MetaMask.");
    return null;
  }
};

export const checkNFTOwnership = async (VoterIdABI, VoterIDContractAddress, wallet) => {
  const { provider, signer } = wallet;
  console.log("Provider:", provider);
  console.log("Signer:", signer);
  const contract = new ethers.Contract(VoterIDContractAddress, VoterIdABI, signer);
  const walletAddress = await signer.getAddress(); // Ensure address is fetched correctly
  console.log("Wallet address:", walletAddress);
  try {
    // Check NFT balance
    const balance = await contract.balanceOf(walletAddress);
    console.log("Balance:", balance.toString());  // Convert to string for logging

    // Convert balance to a number and check if it's greater than zero
    const balanceNumber = Number(balance);
    return balanceNumber > 0;
  } catch (error) {
    console.error("Error checking NFT balance:", error);
    return false;
  }

};

export const votingState = async (VotingSystemABI, VotingSystemContractAddress, wallet) => {
  const { provider, signer } = wallet;
  const contract = new ethers.Contract(VotingSystemContractAddress, VotingSystemABI, signer);
  const walletAddress = await signer.getAddress(); // Ensure address is fetched correctly
  console.log("Wallet address:", walletAddress);
  try {
    // Check NFT balance
    const state = await contract.votingState();
    console.log("Voting State:", state.toString());  // Convert to string for logging
    return state;
  } catch (error) {
    console.error("Error checking voting state:", error);
    return -1;
  }
};

export const fetchUsers = async (wallet) => {
  const url = 'http://127.0.0.1:5000/api/get-candidates';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: wallet.address
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Get the full response
    const data = await response.json();
    // console.log(data.candidates);
    // Return only the candidates array
    return data.candidates;

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
