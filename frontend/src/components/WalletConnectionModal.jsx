import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/Modal';

const WalletConnectionModal = ({ onClose, onConnect }) => (
  <Modal title="Wallet Connection Required" onClose={onClose}>
    <div className="flex items-center mb-4 text-yellow-500">
      <AlertTriangle size={24} className="mr-2" />
      <p className="font-semibold">Wallet not connected</p>
    </div>
    <p className="mb-6">To access the DApp, you need to connect your wallet first.</p>
    <button
      onClick={onConnect}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Connect Wallet
    </button>
  </Modal>
);

export default WalletConnectionModal;
