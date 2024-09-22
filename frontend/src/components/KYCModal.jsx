import React from 'react';
import Modal from './Modal';

const KYCModal = ({ onClose, onComplete }) => (
  <Modal title="KYC Required" onClose={onClose}>
    <p className="mb-6">To access this DApp, you need to complete the KYC process. This ensures compliance and security for all users.</p>
    <button
      onClick={onComplete}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Complete KYC Now
    </button>
  </Modal>
);

export default KYCModal;
