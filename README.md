
---

# 🗳️ Blockchain Voting Machine

---

## 📜 Overview
Welcome to the **Blockchain Voting Machine**!  This decentralized voting platform is built on Ethereum layer 2 [Base](https://www.base.org/), offering a secure, transparent, gasless, and tamper-proof election experience. With seamless Ethereum wallet integration like Metamask and gasless voting, this platform is designed for the future of voting. 🔒✨

## 🌟 Features
- **Ethereum Wallet Integration**: Decentralize your voting with ease. 🛡️
- **Immutable Voting**: Your votes are recorded on the Ethereum blockchain, ensuring they can't be altered. 📜
- **Gasless Voting**: No need to worry about transaction fees, thanks to relayer to pay on behalf of the user. 🚫💸
- **Special [SBT](https://www.ledger.com/academy/topics/blockchain/what-is-a-soulbound-token)** *(Soulbound Token)*: Authenticate voters while maintaining privacy. 🔐
- **Responsive UI**: Enjoy a sleek interface built with React and tailwind. 📱💻

## 🛠️ Tech Stack
- **Frontend**: React, Bootstrap 🌐
- **Blockchain Interaction**: ethers.js, MetaMask 🔗
- **Gasless Transactions**: EIP-2771: Meta-Transaction Forwarder 💰
- **Backend**: Ethereum Smart Contracts, Flask 🔒
- **Database**: SQLite3 🗃️

## 🚀 Usage
1. **Connect Wallet**: Click "Connect Wallet" to link your Ethereum wallet. 🔗
2. **Vote**: After connecting, vote by selecting a candidate if you have a special SBT on your wallet. 🗳️
3. **Complete KYC**: If you don’t have an SBT, complete KYC to receive a unique SBT in your wallet. 🆔
4. **Choose Candidate**: Pick your candidate and cast your vote. ✅
5. **Sign the Transaction**: A sign request will pop up in Metamask; sign it to complete your vote. ✍️

## 🧩 Smart Contracts
Our voting logic is governed by Ethereum smart contracts, ensuring top-notch security and transparency. 🔍

---


# 🚀 **Project Setup**

---

### 🌐 **Frontend Setup**

1. **Navigate to the frontend directory:**  
   ```bash
   cd frontend
   ```

2. **Install dependencies:**  
   ```bash
   npm install
   ```

3. **Create a `.env` file:**  
   Use the `.env.example` file as a reference. Populate the following variables:  
   - 🛡️ **VITE_ADMINADDRESS**: Address of the wallet used to deploy the smart contracts.  
   - 🌐 **VITE_API_BASE_URL**: Backend server address (e.g., for local development: `127.0.0.1:5000`).


### 🛠️ **Backend Setup**

1. **Create a `.env` file at the project root:**  
   Use the `.env.example` file as a reference. Populate the following variables:  
   - ⚙️ **ALCHEMY_RPC**: Get an RPC URL from [Alchemy](https://www.alchemy.com/).  
   - 🔑 **PRIVATE_KEY**: Private key of the admin wallet.  
   - 🧾 **ADMIN_ADDRESS**: Address of the admin wallet.  
   - 📌 **PINATA_API_KEY**, **PINATA_SECRET_API_KEY**, **JWT**: Obtain these from [Pinata](https://pinata.cloud/).  

2. **Install dependencies:**  
   Ensure Python 3.10 is installed, then run:  
   ```bash
   python3 -m pip install -r backend/requirements.txt
   ```

3. **Set up the database:**  
   ```bash
   python3 backend/database.py
   ```

4. **Start the backend server:**  
   ```bash
   python3 backend/app.py
   ```


### 📜 **Smart Contracts Deployment**

1. **Deploy contracts**:  
   Use the smart contracts located in the `smart_contracts/contracts` folder. Deploy them via [Remix IDE](https://remix.ethereum.org/) (or your preferred tool).  

2. **Save deployment details:**  
   - Copy the **ABI**, **Bytecode**, and **Contract Address** for each contract.  
   - Place them in their respective directories.  

---

## 📝 **Notes**

- 🔄 This project used [Remix IDE](https://remix.ethereum.org/) for deploying and managing smart contracts.  
- ✅ Ensure all `.env` variables are correctly configured for smooth functionality.  

---

