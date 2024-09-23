import { ethers } from "ethers";

const config = {
  biconomyPaymasterApiKey: "3L23bfz1T.d84dfba5-6c8b-408d-800a-33e2b01d7b87",
  bundlerUrl: "https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: "84532"
};


let signer;
let provider; // Added provider variable here

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
      let chainId = `0x${Number(config.chainId).toString(16)}`;
      
      if (selectedChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
          });
          console.log("Switched to Base Chain");
        } catch (switchError) {
          console.error("Failed to switch chain:", switchError);
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
