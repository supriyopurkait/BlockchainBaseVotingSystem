import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/Modal';

const AdminControl = ({ onCandidate, onUser, onClose }) => (
  <Modal title="Admin Controls" onClose={onClose}>
      <div>
        <div className="flex items-center mb-4 text-yellow-500">
          <AlertTriangle size={24} className="mr-2" />
          <p className="font-semibold">Proceed With Caution</p>
        </div>
        <p className="mb-2">You Have ADMIN PRIVILEGES</p>
        <p className="mb-6 text-red-500">Controls Beyond This Point Are Critical</p>
        <button
          onClick={onCandidate}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold my-2 py-2 px-4 rounded"
        >
          Candidate Controls
        </button>
        <button
          onClick={onUser}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded"
        >
          User Controls
        </button>
      </div>
  </Modal>
);

export default AdminControl;
