import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const AdminControl = ({ onClose }) => (
  <Modal title="Admin Control" onClose={onClose}>
    <div className="flex items-center mb-4 text-yellow-500">
      <AlertTriangle size={24} className="mr-2" />
      <p className="font-semibold">Admin Options</p>
    </div>
    <p className="mb-6">Admin controls</p>
    <button
      // onClick={onConnect}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Admin Action
    </button>
  </Modal>
);

export default AdminControl;
